import type { PropType } from 'vue'

export const unknownProp = null as unknown as PropType<unknown>
export const FORM_KEY = Symbol('van-form')

export const isDef = <T>(val: T): val is NonNullable<T> => val !== undefined && val !== null

export declare type FieldNames = {
    text: string
    value?: string
    children?: string
}

export declare type SearchItem = {
    type: 'select' | 'input' | 'datetime' | 'cascader' | 'multi-select' | 'datetimeRangePicker'
    label: string
    prop: string
    isOutSide?: boolean
    clearAble?: boolean
    disabled?: boolean
    options?: Array<any>
    unionProp?: Array<string>
    splitSymbol?: string
    fieldNames?: FieldNames
    checkStrictly?: boolean
    dateType?: string
    format?: string
    onChange?: (data: any) => void
    opts?: any
    pickerOpts?: any
    hide?: () => boolean
}

export const searchBarProps = {
    disabled: {
        type: Boolean,
        default: false,
    },
    modelValue: unknownProp,
    fields: {
        type: Array as PropType<SearchItem[]>,
        default: () => [],
    },
}
