<template>
  <div class="form-img-viewer">
    <el-image
      v-if="localFileList[0]"
      ref="imgPreviewer"
      style="width: 32px; height: 32px"
      :src="localFileList[0].url"
      :preview-src-list="previewFileList"
      @click="handlePreview"
      fit="cover"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ImgViewer',
})
</script>

<script lang="ts" setup>
import { ref, watch, computed, nextTick, reactive } from 'vue'
import { ElImage } from 'element-plus'
import { privatePreview, queryGroupFileList } from '@/apis/common'
import * as defaultImg from './image.png'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const imgPreviewer = ref()

let state = reactive({
  groupId: props.modelValue || '',
  maxSize: 10 * 1024 * 1024,
  dialogVisible: false,
  dialogImageUrl: '',
})

let groupUuidList = ref<any[]>([])
// 默认文件列表，上传和删除操作不会改变此数组
let localFileList = ref<any[]>([])
// 真正的文件列表，随文件操作改变而改变，避免页面抖动
let tempFileList = ref<any[]>([])
let previewFileList = computed(() => {
  return tempFileList.value.reverse().map((ele) => ele.url)
})

const handlePreview = () => {
  if (tempFileList.value.length > 1) {
    // 触发隐藏的el-image的preview事件
    imgPreviewer.value.clickHandler()
    return
  }

  queryGroupFileList({ groupUuid: state.groupId }).then((res: any) => {
    if (res.code == '0') {
      if (res.data.length) {
        groupUuidList.value = res.data

        Promise.allSettled(
          groupUuidList.value.map((item: any) => {
            return getPhoto(item)
          }),
        ).then((values) => {
          tempFileList.value = values.filter((item: any) => item.status != 'rejected').map((ele: any) => ele.value)
          nextTick(() => {
            imgPreviewer.value.clickHandler()
          })
        })
      }
    }
  })
}

const getPhoto = async (file: any) => {
  const res = await privatePreview({ filePath: file.uuid })
  let tempFile = { url: res && res.data ? res.data : '', ...file }
  return new Promise((resolve) => {
    resolve(tempFile)
  })
}

watch(
  () => props.modelValue,
  () => {
    localFileList.value = [{ url: defaultImg }]
    tempFileList.value = []
    if (props.modelValue) {
      state.groupId = props.modelValue
    }
  },
  {
    immediate: true,
  },
)
</script>

<style lang="scss" scoped>
.form-img-viewer {
  position: relative;
  display: flex;
  justify-content: flex-start;
}
</style>
