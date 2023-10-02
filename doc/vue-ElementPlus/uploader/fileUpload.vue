<template>
  <div class="form-uploader">
    <el-upload
      ref="uploader"
      class="file-uploader"
      v-model:file-list="localFileList"
      :auto-upload="true"
      :action="uploadState.uploadUrl"
      :headers="uploadState.headers"
      :data="uploadData"
      :name="uploadState.field"
      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.gif,.bmp,.txt,.rar,.zip,.7z,.mp3"
      :show-file-list="true"
      :on-change="handleUploaderChange"
      :before-upload="handleBeforeUpload"
      :on-success="handleUploadSuccess"
      v-bind="$attrs"
    >
      <template #trigger>
        <el-button v-show="showUpload" type="primary">上传文件</el-button>
      </template>

      <el-button type="success" v-show="showBatchDownload" @click="handleDownloadAll" style="margin-left: 10px">
        打包下载
      </el-button>

      <template #file="{ file }">
        <div v-if="file.status === 'uploading'" class="file-list-item">
          <span class="item-name">{{ file.name }}</span>
          <div class="item-actions">
            <span class="item-uploading">已上传{{ Math.round(Number(file.percentage)) }}%</span>
          </div>
        </div>
        <div class="file-list-item" v-else>
          <span class="item-name">{{ file.name }}</span>
          <span class="item-actions">
            <span v-if="canPreview(file)" class="item-preview" @click="handlePreview(file)">
              <ZoomIn />
            </span>
            <span class="item-download" @click="handleDownloadFile(file)">
              <Download />
            </span>
            <span v-if="!disabled" class="item-delete" @click="handleRemoveFile(file)">
              <Delete />
            </span>
          </span>
        </div>
      </template>
    </el-upload>
    <div style="position: absolute; right: 10px">
      <el-image
        ref="imgPreviewer"
        style="width: 100%; height: 100%"
        src=""
        :preview-src-list="[state.dialogImageUrl]"
        fit="cover"
      >
        <template #error>
          <span></span>
        </template>
      </el-image>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'FileUploader',
})
</script>

<script lang="ts" setup>
import { reactive, ref, watch, computed } from 'vue'
import { ElImage, ElMessage, ElUpload } from 'element-plus'
import { Delete, Download, ZoomIn } from '@element-plus/icons-vue'
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
  limit: {
    type: Number,
    default: 10,
  },
  sourceType: {
    type: String,
    default: 'private',
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
// 默认文件列表，上传和删除操作不会改变此数组
let localFileList = ref<any[]>([])
// 真正的文件列表，随文件操作改变而改变，避免页面抖动
let realFileList = computed(() => {
  return uploader?.value?.uploadFiles || []
})

let showBatchDownload = computed(() => {
  return realFileList.value.length > 0
})

// 限制上传文件数量
let showUpload = computed(() => {
  return !props.disabled && realFileList.value.length < props.limit
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
  batchDownloadUrl:
    props.sourceType === 'private'
      ? baseUrl + ctx + 'biz-common/protected-group-batch-download'
      : baseUrl + ctx + 'biz-common/public-batch-download',
  headers: headers as unknown as Headers,
  field: 'files',
})

const uploadData = computed(() => {
  return { groupId: state.groupId }
})

const handleUploaderChange = (uploadFile: any, uploadFiles: any): void => {
  emit('change', uploadFile, uploadFiles)
}

const handleBeforeUpload = (file: any, fileList: Array<any>) => {
  if (file.name.length > 30) {
    ElMessage.warning('文件名称不能超过30个字符')
    return false
  }

  const fileExtList = [
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'png',
    'jpg',
    'jpeg',
    'gif',
    'bmp',
    'txt',
    'rar',
    'zip',
    '7z',
    'mp3',
  ]
  let fileExtension = file.name.split('.').slice(-1)[0]?.toLowerCase()

  if (!fileExtList.includes(fileExtension)) {
    ElMessage.warning('请上传 pdf/doc/docx/xls/xlsx/ppt/pptx/png/jpg/jpeg/gif/bmp/txt/rar/zip/7z/mp3 格式的文件')
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

const previewTypeList = ['.pdf', '.doc', '.xls', '.docx', '.xlsx', '.txt', '.gif', '.jpg', '.png', '.jpeg', '.bmp']
const canPreview = (file: any): Boolean => {
  // 同时有isSupportPreview和fileExtension属性的才是已上传文件
  if (file.isSupportPreview) {
    return true
  } else {
    if (file.fileExtension) {
      return false
    }
  }
  // if (file.fileExtension) {
  //   return previewTypeList.includes(file.fileExtension)
  // }
  let fileExtension = file.name.split('.').slice(-1)[0]?.toLowerCase()

  return previewTypeList.includes('.' + fileExtension)
}

const handleRemoveFile = (file: any) => {
  // 调用upload组件的删除方法
  uploader.value.handleRemove(file)
  emit('change', file, realFileList.value)

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
  let fileName = file.name || file.fileName

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
}

const handleDownloadAll = () => {
  let fileName = '打包下载.zip'
  fetch(uploadState.batchDownloadUrl, {
    method: 'post',
    headers: { 'Content-Type': 'application/json', ...uploadState.headers },
    body: JSON.stringify({
      groups: [state.groupId],
    }),
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
}

const handlePreview = (file: any) => {
  if (props.sourceType === 'private') {
    privatePreview({ filePath: file.uuid })
      .then((res: any) => {
        if (res.code === '0' && res.data) {
          state.dialogImageUrl = res.data
          // state.dialogVisible = true
          // 触发隐藏的el-image的preview事件
          imgPreviewer.value.clickHandler()
        } else {
          ElMessage.warning(res.message)
        }
      })
      .catch((err) => {
        ElMessage.error('文件预览发生错误，请稍后重试')
      })
  } else {
    state.dialogImageUrl = baseUrl + ctx + 'biz-common/public-file-preview?resourceUuid=' + file.uuid
    // state.dialogVisible = true
    // 触发隐藏的el-image的preview事件
    imgPreviewer.value.clickHandler()
  }
}

const getGroupsPhoto = (uuid: string) => {
  if (!uuid) {
    return
  }
  if (props.sourceType === 'private') {
    queryGroupFileList({ groupUuid: uuid }).then((res: any) => {
      if (res.code == '0') {
        if (res.data.length) {
          let values = res.data.map((ele: any) => {
            return { name: ele.title + ele.fileExtension, ...ele }
          })

          localFileList.value = values.map((item: any) => item)
        }
      }
    })
  } else {
    queryPublicGroupFileList({ groupUuid: uuid }).then((res: any) => {
      if (res.code == '0') {
        if (res.data.length) {
          let values = res.data.map((ele: any) => {
            return { name: ele.title + ele.fileExtension, ...ele }
          })

          localFileList.value = values.map((item: any) => item)
        }
      }
    })
  }
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

  .file-uploader {
    :deep(.el-upload-list) {
      margin: 10px 0 0;
      vertical-align: top;

      .el-upload-list__item {
        display: inline-flex;
        width: fit-content;
        margin: 0 8px 8px 0;
        padding: 0;
        overflow: hidden;
      }
    }
    .file-list-item {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 4px 15px;
      height: 40px;
      line-height: 32px;
      color: #fff;
      font-size: 16px;
      white-space: nowrap;
      text-align: center;
      border-radius: 3px;
      background-color: #8a9fd7;
      border: 1px solid #4172ee;
      cursor: pointer;
      .item-name {
        padding: 0 10px;
      }

      .item-actions {
        display: flex;
        justify-content: space-around;
        width: 80px;

        .item-preview,
        .item-download,
        .item-delete {
          cursor: pointer;
        }

        .item-uploading {
          display: inline-block;
        }
      }
    }
  }
}
</style>
