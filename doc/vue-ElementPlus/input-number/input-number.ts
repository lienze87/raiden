import { isNil, isNumber } from 'lodash'
import { CHANGE_EVENT, INPUT_EVENT, UPDATE_MODEL_EVENT } from './constants'
import type { ExtractPropTypes, PropType } from 'vue'
import type InputNumber from './input-number.vue'

export const componentSizes = ['', 'small', 'large', 'medium', 'mini'] as const

export type ComponentSize = typeof componentSizes[number]

export const inputNumberProps = {
  id: {
    type: String,
    default: undefined,
  },
  step: {
    type: Number,
    default: 1,
  },
  stepStrictly: Boolean,
  max: {
    type: Number,
    default: Number.POSITIVE_INFINITY,
  },
  min: {
    type: Number,
    default: Number.NEGATIVE_INFINITY,
  },
  modelValue: {
    type: [String, Number],
    validator: (val: string | number | null) => val === null || val === '' || isNumber(val),
    default: null,
  },
  readonly: Boolean,
  disabled: Boolean,
  size: {
    type: String as PropType<ComponentSize>,
    default: '',
    values: ['', 'small', 'large', 'medium', 'mini'],
  },
  valueOnClear: {
    type: Number,
    validator: (val: 'min' | 'max' | number | null) => val === null || isNumber(val) || ['min', 'max'].includes(val),
    default: null,
  },
  name: String,
  label: String,
  placeholder: String,
  precision: {
    type: Number,
    validator: (val: number) => val >= 0 && val === Number.parseInt(`${val}`, 10),
  },
  validateEvent: {
    type: Boolean,
    default: true,
  },
}
export type InputNumberProps = ExtractPropTypes<typeof inputNumberProps>

export const inputNumberEmits = {
  [CHANGE_EVENT]: (prev: number | string | undefined, cur: number | string | undefined) => prev !== cur,
  blur: (e: FocusEvent) => e instanceof FocusEvent,
  focus: (e: FocusEvent) => e instanceof FocusEvent,
  [INPUT_EVENT]: (val: number | string | null | undefined) => isNumber(val) || isNil(val),
  [UPDATE_MODEL_EVENT]: (val: number | string | undefined) => isNumber(val) || isNil(val),
}
export type InputNumberEmits = typeof inputNumberEmits

export type InputNumberInstance = InstanceType<typeof InputNumber>
