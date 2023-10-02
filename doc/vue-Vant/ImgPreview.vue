<template>
    <van-image :src="currentUrl" v-bind="$attrs">
        <template v-slot:loading><span></span></template>
        <template v-slot:error>加载失败</template>
    </van-image>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'ImgPreview',
})
</script>

<script lang="ts" setup>
import { reactive, watch, computed } from 'vue'
import { serverUrl } from '@/config'
import { baseURL } from '@/utils/axios/request'
import { listGroupResource, queryPublicGroupFileList, getPrivatePhoto } from '@/api/common'
import defaultImg from '@/assets/images/home-bg@2x.png'

const props = defineProps({
    groupUuid: {
        type: String,
        default: '',
    },
    sourceType: {
        type: String,
        default: 'private',
    },
    index: {
        type: Number,
        default: 0,
    },
    showDefault: {
        type: Boolean,
        default: true,
    },
})

const state = reactive({
    url: '',
    baseURL: baseURL + serverUrl.base,
})

const currentUrl = computed(() => {
    return fileList.value.length > 0 ? fileList.value[props.index].url : ''
})

const fileList = ref<any[]>([])

const setDefaultImg = () => {
    if (props.showDefault) {
        fileList.value = [
            {
                url: defaultImg,
                status: 'done',
                isImage: true,
                canDownload: false,
            },
        ]
    }
}

const getGroupsPhoto = (uuid: string) => {
    if (!uuid) {
        setDefaultImg()
        return
    }
    if (props.sourceType === 'private') {
        listGroupResource({ groupUuid: uuid }).then((res: any) => {
            if (res.code == '0') {
                if (res.data && res.data.length > 0) {
                    res.data.forEach((item: any) => {
                        getPhoto(item)
                    })
                } else {
                    setDefaultImg()
                }
            }
        })
    } else {
        queryPublicGroupFileList({ groupUuid: uuid }).then((res: any) => {
            if (res.code == '0') {
                if (res.data && res.data.length > 0) {
                    fileList.value = res.data.map((ele: any) => {
                        return {
                            url: state.baseURL + '/biz-common/public-file-preview?resourceUuid=' + ele.uuid,
                            status: 'done',
                            isImage: true,
                            canDownload: false,
                            ...ele,
                        }
                    })
                    console.log(fileList)
                } else {
                    setDefaultImg()
                }
            }
        })
    }
}

const getPhoto = (file: any) => {
    getPrivatePhoto(file.uuid).then((res) => {
        if (!res || !res.data) {
            return
        }

        fileList.value.push({
            name: file.title + file.fileExtension,
            uuid: file.uuid,
            url: res.data,
            status: 'done',
            isImage: true,
            canDownload: false,
        })
    })
}

watch(
    () => props.groupUuid,
    (val: any) => {
        getGroupsPhoto(val)
    },
    {
        immediate: true,
    },
)

defineExpose({
    fileList: computed(() => fileList.value),
})
</script>

<style lang="scss" scoped></style>
