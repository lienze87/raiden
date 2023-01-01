<template>
  <div id="root"></div>
</template>

<script setup>
  import { onMounted } from "vue";
  import { Layer, CANVAS_WIDTH, CANVAS_HEIGHT } from "./components/layer";
  import ImgUrl from "./assets/background.jpg";

  let ctx = null;

  const backgroundImg = new Image();
  backgroundImg.src = ImgUrl;

  function initCanvas() {
    const root = document.getElementById("app");

    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    root.appendChild(canvas);

    ctx = canvas.getContext("2d");
  }

  onMounted(() => {
    initCanvas();
    const layer1 = new Layer(ctx, backgroundImg, 1);

    function animate() {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      layer1.update();
      layer1.draw();
      requestAnimationFrame(animate);
    }
    animate();
  });
</script>

<style scoped>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
  }
</style>
