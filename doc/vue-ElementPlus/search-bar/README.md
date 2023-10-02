# 搜索栏组件

[TOC]

## 示例代码

[example](./example.vue)

## changelog

### 2023/3/29

1. 新增组件文档

## 表格 API 参考

| 属性名  | 说明                 | 类型      | 可选值 | 默认值 |
| ------- | -------------------- | --------- | ------ | ------ |
| v-model | 搜索栏表单绑定的对象 | Object    | -      | -      |
| fields  | 搜索栏表单的表单项   | FieldProp | -      | -      |

### FieldProp

| 属性名       | 说明                                         | 类型                           | 是否必填 | 可选值               | 默认值 |
| ------------ | -------------------------------------------- | ------------------------------ | -------- | -------------------- | ------ |
| id           | 表头文字                                     | string                         | 是       | -                    | -      |
| type         | 当前支持的表单项类型                         | string                         | 是       | select/input/cascade | -      |
| label        | 此表单项对应的 label                         | string                         | 是       | ''                   | -      |
| prop         | 此表单项对应的属性名                         | string                         | 是       | ''                   | -      |
| unionProp    | 此表单项对应联合属性                         | string[]                       | 否       | -                    | -      |
| splitSymbol  | 联合属性的分隔符                             | string                         | 否       | -                    | /      |
| opts         | 表单项的原生属性                             | el-input/el-select/el-cascader | 否       | -                    | -      |
| options      | type 为'select'或'cascade'的表单项的选项列表 | any[]                          | 否       | -                    | -      |
| selectProps  | type 为'select'的表单项配置属性              | SelectProps                    | 否       | -                    | -      |
| cascadeProps | type 为'cascade'的表单项配置属性             | CascadeProps                   | 否       | -                    | -      |
| onChange     | change 事件的处理函数                        | function(row)：string          | 否       | -                    | -      |

### selectProps

| 属性名 | 说明               | 类型   | 是否必填 | 可选值 | 默认值 |
| ------ | ------------------ | ------ | -------- | ------ | ------ |
| label  | el-option 的 label | string | 是       | -      | -      |
| value  | el-option 的 value | string | 是       | -      | -      |

### cascadeProps

| 属性名        | 说明                     | 类型    | 是否必填 | 可选值 | 默认值 |
| ------------- | ------------------------ | ------- | -------- | ------ | ------ |
| label         | option 的 label          | string  | 是       | -      | -      |
| value         | option 的 value          | string  | 是       | -      | -      |
| checkStrictly | 父子节点是否取消选中关联 | boolean | 否       | -      | -      |
