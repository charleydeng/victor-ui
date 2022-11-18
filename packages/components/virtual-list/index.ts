import { withInstall } from '@victor-ui/utils/with-install'
import _vertual from './src/virtual-list'
const VirtualList = withInstall(_vertual) // ⽣成带有install⽅法的组件
export default VirtualList // 导出Icon组件
declare module 'vue' {
  export interface GlobalComponents {
    VVirtualList: typeof VirtualList
  }
}
