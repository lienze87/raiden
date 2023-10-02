<template>
  <div class="white-board">
    <div class="action-bar">
      <el-button type="primary" @click="handlePreview">预览</el-button>
      <el-button type="danger" @click="handleReset">重置</el-button>
      <el-button type="primary" @click="handleSampling">采样</el-button>
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
let sampler: any = null
let sampleArr = <any[]>[]

onMounted(() => {
  if (myWhiteBoard.value) {
    // Fill Window Width and Height
    myCanvas.width = myWhiteBoard.value.clientWidth || 500
    myCanvas.height = myWhiteBoard.value.clientHeight || 200
    sampler = poissonDiscSampler(myCanvas.width, myCanvas.height, 20)
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

const handleSampling = () => {
  let s = sampler()
  while (s) {
    sampleArr.push(s)
    if (s) {
      drawCircle(s[0], s[1])
    }
    s = sampler()
  }

  console.log(sampleArr)
}

const drawCircle = (x: number, y: number, color: string = '#000') => {
  if (ctx) {
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }
}

function poissonDiscSampler(width: number, height: number, radius: number) {
  const key = 30
  const cellSize = radius * Math.SQRT1_2
  const gridWidthLength = Math.ceil(width / cellSize)
  const gridHeightLength = Math.ceil(height / cellSize)
  let grid = new Array(gridWidthLength * gridHeightLength)
  let queue = <any[]>[]
  let queueLength = 0
  let sampleLength = 0

  const far = (x: number, y: number) => {
    let i = (x / cellSize) | 0,
      j = (y / cellSize) | 0
    // 获取对角线长度为radius的单元格
    const i0 = Math.max(i - 2, 0),
      j0 = Math.max(j - 2, 0),
      i1 = Math.min(i + 3, gridWidthLength),
      j1 = Math.min(j + 3, gridHeightLength)

    for (j = j0; j < j1; ++j) {
      for (i = i0; i < i1; ++i) {
        const s = grid[j * gridWidthLength + i]
        if (s) {
          const dx = s[0] - x,
            dy = s[1] - y
          if (dx * dx + dy * dy < radius * radius) {
            return false
          }
        }
      }
    }
    return true
  }

  const sample = (x: number, y: number) => {
    const s = [x, y]
    queue.push(s)
    grid[gridWidthLength * ((y / cellSize) | 0) + ((x / cellSize) | 0)] = s
    ++sampleLength
    ++queueLength
    return s
  }

  return function () {
    if (!sampleLength) {
      return sample(Math.random() * width, Math.random() * height)
    }

    while (queueLength) {
      const i = (Math.random() * queueLength) | 0,
        s = queue[i]

      for (let j = 0; j < key; ++j) {
        const a = 2 * Math.PI * Math.random(),
          r = radius * (Math.random() + 1),
          x = s[0] + r * Math.cos(a),
          y = s[1] + r * Math.sin(a)
        //drawCircle(x, y, '#d2d')
        if (0 <= x && x < width && 0 <= y && y < height && far(x, y)) {
          return sample(x, y)
        }
      }

      queue[i] = queue[--queueLength]
      queue.length = queueLength
    }
  }
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
