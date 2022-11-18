import { ExtractPropTypes, PropType } from 'vue'
export const checkboxProps = {
  modelValue: {
    type: [Boolean, Number, String] as PropType<boolean | number | string>
  },
  label: {
    type: [Boolean, Number, String] as PropType<boolean | number | string>
  },
  indeterminate: Boolean,
  disabled: Boolean
} as const
export type CheckboxProps = Partial<ExtractPropTypes<typeof checkboxProps>>
export const checkboxEmits = {
  change: (value: boolean) => typeof value === 'boolean',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  'update:modelValue': (value: boolean | number | string) => true //接收消息的函数必须返回true，要不然vue会有警告：Invalid event arguments: event validation failed for event
}
export type CheckboxEmits = typeof checkboxEmits
