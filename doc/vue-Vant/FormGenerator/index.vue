<template>
    <div class="form-generator-container">
        <div class="form-content">
            <van-form ref="formRef" :key="state.key" :disabled="props.disabled">
                <div class="form-item-group" v-for="firstIndicator in indicatorList" :key="firstIndicator.uuid">
                    <div class="form-item-title">
                        {{ firstIndicator.optionTitle }}
                    </div>
                    <div class="form-box">
                        <div class="form-item" v-for="secondIndicator in firstIndicator.secondIndicatorList" :key="secondIndicator.uuid">
                            <FormField :indicatorModel="secondIndicator" @update="handleFieldUpdate" />
                        </div>
                    </div>
                </div>
                <slot v-if="$slots.content" name="content" />
            </van-form>
        </div>
        <div v-if="$slots.footer" class="form-footer">
            <slot name="footer" :answerList="computedAnswerList" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'FormGenerator',
})
</script>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, unref, provide } from 'vue'
import { Toast } from 'vant'
import { initRegisterForm, queryAnswerList, queryIndicatorList, queryThemeAnswerList } from '@/apps/mentalHealthy/api/index'
import FormField from './src/index'

/** 
 "CONSULTATION_REGISTRATION": "咨询登记表"
 "INTERVIEW_REGISTRATION": "访谈登记表"
 "FEEDBACK": "反馈表"
 "CONSULTATION_RECORD": "咨询记录表"
 "INTERVIEW_RECORD": "访问记录表"
 "THEME_ACTIVITY_REGISTRATION": "主题活动报名登记表"
 "GROUP_EFFECT_FEEDBACK": "团辅效果反馈书"
 "GROUP_OBSERVATION_RECORD": "团辅观察记录表"
 "GROUP_RECORD": "团辅记录表"
*/

const props = defineProps({
    useScope: {
        type: String,
        default: '',
    },
    visitorUuid: {
        type: String,
        default: '',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        default: 'appointment',
    },
})

const state = reactive({
    pageLoading: false,
    key: 1,
})

const changeLoading = (loading: boolean): void => {
    state.pageLoading = loading
    if (loading) {
        Toast({ type: 'loading', message: '加载中...', forbidClick: true, duration: 0 })
    } else {
        Toast.clear()
    }
}

watch(
    () => props.visitorUuid,
    (val: any) => {
        queryRegisterForm()
    },
)

const formRef = ref()

let originData = {}
let indicatorList = ref<any[]>([])
watch(
    () => indicatorList,
    (val: any) => {
        state.key++
    },
    {
        deep: true,
    },
)

const queryRegisterForm = () => {
    changeLoading(true)
    if (!props.visitorUuid) {
        if (['CONSULTATION_REGISTRATION', 'INTERVIEW_REGISTRATION'].includes(props.useScope)) {
            initRegisterForm({ useScope: props.useScope })
                .then((res: any) => {
                    changeLoading(false)
                    if (res.code === '0') {
                        originData = res.data
                        indicatorList.value = res.data.indicatorList
                    } else Toast({ type: 'fail', message: res.message })
                })
                .catch((err: any) => {
                    changeLoading(false)
                })
        } else {
            queryIndicatorList({ useScope: props.useScope })
                .then((res: any) => {
                    changeLoading(false)
                    if (res.code === '0') {
                        originData = res.data
                        indicatorList.value = res.data
                    } else Toast({ type: 'fail', message: res.message })
                })
                .catch((err: any) => {
                    changeLoading(false)
                })
        }
    } else {
        if (props.type === 'appointment') {
            queryAnswerList({ useScope: props.useScope, visitorUuid: props.visitorUuid })
                .then((res: any) => {
                    changeLoading(false)
                    if (res.code === '0') {
                        originData = res.data
                        indicatorList.value = res.data
                    } else Toast({ type: 'fail', message: res.message })
                })
                .catch((err: any) => {
                    changeLoading(false)
                })
        } else {
            queryThemeAnswerList({ useScope: props.useScope, recordUuid: props.visitorUuid })
                .then((res: any) => {
                    changeLoading(false)
                    if (res.code === '0') {
                        originData = res.data
                        indicatorList.value = res.data
                    } else Toast({ type: 'fail', message: res.message })
                })
                .catch((err: any) => {
                    changeLoading(false)
                })
        }
    }
}

let answerList = ref<any[]>([])

const handleFieldUpdate = (answer: any) => {
    let index = answerList.value.findIndex((item: any) => item.secondIndicatorUuid === answer.secondIndicatorUuid)
    if (index === -1) {
        answerList.value.push(Object.assign({}, answer))
    } else {
        answerList.value.splice(index, 1, Object.assign({}, answer))
    }
}

const computedAnswerList = computed(() => {
    let tempAnswerList = <any[]>[]
    answerList.value.forEach((indicatorAnswer: any) => {
        if (indicatorAnswer.children.length > 0) {
            tempAnswerList.push({
                firstIndicatorUuid: indicatorAnswer.firstIndicatorUuid,
                secondIndicatorUuid: indicatorAnswer.secondIndicatorUuid,
                secondIndicatorAnswer: ['RADIO', 'PULL_DOWN'].includes(indicatorAnswer.optionType) ? '' : indicatorAnswer.value,
                secondItems: ['RADIO', 'PULL_DOWN'].includes(indicatorAnswer.optionType)
                    ? [
                          {
                              itemUuid: indicatorAnswer.value,
                              supplementaryInformation: ['RADIO', 'PULL_DOWN'].includes(indicatorAnswer.children[0].optionType)
                                  ? ''
                                  : indicatorAnswer.children[0].value,
                              thirdIndicatorItems: ['RADIO', 'PULL_DOWN'].includes(indicatorAnswer.children[0].optionType)
                                  ? [indicatorAnswer.children[0].value]
                                  : [],
                          },
                      ]
                    : indicatorAnswer.children.map((ele: any) => {
                          return {
                              itemUuid: ele.secondIndicatorItemUuid,
                              supplementaryInformation: ['RADIO', 'PULL_DOWN'].includes(ele.optionType) ? '' : ele.value,
                              thirdIndicatorItems: ['RADIO', 'PULL_DOWN'].includes(ele.optionType) ? [ele.value] : [],
                          }
                      }),
            })
        } else {
            tempAnswerList.push({
                firstIndicatorUuid: indicatorAnswer.firstIndicatorUuid,
                secondIndicatorUuid: indicatorAnswer.secondIndicatorUuid,
                secondIndicatorAnswer: ['RADIO', 'PULL_DOWN'].includes(indicatorAnswer.optionType) ? '' : indicatorAnswer.value,
                secondItems: ['RADIO', 'PULL_DOWN'].includes(indicatorAnswer.optionType)
                    ? [
                          {
                              itemUuid: indicatorAnswer.value,
                          },
                      ]
                    : indicatorAnswer.valueList.map((ele: any) => {
                          return { itemUuid: ele }
                      }),
            })
        }
    })

    return tempAnswerList
})

const validateForm = () => {
    let form = unref(formRef)
    return new Promise((resolve, reject) => {
        form.validate()
            .then(() => resolve(true))
            .catch((err: any) => {
                resolve(false)
                form.scrollToField()
            })
    })
}

onMounted(() => {
    queryRegisterForm()
})

provide('FormGenerator', {
    originData,
    answerList,
})

defineExpose({
    formRef,
    validateForm,
    answerList: computed(() => computedAnswerList.value),
})
</script>

<style lang="less" scoped>
.form-generator-container {
    min-height: 200px;

    .form-item-group {
        padding: 10px 0px;
        .form-item-title {
            word-break: break-word;
        }
    }
    :deep(.form-item) {
        .textarea-with-tips {
            .textarea-tip {
                padding: 5px 10px;
                font-size: 14px;
                line-height: 24px;
                word-break: break-all;
                white-space: pre-wrap;
                border: 1px solid #ccc;
                background-color: #ffeee6;
            }
        }

        .slider-marks {
            display: flex;
            justify-content: space-between;
        }
    }

    :deep(.slider-button) {
        width: 26px;
        color: #fff;
        font-size: 10px;
        line-height: 18px;
        text-align: center;
        background-color: #60be5d;
        border-radius: 100px;
    }
}
</style>
