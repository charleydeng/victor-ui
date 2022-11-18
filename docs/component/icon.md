# Icon 图标

victor-ui 推荐使⽤ xicons 作为图标库。

```
$ pnpm install @vicons/ionicons5
```

## 使⽤图标

- 如果你想像⽤例⼀样直接使⽤，你需要全局注册组件，才能够直接在项⽬⾥使⽤。

  <script setup lang="ts">
  import { CashOutline } from '@vicons/ionicons5'
  </script>
  <v-icon color="red" size="40">
  <CashOutline/>
  </v-icon>
  <v-icon color="green" size="40">
  <CashOutline/>
  </v-icon>
  <v-icon color="blue" size="40">
  <CashOutline/>
  </v-icon>
  <div>
  <v-icon color="red" size="60">
  <CashOutline/>
  </v-icon>
  <v-icon color="green" size="60">
  <CashOutline/>
  </v-icon>
  <v-icon color="blue" size="60">
  <CashOutline/>
  </v-icon>
  </div>

```vue
<script setup lang="ts">
import { CashOutline } from '@vicons/ionicons5'
</script>
<template>
  <v-icon color="red" size="40">
    <CashOutline />
  </v-icon>
</template>
```

## API

### Icon Props

| 名称  | 类型   | 默认值    | 说明     |
| ----- | ------ | --------- | -------- |
| -     |
| color | string | undefined | 图标颜⾊ |

|
| size | number \| string | undefined | 图⽚⼤⼩
|

## 基础用法

基础的函数用法

:::demo 使用`size`、`color`、`pain`、`round`属性来定义 Button 的样式。

```vue
<template>
  <div style="margin-bottom:20px;">
    <SButton color="blue">主要按钮</SButton>
    <SButton color="green">绿色按钮</SButton>
    <SButton color="gray">灰色按钮</SButton>
    <SButton color="yellow">黄色按钮</SButton>
    <SButton color="red">红色按钮</SButton>
  </div>
</template>
```

:::

:::demo 设置 icon 属性即可，icon 的列表可以参考 Element 的 icon 组件，也可以设置在文字右边的 icon ，只要使用 i 标签即可，可以使用自定义图标。

```vue
<template>
  <div class="flex flex-row">
    <SButton icon="edit" plain></SButton>
    <SButton icon="delete" plain></SButton>
    <SButton icon="share" plain></SButton>
    <SButton round plain icon="search">搜索</SButton>
  </div>
</template>
```
