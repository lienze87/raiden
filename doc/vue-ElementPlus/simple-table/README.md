# 自定义表格组件

[TOC]

## 示例代码

[example](./example.vue)

## 表格 API 参考

| 属性名   | 说明                            | 类型        | 可选值     | 默认值 |
| -------- | ------------------------------- | ----------- | ---------- | ------ |
| loading  | 控制表格加载时 loading 框的显示 | boolean     | true/false | false  |
| initData | 表格显示的数据                  | array       | -          | -      |
| columns  | 表头的定义数据                  | ColumnProps | -          | -      |

### ColumnProps

| 属性名     | 说明                                 | 类型                                            | 是否必填 | 可选值                              | 默认值 |
| ---------- | ------------------------------------ | ----------------------------------------------- | -------- | ----------------------------------- | ------ |
| label      | 表头文字                             | string                                          | 是       | -                                   | -      |
| prop       | 此列数据对应的属性名                 | string                                          | 是       | ''                                  | -      |
| width      | 当前列的宽度                         | number                                          | 否       | -                                   | 50     |
| type       | el-table 中支持的当前列的类型        | string                                          | 否       | selection/index/expand              | -      |
| extType    | 自定义的当前列类型                   | string                                          | 否       | link/btn/switch/img/children/custom | -      |
| formatter  | 格式化单元格内容                     | function(row, column, cellValue, index)：string | 否       | -                                   | -      |
| render     | 自定义渲染函数                       | function(row, column, cellValue, index)：string | 否       | -                                   | -      |
| linkAttr   | extType 为'link'的单元格配置属性     | LinkProps                                       | 否       | -                                   | -      |
| switchAttr | extType 为'switch'的单元格配置属性   | SwitchProps                                     | 否       | -                                   | -      |
| btnList    | extType 为'btn'的单元格配置属性      | BtnProps                                        | 否       | -                                   | -      |
| children   | extType 为'children'的单元格配置属性 | array                                           | 否       | -                                   | -      |
| opts       | el-table-column 的原生属性           | el-table-column                                 | 否       | -                                   | -      |

### LinkProps

| 属性名         | 说明                       | 类型                  | 是否必填 | 可选值 | 默认值 |
| -------------- | -------------------------- | --------------------- | -------- | ------ | ------ |
| handler        | 点击单元格后的回调函数     | function(row)         | 是       | -      | -      |
| customDisabled | 控制当前链接是否禁用       | function(row):boolean | 否       | -      | -      |
| opts           | el-table-column 的原生属性 | el-table-column       | 否       | -      | -      |

### BtnProps

| 属性名         | 说明                       | 类型                  | 是否必填 | 可选值 | 默认值 |
| -------------- | -------------------------- | --------------------- | -------- | ------ | ------ |
| text           | 按钮内容                   | string                | 是       | -      | -      |
| handler        | 点击按钮后的回调函数       | function(row, e)      | 是       | -      | -      |
| formatter      | 格式化按钮的显示文字       | function(row):string  | 否       | -      | -      |
| customShow     | 控制当前按钮是否显示       | function(row):boolean | 否       | -      | -      |
| customDisabled | 控制当前按钮是否禁用       | function(row):boolean | 否       | -      | -      |
| isHeader       | 当前按钮是否是表头按钮     | boolean               | 否       | -      | -      |
| opts           | el-table-column 的原生属性 | el-table-column       | 否       | -      | -      |

### SwitchProps

| 属性名  | 说明                       | 类型               | 是否必填 | 可选值 | 默认值 |
| ------- | -------------------------- | ------------------ | -------- | ------ | ------ |
| handler | 点击单元格后的回调函数     | function(row, val) | 是       | -      | -      |
| opts    | el-table-column 的原生属性 | el-table-column    | 否       | -      | -      |

### extType = img

- extType 为‘img’时，此列对应的 data 值可以有两种
  - data 为对象，且包含 url 属性，此时将使用 el-image 组件直接显示此 url
  - data 为字符串，此时将认为此字符串为 groupUuid，此时将使用 img-viewer 组件请求接口获取要显示的图片

### extType = custom

将使用 v-html 渲染 render 函数返回的内容

```javascript
let column = [
        label: '学院',
        prop: 'collegeName',
        extType: 'custom',
        render: (row: any) => {
          return `<span class="red-cell">${row.collegeName}</span>`
        }
]
```

### End
