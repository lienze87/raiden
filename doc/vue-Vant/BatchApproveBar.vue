<template>
    <van-action-bar class="footer-bar">
        <div class="footer-content">
            <van-checkbox v-model="batchApprove.selectAll" @change="handleSelectAll" shape="square" icon-size="16px">全选</van-checkbox>
            <van-button plain type="primary" style="padding: 4px 15px; margin-left: 14px" @click="handleOpenDialog" size="small">
                {{ batchApprove.type ? (batchApprove.type === 'checked' ? '勾选数据' : '当前查询结果') : '请选择审批方式' }}
            </van-button>
        </div>
        <van-button class="footer-btn" type="primary" size="small" @click="handleBatchApprove">批量审批</van-button>
    </van-action-bar>
    <SimpleDialog v-model:show="batchApprove.popupShow" :title="'批量审批方式'" @confirm="handleSubmit" @cancel="handleCloseDialog">
        <van-radio-group v-model="dialogType">
            <van-cell-group inset>
                <van-cell title="勾选数据" clickable @click="dialogType = 'checked'">
                    <template #right-icon>
                        <van-radio name="checked" />
                    </template>
                </van-cell>
                <van-cell title="当前查询结果" clickable @click="dialogType = 'condition'">
                    <template #right-icon>
                        <van-radio name="condition" />
                    </template>
                </van-cell>
            </van-cell-group>
        </van-radio-group>
    </SimpleDialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'BatchApproveBar',
})
</script>

<script lang="ts" setup>
import { Toast } from 'vant'
import { reactive } from 'vue'
import SimpleDialog from './SimpleDialog.vue'

const emit = defineEmits(['selectAll', 'submit'])

const props = defineProps({
    uuidList: {
        type: Array,
        default: () => [],
    },
})

const dialogType = ref('checked')

let batchApprove = reactive({
    selectAll: false,
    popupShow: false,
    type: 'checked',
})

const handleSelectAll = (checked: boolean) => {
    if (checked) {
        emit('selectAll', true)
    } else {
        emit('selectAll', false)
    }
}

const handleOpenDialog = () => {
    dialogType.value = batchApprove.type
    batchApprove.popupShow = true
}

const handleSubmit = () => {
    batchApprove.type = dialogType.value
    batchApprove.popupShow = false
}

const handleCloseDialog = () => {
    batchApprove.popupShow = false
}

const handleBatchApprove = () => {
    if (!batchApprove.type) {
        Toast({ type: 'fail', message: '请选择批量审批类型' })
        return
    }
    if (batchApprove.type === 'checked' && props.uuidList.length === 0) {
        Toast({ type: 'fail', message: '请选择批量审批数据' })
        return
    }

    emit('submit', { type: batchApprove.type, uuidList: props.uuidList })
}
</script>

<style lang="less" scoped>
.footer-bar {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    border-top: 1px solid #d1d1d1;

    .footer-content {
        flex: 2;
        display: flex;
        // justify-content: space-around;
    }
}
</style>
