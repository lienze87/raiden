<template>
  <div class="white-board">
    <div class="action-bar">
      <el-button type="primary" @click="handlePreview">预览</el-button>
      <el-button type="danger" @click="handleReset">重置</el-button>
      <span>请使用正楷简体字规范书写</span>
    </div>
    <div class="white-board-content" ref="myWhiteBoard"></div>
    <el-image ref="imgPreviewer" src="" :preview-src-list="[state.url]">
      <template #error>
        <span></span>
      </template>
    </el-image>
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

const state = reactive({
  url: '',
})
const myWhiteBoard = ref()
const imgPreviewer = ref()
const myCanvas: HTMLCanvasElement = document.createElement('canvas')
myCanvas.id = 'my-canvas'
let ctx: CanvasRenderingContext2D | null = null

onMounted(() => {
  if (myWhiteBoard.value) {
    // Fill Window Width and Height
    myCanvas.width = myWhiteBoard.value.clientWidth || 500
    myCanvas.height = myWhiteBoard.value.clientHeight || 200

    myWhiteBoard.value.appendChild(myCanvas)
    ctx = myCanvas.getContext('2d')
    if (ctx) {
      initHandler(myCanvas, ctx)
    }
  }
})

function initHandler(myCanvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  // Set Background Color
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, myCanvas.width, myCanvas.height)

  // Mouse Event Handlers

  let isDown = false
  let canvasX, canvasY
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
      evt.stopPropagation()
    },
    false,
  )
}

const handleReset = () => {
  if (!ctx) return
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, myCanvas.width, myCanvas.height)
}

const handlePreview = () => {
  if (!ctx) return
  // 默认png/base64
  let imgUrl = myCanvas.toDataURL()
  state.url = imgUrl
  imgPreviewer.value.clickHandler()
}

const getCanvasContent = () => {
  if (!ctx) return
  return myCanvas.toDataURL()
}

defineExpose({
  handleReset,
  getCanvasContent,
})
</script>

<style lang="scss" scoped>
.white-board {
  margin: 10px;
  width: fit-content;

  .action-bar {
    padding: 10px;
  }
  .white-board-content {
    width: 502px;
    min-height: 202px;
    border: 1px solid rgb(240, 109, 109);
    cursor: crosshair;
  }
}
</style>
