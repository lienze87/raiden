import type { Component } from 'vue'

export declare type TableProps = {
  initData: Array<any>
  columns: Array<ColumnProps>
  height?: number
  showLoading?: boolean
}

export declare type ColumnProps = {
  label: string
  prop: string
  width?: number
  type?: 'selection' | 'index' | 'expand'
  extType?: 'link' | 'btn' | 'switch' | 'img' | 'children' | 'custom'
  formatter?: (row: any, column: any, value: any, $index: number | undefined) => string
  render?: (row: any, column: any, value: any, $index: number | undefined) => string
  linkAttr?: LinkProps
  switchAttr?: SwitchProps
  btnList?: Array<BtnProps>
  children?: Array<ColumnProps>
  opts?: any
  customOpts?: any
}

export declare type ScopeProps = {
  row?: any
  column: any
  value?: any
  $index?: number
}

export declare type LinkProps = {
  handler: (row: any) => void
  customDisabled?: (row: any, column: any, value: any, $index: number | undefined) => boolean
  opts?: {
    type: string
  }
}

export declare type SwitchProps = {
  handler: (row: any, val: any) => void
  opts?: any
}

export declare type BtnProps = {
  text: string
  handler: (row: any, e?: Event) => void
  formatter?: (row: any) => string
  customShow?: (row: any) => boolean
  customDisabled?: (row: any) => boolean
  isHeader?: boolean
  opts?: {
    size: string
    type: string
    icon: string | Component
  }
}
