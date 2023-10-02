<template>
  <div class="form-uploader">
    <ul class="el-upload-list el-upload-list--picture-card" v-if="disabled">
      <li class="el-upload-list__item" v-for="(item, index) in localFileList" :key="item.uuid">
        <el-image
          style="width: 100%; height: 100%"
          :src="item.url"
          :initial-index="index"
          :preview-src-list="localFileList.map((item:any) => item.url)"
          fit="cover"
        />
      </li>
    </ul>
    <div v-else>
      <el-upload
        ref="uploader"
        v-model:file-list="localFileList"
        :auto-upload="autoUpload"
        :action="uploadState.url"
        :headers="uploadState.headers"
        :data="uploadData"
        :name="uploadState.field"
        accept=".jpg,.jpeg,.png,.gif,.bmp"
        list-type="picture-card"
        :show-file-list="true"
        :on-change="handleUploaderChange"
        :before-upload="handleBeforeUpload"
        :on-success="handleUploadSuccess"
        :on-remove="handleRemoveFile"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <div style="position: absolute; right: 10px">
        <el-image
          ref="imgPreviewer"
          style="width: 100%; height: 100%"
          src=""
          :preview-src-list="previewList"
          fit="cover"
        >
          <template #error>
            <span></span>
          </template>
        </el-image>
      </div>
    </div>
    <el-dialog v-model="state.dialogVisible" title="图片预览">
      <el-image style="width: 100%; height: 100%" :src="state.dialogImageUrl" fit="cover" />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'FormUploader',
})
</script>

<script lang="ts" setup>
import { reactive, ref, watch, computed } from 'vue'
import { ElImage, ElMessage, ElUpload } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { v4 as uuidV4 } from 'uuid'
import Compressor from 'compressorjs'
import { ctx, privateUpload, privatePreview, queryGroupFileList, deletePrivateFile } from '@/apis/common'

import networkConfig from '@/config/default/net.config'
import headers from '@/constant/headers'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  autoUpload: {
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

const uploader = ref(ElUpload)
const imgPreviewer = ref(ElImage)
// 默认文件列表，上传和删除操作不会改变此数组
let localFileList = ref<any[]>([])
// 真正的文件列表，随文件操作改变而改变，避免页面抖动
let realFileList = computed(() => {
  return uploader?.value?.uploadFiles || []
})

// 图片预览列表
let previewList = computed(() => {
  return realFileList.value.map((ele: any) => ele.url) || []
})

let baseUrl = networkConfig.host
  ? networkConfig.host.slice(-1) === '/'
    ? networkConfig.host
    : networkConfig.host + '/'
  : ''

let uploadState = reactive({
  url: baseUrl + ctx + 'biz-common/protected-file-upload',
  headers: headers as unknown as Headers,
  field: 'files',
})

const uploadData = computed(() => {
  return { groupId: state.groupId }
})

const handleUploaderChange = (file: any, fileList: Array<any>) => {
  if (props.autoUpload) {
    return
  }

  const fileTypeList = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp']

  if (!fileTypeList.includes(file.raw.type)) {
    ElMessage.warning('请上传 jpg/jpeg/png/gif/bmp 格式的图片')
    return
  }

  if (file.raw.size > state.maxSize) {
    ElMessage.warning('文件大小不能超过 20mb')
    return
  }

  new Compressor(file.raw, {
    quality: getQuality(file.raw),
    // quality: 0.8,
    success(result: Blob) {
      let compressFile = new File([result], file.name, {
        type: file.type,
      })
      file.raw = compressFile

      handleUploadFile(file.uid)
    },
    error(err: any) {
      console.log(err.message)
    },
  })
}

const handleBeforeUpload = (file: any, fileList: Array<any>) => {
  const fileTypeList = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp']

  if (!fileTypeList.includes(file.type)) {
    ElMessage.warning('请上传 jpg/jpeg/png/gif/bmp 格式的图片')
    return false
  }

  if (file.size > state.maxSize) {
    ElMessage.warning('文件大小不能超过 20mb')
    return false
  }

  return true
}

const handleUploadSuccess = (res: any, file: any, fileList: any) => {
  if (res.code == '0') {
    emit('update:modelValue', state.groupId)

    file.uuid = res.data[0]
  }
}

const getFile = (uid: String | Number) => {
  // 获取elUpload内部属性uploadFiles，实现上传进度的修改
  // 修改localFileList会导致页面闪烁
  return uploader.value.uploadFiles.find((file: any) => file.uid === uid)
}

const handleUploadFile = (uid: String | Number) => {
  let file = getFile(uid)

  let reqData = new FormData()
  reqData.append('files', file.raw)
  reqData.append('groupId', state.groupId)

  privateUpload(reqData, file.uid, handleProgress)
    .then((res: any) => {
      if (res.code === '0') {
        emit('update:modelValue', state.groupId)
        file.status = 'success'
        file.uuid = res.data[0]
      } else {
        file.status = 'fail'
        ElMessage.warning({ type: 'fail', message: res.message })
      }
    })
    .catch((err: any) => {
      file.status = 'fail'
    })
}

const handleProgress = (evt: ProgressEvent, uid: String | Number) => {
  let file = getFile(uid)
  if (!file) return

  let percent = Math.round(evt.total > 0 ? (evt.loaded / evt.total) * 100 : 0)

  file.status = 'uploading'
  file.percentage = percent
}

const handleRemoveFile = (file: any) => {
  if (!file.uuid) return
  // 此时elUpload组件内部属性uploadFiles中已删除文件
  deletePrivateFile({ resourceUuid: file.uuid }).then((res: any) => {
    console.log('删除成功')
  })
}

const handlePictureCardPreview = (uploadFile: any) => {
  state.dialogImageUrl = uploadFile.url
  // state.dialogVisible = true
  // 触发隐藏的el-image的preview事件
  imgPreviewer.value.clickHandler()
}

const getGroupsPhoto = (uuid: string) => {
  if (!uuid) {
    return
  }
  queryGroupFileList({ groupUuid: uuid }).then((res: any) => {
    if (res.code == '0') {
      if (res.data.length) {
        Promise.allSettled(
          res.data.map((item: any) => {
            return getPhoto(item)
          }),
        ).then((values) => {
          localFileList.value = values.filter((item: any) => item.status != 'rejected').map((ele: any) => ele.value)
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

const getQuality = (file: any) => {
  let fileSize = file.size / 1024 / 1024
  return fileSize > 5 ? (fileSize > 10 ? 0.5 : 0.75) : 1
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
.form-uploader {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 10px 15px;
}
</style>
