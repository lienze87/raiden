<template>
  <h3 :id="title" class="doc-title">
    <span>{{ title }}</span>
    <a class="header-anchor" :href="`#${title}`" aria-hidden="true">#</a>
  </h3>
  <slot />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Anchor',
  components: {},
  props: {
    title: {
      type: String,
    },
  },
  setup(props: any) {
    let title = ref(props.title || '')

    return { title }
  },
})
</script>

<style lang="scss" scoped>
.doc-title {
  position: relative;
  display: flex;
  align-items: center;
  opacity: 0;
  margin: 0;

  .header-anchor {
    position: absolute;
    margin-top: 0.125em;
    margin-left: -0.87em;
    padding-right: 0.23em;
    font-size: 0.85em;
    opacity: 0;
  }
}
.doc-title:hover {
  .header-anchor {
    opacity: 1;
  }
}
</style>
