/**用来整合组件，并最终导出组件 */

import { withInstall } from '@victor-ui/utils/with-install'
import _Icon from './src/icon.vue'
const Icon = withInstall(_Icon) // ⽣成带有install⽅法的组件
export default Icon // 导出Icon组件
export type { IconProps } from './src/icon'
declare module 'vue' {
  export interface GlobalComponents {
    VIcon: typeof Icon
  }
}
