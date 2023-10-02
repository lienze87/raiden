<template>
    <div class="field-multi-select">
        <van-field
            v-model="state.selectedLabel"
            :label="props.label"
            readonly
            :right-icon="isDisabled ? '' : 'arrow-down'"
            placeholder="请选择"
            :disabled="isDisabled"
            @click.stop.prevent="
                () => {
                    if (!isDisabled) {
                        state.showPicker = !state.showPicker
                    }
                }
            "
            v-bind="props.opts"
        ></van-field>
        <van-popup v-model:show="state.showPicker" :position="'bottom'" teleport="#app">
            <van-picker
                ref="PickerRef"
                :columns="props.options"
                :field-names="{
                    text: textKey,
                    value: valueKey,
                    children: childrenKey,
                }"
                @change="(data:any) => handleChange(data)"
                @confirm="(data: any, index:any) => handleSelect(data)"
                @cancel="() => (state.showPicker = false)"
                v-bind="props.pickerOpts"
            >
                <template #option="option">
                    {{ option[textKey] }}
                </template>
            </van-picker>
        </van-popup>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'FieldMulitSelect',
})
</script>

<script lang="ts" setup>
import type { PropType, Ref } from 'vue'
import { watch, computed, inject, onMounted } from 'vue'
import type { FieldNames } from './type'
import { FORM_KEY } from 'vant/es/utils/constant'
import { isDef } from './type'

const props = defineProps({
    modelValue: {
        type: Object,
    },
    label: {
        type: String,
    },
    unionProp: {
        type: Array<string>,
        default: () => [],
    },
    splitSymbol: {
        type: String,
        default: '/',
    },
    options: {
        type: Array<any>,
        default: () => [],
    },
    fieldNames: {
        type: Object as PropType<FieldNames>,
    },
    clearAble: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: null,
    },
    opts: {
        type: Object,
    },
    pickerOpts: {
        type: Object,
    },
})

const emit = defineEmits(['change', 'update:modelValue'])

const form = inject(FORM_KEY, undefined)

const getProp = (key: string) => {
    if (isDef(props[key])) {
        return props[key]
    }
    if (form && isDef(form.props[key])) {
        return form.props[key]
    }
}

const PickerRef = ref()

let state = reactive({
    showPicker: false,
    selected: null,
    selectedLabel: '',
    selectedIndex: [0],
    disabled: false,
})

const {
    text: textKey,
    value: valueKey,
    children: childrenKey,
} = Object.assign(
    {
        text: 'text',
        value: 'value',
        children: 'children',
    },
    props.fieldNames,
)

const handleChange = (data: any) => {
    // console.log(data)
}

const getSelectedOptions = (options: any[], values: string[] | number[]): any[] => {
    const value = values[0]
    const option = options.find((item: any) => item[valueKey] === value)
    const restValues = values.slice(1)

    if (option) {
        const index = options.findIndex((item: any) => item[valueKey] === value)
        if (option[childrenKey] && restValues[0]) {
            const selectedOptions = getSelectedOptions(option[childrenKey], restValues)

            if (selectedOptions) {
                return [{ index: index, data: option }, ...selectedOptions]
            }
        } else {
            return [{ index: index, data: option }]
        }
    } else {
        return null
    }
}

const setSelectedIndex = (options: any[]) => {
    options.forEach((option: any, index: number) => {
        PickerRef?.value?.setColumnIndex(index, option.index)
    })
}

const setSelected = () => {
    let valueList = props.unionProp.map((attr: string) => props.modelValue[attr])

    if (valueList[0]) {
        const selectedOptions = getSelectedOptions(props.options, valueList).filter(Boolean)

        state.selected = selectedOptions
        setSelectedIndex(selectedOptions)
        state.selectedLabel = selectedOptions.map((option: any) => option.data[textKey]).join(props.splitSymbol)
    } else {
        state.selected = {}
        state.selectedLabel = ''
    }
}

const handleSelect = (data: any) => {
    if (!data) {
        state.showPicker = false
        return
    }

    state.selected = data
    state.selectedLabel = data.map((option: any) => option[textKey]).join(props.splitSymbol)
    props.unionProp.forEach((attr: string, index: number) => {
        // 进行赋值操作
        props.modelValue[attr] = data[index] ? data[index][valueKey] : ''
    })

    emit('change', data)
    state.showPicker = false
}

watch(
    () => props.modelValue,
    () => {
        setSelected()
    },
    {
        immediate: true,
        deep: true,
    },
)

watch(
    () => props.options,
    () => {
        setSelected()
    },
    {
        deep: true,
    },
)

const isDisabled = computed(() => getProp('disabled'))
</script>

<style lang="less" scoped>
.field-multi-select {
    :deep(.van-field__control) {
        pointer-events: none;
    }
}
</style>
