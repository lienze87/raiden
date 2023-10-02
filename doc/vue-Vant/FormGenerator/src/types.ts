export const isDef = <T>(val: T): val is NonNullable<T> => val !== undefined && val !== null

const OptionTypeEnum = {
    0: { value: 'RADIO', label: '单选' },
    1: { value: 'MULTI_CHOICE', label: '多选' },
    2: { value: 'PULL_DOWN', label: '下拉' },
    3: { value: 'TEXT', label: '输入-文本框' },
    4: { value: 'TEXT_AREA', label: '输入-文本域' },
    5: { value: 'DATE', label: '输入-日期' },
    6: { value: 'DATE_TIME', label: '输入-日期时间' },
    7: { value: 'SCALE', label: '量表' },
}

export declare type AnswerProp = {
    firstIndicatorUuid: string
    secondIndicatorUuid: string
    itemUuid?: string
    secondIndicatorAnswer?: string
    supplementaryInformation?: string
    thirdIndicatorUuid?: string
}

export declare type FormDataProp = {
    firstIndicatorUuid?: string
    secondIndicatorUuid: string
    thirdIndicatorUuid?: string
    secondIndicatorItemUuid?: string
    optionType: 'RADIO' | 'MULTI_CHOICE' | 'PULL_DOWN' | 'TEXT' | 'TEXT_AREA' | 'DATE' | 'DATE_TIME' | 'SCALE'
    value: string
    valueList: string[]
    children: any[]
}

export declare type ExtendOptionProp = {
    secondIndicatorItemUuid: string
    number: number
    uuid: string
    itemTitle: string
}

export declare type ExtendIndicatorProp = {
    secondIndicatorUuid: string
    number: number
    uuid: string
    optionType: 'RADIO' | 'TEXT' | 'TEXT_AREA' | 'DATE_TIME'
    itemTitle: string
    isRequired: 1 | 0 | undefined
    isAutoLoad?: 1 | 0 | undefined
    isSupplementaryInformation?: 1 | 0
    // 提示内容
    promptContent?: string
    // 最大字数
    maxNumber?: number
    itemList?: Array<ExtendOptionProp>
}

export declare type IndicatorProp = {
    firstIndicatorUuid: string
    number: number
    uuid: string
    optionType: 'RADIO' | 'MULTI_CHOICE' | 'PULL_DOWN' | 'TEXT' | 'TEXT_AREA' | 'DATE' | 'DATE_TIME' | 'SCALE'
    optionTitle: string
    isRequired: 1 | 0 | undefined
    // 提示内容
    promptContent?: string
    // 最大字数
    maxNumber?: number
    // 量表开始名称
    measureBeginName?: string
    // 量表开始值
    measureBeginVal?: number
    // 量表结束名称
    measureEndName?: string
    // 量表结束值
    measureEndVal?: number
    itemList?: Array<ExtendIndicatorProp>
    answerList?: Array<AnswerProp>
}
