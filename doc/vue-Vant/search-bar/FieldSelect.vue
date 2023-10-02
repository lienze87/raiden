<template>
    <div class="field-select">
        <van-field
            v-model="state.selectedLabel"
            :label="props.label"
            :right-icon="isDisabled ? '' : 'arrow-down'"
            placeholder="请选择"
            :clearable="props.clearAble"
            :clear-trigger="'always'"
            :disabled="isDisabled"
            @click.stop.prevent="
                () => {
                    if (!isDisabled) {
                        state.showPicker = !state.showPicker
                    }
                }
            "
            @clear="handleClear"
            v-bind="props.opts"
        ></van-field>
        <van-popup v-model:show="state.showPicker" :position="'bottom'" teleport="#app">
            <van-picker
                :columns="optionsFormatter"
                :columns-field-names="{
                    text: textKey,
                    value: valueKey,
                    children: childrenKey,
                }"
                :default-index="state.selectedIndex"
                @confirm="(data: any) => handleSelect(data)"
                @cancel="() => (state.showPicker = false)"
                v-bind="props.pickerOpts"
            />
        </van-popup>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'FieldSelect',
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
        type: [String, Number],
    },
    label: {
        type: String,
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

let state = reactive({
    showPicker: false,
    selected: null,
    selectedLabel: '',
    selectedIndex: 0,
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

const optionsFormatter = computed(() => {
    if (props.clearAble) {
        return [{ [textKey]: '请选择', [valueKey]: '' }].concat(props.options)
    } else {
        return props.options
    }
    // return props.options
})

const getOption = (value: any) => {
    let target = optionsFormatter.value.find((item: any) => item[valueKey] === value)
    if (target) {
        let targetIndex = optionsFormatter.value.findIndex((item: any) => item[valueKey] === value)
        return {
            value: target[valueKey],
            currentLabel: target[textKey],
            selectedIndex: targetIndex,
            disabled: Boolean(target.disabled),
        }
    } else {
        return {
            value: value,
            currentLabel: '',
            selectedIndex: 0,
            disabled: false,
        }
    }
}

const setSelected = () => {
    const option = getOption(props.modelValue)
    state.selected = option
    state.selectedLabel = option.currentLabel === '请选择' ? '' : option.currentLabel
    state.selectedIndex = option.selectedIndex
}

const handleSelect = (pickData: any) => {
    let data = pickData
    if (Array.isArray(pickData)) {
        data = pickData[0]
        console.warn('<FieldSelect/>Warning: 当前选项数据为多列数据')
    }
    if (!pickData) {
        state.showPicker = false
        return
    }

    state.selected = data
    state.selectedLabel = data[textKey] === '请选择' ? '' : data[textKey]
    emit('update:modelValue', data[valueKey])
    emit('change', data[valueKey], data)
    state.showPicker = false
}

const handleClear = () => {
    state.selected = null
    state.selectedLabel = ''
    emit('update:modelValue', '')
    emit('change', '', null)
}

watch(
    () => props.modelValue,
    () => {
        setSelected()
    },
    {
        immediate: true,
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
.field-select {
    :deep(.van-field__control) {
        pointer-events: none;
    }
}
</style>
