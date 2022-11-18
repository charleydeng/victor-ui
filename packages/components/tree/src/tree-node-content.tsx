import { defineComponent, inject } from 'vue'
import { treeInjectionKey, treeNodeContentProps } from './tree'
export default defineComponent({
  name: 'VTreeNodeContent',
  props: treeNodeContentProps,
  setup(props) {
    const tree = inject(treeInjectionKey)
    return () => {
      const node = props.node
      return tree?.slots.default ? tree.slots.default({ node }) : node?.label
    }
  }
})
