import { App } from 'vue'
import Icon from './icon'
import Checkbox from './checkbox'
import Tree from './tree'
import VirtualList from './virtual-list'

// 导出单独组件
export { Icon, Checkbox, Tree, VirtualList }

// 编写一个插件，实现一个install方法

export default {
  install(app: App): void {
    app.use(Icon)
    app.use(Checkbox)
    app.use(Tree)
    app.use(VirtualList)
  }
}
