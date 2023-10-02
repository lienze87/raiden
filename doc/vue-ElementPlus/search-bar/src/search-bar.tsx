import { computed, defineComponent, PropType, ref, watch } from 'vue'
import type { FieldProp } from './types'
import Field from './field'
import CascadeField from './cascade-field'
import isArray from 'lodash/isArray'

export default defineComponent({
  name: 'SearchBar',
  components: {
    Field,
    CascadeField,
  },
  props: {
    modelValue: {
      type: Object,
      default: () => {},
    },
    fields: {
      type: Array as PropType<FieldProp[]>,
      default: () => [],
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const renderCustom = () => {
      return props.fields.map((column: any) => {
        if (!column.prop) {
          return <span style='color:red;'>prop error</span>
        }
        // 组合属性需要使用computed
        if (column.unionProp) {
          let computedModel = computed({
            get() {
              let valueList = column.unionProp.map((attr: string) => props.modelValue[attr])
              if (column.type === 'cascade') {
                return valueList.filter(Boolean)
              } else if (column.type === 'select') {
                return valueList.filter(Boolean).join(column.splitSymbol)
              }

              return undefined
            },
            set(val: any) {
              if (val) {
                column.unionProp.forEach((attr: string, index: number) => {
                  if (isArray(val)) {
                    props.modelValue[attr] = val[index] || ''
                  } else {
                    props.modelValue[attr] = val.split(column.splitSymbol)[index]
                  }
                })
              } else {
                column.unionProp.forEach((attr: string) => {
                  props.modelValue[attr] = ''
                })
              }
            },
          })
          // cascade级联组件的modelValue为数组[],input和select的modelValue为字符串，所以拆成独立组件
          if (column.type === 'cascade') {
            return <CascadeField v-model={computedModel.value} {...column}></CascadeField>
          } else {
            return <Field v-model={computedModel.value} {...column}></Field>
          }
        } else {
          return <Field v-model={props.modelValue[column.prop]} {...column}></Field>
        }
      })
    }

    const uid = ref(1)

    watch(
      () => props.fields,
      (value) => {
        uid.value++
      },
    )

    return () => {
      let content = props.fields.length > 0 ? renderCustom() : slots.default?.()
      return (
        <el-form ref='queryRef' key={uid.value} model={props.modelValue} inline={true} label-width={100}>
          {content}
          {slots.searchBtn?.()}
        </el-form>
      )
    }
  },
})
