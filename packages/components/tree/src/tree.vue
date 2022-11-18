<template>
  <div :class="bem.b()">
    <v-virtual-list
      :items="flattenTree"
      :remain="8"
      :size="35"
      :is-fixed-height="true"
    >
      <template #default="{ node }">
        <v-tree-node
          :key="node.key"
          :node="node"
          :expanded="isExpanded(node)"
          :loading-keys="loadingKeysRef"
          :selected-keys="selectedKeys"
          :show-checkbox="showCheckbox"
          :checked="isChecked(node)"
          :disabled="isDisabled(node)"
          :indeterminate="isIndeterminate(node)"
          @select="handleSelect"
          @toggle="toggleExpand"
          @check="toggleCheckbox"
        >
        </v-tree-node>
      </template>
    </v-virtual-list>
  </div>
</template>
<script setup lang="ts">
import { createNamespace } from '@victor-ui/utils/create'
import { computed, onMounted, provide, ref, useSlots, watch } from 'vue'
import { Key, TreeOption } from '..'
import { treeEvents, treeInjectionKey, TreeNode, treeProps } from './tree'
import VTreeNode from './treeNode.vue'
import VVirtualList from '../../virtual-list'
defineOptions({
  /**这个name是为了当用户将该组件注册为全局组件的时候将该组件命名为v-tree */
  name: 'v-tree'
})
const bem = createNamespace('tree')
const props = defineProps(treeProps)

//----------------------------------------------------------实现树的数据的格式化-------------------------------------------------------------------
//#region

/**props.data格式化后的数据就放到tree中 */
const tree = ref<TreeNode[]>([])

/** 用户传进来的data里的label属姓名不一定叫label，可能叫xx，用户传进来的key可能属姓名不叫key，可能叫id，用户传进来的children可能属姓名不叫children，所以封装一个用于获取用户传进来的data的属性值的⽅法*/
function createTreeOptions(
  keyField: string,
  childrenField: string,
  labelField: string
) {
  return {
    getKey(node: TreeOption) {
      return node[keyField] as string
    },
    getChildren(node: TreeOption) {
      return node[childrenField] as TreeOption[]
    },
    getLabel(node: TreeOption) {
      return node[labelField] as string
    }
  }
}

/** treeOptions里会有获取用户传进来的data的 key、children、label的方法*/
const treeOptions = createTreeOptions(
  props.keyField,
  props.childrenField,
  props.labelField
)

/**格式化props.data 使它都有且属性名都叫label、key、children、level、rawNode、isLeaf*/
function createTree(data: TreeOption[], parent: TreeNode | null = null) {
  function traversal(data: TreeOption[], parent: TreeNode | null): TreeNode[] {
    return data.map(node => {
      const children = treeOptions.getChildren(node) || [] // 获得所有的孩⼦
      const childrenLen = children.length || 0
      const treeNode: TreeNode = {
        key: treeOptions.getKey(node),
        label: treeOptions.getLabel(node),
        level: parent ? parent.level + 1 : 0,
        isLeaf: node.isLeaf ?? childrenLen == 0,
        children: [], //默认先搞为空
        disabled: !!node.disabled, // 添加disabled属性
        rawNode: node,
        parentKey: parent?.key
      }
      if (childrenLen > 0) {
        // 有孩子再去递归孩子，将其格式化为treeNode类型
        treeNode.children = traversal(children, treeNode)
      }
      return treeNode
    })
  }
  const result: TreeNode[] = traversal(data, parent)
  return result
}

/**监控 props.data变化，调用格式化方法，并且一上来就先格式化一次。 */
watch(
  () => props.data,
  (data: TreeOption[]) => {
    tree.value = createTree(data)
  },
  { immediate: true }
)
//#endregion

//----------------------------------------------------------实现收缩展开和异步加载数据-------------------------------------------------------------------
//#region

/**要展开的节点的key */
const expandedKeySet = ref<Set<Key>>(new Set(props.defaultExpandedKeys))

/**这个是 把要展开的节点 都展开后的树。页面上渲染的也是这个。而且这是一维的，也就是说其实页面上的树其实是一维的，只不过是根据不同层级设置不同的缩进导致开上去像树。*/
const flattenTree = computed(() => {
  const expandedKeys = expandedKeySet.value //需要展开的key
  const flattenNodes: TreeNode[] = [] //存放拍平后的结果
  const nodes = tree.value || [] // 已经格式化后的节点
  const stack: TreeNode[] = [] // 存放节点的
  for (let i = nodes.length - 1; i >= 0; --i) {
    stack.push(nodes[i]) // 因为是倒序，所以循环完后stack里是这样存放的 [节点2 节点1]
  }
  while (stack.length) {
    //深度优先遍历
    const node = stack.pop() // 先拿到节点1
    if (!node) continue
    flattenNodes.push(node) // 将节点1⼊队列
    if (expandedKeys.has(node.key)) {
      // 如果需要展开
      const children = node.children
      if (children) {
        const length = children.length // 将节点1的⼉⼦ child3 child2 child1⼊栈
        for (let i = length - 1; i >= 0; --i) {
          // 倒序
          stack.push(children[i])
        }
      }
    }
  }
  return flattenNodes
})

function isExpanded(node: TreeNode): boolean {
  return expandedKeySet.value.has(node.key)
}

/**存储正在加载的key */
const loadingKeysRef = ref(new Set<Key>())

/**这是个异步函数，用于去加载数据 */
function triggerLoading(node: TreeNode) {
  if (!node.children.length && !node.isLeaf) {
    // 需要异步加载
    const loadingKeys = loadingKeysRef.value
    const { onLoad } = props // 有onLoad⽅法
    if (!loadingKeys.has(node.key)) {
      // 防⽌重复加载
      loadingKeys.add(node.key) // 添加为正在加载
      if (onLoad) {
        // 调⽤⽤户提供的加载⽅法
        onLoad(node.rawNode).then((children: TreeOption[]) => {
          node.rawNode.children = children
          node.children = createTree(children, node) // 给节点添加上children属性并赋值为格式化后的值
          loadingKeys.delete(node.key) // 加载完毕移除key
        })
      }
    }
  }
}

/**在折叠和展开中切换 */
function toggleExpand(node: TreeNode) {
  /**折叠树，展开树，原理是在expandedKeySet中删除该该节点，expandedKeySet发生变化则会让flattenTree重新计算则会重新渲染 */
  function collapse(node: TreeNode) {
    expandedKeySet.value.delete(node.key)
  }

  /**展开树，原理是在expandedKeySet中增加该该节点，expandedKeySet发生变化则会让flattenTree重新计算则会重新渲染  */
  function expand(node: TreeNode) {
    const keySet = expandedKeySet.value
    keySet.add(node.key)
    triggerLoading(node) // 展开时触发加载逻辑
  }

  const expandedKeys = expandedKeySet.value
  if (expandedKeys.has(node.key) && !loadingKeysRef.value.has(node.key)) {
    collapse(node)
  } else {
    expand(node)
  }
}
//#endregion

//----------------------------------------------------------实现禁用、多选节点-------------------------------------------------------------------
//#region
const emit = defineEmits(treeEvents)

/** 选中的key列表 */
const selectedKeys = ref<Key[]>([])

/**监控selectedKeys，如果新的selectedKeys值不是undefined则给selectedKeys赋上新的值，如果是undefined就算了。 */
watch(
  () => props.selectedKeys,
  value => {
    if (value != undefined) {
      selectedKeys.value = value
    }
  },
  { immediate: true }
)

/**该函数用于处理选中某个节点后怎么处理 */
function handleSelect(node: TreeNode) {
  let keys = Array.from(selectedKeys.value)
  if (!props.selectable) {
    // 如果不⽀持选中
    return
  }
  if (props.multiple) {
    // ⽀持多选
    const index = keys.findIndex(key => key === node.key)
    if (index > -1) {
      keys.splice(index, 1)
    } else {
      keys.push(node.key)
    }
  } else {
    if (keys.includes(node.key)) {
      // 如果选中的包含则清空
      keys = []
    } else {
      keys = [node.key]
    }
  }
  emit('update:selectedKeys', keys)
}

//#endregion

//----------------------------------------------------------实现用户自定义节点内容-------------------------------------------------------------------
//#region

/**将这个组件的插槽暴露出去 */
provide(treeInjectionKey, {
  slots: useSlots() // 提供slots属性
})

//#endregion

//----------------------------------------------------------实现有checkbox的树-------------------------------------------------------------------
//#region
/**已经选择的checkbox的节点的key */
const checkedKeysRefs = ref(new Set(props.defaultCheckedKeys))

/**是否选中checkbox */
function isChecked(node: TreeNode) {
  return checkedKeysRefs.value.has(node.key)
}

/**是否禁用checkbox */
function isDisabled(node: TreeNode) {
  return !!node.disabled
}

/**半选的checkbox的节点的key */
const indeterminateRefs = ref<Set<Key>>(new Set())

/**其checkbox是否为半选状态 */
function isIndeterminate(node: TreeNode) {
  return indeterminateRefs.value.has(node.key)
}

/**自上而下的选中checkbox */
function toggle(node: TreeNode, checked: boolean) {
  if (!node) return
  const checkedKeys = checkedKeysRefs.value

  if (checked) {
    // 选中的时候 去掉半选状态
    indeterminateRefs.value.delete(node.key)
  }
  // 维护当前的key列表
  checkedKeys[checked ? 'add' : 'delete'](node.key)
  const children = node.children
  if (children) {
    children.forEach(childNode => {
      if (!childNode.disabled) {
        toggle(childNode, checked)
      }
    })
  }
}

/**找到满足key的节点，返回节点 */
function findNode(key: Key) {
  return flattenTree.value.find(node => node.key === key)
}

/**自下而上的更新选中的checkbox */
function updateCheckedKeys(node: TreeNode) {
  if (node.parentKey) {
    const parentNode = findNode(node.parentKey)

    if (parentNode) {
      let allChecked = true //默认儿子应该全选
      let hasChecked = false // 儿子有没有被选中

      const nodes = parentNode.children
      for (const node of nodes) {
        if (checkedKeysRefs.value.has(node.key)) {
          hasChecked = true // 子节点被选中了
        } else if (indeterminateRefs.value.has(node.key)) {
          allChecked = false
          hasChecked = true
        } else {
          allChecked = false
        }
      }
      if (allChecked) {
        checkedKeysRefs.value.add(parentNode.key)
        indeterminateRefs.value.delete(parentNode.key)
      } else if (hasChecked) {
        checkedKeysRefs.value.delete(parentNode.key)
        indeterminateRefs.value.add(parentNode.key)
      }
      updateCheckedKeys(parentNode)
    }
  }
}
function toggleCheckbox(node: TreeNode, checked: boolean) {
  toggle(node, checked)
  updateCheckedKeys(node)
}

onMounted(() => {
  checkedKeysRefs.value.forEach((key: Key) => {
    toggle(findNode(key)!, true)
  })
})
//#endregion
</script>
