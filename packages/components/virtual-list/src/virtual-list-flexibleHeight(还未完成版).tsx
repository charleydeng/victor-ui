import { createNamespace } from '@victor-ui/utils/create'
import {
  computed,
  defineComponent,
  onBeforeMount,
  onMounted,
  onUpdated,
  reactive,
  ref,
  watch
} from 'vue'
import { useThrottleFn } from '@vueuse/core'

interface positionsItem {
  index: number
  height: number
  top: number
  bottom: number
}

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
    },
    isFixedHeight: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { slots }) {
    const bem = createNamespace('vl')
    const wrapperRef = ref<HTMLElement>()
    const barRef = ref<HTMLElement>()
    const listRef = ref<HTMLElement>()

    /**表示可视区的数据的开始index和结束index */
    const state = reactive({
      start: 0,
      end: props.remain
    })

    /**不定高时的一些处理逻辑 */
    //#region

    /**用于列表项渲染后存储`每一项的高度以及位置`信息 */
    let positions = reactive<positionsItem[]>([])

    /**根据`size`对`positions`进行初始化 */
    function initPositions() {
      positions = props.items.map((item, index) => {
        return {
          index,
          height: props.size,
          top: index * props.size,
          bottom: (index + 1) * props.size
        }
      })
    }

    /**在列表项的高度不固定时，由于列表项高度不定，所以列表的总高度也是不断变化的 */
    const wholeHeight = computed(() => {
      return positions[positions.length - 1].bottom //`列表高度`实际就等于列表中最后一项的底部 距离列表顶部的位置。
    })

    /**在`渲染完成`后，获取列表每项的实际位置信息并缓存在positions中 */
    onUpdated(() => {
      if (!props.isFixedHeight) {
        const nodes = Array.from(listRef.value?.children as HTMLCollection)
        nodes!.forEach((node, index) => {
          const rect = node.getBoundingClientRect()
          const height = rect.height
          const oldHeight = positions[index].height
          const dValue = oldHeight - height
          //存在差值
          if (dValue) {
            positions[index].bottom = positions[index].bottom - dValue
            positions[index].height = height
            for (let k = index + 1; k < positions.length; k++) {
              positions[k].top = positions[k - 1].bottom
              positions[k].bottom = positions[k].bottom - dValue
            }
          }
        })
      }
    })
    //#endregion

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

    /**非定高时的获取 列表开始索引 的方法 。如果没找到就返回null*/
    function getStartIndex(scrollTop = 0) {
      function binarySearch(list: positionsItem[], value: number) {
        //由于我们的缓存数据本身就是有顺序的，所以获取`开始索引`的方法可以考虑通过`二分查找`的方式来降低检索次数
        let start = 0
        let end = list.length - 1
        let tempIndex = null
        while (start <= end) {
          const midIndex = (start + end) >> 1
          const midValue = list[midIndex].bottom
          if (midValue === value) {
            return midIndex + 1
          } else if (midValue < value) {
            start = midIndex + 1
          } else {
            if (tempIndex === null || tempIndex > midIndex) {
              tempIndex = midIndex
            }
            end = end - 1
          }
        }
        return tempIndex
      }
      return binarySearch(positions, scrollTop)
    }

    /**滚动时触发的回调函数，计算滚动后应展示的数据是哪些，并且计算偏移距离。并且内部用requestAnimationFrame保证浏览器在下一次重绘之前执行函数，可以确保不会出现丢帧现象*/
    const handleScroll = () => {
      // window.requestAnimationFrame(() => {
      const scrollTop = wrapperRef.value!.scrollTop //scrollTop表示向上滚出去了看不到的距离
      if (props.isFixedHeight) {
        state.start = Math.floor(scrollTop / props.size) // 数据的起始索引
        state.end = state.start + props.remain //数据的结束索引
        offset.value = state.start * props.size - props.size * prev.value
      } else {
        //滚动后获取列表`开始索引`的方法修改为通过`缓存`获取
        state.start = getStartIndex(scrollTop) as number
        state.end = state.start + props.remain //数据的结束索引
        if (state.start <= prev.value) {
          offset.value = 0
        } else {
          offset.value = positions[state.start - 1].bottom
        }
      }
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

    onBeforeMount(() => {
      if (!props.isFixedHeight) {
        initPositions()
      }
    })
    onMounted(() => {
      initWrapper()
    })
    return () => {
      return (
        <div class={bem.b()} ref={wrapperRef} onScroll={throttledHandleScroll}>
          <div
            class={bem.e('scroll-bar')}
            style={
              props.isFixedHeight ? {} : { height: `${wholeHeight.value}` }
            }
            ref={barRef}
          ></div>
          <div
            class={bem.e('scroll-list')}
            style={{ transform: `translate3d(0,${offset.value}px,0)` }}
            ref={listRef}
          >
            {visibleData.value.map(node => slots.default!({ node }))}
          </div>
        </div>
      )
    }
  }
})

// import { createNamespace } from '@victor-ui/utils/create'
// import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'

// export default defineComponent({
//   name: 'VVirtualList',
//   props: {
//     size: {
//       type: Number,
//       default: 35
//     },
//     remain: {
//       default: 8,
//       type: Number
//     },
//     items: {
//       type: Array,
//       default: () => []
//     }
//   },
//   setup(props, { slots }) {
//     const bem = createNamespace('vl')
//     const wrapperRef = ref<HTMLElement>()
//     const barRef = ref<HTMLElement>()
//     const state = reactive({
//       // 计算显示的区域
//       start: 0,
//       end: props.remain
//     })

//     const prev = computed(() => {
//       // 当前开始第四条
//       return Math.min(state.start, props.remain)
//     })

//     const next = computed(() => {
//       return Math.min(props.remain, props.items.length - state.end)
//     })

//     // 这里应该多展示 上8条和下8条，保证用户在快速滚动的时候 不会白屏
//     const visibleData = computed(() => {
//       // 上下都补点
//       return props.items.slice(state.start - prev.value, state.end + next.value)
//     })

//     const offset = ref(0)

//     const handleScroll = () => {
//       // 根据当前滚动的距离 来算，过去了几个数据
//       const scrollTop = wrapperRef.value!.scrollTop
//       state.start = Math.floor(scrollTop / props.size) // 划过去了多少个

//       state.end = state.start + props.remain
//       offset.value = state.start * props.size - props.size * prev.value // 滚过去了多少个
//     }

//     function initWrapper() {
//       wrapperRef.value!.style.height = props.remain * props.size + 'px'
//       barRef.value!.style.height = props.items.length * props.size + 'px'
//     }
//     watch(() => props.items, initWrapper)

//     onMounted(() => {
//       initWrapper()
//     })
//     return () => {
//       return (
//         <div class={bem.b()} ref={wrapperRef} onScroll={handleScroll}>
//           {/* 就是模拟总长度，感觉好像很多数据 */}
//           <div class={bem.e('scroll-bar')} ref={barRef}></div>
//           {/* 更新列表从哪显示到哪里 ，一直只展示 8条数据*/}
//           <div
//             class={bem.e('scroll-list')}
//             style={{ transform: `translate3d(0,${offset.value}px,0)` }}
//           >
//             {visibleData.value.map((node, idx) => slots.default!({ node }))}
//           </div>
//         </div>
//       )
//     }
//   }
// })
