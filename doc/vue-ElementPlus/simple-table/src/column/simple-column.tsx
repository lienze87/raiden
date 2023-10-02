import { defineComponent, PropType } from 'vue'
import type { ColumnProps, ScopeProps } from '../types'
import { typeRenders } from './render-helper'
import imgViewerVue from './img-viewer.vue'

function checkAttr(obj: object, key: string, value: string | number | undefined, defaultVal?: string | number) {
  if (value) {
    obj[key] = value
  } else if (defaultVal) {
    obj[key] = defaultVal
  }
}

const SimpleTableColumn = defineComponent({
  name: 'SimpleTableColumn',
  components: {
    imgViewerVue,
  },
  props: {
    column: {
      type: Object as PropType<ColumnProps>,
      required: true,
    },
  },
  setup({ column }) {
    let config = column

    // 设置默认值
    checkAttr(config, 'width', column.width, 80)
    checkAttr(config, 'extType', column.extType, '')

    return { config }
  },
  render() {
    try {
      const { label, prop, width, type, extType, formatter, render, opts, customOpts } = this.config

      if (type) {
        return <el-table-column type={type} label={label} width={55} {...opts} />
      }

      switch (extType) {
        case 'link':
          return (
            <el-table-column label={label} prop={prop} min-width={width} formatter={formatter} {...opts}>
              {{
                default: (scope: ScopeProps) => typeRenders.link(scope, this.config),
              }}
            </el-table-column>
          )
        case 'btn':
          return (
            <el-table-column label={label} prop={prop} min-width={width} {...opts}>
              {{
                header: (scope: ScopeProps) => typeRenders.header(scope, this.config),
                default: (scope: ScopeProps) => typeRenders.btn(scope, this.config),
              }}
            </el-table-column>
          )
        case 'switch':
          return (
            <el-table-column label={label} prop={prop} min-width={width} {...opts}>
              {{
                default: (scope: ScopeProps) => typeRenders.switch(scope, this.config),
              }}
            </el-table-column>
          )
        case 'img':
          return (
            <el-table-column label={label} prop={prop} min-width={width} {...opts}>
              {{
                default: (scope: ScopeProps) => typeRenders.img(scope, this.config),
              }}
            </el-table-column>
          )
        case 'children':
          return (
            <el-table-column
              label={label}
              prop={prop}
              min-width={width}
              formatter={formatter}
              show-overflow-tooltip={true}
              {...opts}>
              {this.config.children?.map((ele: ColumnProps, index: number) => {
                return <SimpleTableColumn column={ele} key={`${index}-${ele.prop || 'default'}`} />
              })}
            </el-table-column>
          )
        case 'custom':
          return (
            <el-table-column
              label={label}
              prop={prop}
              min-width={width}
              formatter={formatter}
              show-overflow-tooltip={true}
              {...opts}>
              {{
                default: (scope: ScopeProps) => {
                  const value = prop && scope.row[prop]
                  const context = render
                    ? render(scope.row, scope.column, scope.value, scope.$index)
                    : value?.toString?.() || ''
                  // 当context类型为字符串时，使用v-html模式，否则视context为v-node
                  if (typeof context === 'string') {
                    return <span class='custom-cell' v-html={context} {...customOpts}></span>
                  } else {
                    return context
                  }
                },
              }}
            </el-table-column>
          )
        default:
          return (
            <el-table-column
              label={label}
              prop={prop}
              min-width={width}
              formatter={formatter}
              show-overflow-tooltip={true}
              {...opts}
            />
          )
      }
    } catch (e) {
      console.error('表格错误', e)
    }
  },
})

export default SimpleTableColumn
