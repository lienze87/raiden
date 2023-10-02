# 学生搜索及详情组件

[TOC]

## 示例代码

[example](./example.vue)

## changelog

### 2023/7/11

1. 修改学生详情组件中的学生默认头像显示

### 2023/4/23

1. 修改查询学生列表的响应结果的数据解析错误

### 2023/4/19

1. 新增组件文档

## StudentSearch 组件 API 参考

| 属性名    | 说明                  | 类型                                             | 可选值     | 默认值 |
| --------- | --------------------- | ------------------------------------------------ | ---------- | ------ |
| disabled  | 控制组件是否 disabled | boolean                                          | true/false | false  |
| studentNo | 默认的 studentNo      | string                                           | -          | -      |
| onChange  | 在学生改变时触发      | ({studentNo: string,studentName: string})=> void | -          | -      |

## StudentInfo 组件 API 参考

| 属性名     | 说明             | 类型        | 可选值 | 默认值 |
| ---------- | ---------------- | ----------- | ------ | ------ |
| modelValue | 表单数据         | Object      | -      | -      |
| columns    | 表单项的定义数据 | ColumnProps | -      | -      |
| avatarKey  | 头像字段名       | string      | -      | photo  |

### ColumnProps

| 属性名    | 说明                 | 类型                          | 是否必填 | 可选值   | 默认值 |
| --------- | -------------------- | ----------------------------- | -------- | -------- | ------ |
| label     | 表单项的标题         | string                        | 是       | -        | -      |
| prop      | 此列数据对应的属性名 | string                        | 是       | ''       | -      |
| width     | 当前列的宽度         | number                        | 否       | 50/100/- | -      |
| formatter | 格式化单元格内容     | (modelValue: Object)=> string | 否       | -        | -      |
