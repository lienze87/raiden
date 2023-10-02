<template>
    <label :class="['checkbox-button', isChecked ? 'is-checked' : '']">
        <input
            v-model="model"
            :disabled="isDisabled"
            class="checkbox-button__input"
            type="checkbox"
            name="CheckboxButton"
            :value="props.label"
            @change="handleChange"
        />
        <span v-if="$slots.default || label" class="checkbox-button__inner">
            <slot>{{ props.label }}</slot>
        </span>
    </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'FormCheckboxButton',
})
</script>

<script lang="ts" setup>
import { computed, inject, ref, toRaw } from 'vue'
const emit = defineEmits(['change'])
const props = defineProps({
    label: {
        type: [String, Number],
        default: '',
    },
})

const checkboxGroup = inject('CheckboxButtonGroup', undefined)
const isLimitExceeded = ref(false)

const model = computed({
    get() {
        return checkboxGroup?.modelValue?.value
    },
    set(val: Array<any>) {
        // 进行max判断和处理
        isLimitExceeded.value = checkboxGroup?.max?.value !== undefined && val.length > checkboxGroup?.max.value
        if (isLimitExceeded.value) {
            val.shift()
        }
        checkboxGroup?.changeEvent?.(val)
    },
})

const isChecked = computed(() => {
    const value = model.value

    return value ? value.map(toRaw).includes(props.label) : false
})

const isDisabled = computed(() => checkboxGroup?.disabled.value)

const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement

    if (target.checked) {
        if (!model.value.includes(props.label)) {
            model.value.push(props.label)
        }
    } else {
        model.value = model.value.filter((ele: any) => ele != props.label)
    }

    emit('change', target.checked, e)
}
</script>

<style lang="less" scoped>
.checkbox-button {
    position: relative;
    display: inline-block;
    font-size: 0;
    line-height: 0;
    margin-left: 10px;
    margin-bottom: 10px;

    &.is-checked {
        .checkbox-button__inner {
            color: #fff;
            border-color: var(--van-button-primary-border-color);
            background-color: var(--van-button-primary-background-color);
        }
    }

    .checkbox-button__input {
        position: absolute;
        margin: 0;
        outline: none;
        opacity: 0;
        z-index: -1;
    }
    .checkbox-button__inner {
        position: relative;
        display: inline-block;
        margin: 0;
        padding: 5px 9px;
        font-size: 10px;
        outline: none;
        line-height: 1;
        text-align: center;
        white-space: nowrap;
        border: 1px solid #dcdfe6;
        border-radius: 0;
        vertical-align: middle;
        box-sizing: border-box;
    }
}

.checkbox-button:first-child {
    .checkbox-button__inner {
        border-left: 1px solid #dcdfe6;
        border-top-left-radius: var(--van-button-border-radius);
        border-bottom-left-radius: var(--van-button-border-radius);
    }
}

.checkbox-button:last-child {
    .checkbox-button__inner {
        border-top-right-radius: var(--van-button-border-radius);
        border-bottom-right-radius: var(--van-button-border-radius);
    }
}
</style>
