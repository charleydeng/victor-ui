/**这里编写组件需要的属性及其类型*/

import { ExtractPropTypes, PropType } from 'vue'
export const iconProps = {
  size: [Number, String] as PropType<number | string>,
  color: String
} as const
export type IconProps = ExtractPropTypes<typeof iconProps> //ExtractPropTypes 用于把 构造器类型变成对应的类型
