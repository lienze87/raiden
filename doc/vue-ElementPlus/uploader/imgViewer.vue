<template>
  <div class="form-img-viewer">
    <el-badge v-if="localFileList[0]" :value="groupUuidList.length" :hidden="hiddenBadge" type="primary">
      <el-image
        ref="imgPreviewer"
        style="width: 32px; height: 32px"
        :src="localFileList[0].url"
        :preview-src-list="previewFileList"
        @click="handlePreview"
        fit="cover"
        @close="handleClose"
      />
    </el-badge>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ImgViewer',
})
</script>

<script lang="ts" setup>
import { reactive, ref, watch, computed, nextTick } from 'vue'
import { ElImage, ElMessage, ElUpload } from 'element-plus'
import { v4 as uuidV4 } from 'uuid'
import { ctx, privatePreview, queryGroupFileList } from '@/apis/common'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hiddenBadge: {
    type: Boolean,
    default: false,
  },
})

let state = reactive({
  groupId: props.modelValue || uuidV4().replace(/-/g, ''),
  previousValue: '',
  maxSize: 20 * 1024 * 1024,
  dialogVisible: false,
  dialogImageUrl: '',
})

const uploader = ref()
const imgPreviewer = ref()

let groupUuidList = ref<any[]>([])
// 默认文件列表，上传和删除操作不会改变此数组
let localFileList = ref<any[]>([])
// 暂存的文件预览列表
let tempFileList = ref<any[]>([])
// 真正的文件列表，随文件操作改变而改变
let realFileList = computed(() => {
  return uploader?.value?.uploadFiles || []
})

let previewFileList = computed(() => {
  return tempFileList.value.reverse().map((ele: any) => ele.url)
})

const handleClose = () => {
  document.body.style.overflow = ''
}

const handlePreview = () => {
  if (tempFileList.value.length > 0) {
    // 触发隐藏的el-image的preview事件
    imgPreviewer.value.clickHandler()
    return
  }

  getAllPhoto(groupUuidList.value)
}

const getGroupsPhoto = (uuid: string) => {
  if (!uuid) {
    return
  }
  queryGroupFileList({ groupUuid: uuid }).then((res: any) => {
    if (res.code == '0') {
      if (res.data.length) {
        groupUuidList.value = res.data

        getSinglePhoto(res.data.slice(-1)[0])
      }
    }
  })
}

const getSinglePhoto = (file: any) => {
  privatePreview({ filePath: file.uuid }).then((res: any) => {
    let tempFile = { url: res && res.data ? res.data : '', ...file }
    localFileList.value = [tempFile]
  })
}

const getAllPhoto = (uuidList: any) => {
  Promise.allSettled(
    uuidList.map((item: any) => {
      return getPhoto(item)
    }),
  ).then((values) => {
    tempFileList.value = values.filter((item: any) => item.status != 'rejected').map((ele: any) => ele.value)
    nextTick(() => {
      imgPreviewer.value.clickHandler()
    })
  })
}

const getPhoto = async (file: any) => {
  const res = await privatePreview({ filePath: file.uuid })
  let tempFile = { url: res && res.data ? res.data : '', ...file }
  return new Promise((resolve) => {
    resolve(tempFile)
  })
}

const initStates = () => {
  if (!props.modelValue) {
    localFileList.value = []
    state.groupId = uuidV4().replace(/-/g, '')
  } else {
    state.previousValue = props.modelValue
    localFileList.value = []
    state.groupId = props.modelValue
    getGroupsPhoto(state.groupId)
  }
}

watch(
  () => props.modelValue,
  (val, oldVal) => {
    if (!val || val !== state.previousValue) {
      initStates()
    }
  },
  {
    immediate: true,
  },
)

defineExpose({
  realFileList,
})
</script>

<style lang="scss" scoped>
.form-img-viewer {
  position: relative;
  display: flex;
  justify-content: space-around;
}
</style>
