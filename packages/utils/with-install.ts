import { Component, ComputedOptions, MethodOptions, Plugin } from 'vue'
export type SFCWithInstall<T> = T & Plugin //添加插件类型
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withInstall<
  T extends Component<any, any, any, ComputedOptions, MethodOptions>
>(comp: T) {
  ;(comp as SFCWithInstall<T>).install = //断言comp 是有 install 方法的
    function (app) {
      const { name } = comp as unknown as { name: string } //断言 comp 是有name属性的
      app.component(name, comp) // 注册全局组件,并且给这个组件命名
    }
  return comp as SFCWithInstall<T>
}
