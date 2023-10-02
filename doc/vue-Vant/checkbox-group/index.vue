<template>
    <div class="form-checkbox-group">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'CheckboxGroup',
})
</script>

<script lang="ts" setup>
import { computed, nextTick, provide, reactive, ref } from 'vue'

const emit = defineEmits(['update:modelValue', 'change'])

const props = defineProps({
    modelValue: {
        type: Array<any>,
        default: () => [],
    },
    max: {
        type: Number,
        default: 1,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
})

const changeEvent = async (value: any) => {
    emit('update:modelValue', value)
    await nextTick()
    emit('change', value)
}

const modelValue = computed({
    get() {
        return props.modelValue
    },
    set(val: Array<any>) {
        changeEvent(val)
    },
})

provide('CheckboxButtonGroup', {
    max: computed(() => props.max),
    modelValue,
    changeEvent,
    disabled: computed(() => props.disabled),
})
</script>

<style lang="less" scoped>
.form-checkbox-group {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    font-size: 0;
    line-height: 0;
}
</style>
