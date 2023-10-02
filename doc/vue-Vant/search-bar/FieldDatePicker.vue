<template>
    <div class="field-date-picker">
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
        <van-calendar
            v-model:show="state.showPicker"
            :min-date="state.minDate"
            :default-date="state.selected"
            @confirm="handleSelect"
            teleport="#app"
            v-bind="props.pickerOpts"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'FieldDateSelect',
})
</script>

<script lang="ts" setup>
import { watch, computed, inject, onMounted } from 'vue'
import { parseTime } from '@/utils/base'
import { FORM_KEY } from 'vant/es/utils/constant'
import { isDef } from './type'

const props = defineProps({
    modelValue: {
        type: [String, Date],
    },
    label: {
        type: String,
    },
    minDate: {
        type: String,
        default: '2013-01-01',
    },
    format: {
        type: String,
        default: '{y}-{m}-{d}',
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

const emit = defineEmits(['update:modelValue'])

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
    minDate: new Date(parseTime(props.minDate, '{y}/{m}/{d} {h}:{i}:{s}')),
    selected: new Date(),
    selectedLabel: '',
    disabled: false,
})

const setSelected = (date: string | Date) => {
    state.selectedLabel = parseTime(date, props.format)
    state.selected = new Date(parseTime(date, '{y}/{m}/{d} {h}:{i}:{s}'))
}

const handleSelect = (date: any) => {
    state.selectedLabel = parseTime(date, props.format)
    emit('update:modelValue', state.selectedLabel)
    state.showPicker = false
}

watch(
    () => props.modelValue,
    () => {
        setSelected(props.modelValue)
    },
    {
        immediate: true,
    },
)

const isDisabled = computed(() => getProp('disabled'))
</script>

<style lang="less" scoped>
.field-date-picker {
    :deep(.van-field__control) {
        pointer-events: none;
    }
}
</style>
