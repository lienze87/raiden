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
        :auto-upload="true"
        :action="uploadState.uploadUrl"
        :headers="uploadState.headers"
        :data="uploadData"
        :name="uploadState.field"
        accept=".jpg,.jpeg,.png,.gif,.bmp"
        list-type="picture-card"
        :multiple="props.multiple"
        :limit="props.limit"
        :show-file-list="true"
        :on-change="handleUploaderChange"
        :on-exceed="handleExceed"
        :before-upload="handleBeforeUpload"
        :on-success="handleUploadSuccess"
        v-bind="$attrs"
      >
        <template #default>
          <el-icon><Plus /></el-icon>
        </template>
        <template #file="{ file }">
          <div v-if="file.status === 'uploading'" class="el-upload-list__item-info">
            <a class="el-upload-list__item-name" @click.prevent="handlePreview(file)">
              <el-icon><Document /></el-icon>
              <span class="el-upload-list__item-file-name">
                {{ file.name }}
              </span>
            </a>
            <el-progress
              v-if="file.status === 'uploading'"
              :type="'circle'"
              :stroke-width="6"
              :percentage="Math.round(Number(file.percentage))"
              :style="'margin-top: 0.5rem'"
            />
          </div>
          <template v-else>
            <img class="el-upload-list__item-thumbnail" style="object-fit: cover" :src="file.url" alt="" />
            <label class="el-upload-list__item-status-label">
              <el-icon class="el-icon--upload-success el-icon--check"><Check /></el-icon>
            </label>
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePreview(file)">
                <ZoomIn />
              </span>
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownloadFile(file)">
                <Download />
              </span>
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemoveFile(file)">
                <Delete />
              </span>
            </span>
          </template>
        </template>
      </el-upload>
      <div style="position: absolute; right: 10px">
        <el-image
          ref="imgPreviewer"
          style="width: 100%; height: 100%"
          src=""
          :initial-index="state.dialogImageIndex"
          :preview-src-list="previewList"
          fit="cover"
        >
          <template #error>
            <span></span>
          </template>
        </el-image>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ImgUploader',
})
</script>

<script lang="ts" setup>
import { reactive, ref, watch, computed } from 'vue'
import { ElImage, ElMessage, ElUpload } from 'element-plus'
import { Check, Delete, Download, Plus, ZoomIn, Document } from '@element-plus/icons-vue'
import { v4 as uuidV4 } from 'uuid'
import {
  ctx,
  privatePreview,
  queryGroupFileList,
  queryPublicGroupFileList,
  deletePrivateFile,
  deletePublicFile,
} from '@/apis/common'
import networkConfig from '@/config/default/net.config'
import headers from '@/constant/headers'

const emit = defineEmits(['update:modelValue', 'change'])

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  limit: {
    type: Number,
    default: 10,
  },
  sourceType: {
    type: String,
    default: 'private',
  },
  isSingle: {
    type: Boolean,
    default: false,
  },
})

let state = reactive({
  groupId: props.modelValue || uuidV4().replace(/-/g, ''),
  fileUuid: '',
  previousValue: '',
  maxSize: 20 * 1024 * 1024,
  dialogVisible: false,
  dialogImageUrl: '',
  dialogImageIndex: 0,
})

const uploader = ref()
const imgPreviewer = ref()
// 默认文件列表，上传和删除操作不会改变此数组
let localFileList = ref<any[]>([])
// 真正的文件列表，随文件操作改变而改变
let realFileList = computed(() => {
  let uploadFiles = uploader?.value?.uploadFiles || []
  // 隐藏上传框
  if (uploadFiles.length >= props.limit) {
    uploader.value?.uploadRef.$el.setAttribute('style', 'display: none')
  } else {
    uploader.value?.uploadRef.$el.setAttribute('style', '')
  }
  return uploadFiles
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
  uploadUrl:
    props.sourceType === 'private'
      ? baseUrl + ctx + 'biz-common/protected-file-upload'
      : baseUrl + ctx + 'biz-common/public-file-upload',
  downloadUrl:
    props.sourceType === 'private'
      ? baseUrl + ctx + 'biz-common/protected-single-download'
      : baseUrl + ctx + 'biz-common/public-single-download',
  headers: headers as unknown as Headers,
  field: 'files',
})

const uploadData = computed(() => {
  return props.isSingle ? {} : { groupId: state.groupId }
})

const handleUploaderChange = (uploadFile: any, uploadFiles: any): void => {
  emit('change', uploadFile, uploadFiles)
}

const handleExceed = (files: any, uploadFiles: any) => {
  ElMessage.warning(`只能上传${props.limit}张图片`)
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
    if (props.isSingle) {
      state.fileUuid = res.data[0]
      emit('update:modelValue', state.fileUuid)
    } else {
      emit('update:modelValue', state.groupId)
    }

    file.uuid = res.data[0]
  }
}

const handleRemoveFile = (file: any) => {
  // 调用upload组件的删除方法
  uploader.value.handleRemove(file)
  emit('change', file, realFileList.value)
  if (props.isSingle) {
    state.fileUuid = ''
    emit('update:modelValue', state.fileUuid)
  }

  if (!file.uuid) return

  // 此时elUpload组件内部属性uploadFiles中已删除文件
  if (props.sourceType === 'private') {
    deletePrivateFile({ resourceUuid: file.uuid }).then((res: any) => {
      console.log('删除成功')
    })
  } else {
    deletePublicFile({ resourceUuid: file.uuid }).then((res: any) => {
      console.log('删除成功')
    })
  }
}

const handleDownloadFile = (file: any) => {
  if (!file.uuid) return
  let fileName = file.name || file.title + file.fileExtension

  fetch(uploadState.downloadUrl + `?resourceUuid=${file.uuid}`, {
    method: 'post',
    headers: uploadState.headers,
  }).then((res) => {
    // 需要后端在响应头中加入Access-Control-Expose-Headers:Content-Disposition
    // 才能访问到Content-Disposition响应头
    // console.log(Array.from(res.headers.entries()))
    if (!res.ok) {
      return
    }
    // 获得接口返回的文件名
    let attachmentName = res.headers.get('Content-Disposition')?.split('=')[1]
    if (attachmentName) attachmentName = decodeURIComponent(attachmentName)

    res.blob().then((data) => {
      let blobUrl: string = window.URL.createObjectURL(data)
      let a: HTMLAnchorElement = document.createElement('a')

      a.href = blobUrl
      a.download = attachmentName || fileName
      a.click()
    })
  })

  // protectedDownload(file.uuid, fileName, fileType).catch((res) => {
  //   if (!res) {
  //     ElMessage.error('下载图片失败')
  //   }
  // })
}

const handlePreview = (uploadFile: any) => {
  let uuidList = realFileList.value.map((ele: any) => ele.uuid)
  let targetIndex = uuidList.indexOf(uploadFile.uuid)
  state.dialogImageIndex = targetIndex === -1 ? 0 : Number(targetIndex)
  state.dialogImageUrl = uploadFile.url
  // state.dialogVisible = true
  // 触发隐藏的el-image的preview事件
  imgPreviewer.value.clickHandler()
}

const getGroupsPhoto = (uuid: string) => {
  if (!uuid) {
    return
  }

  if (props.isSingle) {
    if (props.sourceType === 'private') {
      getPhoto({ uuid: uuid }).then((file: any) => {
        localFileList.value = [file]
      })
    } else {
      localFileList.value = [{ uuid: uuid, url: baseUrl + ctx + 'biz-common/public-file-preview?resourceUuid=' + uuid }]
    }
    return
  }

  if (props.sourceType === 'private') {
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
  } else {
    queryPublicGroupFileList({ groupUuid: uuid }).then((res: any) => {
      if (res.code == '0') {
        if (res.data && res.data.length > 0) {
          localFileList.value = res.data.map((ele: any) => {
            return {
              url: baseUrl + ctx + 'biz-common/public-file-preview?resourceUuid=' + ele.uuid,
              ...ele,
            }
          })
        }
      }
    })
  }
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
    state.fileUuid = ''
  } else {
    state.previousValue = props.modelValue
    localFileList.value = []
    if (props.isSingle) {
      state.fileUuid = props.modelValue
      getGroupsPhoto(state.fileUuid)
    } else {
      state.groupId = props.modelValue
      getGroupsPhoto(state.groupId)
    }
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
  name: 'ImageUploader',
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
