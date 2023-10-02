<template>
    <div class="field-cascader">
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
            <van-cascader
                v-model="state.model"
                :title="`请选择${props.label}`"
                :options="props.options"
                :field-names="{
                    text: textKey,
                    value: valueKey,
                    children: childrenKey,
                }"
                :closeable="!props.checkStrictly"
                @change="(data:any) => handleChange(data)"
                @finish="(data:any) => handleSelect(data)"
                @close="() => (state.showPicker = false)"
                v-bind="props.pickerOpts"
            >
                <template #title v-if="props.checkStrictly">
                    <div class="custom-title">
                        <van-button size="mini" class="van-picker__cancel" @click="state.showPicker = false">取消</van-button>
                        <span class="custom-title-value">{{ `请选择${props.label}` }}</span>
                        <van-button size="mini" class="van-picker__confirm" @click="handleConfirm">确定</van-button>
                    </div>
                </template>
            </van-cascader>
        </van-popup>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'FieldCascader',
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
    checkStrictly: {
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
    model: '',
    selected: null,
    selectedLabel: '',
    nowSelected: null,
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

const getSelectedOptionsByValue = (options: any[], value: string | number) => {
    for (const option of options) {
        if (option[valueKey] === value) {
            return [option]
        }

        if (option[childrenKey]) {
            const selectedOptions = getSelectedOptionsByValue(option[childrenKey], value)
            if (selectedOptions) {
                return [option, ...selectedOptions]
            }
        }
    }
}

const setSelected = () => {
    let valueList = props.unionProp.map((attr: string) => props.modelValue[attr])
    state.model = valueList.filter(Boolean).slice(-1)[0] || ''

    if (state.model) {
        const selectedOptions = getSelectedOptionsByValue(props.options, state.model) || []
        state.selected = {
            value: state.model,
            selectedOptions,
        }
        state.selectedLabel = selectedOptions.map((option: any) => option[textKey]).join(props.splitSymbol)
    } else {
        state.selected = {
            value: state.model,
            selectedOptions: [],
        }
        state.selectedLabel = ''
    }
}

const handleSelect = (data: any) => {
    if (!data) {
        state.showPicker = false
        return
    }

    state.selected = data
    state.selectedLabel = data.selectedOptions.map((option: any) => option[textKey]).join(props.splitSymbol)

    props.unionProp.forEach((attr: string, index: number) => {
        // 进行赋值操作
        props.modelValue[attr] = data.selectedOptions[index] ? data.selectedOptions[index][valueKey] : ''
    })

    emit('change', data)
    state.showPicker = false
}

const handleChange = (data: any) => {
    // console.log(data)
    state.nowSelected = data
}

const handleConfirm = () => {
    if (!state.nowSelected) {
        state.showPicker = false
    } else {
        handleSelect(state.nowSelected)
    }
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
.field-cascader {
    :deep(.van-field__control) {
        pointer-events: none;
    }

    :deep(.van-cascader__title) {
        width: 100%;
    }
}

.custom-title {
    display: flex;
    align-items: center;
    width: 100%;

    .custom-title-value {
        flex-grow: 1;
        flex-shrink: 1;
        line-height: 24px;
        text-align: center;
    }
    .van-picker__confirm {
        color: var(--van-picker-confirm-action-color);
    }

    .van-picker__cancel {
        color: var(--van-picker-cancel-action-color);
    }
}
</style>
