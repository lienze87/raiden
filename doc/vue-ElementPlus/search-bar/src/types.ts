import type { Ref } from 'vue'

export declare type SelectProp = {
  label: string
  value: string
}

export declare type CascadeProp = {
  label: string
  value: string
  checkStrictly: boolean
}

export declare type FieldProp = {
  id?: string
  type: 'select' | 'input' | 'cascade'
  label: string
  prop: string
  unionProp?: Array<string>
  splitSymbol?: string
  opts?: any
  options?: Array<any> | Ref<Array<any> | undefined>
  selectProps?: SelectProp
  cascadeProps?: CascadeProp
  onChange?: (data: any) => void
}
