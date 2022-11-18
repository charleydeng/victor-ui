import { createApp } from 'vue'
import App from './App.vue'
import Icon from '@victor-ui/components/icon'
import Tree from '@victor-ui/components/tree'
import Checkbox from '@victor-ui/components/checkbox'
import VirtualList from '@victor-ui/components/virtual-list'
import '@victor-ui/theme-chalk/src/index.scss'

const plugins = [Icon, Tree, Checkbox, VirtualList]
const app = createApp(App)
plugins.forEach(item => app.use(item))
app.mount('#app')
