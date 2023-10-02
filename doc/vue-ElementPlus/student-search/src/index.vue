<template>
  <div
    class="app-container"
    style="padding-bottom: 0"
    v-loading="state.pageLoading || state.tableLoading"
    element-loading-text="加载中..."
  >
    <div class="base shadow">
      <div class="title">
        <h3>
          <span>{{ pageTitle }}</span>
        </h3>
      </div>
      <Transition>
        <StudentInfo v-if="state.studentNo" v-model="studentFormData" :columns="studentFormColumns">
          <template #append>
            <div class="student-search-icon" v-if="!props.disabled" @click="handleResetQuery">
              <Search />
            </div>
          </template>
        </StudentInfo>
        <div class="student-search" v-else>
          <el-form :model="state" label-width="120px">
            <el-form-item label="学号/姓名">
              <div style="display: flex">
                <el-input v-model="state.key"></el-input>
                <el-button type="primary" :icon="Search" style="margin-left: 10px" @click="handleSearchUser">
                  搜索
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </Transition>
    </div>
    <el-dialog v-model="state.searchVisible" title="学生列表" width="50%" destroy-on-close center>
      <SimpleTable :loading="state.tableLoading" :init-data="userList" :columns="userColumns" />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'StudentSearch',
})
</script>

<script lang="ts" setup>
import { reactive, ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { queryStudentList, queryStudentDetail } from '@/apis/common'
import SimpleTable from '@/components/simple-table'
import StudentInfo from './info.vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  studentNo: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const state = reactive({
  searchVisible: false,
  studentNo: '',
  key: '',
  pageLoading: false,
  tableLoading: false,
})

const pageTitle = computed(() => {
  return '学生基础信息'
})

// 学生详情
let studentFormData = reactive({
  photo: '',
  studentNo: '',
  studentName: '',
  sexName: '',
  nationName: '',
  polityName: '',
  age: '',
  collegeName: '',
  specialtyTypeName: '',
  grade: '',
  specialtyName: '',
  className: '',
  mobilePhone: '',
})

const studentFormColumns = ref<any[]>([
  {
    label: '学号',
    prop: 'studentNo',
  },
  {
    label: '姓名',
    prop: 'studentName',
  },
  {
    label: '性别',
    prop: 'sexName',
  },
  {
    label: '民族',
    prop: 'nationName',
  },
  {
    label: '学历',
    prop: 'specialtyTypeName',
  },
  {
    label: '学院',
    prop: 'collegeName',
  },
  {
    label: '年级',
    prop: 'grade',
  },
  {
    label: '专业',
    prop: 'specialtyName',
  },
  {
    label: '班级',
    prop: 'className',
  },
  {
    label: '联系电话',
    prop: 'mobilePhone',
  },
])

let userList = ref([])
let userColumns = ref<any[]>([
  {
    label: '学号',
    prop: 'studentNo',
    extType: 'link',
    linkAttr: {
      handler: (row: any) => {
        handleQueryUserDetail(row)
      },
      opts: {
        type: 'primary',
      },
    },
  },
  {
    label: '姓名',
    prop: 'studentName',
  },
  { label: '性别', prop: 'sexName' },
  { label: '学院', prop: 'collegeName' },
  { label: '年级', prop: 'grade' },
  { label: '班级', prop: 'className' },
])

const handleResetQuery = () => {
  state.key = ''
  state.studentNo = ''
  userList.value = []
}

const handleSearchUser = () => {
  state.pageLoading = true
  queryStudentList({ keywords: state.key })
    .then((res: any) => {
      state.pageLoading = false
      if (res.code === '0') {
        let data = res.data.data
        userList.value = data

        if (data.length === 0) {
          ElMessage.warning('未查询到结果，请重新编辑条件')
        } else if (data.length === 1) {
          handleQueryUserDetail(data[0])
        } else if (data.length > 15) {
          ElMessage.warning('查询结果大于15条，请重新编辑条件，缩小检索范围')
        } else {
          state.searchVisible = true
        }
      } else ElMessage.error(res.message)
    })
    .catch((error: any) => {
      state.pageLoading = false
    })
}

const handleQueryUserDetail = (data: any) => {
  state.tableLoading = true

  queryStudentDetail({ studentNo: data.studentNo })
    .then((res: any) => {
      state.tableLoading = false
      if (res.code === '0') {
        state.searchVisible = false
        emit('change', {
          studentNo: res.data.studentNo,
          studentName: res.data.studentName,
        })
        Object.assign(studentFormData, res.data)
        state.studentNo = res.data.studentNo
      } else ElMessage.error(res.message)
    })
    .catch((error: any) => {
      state.tableLoading = false
    })
}

watch(
  () => props.studentNo,
  () => {
    if (props.studentNo != state.studentNo) {
      state.studentNo = props.studentNo
      handleQueryUserDetail({
        studentNo: props.studentNo,
      })
    }
  },
  {
    immediate: true,
  },
)
</script>

<style lang="scss" scoped>
.student-info {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  .student-avatar {
    flex-shrink: 1;
    width: 111px;
    object-fit: contain;
    display: flex;
    align-items: center;
    .avatar {
      width: 111px;
    }
  }

  .el-form {
    flex-shrink: 1;
    flex-grow: 1;
  }

  .student-search-icon {
    position: absolute;
    top: 20px;
    right: -20px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 30px;
    text-align: left;
    border: 1px solid #c8c9cc;
    border-right: none;
    border-radius: 20px 0 0 20px;
    background-color: #fff;
    transition: all 0.2s ease-out;
  }

  .student-search-icon:hover {
    width: 45px;
    color: #fff;
    border-color: #409eff;
    background-color: #3a8ee6;
    cursor: pointer;
  }
}

.form-box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .form-item {
    width: 33.3%;
  }

  .w-50 {
    width: 50%;
  }
  .w-100 {
    width: 100%;
  }
}

.form-item-content {
  display: inline-block;
  margin-right: 20px;
  line-height: 32px;
  .form-item-content-value {
    display: inline-block;
    margin-left: 5px;
  }
  .form-item-red-value {
    display: inline-block;
    margin: 0 5px;
    color: red;
  }
}

.student-search {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 40px;
}
</style>
