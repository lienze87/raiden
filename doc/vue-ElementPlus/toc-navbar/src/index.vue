<template>
  <div class="content-wrapper">
    <div class="content-container">
      <div style="position: relative; width: 100%" class="doc-content">
        <div class="doc-base-anchor">
          <slot />
        </div>
      </div>
    </div>
    <Toc :data="tocMenu" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import './style/index'
import Toc from './toc.vue'

export default defineComponent({
  name: 'TocNavbar',
  components: { Toc },
  setup(props: any) {
    let title = ref(props.title || '')

    let tocMenu = ref<any[]>([])

    onMounted(() => {
      tocMenu.value = Array.from(document.querySelectorAll('.doc-title')).map((ele) => {
        return { link: '#' + ele.id, text: ele.id }
      })
    })
    return { title, tocMenu }
  },
})
</script>

<style lang="scss" scoped></style>
