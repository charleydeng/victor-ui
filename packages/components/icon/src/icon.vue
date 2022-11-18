<template>
  <i :class="bem.b()" :style="style">
    <slot></slot>
  </i>
</template>

<script lang="ts" setup>
import { createNamespace } from '@victor-ui/utils/create'
import { computed, CSSProperties } from 'vue'
import { iconProps } from './icon'
defineOptions({
  /**这个name是为了当用户将该组件注册为全局组件的时候将该组件命名为VIcon */
  name: 'VIcon'
})
const bem = createNamespace('icon')
const props = defineProps(iconProps)
const style = computed<CSSProperties>(() => {
  if (!props.size && !props.color) {
    return {}
  }
  return {
    ...(props.size
      ? {
          'font-size': props.size + 'px'
        }
      : {}),
    ...(props.color
      ? {
          color: props.color
        }
      : {})
  }
})
</script>
