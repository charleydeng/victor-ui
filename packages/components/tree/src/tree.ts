import { PropType, ExtractPropTypes, InjectionKey, SetupContext } from 'vue'

export type Key = string | number

/**我们需要对⽤户传⼊的数据进⾏格式化后再使⽤。这个是格式化后的props.data里的对象的格式。*/
export interface TreeNode extends Required<TreeOption> {
  level: number // 层级
  children: Array<TreeNode> // ⼉⼦数组
  rawNode: TreeOption // 原始的node
  parentKey: Key | undefined
}

/**用户传进来的data里的对象的格式 */
export interface TreeOption {
  key?: Key
  label?: string
  isLeaf?: boolean //如果是叶子结点则不用展开（即不用三角小图标）
  children?: TreeOption[]
  disabled?: boolean //表示该节点是否可选，不是指checkbox，是指节点本身
  [k: string]: unknown
}

/**用户可以传给tree组件的属性 */
export const treeProps = {
  defaultExpandedKeys: {
    // 1.默认要展开的节点的key有哪些
    type: Array as PropType<Key[]>,
    default: () => []
  },
  keyField: {
    // 2.key字段的别名
    type: String,
    default: 'key'
  },
  labelField: {
    // 3.label字段的别名
    type: String,
    default: 'label'
  },
  childrenField: {
    // 4.children字段的别名
    type: String,
    default: 'children'
  },
  data: {
    // 5.所有数据
    type: Array as PropType<TreeOption[]>,
    default: () => []
  },
  /**用于加载展开数据的函数 */
  onLoad: Function as PropType<(node: TreeOption) => Promise<TreeOption[]>>,

  /**是否可以多选 */
  multiple: Boolean,

  /**是否可选 */
  selectable: {
    type: Boolean,
    default: true
  },

  /**已经选择的key */
  selectedKeys: Array as PropType<Key[]>,

  /**选中了checkbox的节点的key */
  defaultCheckedKeys: {
    type: Array as PropType<Key[]>,
    default: () => []
  },
  showCheckbox: {
    type: Boolean,
    required: true
  }
} as const
export type TreeProps = Partial<ExtractPropTypes<typeof treeProps>>

/**传给treeNode的属性 */
export const treeNodeProps = {
  /**当前节点 */
  node: {
    type: Object as PropType<TreeNode>,
    required: true
  },
  /**是否展开 */
  expanded: {
    type: Boolean,
    default: false
  },
  /**正在加载的节点 */
  loadingKeys: {
    type: Object as PropType<Set<Key>>
  },
  /**选择的keys */
  selectKeys: {
    type: Array as PropType<Key[]>,
    default: () => []
  },

  showCheckbox: {
    type: Boolean,
    default: false
  },
  checked: Boolean,
  disabled: Boolean,
  indeterminate: Boolean
} as const
export type TreeNodeProps = Partial<ExtractPropTypes<typeof treeNodeProps>>

/**定义tree里的事件 */
export const treeEvents = {
  /**内部组件发射的事件用来同步响应式数据 */
  'update:selectedKeys': (keys: Key[]) => keys
}

/**定义treeNode里的事件 */
export const treeNodeEvents = {
  /**切换节点的折叠和展开 */
  toggle: (node: TreeNode) => node,

  /**选择节点后处理的事件 */
  select: (node: TreeNode) => node,

  /**点击checkbox后的事件 */
  check: (node: TreeNode, val: boolean) => typeof val === 'boolean'
}

/** 创建上下⽂对象，提供注⼊实现*/
export interface TreeContext {
  slots: SetupContext['slots'] // 插槽属性
}

/**此变量作为提供出去的属性*/
export const treeInjectionKey: InjectionKey<TreeContext> = Symbol()

/**treeNodeContent组件的属性类型 */
export const treeNodeContentProps = {
  node: {
    type: Object as PropType<TreeNode>,
    required: true
  }
} as const
