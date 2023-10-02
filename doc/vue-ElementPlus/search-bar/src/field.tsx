import { computed, defineComponent, PropType } from 'vue'
import type { SelectProp, CascadeProp } from './types'
import { useId } from './use-id'

export default defineComponent({
  name: 'Field',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'Input',
    },
    label: {
      type: String,
      default: '',
    },
    prop: {
      type: String,
      default: '',
    },
    opts: {
      type: Object,
      default: () => {},
    },
    options: {
      type: Array,
      default: () => [],
    },
    selectProps: {
      type: Object as PropType<SelectProp>,
      default: () => {},
    },
    cascadeProps: {
      type: Object as PropType<CascadeProp>,
      default: () => {},
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit, slots }) {
    const id = useId()
    const getId = () => props.id || `${id}-${props.type}`
    const modelValue = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        emit('update:modelValue', val)
      },
    })

    const renderCustom = () => {
      if (props.type === 'input') {
        return renderInput()
      } else if (props.type === 'select') {
        return renderSelect()
      } else if (props.type === 'date') {
        return renderDatePicker()
      } else {
        return <span style='color:red;'>unknown type</span>
      }
    }

    const renderInput = () => {
      return <el-input v-model={modelValue.value} {...props.opts}></el-input>
    }

    const renderSelect = () => {
      return (
        <el-select v-model={modelValue.value} onChange={(val: any) => emit('change', val)} {...props.opts}>
          {props.options.map((option: any) => (
            <el-option
              label={option[props.selectProps.label]}
              value={option[props.selectProps.value]}
              key={option[props.selectProps.value]}></el-option>
          ))}
        </el-select>
      )
    }

    const renderDatePicker = () => {
      return <el-date-picker v-model={modelValue.value} {...props.opts} />
    }

    return () => {
      const content = renderCustom()
      return (
        <el-form-item id={getId()} label={props.label} prop={props.prop}>
          {content}
        </el-form-item>
      )
    }
  },
})
