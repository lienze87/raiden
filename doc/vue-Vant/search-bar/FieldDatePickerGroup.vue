<template>
    <div class="field-datetime-picker">
        <van-field
            v-model="state.selectedLabel"
            :label="props.label"
            :right-icon="props?.opts?.disabled ? '' : 'arrow-down'"
            placeholder="请选择"
            :clearable="props.clearAble"
            :clear-trigger="'always'"
            @click.stop.prevent="() => (state.showPicker = !state.showPicker)"
            v-bind="props.opts"
            @clear="handleClear"
        ></van-field>
        <van-popup :closeable="false" v-model:show="state.showPicker" :position="'bottom'" teleport="#app">
            <div class="van-picker__toolbar">
                <button type="button" class="van-picker__cancel van-haptics-feedback" @click="handleCancelClick">
                    {{ state.currentSelect === 'start' ? '取消' : '上一步' }}
                </button>
                <div class="van-picker__title van-ellipsis">{{ label }}</div>
                <button type="button" class="van-picker__confirm van-haptics-feedback" @click="handleSureClick">
                    {{ state.currentSelect === 'start' ? '下一步' : '确认' }}
                </button>
            </div>
            <van-datetime-picker
                v-if="state.currentSelect === 'start'"
                :show-toolbar="false"
                v-model="state.selectedStart"
                :type="props.dateType"
                :min-date="state.minDate"
                :max-date="state.selectedEnd"
            />
            <van-datetime-picker
                v-if="state.currentSelect === 'end'"
                :show-toolbar="false"
                v-model="state.selectedEnd"
                :type="props.dateType"
                :min-date="state.selectedStart"
                :max-date="state.maxDate"
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
import { watch, computed } from 'vue'
import { parseTime } from '@/utils/base'

const props = defineProps({
    modelValue: {
        type: Array,
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
    clearAble: {
        type: Boolean,
        default: false,
    },
    format: {
        type: String,
        default: '{y}-{m}-{d}',
    },
    opts: {
        type: Object,
    },
})

const emit = defineEmits(['change', 'update:modelValue'])

let state = reactive({
    showPicker: false,
    minDate: new Date(parseTime(props.minDate, '{y}/{m}/{d} {h}:{i}:{s}')),
    maxDate: new Date(parseTime(props.maxDate, '{y}/{m}/{d} {h}:{i}:{s}')),
    selectedStart: new Date(),
    selectedEnd: new Date(),
    selectedLabel: '',
    currentSelect: 'start',
})

const setSelected = (date: any[]) => {
    if (props.dateType === 'year-month') {
        state.selectedLabel =
            date.length && date[0] && date[1]
                ? parseTime(date[0], props.format)?.substring(0, 7) + '至' + parseTime(date[1], props.format)?.substring(0, 7)
                : ''
    } else {
        state.selectedLabel = date.length && date[0] && date[1] ? parseTime(date[0], props.format) + '至' + parseTime(date[1], props.format) : ''
    }
    state.selectedStart = date.length && date[0] ? new Date(parseTime(date[0], '{y}/{m}/{d} {h}:{i}:{s}')) : new Date()
    state.selectedEnd = date.length && date[1] ? new Date(parseTime(date[1], '{y}/{m}/{d} {h}:{i}:{s}')) : new Date()
    state.currentSelect = 'start'
}

function handleCancelClick() {
    if (state.currentSelect === 'end') {
        state.currentSelect = 'start'
        return false
    }
    state.showPicker = !state.showPicker
}

function handleSureClick() {
    if (state.currentSelect === 'start') {
        state.currentSelect = 'end'
        return false
    }
    emit('update:modelValue', [parseTime(state.selectedStart, props.format), parseTime(state.selectedEnd, props.format)])
    emit('change', [parseTime(state.selectedStart, props.format), parseTime(state.selectedEnd, props.format)])
    state.showPicker = false
}

function handleClear() {
    Object.assign(state, {
        selectedLabel: '',
    })
    emit('update:modelValue', [])
    emit('change', [])
}

watch(
    [() => props.modelValue, () => state.showPicker],
    () => {
        setSelected(props.modelValue)
    },
    {
        immediate: true,
    },
)
</script>

<style lang="less" scoped>
.field-datetime-picker {
    :deep(.van-field__control) {
        pointer-events: none;
    }
}
</style>
