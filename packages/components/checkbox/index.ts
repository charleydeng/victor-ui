/**用来整合组件，并最终导出组件 */

import { withInstall } from '@victor-ui/utils/with-install'
import _Checkbox from './src/checkbox.vue'
const Checkbox = withInstall(_Checkbox) // ⽣成带有install⽅法的组件
export default Checkbox // 导出Checkbox组件
export type { CheckboxProps } from './src/checkbox'
declare module 'vue' {
  export interface GlobalComponents {
    VCheckbox: typeof Checkbox
  }
}
