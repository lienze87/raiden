<template>
    <van-calendar
        title="日历"
        color="#409eff"
        :poppable="false"
        :show-title="false"
        :show-confirm="false"
        :default-date="state.dateNow"
        :min-date="state.minDate"
        :max-date="state.maxDate"
        :style="{ height: '420px' }"
        :formatter="formatter"
        @select="handleSelectDate"
        v-bind="$attrs"
    >
        <template #subtitle>
            <div class="calendar-title">
                <div class="prev-month" @click="handleChangeMonth('prev')">
                    <van-icon name="arrow-left" />
                    <span>上一月</span>
                </div>
                <span class="current-month">{{ currentMonth }}</span>
                <div class="next-month" @click="handleChangeMonth('next')">
                    <span>下一月</span>
                    <van-icon name="arrow" />
                </div>
            </div>
        </template>
    </van-calendar>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'Calendar',
})
</script>

<script lang="ts" setup>
import { PropType, computed, reactive, onMounted } from 'vue'
import type { CalendarDayItem } from 'vant'
import { parseTime } from '@/utils/base'

const emit = defineEmits(['change'])

const props = defineProps({
    disabledDate: {
        type: Function as PropType<(day: Date) => boolean>,
    },
})

const state = reactive({
    dateNow: new Date(),
    minDate: new Date(),
    maxDate: new Date(),
})

const currentMonth = computed(() => {
    return parseTime(state.dateNow, '{y}年{m}月')
})

const formatter = (day: CalendarDayItem) => {
    if (props.disabledDate?.(day.date)) {
        day.type = 'disabled'
    }
    return day
}

const handleChangeMonth = (type: string) => {
    let year = state.dateNow.getFullYear()
    let month = state.dateNow.getMonth()
    if (type === 'prev') {
        if (month === 0) {
            year -= 1
            month = 11
        } else {
            month = Math.max(month - 1, 0)
        }

        state.minDate = new Date(year, month, 1)
        state.maxDate = new Date(year, month + 1, 0)
        nextTick(() => {
            state.dateNow = new Date(year, month, 1)
            emit('change', state.dateNow)
        })
    } else {
        if (month === 11) {
            year += 1
            month = 0
        } else {
            month = Math.min(month + 1, 11)
        }

        state.minDate = new Date(year, month, 1)
        state.maxDate = new Date(year, month + 1, 0)
        nextTick(() => {
            state.dateNow = new Date(year, month, 1)
            emit('change', state.dateNow)
        })
    }
}

const handleSelectDate = (date: Date) => {
    emit('change', date)
}

onMounted(() => {
    let year = new Date().getFullYear()
    let month = new Date().getMonth()

    state.minDate = new Date(year, month, 1)
    state.maxDate = new Date(year, month + 1, 0)
    state.dateNow = new Date()
})
</script>

<style lang="less" scoped>
.calendar-title {
    position: relative;
    display: flex;
    justify-content: space-between;

    .prev-month,
    .next-month {
        padding: 0 20px;
        color: var(--van-primary-color);
    }
}
</style>
