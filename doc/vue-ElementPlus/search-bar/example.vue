<template>
  <div class="app-container">
    <div class="list-base filter-container">
      <div class="border-wrap">
        <div class="title">
          <h3><span>信息查询</span></h3>
          <span class="toggle" @click="state.showQuery = !state.showQuery">
            <span>{{ state.showQuery ? '收起' : '展开' }}</span>
            <svg class="icon" :class="[{ 'is-open': !state.showQuery }]" aria-hidden="true" font-size="14px">
              <use xlink:href="#icon-zhedie1" />
            </svg>
          </span>
        </div>
        <el-collapse-transition>
          <SearchBar v-show="state.showQuery" v-model="query" :fields="dataList">
            <template #searchBtn>
              <div class="action-handle">
                <el-button @click="handleSearch">搜索</el-button>
                <el-button @click="handleReset">重置</el-button>
              </div>
            </template>
          </SearchBar>
        </el-collapse-transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Searchbar',
})
</script>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import SearchBar from './index'

const state = reactive({
  showQuery: true,
})

let query = reactive({
  classNo: '',
  studentKeyWord: '',
  beginYear: '',
  endYear: '',
  specialtyTypeFirstLevel: '',
  specialtyTypeSecondLevel: '',
})

const yearList = ref([
  {
    schoolYear: '2022-2023',
    schoolYearName: '2022-2023学年',
    schoolYearStart: '2022',
    schoolYearEnd: '2023',
    isCurrentYear: 1,
  },
  {
    schoolYear: '2021-2022',
    schoolYearName: '2021-2022学年',
    schoolYearStart: '2021',
    schoolYearEnd: '2022',
    isCurrentYear: 0,
  },
  {
    schoolYear: '2020-2021',
    schoolYearName: '2020-2021学年',
    schoolYearStart: '2020',
    schoolYearEnd: '2021',
    isCurrentYear: 0,
  },
  {
    schoolYear: '2015-2016',
    schoolYearName: '2015-2016学年',
    schoolYearStart: '2015',
    schoolYearEnd: '2016',
    isCurrentYear: 0,
  },
  {
    schoolYear: '2012-2013',
    schoolYearName: '2012-2013学年',
    schoolYearStart: '2012',
    schoolYearEnd: '2013',
    isCurrentYear: 0,
  },
])

const classList = ref([
  { className: '一班', classNo: 'A001' },
  { className: '二班', classNo: 'B002' },
])

const specialtyTypeList = ref([
  {
    specialtyType: 'B',
    specialtyTypeName: '本科',
    specialtyTypeLevel: 1,
    parentSpecialtyType: '',
    sort: 0,
    children: [
      {
        specialtyType: 'B1',
        specialtyTypeName: '普通本科',
        specialtyTypeLevel: 2,
        parentSpecialtyType: 'B',
        sort: 1,
      },
      {
        specialtyType: 'B2',
        specialtyTypeName: '专升本',
        specialtyTypeLevel: 2,
        parentSpecialtyType: 'B',
        sort: 2,
      },
      {
        specialtyType: 'B3',
        specialtyTypeName: '本科预读',
        specialtyTypeLevel: 2,
        parentSpecialtyType: 'B',
        sort: 3,
      },
    ],
  },
  {
    specialtyType: 'D',
    specialtyTypeName: '博士',
    specialtyTypeLevel: 1,
    parentSpecialtyType: '',
    sort: 4,
  },
  {
    specialtyType: 'S',
    specialtyTypeName: '硕士',
    specialtyTypeLevel: 1,
    parentSpecialtyType: '',
    sort: 5,
  },
  {
    specialtyType: 'Z',
    specialtyTypeName: '专科',
    specialtyTypeLevel: 1,
    parentSpecialtyType: '',
    sort: 9,
    children: [
      {
        specialtyType: 'Z1',
        specialtyTypeName: '普通专科',
        specialtyTypeLevel: 2,
        parentSpecialtyType: 'Z',
        sort: 10,
      },
      {
        specialtyType: 'Z2',
        specialtyTypeName: '五年一贯',
        specialtyTypeLevel: 2,
        parentSpecialtyType: 'Z',
        sort: 11,
      },
    ],
  },
  {
    specialtyType: 'M',
    specialtyTypeName: '中职',
    specialtyTypeLevel: 2,
    parentSpecialtyType: '',
    sort: 12,
  },
])

const dataList = ref<any[]>([
  {
    type: 'select',
    label: '学年',
    prop: 'schoolYear',
    unionProp: ['beginYear', 'endYear'],
    splitSymbol: '-',
    options: yearList,
    selectProps: {
      label: 'schoolYearName',
      value: 'schoolYear',
    },
    onChange: (val: any) => {
      console.log(val)
    },
    opts: {
      placeholder: '请选择',
      clearable: true,
    },
  },
  {
    type: 'cascade',
    label: '学历',
    prop: 'specialtyType',
    unionProp: ['specialtyTypeFirstLevel', 'specialtyTypeSecondLevel'],
    options: specialtyTypeList,
    cascadeProps: {
      label: 'specialtyTypeName',
      value: 'specialtyType',
      checkStrictly: true,
    },
    onChange: (val: any) => {
      console.log(val)
    },
    opts: {
      placeholder: '请选择',
    },
  },
  {
    type: 'select',
    label: '班级',
    prop: 'classNo',
    options: classList,
    selectProps: {
      label: 'className',
      value: 'classNo',
    },
    onChange: (val: any) => {
      console.log(val)
    },
    opts: {
      placeholder: '请选择',
    },
  },
  {
    label: '关键字',
    prop: 'studentKeyWord',
    type: 'input',
    opts: {
      placeholder: '请输入名字或学号',
    },
  },
])

const handleSearch = () => {
  query.classNo = ''
  classList.value = [
    { className: '三三十年班', classNo: 'C001' },
    { className: '世世代代班', classNo: 'D002' },
  ]
  console.log(query)
}

const handleReset = () => {
  Object.assign(query, {
    classNo: '',
    studentKeyWord: '',
    beginYear: '',
    endYear: '',
    specialtyTypeFirstLevel: '',
    specialtyTypeSecondLevel: '',
  })
}
</script>

<style lang="scss" scoped></style>
