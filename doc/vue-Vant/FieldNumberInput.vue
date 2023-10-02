<template>
    <van-field v-model="displayValue" :label="props.label" type="number" placeholder="请输入" @blur="handleInputChange" v-bind="$attrs">
        <template #extra>
            <slot name="extra" />
        </template>
    </van-field>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'FieldItem',
})
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { isNumber, isUndefined, isNil } from 'lodash'

const props = defineProps({
    modelValue: {
        type: [String, Number],
    },
    label: {
        type: String,
    },
    max: {
        type: Number,
        default: Number.POSITIVE_INFINITY,
    },
    min: {
        type: Number,
        default: Number.NEGATIVE_INFINITY,
    },
    step: {
        type: Number,
        default: 1,
    },
    stepStrictly: Boolean,
    precision: {
        type: Number,
        validator: (val: number) => val >= 0 && val === Number.parseInt(`${val}`, 10),
    },
})

const emit = defineEmits(['change', 'input', 'update:modelValue'])

interface Data {
    currentValue: string | number | null | undefined
    userInput: null | number | string
}

const data = reactive<Data>({
    currentValue: props.modelValue,
    userInput: null,
})

const displayValue = computed({
    get() {
        if (data.userInput !== null) {
            return data.userInput
        }

        let currentValue: number | string | null | undefined = data.currentValue
        if (isNil(currentValue)) return ''
        if (isNumber(currentValue)) {
            if (Number.isNaN(currentValue)) return ''
            if (!isUndefined(props.precision)) {
                currentValue = currentValue.toFixed(props.precision)
            }
        }
        return currentValue
    },
    set(val: any) {
        handleInput(val)
    },
})

const getPrecision = (value: string | number | null | undefined) => {
    if (isNil(value)) return 0
    const valueString = value.toString()
    const dotPosition = valueString.indexOf('.')
    let precision = 0
    if (dotPosition !== -1) {
        precision = valueString.length - dotPosition - 1
    }
    return precision
}

const numPrecision = computed(() => {
    const stepPrecision = getPrecision(props.step)
    if (!isUndefined(props.precision)) {
        if (stepPrecision > props.precision) {
        }
        return props.precision
    } else {
        return Math.max(getPrecision(props.modelValue), stepPrecision)
    }
})

const toPrecision = (num: number, pre?: number) => {
    if (isUndefined(pre)) {
        pre = numPrecision.value
    }

    if (pre === 0) return Math.round(num)

    let snum = String(num)
    const pointPos = snum.indexOf('.')
    // 无小数点
    if (pointPos === -1) return num

    const nums = snum.replace('.', '').split('')
    const datum = nums[pointPos + pre]
    // 小数点后无值
    if (!datum) return num

    const length = snum.length
    // Number('1.565').toFixed(2) 1.56
    // Number('1.566').toFixed(2) 1.57
    // 处理toFixed的精度问题

    if (snum.charAt(length - 1) === '5') {
        snum = `${snum.slice(0, Math.max(0, length - 1))}6`
    }

    return Number.parseFloat(Number(snum).toFixed(pre))
}

const verifyValue = (value: number | string | null | undefined, update?: boolean): number | string | null | undefined => {
    const { max, min, step, precision, stepStrictly } = props
    let newVal = Number(value)
    if (isNil(value) || Number.isNaN(newVal)) {
        return null
    }

    if (value === '') {
        return ''
    }

    if (stepStrictly) {
        newVal = toPrecision(Math.round(newVal / step) * step, precision)
    }

    if (!isUndefined(precision)) {
        newVal = toPrecision(newVal, precision)
    }

    if (newVal > max || newVal < min) {
        newVal = newVal > max ? max : min

        update && emit('update:modelValue', newVal)
    }

    return newVal
}

const setCurrentValue = (value: number | string | null | undefined) => {
    const oldVal = data.currentValue
    const newVal = verifyValue(value)
    if (oldVal === newVal) return
    data.userInput = null
    emit('update:modelValue', newVal!)
    emit('change', newVal!, oldVal!)

    data.currentValue = newVal
}

const handleInput = (value: string) => {
    data.userInput = value
    emit('input', value === '' ? null : Number(value))
}

const handleInputChange = () => {
    let value = data.userInput
    if (value === null && data.currentValue) {
        return
    }
    const newVal = value !== '' ? Number(value) : ''
    if ((isNumber(newVal) && !Number.isNaN(newVal)) || value === '') {
        setCurrentValue(newVal)
    }
    data.userInput = null
}

watch(
    () => props.modelValue,
    (value) => {
        data.currentValue = verifyValue(value, true)
        data.userInput = null
    },
    { immediate: true },
)
</script>
