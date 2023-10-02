<template>
    <div class="field-datetime-picker">
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
            <van-datetime-picker
                v-model="state.selected"
                :type="props.dateType"
                :min-date="state.minDate"
                :max-date="state.maxDate"
                @confirm="handleSelect"
                @cancel="() => (state.showPicker = !state.showPicker)"
                v-bind="props.pickerOpts"
            />
        </van-popup>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'FieldDatetimeSelect',
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
    dateType: {
        type: String,
        default: 'date',
    },
    minDate: {
        type: String,
        default: parseTime(new Date(new Date().getTime() - 10 * 365 * 86400000), '{y}-{m}-{d}'),
    },
    maxDate: {
        type: String,
        default: parseTime(new Date(new Date().getTime() + 10 * 365 * 86400000), '{y}-{m}-{d}'),
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
    minDate: new Date(parseTime(props.minDate, '{y}/{m}/{d} {h}:{i}:{s}')),
    maxDate: new Date(parseTime(props.maxDate, '{y}/{m}/{d} {h}:{i}:{s}')),
    selected: new Date(),
    selectedLabel: '',
    disabled: false,
})

const setSelected = (date: string | Date) => {
    state.selectedLabel = parseTime(date, props.format)
    state.selected = date ? new Date(parseTime(date, '{y}/{m}/{d} {h}:{i}:{s}')) : new Date()
}

const handleSelect = (date: any) => {
    state.selectedLabel = parseTime(date, props.format)
    emit('update:modelValue', state.selectedLabel)
    emit('change', date)
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
.field-datetime-picker {
    :deep(.van-field__control) {
        pointer-events: none;
    }
}
</style>
