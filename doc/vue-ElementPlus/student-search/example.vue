<template>
  <div class="home-container">
    <div class="app-container" style="padding-bottom: 0">
      <div class="base shadow">
        <div class="title">
          <h3><span>学生基础信息</span></h3>
        </div>
        <StudentInfo v-model="userFormData" :columns="userFormColumns"></StudentInfo>
      </div>
    </div>
    <div>
      <h3>disabled=false</h3>
    </div>
    <StudentSearch key="1" :studentNo="studentNo" @change="handleSearchChange" />
    <div>
      <h3>disabled=true</h3>
    </div>
    <StudentSearch key="2" :studentNo="studentNo2" :disabled="true" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'StudentSearch',
})
</script>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import StudentInfo from './src/info.vue'
import StudentSearch from './index'

const studentNo = ref('')
const studentNo2 = ref('2020D2560437')

// 咨询师详情
let userFormData = reactive({
  uuid: '2200',
  photo: '',
  userNo: '20220506',
  userName: '一个学生',
  nationName: '汉',
  leaveDate: '2022-10-02',
  leaveTime: '15:00',
})

let userFormColumns = ref<any[]>([
  {
    label: '工号',
    prop: 'userNo',
  },
  {
    label: '姓名',
    prop: 'userName',
  },
  {
    label: '民族',
    prop: 'nationName',
  },
  {
    label: '请假时间',
    prop: '',
    width: '100',
    formatter: (data: any) => {
      return `${userFormData.leaveDate} ${userFormData.leaveTime}`
    },
  },
])

const handleSearchChange = (data: any) => {
  studentNo.value = data.studentNo
}
</script>

<style lang="scss" scoped>
.home-container {
  padding: 10px 20px;
}
</style>
