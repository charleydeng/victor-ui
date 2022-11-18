<template>
  <div
    :class="[
      bem.b(),
      bem.is('selected', isSelected),
      bem.is('disabled', node.disabled)
    ]"
  >
    <div
      :class="bem.e('content')"
      :style="{ paddingLeft: `${node.level * 16 + 'px'}` }"
    >
      <!--根据层级不同使用不同的缩进（通过paddingLeft来缩进）-->
      <span
        :class="[
          bem.e('expand-icon'),
          bem.is('leaf', node.isLeaf),
          { expanded: !node.isLeaf && expanded }
        ]"
      >
        <v-icon size="25" @click.stop="handleExpandIconClick(node)">
          <Switcher v-if="!isLoading"></Switcher>
          <Loading v-else></Loading>
        </v-icon>
      </span>
      <v-checkbox
        v-if="showCheckbox"
        :disabled="disabled"
        :model-value="checked"
        :indeterminate="indeterminate"
        @change="handleCheckChange"
      ></v-checkbox>
      <span :class="bem.e('label')" @click="handleContentClick(node)"
        ><VTreeNodeContent :node="node"> </VTreeNodeContent>
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { createNamespace } from '../../../utils/create'
import { TreeNode, treeNodeEvents, treeNodeProps } from './tree'
import VIcon from '../../icon'
import VCheckbox from '../../checkbox'
import VTreeNodeContent from './tree-node-content'
import Switcher from './icon/Switcher'
import { computed } from 'vue'
import Loading from './icon/Loading'
const bem = createNamespace('tree-node')
const props = defineProps(treeNodeProps)
const emit = defineEmits(treeNodeEvents)
const handleExpandIconClick = (node: TreeNode) => {
  emit('toggle', node) // 触发toggle事件
}

const isLoading = computed(() => {
  return props.loadingKeys?.has(props.node.key)
})

/** 判断是否选中 */
const isSelected = computed(() => {
  return props.selectKeys.includes(props.node.key)
})

/**内容点击触发选择 */
const handleContentClick = (node: TreeNode) => {
  if (node.disabled) return //在选中节点时判断，节点是否为禁⽤状态
  emit('select', node)
}

/**触发点击checkbox事件 */
function handleCheckChange(val: boolean) {
  emit('check', props.node, val)
}
</script>
