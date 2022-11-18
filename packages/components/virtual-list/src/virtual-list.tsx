import { createNamespace } from '@victor-ui/utils/create'
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { useThrottleFn } from '@vueuse/core'

export default defineComponent({
  name: 'VVirtualList',
  props: {
    /**如果列表项是定高的，则这个就是列表项的高度；如果列表项是不定高的，则这个就是列表项的预估高度 */
    size: {
      type: Number,
      default: 35
    },
    remain: {
      default: 8,
      type: Number
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { slots }) {
    const bem = createNamespace('vl')
    const wrapperRef = ref<HTMLElement>()
    const barRef = ref<HTMLElement>()

    /**表示可视区的数据的开始index和结束index */
    const state = reactive({
      start: 0,
      end: props.remain
    })

    /**表示可视区的上面多渲染的数量 */
    const prev = computed(() => {
      return Math.min(state.start, props.remain)
    })

    /**表示可视区的下面多渲染的数量 */
    const next = computed(() => {
      return Math.min(props.remain, props.items.length - state.end)
    })

    /**表示要渲染到可视区的数据 并且这里在可视区的上下都会多渲染几条，保证用户在快速滚动的时候不会白屏*/
    const visibleData = computed(() => {
      return props.items.slice(state.start - prev.value, state.end + next.value)
    })

    /**渲染区域的偏移量 */
    const offset = ref(0)

    /**滚动时触发的回调函数，计算滚动后应展示的数据是哪些，并且计算偏移距离。并且内部用requestAnimationFrame保证浏览器在下一次重绘之前执行函数，可以确保不会出现丢帧现象*/
    const handleScroll = () => {
      // window.requestAnimationFrame(() => {
      const scrollTop = wrapperRef.value!.scrollTop //scrollTop表示向上滚出去了看不到的距离
      state.start = Math.floor(scrollTop / props.size) // 数据的起始索引
      state.end = state.start + props.remain //数据的结束索引
      offset.value = state.start * props.size - props.size * prev.value
      // })
    }

    /**将滚动触发的回调函数进行节流处理。这里的等待时间不宜设置过长，不然会出现滑动到空白占位区域的情况
     * 因为间隔时间过长的话，太久没有触发滚动更新事件，下滑就会到padding-bottom的空白区域
     * 电脑屏幕的刷新频率一般是60HZ，渲染的间隔时间为16.6ms，我们的时间间隔最好小于两次渲染间隔16.6*2=33.2ms，一般情况下30ms左右
     */
    const throttledHandleScroll = useThrottleFn(handleScroll, 30)

    /**初始化 最外层的高度为展示的内容的高度，里一层的高度为所有内容的高度 */
    function initWrapper() {
      wrapperRef.value!.style.height = props.remain * props.size + 'px'
      barRef.value!.style.height = props.items.length * props.size + 'px'
    }
    watch(() => props.items, initWrapper)

    onMounted(() => {
      initWrapper()
    })
    return () => {
      return (
        <div class={bem.b()} ref={wrapperRef} onScroll={throttledHandleScroll}>
          <div class={bem.e('scroll-bar')} ref={barRef}></div>
          <div
            class={bem.e('scroll-list')}
            style={{ transform: `translate3d(0,${offset.value}px,0)` }}
          >
            {visibleData.value.map(node => slots.default!({ node }))}
          </div>
        </div>
      )
    }
  }
})
