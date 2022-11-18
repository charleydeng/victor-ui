<script setup lang="ts">
import { CashOutline } from '@vicons/ionicons5'
import { Key, TreeOption } from '@victor-ui/components/tree'
import { reactive, ref } from 'vue'
import { faker } from '@faker-js/faker'
/**该函数用于生成树型结构的数据 */
function createData(level = 4, parentKey = ''): TreeOption[] {
  function createLabel(level: number): string {
    if (level === 4) return '道⽣⼀'
    if (level === 3) return '⼀⽣⼆'
    if (level === 2) return '⼆⽣三'
    if (level === 1) return '三⽣万物'
    return ''
  }

  if (!level) return []
  const arr = new Array(20 - level).fill(0)
  return arr.map((_, idx: number) => {
    const key = parentKey + level + idx
    return {
      label: createLabel(level),
      key: key,
      children: createData(level - 1, key)
    }
  })
}

// function createData() {
//   return [
//     {
//       label: nextLabel(),
//       key: 1,
//       isLeaf: false
//     },
//     {
//       label: nextLabel(),
//       key: 2,
//       isLeaf: false
//     }
//   ]
// }
// function nextLabel(currentLabel?: string): string {
//   if (!currentLabel) return 'Out of Tao, One is born'
//   if (currentLabel === 'Out of Tao, One is born') return 'Out of One, Two'
//   if (currentLabel === 'Out of One, Two') return 'Out of Two, Three'
//   if (currentLabel === 'Out of Two, Three') {
//     return 'Out of Three, the created universe'
//   }
//   if (currentLabel === 'Out of Three, the created universe') {
//     return 'Out of Tao, One is born'
//   }
//   return ''
// }

const data = ref<TreeOption[]>(createData())
// const data = ref<TreeOption[]>([
//   {
//     key: '0',
//     label: '0',
//     children: [
//       {
//         key: '0-0',
//         label: '0-0'
//       },
//       {
//         disabled: true,
//         key: '0-1',
//         label: '0-1',
//         children: [
//           {
//             label: '0-1-0',
//             key: '0-1-0'
//           },
//           {
//             label: '0-1-1',
//             key: '0-1-1'
//           }
//         ]
//       }
//     ]
//   }
// ])

/**该函数用于生成异步的孩子数据。 参数node表示当前要展开的节点。 */
// const handleLoad = (node: TreeOption) => {
//   return new Promise<TreeOption[]>(resolve => {
//     setTimeout(() => {
//       resolve([
//         //这个数据会作为当前展开的node的children属性
//         {
//           label: nextLabel(node.label),
//           key: node.key + nextLabel(node.label),
//           isLeaf: false
//         }
//       ])
//     }, 2000)
//   })
// }

const value = ref<Key[]>([])
const check = ref(true)
const handleCheckbox = function (val: boolean) {
  console.log(val)
}

const virtualListData = reactive<{ id: number; value: string }[]>([])
for (let id = 0; id < 120; id++) {
  virtualListData.push({
    id,
    value: faker.lorem.sentences() // 长文本
  })
}
</script>
<template>
  <v-Icon :color="'red'" :size="400">
    <CashOutline></CashOutline>
  </v-Icon>
  {{ value }}
  <!--传递的data应该是树型结构的-->
  <v-tree
    v-model:selected-keys="value"
    :data="data"
    selectable
    multiple
    show-checkbox
  >
    <template #default="{ node }"> {{ node.key }}-{{ node.label }} </template>
  </v-tree>

  {{ check }}
  <v-checkbox
    v-model="check"
    :indeterminate="true"
    label="节点"
    @change="handleCheckbox"
    >jiandian</v-checkbox
  >
</template>
