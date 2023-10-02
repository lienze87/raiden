import { computed, defineComponent, PropType } from 'vue'
import type { SelectProp, CascadeProp } from './types'
import { useId } from './use-id'

export default defineComponent({
  name: 'CascadeField',
  props: {
    modelValue: {
      type: Array,
      default: [],
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

    const renderCascade = () => {
      return (
        <el-cascader
          v-model={modelValue.value}
          onChange={(val: any) => emit('change', val)}
          options={props.options}
          props={props.cascadeProps}></el-cascader>
      )
    }

    return () => {
      const content = renderCascade()
      return (
        <el-form-item id={getId()} label={props.label} prop={props.prop}>
          {content}
        </el-form-item>
      )
    }
  },
})
