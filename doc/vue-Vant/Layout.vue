<template>
    <div class="app-container" :style="`padding-top: ${state.showTitle ? 50 : 0}px`">
        <div class="page-title" v-if="state.showTitle">
            <van-nav-bar :title="state.title" />
        </div>
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'Layout',
})
</script>

<script lang="ts" setup>
const props = defineProps({
    title: {
        type: String,
        default: '',
    },
})

const state = reactive({
    showTitle: true,
    title: props.title || document.title,
})

const handleScanEnv = (): void => {
    let ua = navigator.userAgent.toLowerCase()
    let isWeiXin = ua.includes('micromessenger')
    let isTodaySchool = ua.includes('wisedu')
    if (isWeiXin) {
        state.showTitle = false
    } else if (isTodaySchool) {
        state.showTitle = false
    }
}

onBeforeMount(() => {
    handleScanEnv()
})
</script>

<style lang="less" scoped>
.app-container {
    padding-bottom: 40px;
}

.page-title {
    position: fixed;
    top: 0px;
    width: 100%;
    height: 42px;
    line-height: 42px;
    text-align: center;
    border-bottom: 1px solid #f2f2f2;
    background-color: #fff;
    z-index: 9;
    span {
        margin: 0 auto;
    }
    .goBack {
        position: absolute;
        left: 4%;
        top: 34%;
    }
}
</style>
