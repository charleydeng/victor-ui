# Checkbox 选择器

## 使⽤选择器

- 如果你想像⽤例⼀样直接使⽤，你需要全局注册组件，才能够直接在项⽬⾥使⽤。

  <script setup lang="ts">
  </script>
  <div>
  <v-checkbox label="一起加油吧">
  </v-checkbox>
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

| 名称 | 类型   | 默认值    | 说明     |
| ---- | ------ | --------- | -------- |
| -    |
| null | string | undefined | 图标颜⾊ |

|
| null | number \| string | undefined | 图⽚⼤⼩
|
