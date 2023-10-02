<template>
  <div class="home-container">
    <h3>使用整个SimpleTable</h3>
    <SimpleTable :init-data="dataList" :columns="dataColumns" @selection-change="handleSelectionChange"></SimpleTable>
  </div>
  <div class="home-container">
    <h3>使用整个SimpleTable(使用slot)</h3>
    <SimpleTable :init-data="dataList" :columns="dataColumns2" @selection-change="handleSelectionChange">
      <template #custom="scope">
        <span>这是自定义内容{{ scope.row }}</span>
      </template>
      <template #op="scope">
        <el-button type="primary" @click="handleCustomClick(scope.row)">详情</el-button>
      </template>
    </SimpleTable>
  </div>
  <div class="home-container">
    <h3>只使用SimpleTableColumn</h3>
    <el-table :data="dataList" style="width: 100%">
      <SimpleTableColumn :column="{ label: '学号', prop: 'studentNo' }" />
      <el-table-column prop="studentName" label="姓名" width="180" />
      <SimpleTableColumn :column="dataColumns[3]" />
      <el-table-column label="操作">
        <el-button type="primary">添加</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Table',
})
</script>

<script lang="ts" setup>
import { ref, markRaw, h } from 'vue'
import SimpleTable from './index'
import SimpleTableColumn from './src/column'
import { Plus, Delete } from '@element-plus/icons-vue'

const deleteIcon = markRaw(Delete)
const addIcon = markRaw(Plus)

let dataList = ref([
  {
    uuid: '101',
    studentNo: '12345',
    studentName: '大学生',
    photo: {
      url: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    },
    photos: '',
    collegeName: '土木工程学院',
    grade: 2022,
    className: '建筑理论系\n一班',
    beginYear: 2022,
    endYear: 2023,
    termNo: '1',
    active: true,
  },
])

let dataColumns = ref<any[]>([
  {
    type: 'selection',
    prop: '',
  },
  { label: '学号', prop: 'studentNo' },
  { label: '姓名', prop: 'studentName' },
  { label: '照片', prop: 'photo', extType: 'img' },
  { label: '照片2', prop: 'photos', extType: 'img' },
  {
    label: '班级信息',
    prop: '',
    extType: 'children',
    children: [
      {
        label: '学院',
        prop: 'collegeName',
        extType: 'custom',
        render: (row: any) =>
          h('span', { class: 'red-cell', onClick: (e: Event) => console.log(row.studentNo) }, row.collegeName),
      },
      {
        label: '年级',
        prop: 'grade',
        extType: 'custom',
        render: (row: any) => `<span class="red-cell">${row.grade}</span>`,
      },
      { label: '班级', prop: 'className', opts: { 'class-name': 'line-break' } },
    ],
  },
  {
    label: '评定学年/学期',
    prop: '',
    formatter: (row: any) => {
      return `${row.beginYear}-${row.endYear}学年第${row.termNo}学期 `
    },
  },
  {
    label: '活跃',
    prop: 'active',
    extType: 'switch',
    width: 120,
    switchAttr: {
      handler: (row: any, val: any) => {
        console.log('999', val)
        dataList.value[0].active = val
      },
      opts: {
        'active-text': '活跃',
        'inactive-text': '休眠',
      },
    },
  },
  {
    label: '操作',
    prop: '',
    extType: 'btn',
    width: 150,
    btnList: [
      {
        text: '111',
        handler: (row: any) => {
          console.log('111')
        },
      },
      {
        text: '222',
        handler: (row: any) => {
          console.log('222')
        },
      },
      {
        text: '333',
        handler: (row: any) => {
          console.log('333')
        },
      },
      {
        text: '444',
        handler: (row: any) => {
          console.log('444')
        },
      },
    ],
  },
  {
    label: '操作',
    prop: '',
    extType: 'btn',
    btnList: [
      {
        text: '添加',
        handler: (row: any) => {
          console.log('添加')
        },
        customShow: () => false,
        isHeader: true,
        opts: {
          size: 'small',
          type: 'text',
          icon: addIcon,
        },
      },
      {
        text: '',
        handler: (row: any) => {
          console.log('删除')
        },
        opts: {
          size: 'small',
          type: 'text',
          icon: deleteIcon,
        },
      },
    ],
  },
])

let dataColumns2 = ref<any[]>([
  {
    type: 'selection',
    prop: '',
  },
  { label: '学号', prop: 'studentNo' },
  { label: '姓名', prop: 'studentName' },
  {
    label: '自定义',
    prop: 'custom',
  },
  {
    label: '操作',
    prop: 'op',
  },
])

const handleCustomClick = (row: any) => {
  alert('姓名：' + row.studentName)
}

const handleSelectionChange = (rowList: any) => {
  console.log(rowList)
}
</script>

<style lang="scss" scoped>
.home-container {
  padding: 10px 20px;
}
.el-table :deep(.line-break .cell) {
  white-space: pre;
}

.el-table :deep(.cell .red-cell) {
  color: red;
}
</style>
