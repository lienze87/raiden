<template>
  <WhiteBoard ref="WhiteBoardRef" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import WhiteBoard from './index.vue'

const WhiteBoardRef = ref()
const base64 = WhiteBoardRef.value?.getCanvasContent()
</script>
