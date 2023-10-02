<template>
    <div class="white-board">
        <div class="action-bar">
            <van-button type="primary" size="small" @click="handleSign">填写签名</van-button>
            <!-- <van-button type="primary" size="small" @click="handlePreview">预览上传内容</van-button>
            <van-button type="success" size="small" icon="replay" @click="handleRotate">旋转</van-button> -->
            <div class="white-board-preview" v-if="state.url">
                <div :style="`transform: rotate(${state.angle}deg);transition: transform 0.3s ease 0s;`">
                    <van-image :src="state.url" height="200" fit="contain" />
                </div>
            </div>
            <div class="white-board-placeholder" v-else @click="handleSign">请填写签名</div>
        </div>
        <van-popup v-model:show="state.showWhiteBoard" teleport="body" :close-on-click-overlay="false">
            <div class="white-board-vertical-container">
                <div class="vertical-action">
                    <van-button type="primary" size="small" @click="handleConfirm">确定</van-button>
                    <div class="sign-tip">请使用正楷简体字规范签名</div>
                    <van-button type="primary" size="small" @click="handleReset">重置</van-button>
                </div>
                <div class="vertical-content">
                    <div class="white-board-content" ref="myWhiteBoard"></div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'WhiteBoard',
})
</script>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue'
import { ImagePreview } from 'vant'

const emits = defineEmits(['confirm'])
const state = reactive({
    url: '',
    realUrl: '',
    showWhiteBoard: false,
    rotateDeg: 90,
    angle: 0,
    isDirty: false,
})

const myWhiteBoard = ref()
const myCanvas: HTMLCanvasElement = document.createElement('canvas')
myCanvas.id = 'my-canvas'
let ctx: CanvasRenderingContext2D | null = null

onMounted(() => {
    state.isDirty = false
})

function initHandler(myCanvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    // Set Background Color
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, myCanvas.width, myCanvas.height)

    // Mouse Event Handlers

    let isDown = false
    let canvasX = 0
    let canvasY = 0
    ctx.lineWidth = 4

    const mouseDraw = {
        mousedown: function (evt: MouseEvent) {
            isDown = true
            ctx.beginPath()
            const scrollTop = window.scrollY
            canvasX = evt.pageX - myCanvas.getBoundingClientRect().left
            canvasY = evt.pageY - myCanvas.getBoundingClientRect().top - scrollTop
            ctx.moveTo(canvasX, canvasY)
        },
        mousemove: function (evt: MouseEvent) {
            if (isDown !== false) {
                if (state.isDirty === false) {
                    state.isDirty = true
                }

                const scrollTop = window.scrollY
                canvasX = evt.pageX - myCanvas.getBoundingClientRect().left
                canvasY = evt.pageY - myCanvas.getBoundingClientRect().top - scrollTop

                ctx.lineTo(canvasX, canvasY)
                ctx.strokeStyle = '#000'
                ctx.stroke()
            }
        },
        mouseup: function (evt: MouseEvent) {
            isDown = false
            ctx.closePath()
        },
        mouseleave: function (evt: MouseEvent) {
            isDown = false
            ctx.closePath()
        },
    }

    // Mouse Events
    myCanvas.addEventListener('mousedown', mouseDraw.mousedown, false)
    myCanvas.addEventListener('mouseup', mouseDraw.mouseup, false)
    myCanvas.addEventListener('mousemove', mouseDraw.mousemove, false)
    myCanvas.addEventListener('mouseleave', mouseDraw.mouseleave, false)

    // Touch Events Handlers
    const touchDraw = {
        started: false,
        start: function (evt: TouchEvent) {
            ctx.beginPath()
            const scrollTop = window.scrollY
            canvasX = evt.touches[0].pageX - myCanvas.getBoundingClientRect().left
            canvasY = evt.touches[0].pageY - myCanvas.getBoundingClientRect().top - scrollTop

            ctx.moveTo(canvasX, canvasY)
            this.started = true
        },
        move: function (evt: TouchEvent) {
            evt.preventDefault()

            if (this.started) {
                if (state.isDirty === false) {
                    state.isDirty = true
                }
                const scrollTop = window.scrollY
                canvasX = evt.touches[0].pageX - myCanvas.getBoundingClientRect().left
                canvasY = evt.touches[0].pageY - myCanvas.getBoundingClientRect().top - scrollTop

                ctx.lineTo(canvasX, canvasY)
                ctx.strokeStyle = '#000'
                ctx.stroke()
            }
        },
        end: function (evt: TouchEvent) {
            this.started = false
        },
    }

    // Touch Events
    myCanvas.addEventListener('touchstart', touchDraw.start, false)
    myCanvas.addEventListener('touchend', touchDraw.end, false)
    myCanvas.addEventListener('touchmove', touchDraw.move, false)

    // Disable Page Move
    document.body.addEventListener(
        'touchmove',
        function (evt) {
            // evt.preventDefault()
            evt.stopPropagation()
        },
        false,
    )
}

const handleReset = () => {
    if (!ctx) return
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, myCanvas.width, myCanvas.height)
    state.isDirty = false
    emits('confirm', '')
}

const handleConfirm = () => {
    if (state.isDirty) {
        emits('confirm', getCanvasContent())
    } else {
        emits('confirm', '')
    }

    state.showWhiteBoard = false
}

const handleSign = () => {
    state.showWhiteBoard = true
    nextTick(() => {
        if (myWhiteBoard.value && !ctx) {
            // Fill Window Width and Height
            myCanvas.width = myWhiteBoard.value.clientWidth
            myCanvas.height = myWhiteBoard.value.clientHeight

            myWhiteBoard.value.appendChild(myCanvas)
            ctx = myCanvas.getContext('2d')
            if (ctx) {
                initHandler(myCanvas, ctx)
            }
        } else {
            ctx.fillRect(0, 0, myCanvas.width, myCanvas.height)
        }
    })
}

const handlePreview = () => {
    if (!ctx) return
    ImagePreview([state.realUrl])
}

const handleRotate = () => {
    state.angle += state.rotateDeg
    rotate(state.url, state.angle, (newUrl: string) => {
        state.realUrl = newUrl
        emits('confirm', newUrl)
    })
}

function rotate(srcBase64: string, degrees: number, callback: Function) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const image = new Image()

    image.onload = function () {
        canvas.width = degrees % 180 === 0 ? image.width : image.height
        canvas.height = degrees % 180 === 0 ? image.height : image.width

        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate((degrees * Math.PI) / 180)
        ctx.drawImage(image, image.width / -2, image.height / -2)

        callback(canvas.toDataURL())
    }

    image.src = srcBase64
}

const getCanvasContent = () => {
    if (!ctx) return ''

    // 默认png/base64
    let imgUrl = myCanvas.toDataURL()
    state.url = imgUrl
    return imgUrl
}

defineExpose({
    handleReset,
    getCanvasContent,
})
</script>

<style lang="less" scoped>
.white-board {
    padding: 10px 16px;
    width: calc(100% - 32px);

    .action-bar {
        width: 100%;

        .van-button {
            margin-right: 10px;
        }
        .white-board-preview {
            margin-top: 10px;
            border: 1px solid #aacb9e;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .white-board-placeholder {
            margin-top: 10px;
            border: 1px solid #aacb9e;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
            color: #969799;
        }
    }
}

.white-board-vertical-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    overflow: hidden;

    .vertical-content {
        width: 100%;
        height: 100%;
    }

    .vertical-action {
        position: absolute;
        top: 50vh;
        left: -20vw;
        display: flex;
        justify-content: space-around;
        width: 100vh;
        transform: rotate(90deg);

        .van-button {
            padding: 0 50px;
        }
        .sign-tip {
            background-color: #fff;
        }
    }

    .white-board-content {
        width: 100%;
        height: 100%;
        min-height: 202px;
        cursor: crosshair;
    }
}
</style>
