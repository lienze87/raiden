<template>
  <el-image
    class="avatar"
    style="width: 100px; height: 100px"
    :src="state.photoURL"
    :preview-src-list="previewList"
    v-bind="$attrs"
  ></el-image>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ImgPreview',
})
</script>

<script lang="ts" setup>
import { reactive, watch, computed } from 'vue'
import { privatePreview } from '@/apis/common'
import * as defaultAvatar from '@/assets/images/personal.png'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  preview: {
    type: Boolean,
    default: false,
  },
})

const state = reactive({
  photoURL: defaultAvatar,
})

const previewList = computed(() => {
  if (props.preview) {
    return [state.photoURL]
  } else {
    return []
  }
})

const getAvatar = (filePath: string) => {
  if (!filePath) {
    state.photoURL = defaultAvatar
    return
  }
  privatePreview({ filePath: filePath }).then((res: any) => {
    if (!res || !res.data) {
      state.photoURL = defaultAvatar
      return
    }

    state.photoURL = res.data
  })
}

watch(
  () => props.modelValue,
  (val: any) => {
    getAvatar(val)
  },
  {
    immediate: true,
  },
)
</script>

<style lang="scss" scoped></style>
