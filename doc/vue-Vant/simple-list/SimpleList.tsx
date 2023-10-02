import { computed, reactive, ref, watch } from 'vue'
import FormUploader from '@/components/FormUploader/index.vue'
import type { PropType } from 'vue'
import './style/index'

type BtnProps = {
    text: string
    handler: (row: any, e?: Event) => void
    formatter?: (row: any) => string
    customShow?: (row: any) => boolean
    isHeader?: boolean
    opts?: {
        size: string
        type: string
        icon: string
    }
}

type ColumnProps = {
    label: string
    prop: string
    type?: 'title' | 'value' | 'label' | 'btn' | 'image'
    formatter?: (data: any) => string
    btnList?: Array<BtnProps>
    render?: (data: any) => string
    customShow?: (data: any) => boolean
}

export default defineComponent({
    name: 'SimpleList',
    components: {
        FormUploader,
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
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { slots }) {
        const uid = ref(1)
        const activeNames = ref([])
        const timeStamp = Date.now()

        return { props, uid, activeNames, timeStamp }
    },
    render() {
        const props = this.props
        const renderContent = (row: any, index: number) => {
            const titleColumn = props.columns.find((ele: ColumnProps) => ele.type === 'title')
            const valueColumn = props.columns.find((ele: ColumnProps) => ele.type === 'value')
            const labelColumn = props.columns.find((ele: ColumnProps) => ele.type === 'label')
            const btnColumn = props.columns.find((ele: ColumnProps) => ele.type === 'btn')

            const title = titleColumn ? (titleColumn.formatter ? titleColumn.formatter(row) : row[titleColumn.prop]) : ''
            const value = valueColumn ? (valueColumn.formatter ? valueColumn.formatter(row) : `${valueColumn.label}:${row[valueColumn.prop]}`) : ''
            let label = labelColumn ? (labelColumn.formatter ? labelColumn.formatter(row) : `${labelColumn.label}:${row[labelColumn.prop]}`) : ''

            if (btnColumn && !props.disabled && !label && value) {
                label = value
            }

            function renderValue(data: any) {
                if (btnColumn && !props.disabled) {
                    const btnList = btnColumn.btnList.filter((btn: BtnProps) => {
                        if (btn.customShow && !btn.customShow(data)) {
                            return false
                        }
                        return true
                    })

                    return (
                        <div class='btn-wrap'>
                            {btnList.map((btn: BtnProps) => {
                                let text = btn.text
                                if (btn.formatter) {
                                    text = btn.formatter(data)
                                }
                                let opts = Object.assign({ size: 'mini', type: 'primary', plain: true }, btn.opts)

                                return (
                                    <van-button
                                        onClick={(e: Event) => {
                                            e && e.stopPropagation()
                                            btn.handler(data, e)
                                        }}
                                        {...opts}
                                    >
                                        {text}
                                    </van-button>
                                )
                            })}
                        </div>
                    )
                } else {
                    return value
                }
            }

            function renderDefault(data: any) {
                const contentColumn = props.columns.filter((ele: ColumnProps) => {
                    if (ele.type === 'btn') {
                        return false
                    }

                    if (ele.customShow && !ele.customShow(data)) {
                        return false
                    }
                    return true
                })
                return (
                    <div class='content-list'>
                        {contentColumn.map((column: ColumnProps) => {
                            let value = ''
                            if (column.prop) {
                                value = data[column.prop]
                            }

                            if (column.formatter && !column.type) {
                                value = column.formatter(data)
                            }

                            if (!value && column.formatter) {
                                value = column.formatter(data)
                            }

                            if (column.type && column.type === 'image') {
                                return (
                                    <div class='content-list-item' key={column.prop}>
                                        <span class='item-label'>{column.label}:</span>
                                        <form-uploader v-model={value} disabled={true} />
                                    </div>
                                )
                            }

                            if (column.render) {
                                return <div class='content-list-item' key={column.prop} v-html={column.render(data) || ''}></div>
                            } else {
                                return (
                                    <div class='content-list-item' key={column.prop}>
                                        <span class='item-label'>{column.label}:</span>
                                        <span class='item-value'>{value}</span>
                                    </div>
                                )
                            }
                        })}
                    </div>
                )
            }

            let name = this.timeStamp + '-' + index
            return (
                <van-collapse-item
                    title={title}
                    label={label}
                    name={name}
                    is-link={false}
                    icon={this.activeNames.includes(name) ? 'arrow-down' : 'arrow'}
                >
                    {{
                        value: () => renderValue(row),
                        default: () => renderDefault(row),
                    }}
                </van-collapse-item>
            )
        }

        return (
            <van-collapse class='simple-list' key={this.uid} v-model={this.activeNames}>
                {props.initData.map((data: any, index: number) => renderContent(data, index))}
            </van-collapse>
        )
    },
})
