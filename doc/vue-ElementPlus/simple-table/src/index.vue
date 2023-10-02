<template>
  <el-table
    ref="tableRef"
    v-loading="loading"
    :data="dataList"
    :height="tableAutoHeight || undefined"
    :max-height="500"
    v-bind="$attrs"
    :key="uid"
  >
    <template v-for="(column, index) in columns" :key="`${index}-${column.prop || 'default'}`">
      <template v-if="column.prop && $slots[column.prop]">
        <el-table-column :label="column.label" v-bind="column.opts">
          <template #default="scope">
            <slot
              :name="column.prop"
              :row="scope.row"
              :column="scope.column"
              :value="scope.value"
              :$index="scope.$index"
            />
          </template>
        </el-table-column>
      </template>
      <SimpleColumn v-else :column="column" />
    </template>
  </el-table>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick, PropType } from 'vue'
import { ElTable } from 'element-plus'
import SimpleColumn from './column/index'
import type { ColumnProps } from './types'

export default defineComponent({
  name: 'SimpleTable',
  components: {
    SimpleColumn,
  },
  props: {
    initData: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array as PropType<ColumnProps[]>,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    autoHeight: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const tableRef = ref<InstanceType<typeof ElTable>>()

    const tableAutoHeight = ref(0)

    let uid = ref(1)

    let loading = ref(props.loading)
    watch(
      () => props.loading,
      (newLoading) => {
        loading.value = newLoading
      },
    )

    let dataList = ref(props.initData)

    watch(
      () => props.initData,
      (newVal) => {
        dataList.value = newVal
        nextTick(() => {
          if (props.autoHeight) {
            tableAutoHeight.value = getAutoHeight()
            console.log('tableHeight', tableAutoHeight.value)
          }
        })
      },
      {
        deep: true,
      },
    )

    let columns = ref<ColumnProps[]>(props.columns)
    watch(
      () => props.columns,
      (newColumns: any) => {
        uid.value++
        columns.value = newColumns
      },
      {
        immediate: true,
      },
    )

    function getAutoHeight() {
      function getParentBottom(el: HTMLElement, rootClass: string, result: number): any {
        if (!el.offsetParent) {
          return result
        }

        if (el.offsetParent?.className === rootClass) {
          return result
        }

        let computedStyle = window.getComputedStyle(el.offsetParent, null)

        let paddingBottom = parseInt(computedStyle.getPropertyValue('padding-bottom').replace('px', ''))

        let marginBottom = parseInt(computedStyle.getPropertyValue('margin-bottom').replace('px', ''))

        let newResult = result + paddingBottom + marginBottom

        return getParentBottom(el.offsetParent as HTMLElement, rootClass, newResult)
      }

      let rootHeight = document.body.clientHeight
      let rootClass = 'app-main'
      let rootElement = document.querySelector('.' + rootClass)
      let rootOffsetTop = rootElement
        ? parseInt(window.getComputedStyle(rootElement, null).getPropertyValue('padding-top').replace('px', ''))
        : 0
      let tableParentOffsetTop = tableRef.value?.$el.offsetParent.offsetTop
      let tableOffsetTop = tableRef.value?.$el.offsetTop

      let pageBoxHeight = 64

      let tableParentOffsetBottom = getParentBottom(tableRef.value?.$el, rootClass, 0)

      let tableAutoHeight =
        rootHeight - rootOffsetTop - tableParentOffsetTop - tableOffsetTop - pageBoxHeight - tableParentOffsetBottom

      return tableAutoHeight
    }

    return { loading, dataList, columns, tableRef, uid, tableAutoHeight }
  },
})
</script>

<style lang="scss" scoped></style>
