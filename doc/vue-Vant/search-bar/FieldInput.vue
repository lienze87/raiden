<template>
    <van-field
        v-model="modelValue"
        :label="props.label"
        :maxlength="50"
        :clearable="props.clearAble"
        placeholder="请输入"
        @change="handleChange"
        @clear="handleClear"
        v-bind="$attrs"
    ></van-field>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'FieldItem',
})
</script>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: [String, Number],
    },
    label: {
        type: String,
    },
    clearAble: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['change', 'update:modelValue'])
const modelValue = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    },
})

const handleChange = (val: any) => {
    emit('change', val)
}

const handleClear = () => {
    emit('update:modelValue', '')
}
</script>
