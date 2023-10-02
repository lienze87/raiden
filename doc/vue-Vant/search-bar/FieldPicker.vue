<template>
    <div class="search-field-picker">
        <van-field
            v-model="state.selectedLabel"
            label=""
            readonly
            right-icon="arrow-down"
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
        <van-popup v-model:show="state.showPicker" :position="'bottom'">
            <van-picker
                :columns="optionsFormatter"
                :columns-field-names="props.fieldNames"
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
    name: 'FieldPicker',
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
        default: () => {
            return { text: 'label', value: 'value' }
        },
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

const emit = defineEmits(['change', 'search', 'update:modelValue'])

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

const optionsFormatter = computed(() => {
    if (props.clearAble) {
        return [{ [props.fieldNames.text]: '全部', [props.fieldNames.value]: '' }].concat(props.options)
    } else {
        return props.options
    }
})

const getOption = (value: any) => {
    let target = optionsFormatter.value.find((item: any) => item[props.fieldNames.value] === value)
    if (target) {
        let targetIndex = optionsFormatter.value.findIndex((item: any) => item[props.fieldNames.value] === value)
        return {
            value: target[props.fieldNames.value],
            currentLabel: target[props.fieldNames.text],
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
    state.selectedLabel = option.currentLabel
    state.selectedIndex = option.selectedIndex
}

const handleSelect = (pickData: any) => {
    let data = pickData
    if (Array.isArray(pickData)) {
        data = pickData[0]
        console.warn('<FieldPicker/>Warning: 当前选项数据为多列数据')
    }

    if (!pickData) {
        state.showPicker = false
        return
    }

    state.selected = data
    state.selectedLabel = data[props.fieldNames.text]
    emit('update:modelValue', data[props.fieldNames.value])
    emit('change', data[props.fieldNames.value], data)
    state.showPicker = false
}

const handleSearch = () => {
    state.showPicker = false
    emit('search')
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
.search-field-picker {
    width: 100%;
    :deep(.van-field__control) {
        pointer-events: none;
    }
}
</style>
