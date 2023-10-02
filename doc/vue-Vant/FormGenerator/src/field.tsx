import { isNumber } from 'lodash'
import { ref, defineComponent, PropType, reactive, computed, watch } from 'vue'
import { FORM_KEY } from 'vant/es/utils/constant'
import { Slider } from 'vant'
import type { IndicatorProp, ExtendIndicatorProp, ExtendOptionProp, FormDataProp, AnswerProp } from './types'
import { useId } from './use-id'
import { isDef } from './types'
import FieldSelect from '@/apps/award/components/search-bar/FieldSelect.vue'
import FieldDatetimePicker from '@/apps/award/components/search-bar/FieldDatetimePicker.vue'

const ExtendField = defineComponent({
    name: 'ExtendField',
    components: {
        FieldDatetimePicker,
    },
    props: {
        indicatorModel: {
            type: Object as PropType<ExtendIndicatorProp>,
            default: () => {},
        },
        answer: {
            type: String,
            default: () => '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['change'],
    setup(props, { emit, slots }) {
        const { indicatorModel, answer } = props
        const id = useId()
        const getId = () => indicatorModel.uuid || `${id}-${indicatorModel.optionType}`

        const textareaRows = 6

        const formData = reactive<FormDataProp>({
            secondIndicatorUuid: indicatorModel.secondIndicatorUuid,
            secondIndicatorItemUuid: indicatorModel.uuid,
            optionType: indicatorModel.optionType,
            value: answer,
            valueList: [],
            children: [],
        })

        const handleChange = (val: any) => {
            emit('change', val, formData)
        }

        const fieldRules = [
            {
                required: Boolean(indicatorModel.isRequired),
                message: `请${['TEXT', 'TEXT_AREA'].includes(indicatorModel.optionType) ? '填写' : '选择'}补充信息`,
                validator: (val: any) => {
                    if (Boolean(indicatorModel.isRequired) && !formData.value) {
                        return `请${['TEXT', 'TEXT_AREA'].includes(indicatorModel.optionType) ? '填写' : '选择'}补充信息`
                    }
                    return true
                },
                trigger: 'onSubmit',
            },
        ]

        const renderCustom = () => {
            switch (indicatorModel.optionType) {
                case 'RADIO':
                    return renderRadio()
                case 'TEXT':
                    return renderInput()
                case 'TEXT_AREA':
                    return renderTextArea()
                case 'DATE_TIME':
                    return renderDatePicker('datetime', '{y}-{m}-{d} {h}:{i}:{s}')
                default:
                    return <span style='color:red;'>unknown type</span>
            }
        }

        const renderRadio = () => {
            if (!indicatorModel.itemList) return

            return (
                <div class='field-radio-group'>
                    <van-field required={Boolean(indicatorModel.isRequired)} rules={fieldRules}>
                        {{
                            input: () => (
                                <van-radio-group v-model={formData.value} disabled={props.disabled} onChange={handleChange} style='flex:1'>
                                    <van-cell-group inset>
                                        {indicatorModel.itemList.map((option: ExtendOptionProp) => (
                                            <div key={option.uuid}>
                                                <van-cell
                                                    title={option.itemTitle}
                                                    clickable
                                                    onClick={() => {
                                                        if (!props.disabled) {
                                                            formData.value = option.uuid
                                                        }
                                                    }}
                                                >
                                                    {{
                                                        'right-icon': () => <van-radio name={option.uuid} />,
                                                    }}
                                                </van-cell>
                                            </div>
                                        ))}
                                    </van-cell-group>
                                </van-radio-group>
                            ),
                        }}
                    </van-field>

                    {/* <van-radio-group v-model={formData.value} onChange={handleChange}>
                        {indicatorModel.itemList.map((option: ExtendOptionProp) => (
                            <van-radio name={option.uuid}>{option.itemTitle}</van-radio>
                        ))}
                    </van-radio-group> */}
                </div>
            )
        }

        const renderInput = () => {
            return (
                <van-field
                    v-model={formData.value}
                    label={''}
                    onChange={handleChange}
                    show-word-limit
                    maxlength={indicatorModel.maxNumber}
                    placeholder={indicatorModel.promptContent}
                    required={Boolean(indicatorModel.isRequired)}
                    rules={fieldRules}
                ></van-field>
            )
        }

        const renderTextArea = () => {
            return (
                <div class='textarea-with-tips'>
                    {indicatorModel.promptContent ? <div class='textarea-tip'>{indicatorModel.promptContent}</div> : null}
                    <van-field
                        v-model={formData.value}
                        label={''}
                        onChange={handleChange}
                        rows={textareaRows}
                        type={'textarea'}
                        autosize
                        show-word-limit
                        maxlength={indicatorModel.maxNumber}
                        placeholder={'请输入'}
                        required={Boolean(indicatorModel.isRequired)}
                        rules={fieldRules}
                    ></van-field>
                </div>
            )
        }

        const renderDatePicker = (type: string, format: string) => {
            return (
                <field-datetime-picker
                    v-model={formData.value}
                    label={''}
                    onChange={handleChange}
                    dateType={type}
                    format={format}
                    value-format={format}
                    opts={{ required: Boolean(indicatorModel.isRequired), rules: fieldRules, placeholder: indicatorModel.promptContent }}
                />
            )
        }

        return () => {
            return renderCustom()
        }
    },
})

const FormField = defineComponent({
    name: 'Field',
    components: {
        ExtendField,
        FieldSelect,
        FieldDatetimePicker,
        Slider,
    },
    props: {
        indicatorModel: {
            type: Object as PropType<IndicatorProp>,
            default: () => {},
        },
    },
    emits: ['update', 'change'],
    setup(props, { emit, slots }) {
        const { indicatorModel } = props
        const id = useId()

        const form = inject(FORM_KEY, undefined)

        const getProp = (key: string) => {
            if (isDef(props[key])) {
                return props[key]
            }

            if (form && isDef(form.props[key])) {
                return form.props[key]
            }
        }

        let disabled = getProp('disabled')

        const textareaRows = 6

        const formData = reactive<FormDataProp>({
            firstIndicatorUuid: indicatorModel.firstIndicatorUuid,
            secondIndicatorUuid: indicatorModel.uuid,
            optionType: indicatorModel.optionType,
            value: '',
            valueList: [],
            children: [],
        })

        // 填充答案或加载默认选项，并触发更新事件
        if (indicatorModel.answerList && indicatorModel.answerList.length > 0) {
            if (indicatorModel.answerList.length === 1 && !['MULTI_CHOICE', 'RADIO', 'PULL_DOWN'].includes(indicatorModel.optionType)) {
                let answer = indicatorModel.answerList[0]
                formData.value = answer.secondIndicatorAnswer || ''
                if (answer.thirdIndicatorUuid || answer.supplementaryInformation) {
                    formData.children = [
                        {
                            secondIndicatorItemUuid: answer.itemUuid,
                            value: answer.thirdIndicatorUuid ? answer.thirdIndicatorUuid : answer.supplementaryInformation || '',
                            valueList: [],
                        },
                    ]
                }
            } else {
                formData.valueList = indicatorModel.answerList.map((answer: AnswerProp) => answer.itemUuid || '').filter(Boolean)

                if (['RADIO', 'PULL_DOWN'].includes(indicatorModel.optionType)) {
                    formData.value = indicatorModel.answerList[0].itemUuid || ''
                    formData.valueList = []
                }
                formData.children = indicatorModel.answerList
                    .map((answer: AnswerProp) => {
                        if (answer.thirdIndicatorUuid || answer.supplementaryInformation) {
                            return {
                                secondIndicatorItemUuid: answer.itemUuid,
                                value: answer.thirdIndicatorUuid ? answer.thirdIndicatorUuid : answer.supplementaryInformation || '',
                                valueList: [],
                            }
                        } else {
                            return false
                        }
                    })
                    .filter(Boolean)
            }

            emit('update', formData)
        } else if (!formData.value && formData.valueList.length === 0) {
            if (['RADIO', 'MULTI_CHOICE', 'PULL_DOWN'].includes(indicatorModel.optionType)) {
                let autoLoadList = indicatorModel.itemList?.filter((item: ExtendIndicatorProp) => Boolean(item.isAutoLoad))
                if (autoLoadList && autoLoadList.length > 0) {
                    if (['RADIO', 'PULL_DOWN'].includes(indicatorModel.optionType)) {
                        formData.value = autoLoadList[0].uuid
                    } else {
                        formData.valueList = autoLoadList.map((ele: ExtendIndicatorProp) => ele.uuid)
                    }
                }
            }
            emit('update', formData)
        }

        const fieldRules = [
            {
                required: Boolean(indicatorModel.isRequired),
                message: `请${['TEXT', 'TEXT_AREA'].includes(indicatorModel.optionType) ? '填写' : '选择'}${indicatorModel.optionTitle}`,
                validator: (val: any) => {
                    if (Boolean(indicatorModel.isRequired) && !formData.value && formData.value !== '0' && formData.valueList.length === 0) {
                        return `请${['TEXT', 'TEXT_AREA'].includes(indicatorModel.optionType) ? '填写' : '选择'}${indicatorModel.optionTitle}`
                    }
                    return true
                },
                trigger: 'onSubmit',
            },
        ]

        // 更新数据
        watch(
            () => formData,
            () => {
                emit('update', formData)
                disabled = getProp('disabled')
            },
            {
                deep: true,
            },
        )

        const renderCustom = () => {
            switch (indicatorModel.optionType) {
                case 'RADIO':
                    return renderRadio()
                case 'MULTI_CHOICE':
                    return renderCheckbox()
                case 'PULL_DOWN':
                    return renderSelect()
                case 'TEXT':
                    return renderInput()
                case 'TEXT_AREA':
                    return renderTextArea()
                case 'DATE':
                    return renderDatePicker('date', '{y}-{m}-{d}')
                case 'DATE_TIME':
                    return renderDatePicker('datetime', '{y}-{m}-{d} {h}:{i}')
                case 'SCALE':
                    return renderSlider()
                default:
                    return <span style='color:red;'>unknown type</span>
            }
        }

        const renderRadio = () => {
            if (!indicatorModel.itemList) return

            return (
                <div class='field-radio-group'>
                    <van-cell title={indicatorModel.optionTitle} required={Boolean(indicatorModel.isRequired)}></van-cell>
                    <van-field rules={fieldRules}>
                        {{
                            input: () => (
                                <van-radio-group
                                    v-model={formData.value}
                                    disabled={disabled}
                                    onChange={(val: any) => emit('change', val)}
                                    style='flex:1'
                                >
                                    <van-cell-group inset>
                                        {indicatorModel.itemList.map((option: ExtendIndicatorProp) => (
                                            <div key={option.uuid}>
                                                <van-cell
                                                    title={option.itemTitle}
                                                    clickable
                                                    onClick={() => {
                                                        if (!disabled) {
                                                            formData.value = option.uuid
                                                        }
                                                    }}
                                                >
                                                    {{
                                                        'right-icon': () => <van-radio name={option.uuid} />,
                                                    }}
                                                </van-cell>
                                                {option.uuid === formData.value ? renderExtend(option) : null}
                                            </div>
                                        ))}
                                    </van-cell-group>
                                </van-radio-group>
                            ),
                        }}
                    </van-field>
                </div>
            )
        }

        const renderCheckbox = () => {
            if (!indicatorModel.itemList) return
            const handleToggle = (uuid: string) => {
                let index = formData.valueList.indexOf(uuid)
                if (index === -1) {
                    formData.valueList.push(uuid)
                } else {
                    formData.valueList.splice(index, 1)
                }
            }
            return (
                <div class='field-checkbox-group'>
                    <van-cell title={indicatorModel.optionTitle} required={Boolean(indicatorModel.isRequired)}></van-cell>
                    <van-field rules={fieldRules}>
                        {{
                            input: () => (
                                <van-checkbox-group
                                    v-model={formData.valueList}
                                    disabled={disabled}
                                    onChange={(val: any) => emit('change', val)}
                                    style='flex:1'
                                >
                                    <van-cell-group inset>
                                        {indicatorModel.itemList.map((option: ExtendIndicatorProp) => (
                                            <div key={option.uuid}>
                                                <van-cell
                                                    title={option.itemTitle}
                                                    clickable
                                                    onClick={() => {
                                                        if (!disabled) {
                                                            handleToggle(option.uuid)
                                                        }
                                                    }}
                                                >
                                                    {{
                                                        'right-icon': () => (
                                                            <van-checkbox
                                                                name={option.uuid}
                                                                shape='square'
                                                                onClick={(e: Event) => e.stopPropagation()}
                                                            />
                                                        ),
                                                    }}
                                                </van-cell>
                                                {formData.valueList.includes(option.uuid) ? renderExtend(option) : null}
                                            </div>
                                        ))}
                                    </van-cell-group>
                                </van-checkbox-group>
                            ),
                        }}
                    </van-field>
                </div>
            )
        }

        const renderSelect = () => {
            if (!indicatorModel.itemList) return
            const handleChange = () => {
                let target = indicatorModel.itemList?.find((option: ExtendIndicatorProp) => option.uuid === formData.value)

                return target ? renderExtend(target) : null
            }
            return (
                <div class='field-select'>
                    <field-select
                        v-model={formData.value}
                        label={indicatorModel.optionTitle}
                        options={indicatorModel.itemList}
                        fieldNames={{ text: 'itemTitle', value: 'uuid' }}
                        onChange={(val: any) => emit('change', val)}
                        placeholder={indicatorModel.promptContent}
                        opts={{ required: Boolean(indicatorModel.isRequired), rules: fieldRules }}
                    />
                    {formData.value ? handleChange() : null}
                </div>
            )
        }

        const renderInput = () => {
            return (
                <van-field
                    v-model={formData.value}
                    label={indicatorModel.optionTitle}
                    onChange={(val: any) => emit('change', val)}
                    show-word-limit
                    maxlength={indicatorModel.maxNumber}
                    placeholder={indicatorModel.promptContent}
                    required={Boolean(indicatorModel.isRequired)}
                    rules={fieldRules}
                ></van-field>
            )
        }

        const renderTextArea = () => {
            return (
                <div class='textarea-with-tips'>
                    {indicatorModel.promptContent ? <div class='textarea-tip'>{indicatorModel.promptContent}</div> : null}
                    <van-field
                        v-model={formData.value}
                        label={indicatorModel.optionTitle}
                        label-width={'100%'}
                        onChange={(val: any) => emit('change', val)}
                        rows={textareaRows}
                        type={'textarea'}
                        autosize
                        show-word-limit
                        maxlength={indicatorModel.maxNumber}
                        placeholder={'请输入'}
                        required={Boolean(indicatorModel.isRequired)}
                        rules={fieldRules}
                        style='flex-wrap:wrap'
                    ></van-field>
                </div>
            )
        }
        const renderDatePicker = (type: string, format: string) => {
            return (
                <field-datetime-picker
                    v-model={formData.value}
                    label={indicatorModel.optionTitle}
                    onChange={(val: any) => emit('change', val)}
                    dateType={type}
                    format={format}
                    value-format={format}
                    opts={{ required: Boolean(indicatorModel.isRequired), rules: fieldRules, placeholder: indicatorModel.promptContent }}
                />
            )
        }

        const renderSlider = () => {
            if (isNumber(indicatorModel.measureBeginVal) && isNumber(indicatorModel.measureEndVal)) {
                const model = computed({
                    get() {
                        return Number(formData.value)
                    },
                    set(val: number) {
                        formData.value = val.toString()
                    },
                })
                return (
                    <div class='field-slider'>
                        <van-cell title={indicatorModel.optionTitle} required={Boolean(indicatorModel.isRequired)}></van-cell>
                        <van-field rules={fieldRules}>
                            {{
                                input: () => (
                                    <Slider
                                        v-model={model.value}
                                        min={indicatorModel.measureBeginVal}
                                        max={indicatorModel.measureEndVal}
                                        style='flex:1'
                                        disabled={disabled}
                                    >
                                        {{
                                            button: () => <div class='slider-button'>{model.value}</div>,
                                        }}
                                    </Slider>
                                ),
                            }}
                        </van-field>
                        <div class='van-cell slider-marks'>
                            <div class='van-cell__label'>{indicatorModel.measureBeginName}</div>
                            <div class='van-cell__label'>{indicatorModel.measureEndName}</div>
                        </div>
                    </div>
                )
            }

            return null
        }

        const handleExtendChange = (val: any, extendData: any) => {
            // 非多选状态下，只有一个补充信息
            if (indicatorModel.optionType != 'MULTI_CHOICE') {
                formData.children = [Object.assign({}, extendData)]
            } else {
                let index = formData.children.findIndex((item: any) => item.secondIndicatorItemUuid === extendData.secondIndicatorItemUuid)
                if (index === -1) {
                    formData.children.push(Object.assign({}, extendData))
                } else {
                    formData.children.splice(index, 1, Object.assign({}, extendData))
                }
            }
        }

        const renderExtend = (option: ExtendIndicatorProp) => {
            if (Boolean(option.isSupplementaryInformation)) {
                let answer = formData.children.find((ele: any) => ele.secondIndicatorItemUuid === option.uuid)

                return (
                    <ExtendField
                        key={option.uuid}
                        indicatorModel={option}
                        answer={answer ? answer.value : ''}
                        style='margin-left: 10px'
                        onChange={handleExtendChange}
                        disabled={disabled}
                    />
                )
            }
            return null
        }

        return () => {
            return renderCustom()
        }
    },
})

export default FormField
