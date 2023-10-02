<template>
    <div ref="TextMoreRef" :class="`text-more${state.showMore ? '' : ' multi-ellipsis'}`" :style="state.showMore ? '' : `max-height: ${maxHeight}px`">
        <slot />
        <template v-if="isOverflow">
            <div v-if="!state.showMore" class="open" @click="handleChange(true)">
                查看全部
                <div class="text-transition"></div>
            </div>
            <div v-else class="close" @click="handleChange(false)">收起</div>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'TextMore',
})
</script>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue'
const emit = defineEmits(['change'])

const props = defineProps({
    lineNum: {
        type: Number,
        default: 2,
    },
})

const state = reactive({
    showMore: false,
    lineHeight: 24,
})

const maxHeight = computed(() => props.lineNum * state.lineHeight)

const TextMoreRef = ref()
const isOverflow = ref(false)

const handleChange = (showMore: boolean) => {
    state.showMore = showMore
    emit('change', showMore)
}

let observer: MutationObserver | null = null
// 通过MutationObserver监听slot变化，然后判断是否overflow
const initListener = () => {
    const targetNode = TextMoreRef.value
    const config = { childList: true, attributes: true, subtree: true }
    observer = new MutationObserver((mutationsList: any, observer: any) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                let contentHeight = TextMoreRef.value?.firstElementChild?.scrollHeight
                isOverflow.value = contentHeight && contentHeight > maxHeight.value
            }
        }
    })
    observer.observe(targetNode, config)
}

onMounted(() => {
    initListener()
})

onUnmounted(() => {
    observer?.disconnect()
})
</script>

<style lang="less" scoped>
.text-more {
    position: relative;
    font-size: 14px;
    line-height: 24px;
    overflow-x: hidden;
    :deep(img) {
        width: 100%;
        object-fit: contain;
    }

    &.multi-ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 48px;
    }
    .open {
        position: absolute;
        bottom: 0;
        right: 0;
        color: var(--van-primary-color);
        background: #fff;
        &::before {
            content: '\002026';
            color: var(--van-text-color);
        }
    }
    .text-transition {
        position: absolute;
        top: 0px;
        left: -40px;
        margin: 0px;
        min-width: 0px;
        width: 40px;
        height: 24px;
        background: linear-gradient(to right, rgba(255, 255, 255, 0), rgb(255, 255, 255));
        box-sizing: border-box;
    }
    .close {
        text-align: right;
        color: var(--van-primary-color);
    }
}
</style>
