<template>
    <div id="search-bar" class="search-bar" ref="queryRef" :key="uid">
        <div class="search-field">
            <div class="search-field-content" v-if="outSideField">
                <field-picker
                    v-if="outSideField.type === 'select'"
                    :key="`${outSideField.type}-${outSideField.prop}`"
                    v-model="props.modelValue[outSideField.prop]"
                    :label="outSideField.label"
                    :options="outSideField.options"
                    :fieldNames="outSideField.fieldNames"
                    :clearAble="outSideField.clearAble"
                    :disabled="outSideField.disabled"
                    @change="handleOutsideChange"
                    @search="openSearchPanel"
                    v-bind="outSideField.opts"
                />
                <van-field
                    v-if="outSideField.type === 'input'"
                    v-model="props.modelValue[outSideField.prop]"
                    label=""
                    right-icon="search"
                    type="search"
                    :clearable="outSideField.clearAble"
                    :disabled="outSideField.disabled"
                    :maxlength="50"
                    @keyup.enter="(e:KeyboardEvent) => handleOutsideChange(props.modelValue[outSideField.prop])"
                    @blur="(e:Event) => handleOutsideChange(props.modelValue[outSideField.prop])"
                    v-bind="outSideField.opts"
                ></van-field>
                <div class="search-field-btn" @click.prevent.stop="openSearchPanel">
                    <van-icon name="wap-nav" size="24" color="#1989fa"></van-icon>
                </div>
            </div>
            <div v-else class="search-icon" @click="openSearchPanel">
                <van-icon name="search" size="18" color="#1989fa" />
            </div>
        </div>
        <van-popup v-model:show="state.showPopup" position="right" class="search-panel" :style="{ height: '100%', width: '80%' }">
            <div class="panel-header">
                <span class="panel-header-title">信息查询</span>
                <van-icon name="cross" size="15" color="#b1b3b8" @click="() => openSearchPanel()" />
            </div>
            <div class="panel-content">
                <template v-for="field in props.fields" :key="field.prop">
                    <field-input
                        v-if="field.type === 'input' && !field?.hide?.()"
                        :key="`${field.type}-${field.prop}`"
                        v-model="props.modelValue[field.prop]"
                        :label="field.label"
                        :clearAble="field.clearAble"
                        :disabled="field.disabled"
                        @change="field.onChange"
                        :opts="field.opts"
                    />
                    <field-cascader
                        v-if="field.type === 'cascader' && !field?.hide?.()"
                        v-model="props.modelValue"
                        :key="`${field.type}-${field.unionProp?.join('-')}`"
                        :label="field.label"
                        :unionProp="field.unionProp"
                        :splitSymbol="field.splitSymbol"
                        :options="field.options"
                        :fieldNames="field.fieldNames"
                        :checkStrictly="field.checkStrictly"
                        :disabled="field.disabled"
                        @change="field.onChange"
                        :opts="field.opts"
                        :pickerOpts="field.pickerOpts"
                    />
                    <field-multi-select
                        v-if="field.type === 'multi-select' && !field?.hide?.()"
                        v-model="props.modelValue"
                        :key="`${field.type}-${field.unionProp?.join('-')}`"
                        :label="field.label"
                        :unionProp="field.unionProp"
                        :splitSymbol="field.splitSymbol"
                        :options="field.options"
                        :fieldNames="field.fieldNames"
                        :clearAble="field.clearAble"
                        :disabled="field.disabled"
                        @change="field.onChange"
                        :opts="field.opts"
                        :pickerOpts="field.pickerOpts"
                    />
                    <field-select
                        v-if="field.type === 'select' && !field?.hide?.()"
                        v-model="props.modelValue[field.prop]"
                        :key="`${field.type}-${field.prop}`"
                        :label="field.label"
                        :options="field.options"
                        :fieldNames="field.fieldNames"
                        :clearAble="field.clearAble"
                        :disabled="field.disabled"
                        @change="field.onChange"
                        :opts="field.opts"
                        :pickerOpts="field.pickerOpts"
                    />
                    <field-datetime-picker
                        v-if="field.type === 'datetime' && !field?.hide?.()"
                        v-model="props.modelValue[field.prop]"
                        :key="`${field.type}-${field.prop}`"
                        :label="field.label"
                        :dateType="field.dateType"
                        :format="field.format"
                        :disabled="field.disabled"
                        @change="field.onChange"
                        :opts="field.opts"
                        :pickerOpts="field.pickerOpts"
                    />
                    <field-date-picker-group
                        v-if="field.type === 'datetimeRangePicker' && !field?.hide?.()"
                        v-model="props.modelValue[field.prop]"
                        :key="`${field.type}-${field.prop}`"
                        :label="field.label"
                        :dateType="field.dateType"
                        :format="field.format"
                        :clearAble="field.clearAble"
                        @change="field.onChange"
                        :opts="field.opts"
                        :pickerOpts="field.pickerOpts"
                    />
                </template>
            </div>
            <div v-if="$slots.footer" class="panel-footer">
                <slot name="footer" :openSearchPanel="openSearchPanel" />
            </div>
        </van-popup>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'SearchBar',
})
</script>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import { searchBarProps } from './type'
import type { SearchItem } from './type'
import FieldCascader from './FieldCascader.vue'
import FieldInput from './FieldInput.vue'
import FieldDatetimePicker from './FieldDatetimePicker.vue'
import FieldSelect from './FieldSelect.vue'
import FieldMultiSelect from './FieldMultiSelect.vue'
import FieldPicker from './FieldPicker.vue'
import FieldDatePickerGroup from './FieldDatePickerGroup.vue'

const props = defineProps(searchBarProps)
const emits = defineEmits(['update:modelValue', 'search', 'popupChange'])

const outSideField = computed(() => {
    let target = props.fields.find((item: SearchItem) => item.isOutSide)
    return target || null
})

const handleOutsideChange = (val: any) => {
    outSideField.value.onChange?.(val)
}

const state = reactive({
    showPopup: false,
})

const uid = ref(1)

function openSearchPanel() {
    state.showPopup = !state.showPopup
}

defineExpose({
    openSearchPanel,
})

watch(
    () => state.showPopup,
    (newV) => {
        emits('popupChange', newV)
    },
)
</script>

<style lang="less" scoped>
.search-bar {
    width: 100%;
    margin-bottom: 10px;
    .search-field {
        width: 100%;

        .search-field-content {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 0 20px;

            .search-field-btn {
                padding: 5px 8px;
            }
        }

        .search-icon {
            position: fixed;
            right: 0;
            top: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 36px;
            height: 30px;
            background-color: #fff;
            border-radius: 20px 0 0 20px;
            border: 1px solid #c8c9cc;
            border-right: none;
            z-index: 9;
        }
    }
}

.search-panel {
    width: 80%;
    height: 100vh;
    .panel-header {
        display: flex;
        justify-content: space-between;
        padding: var(--van-cell-vertical-padding) var(--van-cell-horizontal-padding);
    }
    .panel-content {
        max-height: calc(100% - 120px);
        overflow-y: auto;
    }
    .panel-footer {
        position: fixed;
        bottom: 20px;
        display: flex;
        justify-content: space-between;
        padding: var(--van-cell-vertical-padding) var(--van-cell-horizontal-padding);
        width: calc(100% - var(--van-cell-horizontal-padding) * 2);
        background: #fff;

        :deep(.van-button) {
            border-radius: 4px;
            padding: 0 20px;
        }
    }
}

.search-field :deep(.van-cell) {
    padding: 5px 8px;
    border: 1px solid #ccc;
    .van-field__label {
        width: 0%;
    }
}

.panel-content :deep(.van-cell) {
    flex-wrap: wrap;
    .van-field__label {
        width: 100%;
    }
}
</style>
