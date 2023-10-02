<template>
  <div class="home-container">
    <div>
      <h2>文件上传</h2>
      <FileUploadVue v-model="attachmentUuid" />
    </div>
    <div>
      <h2>图片上传(限制2张)</h2>
      <ImgUploadVue ref="UploadRef" v-model="attachmentGroupUuid" :limit="2" :sourceType="'public'" />
    </div>
    <div style="width: 200px">
      <h2>单张图片预览</h2>
      <ImgViewerVue key="1001" v-model="attachmentUuid" />
      <ImgViewerVue key="1002" v-model="attachmentUuid" :hiddenBadge="true" />
    </div>
    <div>
      <h2>表单校验(图片上传与文件上传相似)</h2>
      <el-form v-model="formData" ref="formRef" :model="formData" :rules="state.rules" label-width="120px">
        <el-form-item label="证明材料" prop="attachmentGroupUuid">
          <ImgUploadVue
            ref="imgUploaderRef"
            v-model="formData.attachmentGroupUuid"
            :disabled="state.disabled"
            @change="handleUploaderChange"
          />
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Uploader',
})
</script>

<script lang="ts" setup>
import { ref, reactive, unref, computed } from 'vue'
import FileUploadVue from './fileUpload.vue'
import ImgUploadVue from './imgUpload.vue'
import ImgViewerVue from './imgViewer.vue'

const attachmentUuid = ref('edbb89c17c8a49fea402afe832468458')

const attachmentGroupUuid = ref('0ee8831e6f674bff8c31b3599bf1d0a6')

const UploadRef = ref()
// 可能需要后端拼接完整地址
const publicFileList = computed(() => {
  return UploadRef.value?.realFileList.map((file: any) => `biz-common/public-file-preview?resourceUuid=${file.uuid}`)
})

const formRef = ref()

const formData = reactive({
  attachmentGroupUuid: '',
})

const imgUploaderRef = ref()

const handleUploaderChange = (file: any, fileList: any) => {
  const form = unref(formRef)
  if (fileList && fileList.length > 0) {
    form.clearValidate('attachmentGroupUuid')
  }
}

const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      console.log(valid)
    }
  })
}

let state = reactive({
  disabled: false,
  rules: {
    attachmentGroupUuid: [
      {
        required: true,
        validator: (rule: any, value: string, callback: any) => {
          let valid = true
          let errorMessage = '请上传证明材料'

          if (!value) {
            valid = false
          }

          if (imgUploaderRef.value) {
            if (imgUploaderRef.value.realFileList.length === 0) {
              valid = false
            }
          }

          if (valid) {
            callback()
          } else {
            callback(new Error(errorMessage))
          }
        },
        trigger: 'change',
      },
    ],
  },
})
</script>

<style lang="scss" scoped>
.home-container {
  padding: 10px 20px;
}
</style>
