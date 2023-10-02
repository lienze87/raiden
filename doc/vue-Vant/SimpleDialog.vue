<template>
    <van-popup v-model:show="state.showDialog" class="van-dialog" role="dialog" :close-on-click-overlay="false" teleport="#app" v-bind="$attrs">
        <div class="van-dialog__header van-dialog__header--isolated">{{ props.title }}</div>
        <div class="van-dialog__content" style="max-height: 400px; overflow: auto">
            <slot />
        </div>
    </van-popup>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'SimpleDialog',
})
</script>

<script lang="ts" setup>
import { reactive } from 'vue'

const emit = defineEmits(['confirm', 'cancel', 'update:show'])

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: '弹窗提示',
    },
})

let state = reactive({
    showDialog: false,
})

function handleConfirm(data: any) {
    emit('confirm')
}

function handleCancel(data: any) {
    emit('cancel')
}

watch(
    () => props.show,
    () => {
        state.showDialog = props.show
    },
    {
        immediate: true,
    },
)
</script>
