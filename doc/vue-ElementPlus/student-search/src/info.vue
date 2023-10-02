<template>
  <div class="student-info">
    <div class="student-avatar">
      <ImgPreview class="avatar" v-model="props.modelValue[props.avatarKey]" />
    </div>
    <el-form :model="modelValue" :inline="true" label-width="120px">
      <div class="form-box">
        <div
          v-for="item in props.columns"
          :key="`${item.label}-${item.prop}`"
          :class="`form-item${item.width ? ' w-' + item.width : ''}`"
        >
          <el-form-item :label="item.label">
            <span class="form-item-content">
              {{ item.formatter ? item.formatter(modelValue) : modelValue[item.prop] || '' }}
            </span>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <template v-if="$slots.append">
      <slot name="append" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'StudentInfo',
})
</script>

<script lang="ts" setup>
import { PropType } from 'vue'
import ImgPreview from './imgPreview.vue'

type ColumnProps = {
  label: string
  prop: string
  width: 50 | 100 | undefined
  type: 'avatar' | undefined
  formatter?: (data: any) => string
}

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {},
  },
  columns: {
    type: Array as PropType<ColumnProps[]>,
    default: () => [],
  },
  avatarKey: {
    type: String,
    default: 'photo',
  },
})
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
.form-wrapper {
  padding-bottom: 0;
}
</style>
