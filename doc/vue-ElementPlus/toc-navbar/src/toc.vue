<template>
  <div ref="container" class="toc-wrapper" :key="uid">
    <nav class="toc-content">
      <h3 class="toc-content__heading">导航栏</h3>
      <ul class="toc-items">
        <li v-for="{ link, text, children } in headers" :key="link" class="toc-item">
          <a class="toc-link" :data-href="link" :href="link" :title="text" @click.stop.prevent="handleClick(link)">
            {{ text }}
          </a>
          <ul v-if="children">
            <li v-for="{ link: childLink, text: childText } in children" :key="childLink" class="toc-item">
              <a class="toc-link subitem" :href="link" :title="text" @click.stop.prevent="handleClick(link)">
                {{ childText }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
      <div ref="marker" class="toc-marker" />
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Toc',
})
</script>

<script setup lang="ts">
import { watch, ref, defineProps, PropType } from 'vue'
import { useActiveSidebarLinks } from './active-bar'

type HeadersLink = {
  link: string
  text: string
  children?: Array<HeadersLink>
}

const props = defineProps({
  data: {
    type: Object as PropType<HeadersLink[]>,
    default: () => [],
  },
})

let uid = ref(1)

watch(
  () => props.data,
  (newMenu: any) => {
    uid.value++
    headers.value = newMenu
  },
)

const headers = ref<HeadersLink[]>(props.data)

const marker = ref()
const container = ref()
useActiveSidebarLinks(container, marker)

const handleClick = (id: string) => {
  const ele = document.querySelector(id)
  if (ele) {
    scrollToElement(ele)
  }
}

const scrollToElement = (ele: Element) => {
  const headerOffset = (document.querySelector('.fixed-header') as HTMLElement)?.offsetHeight || 0
  const stickyOffset = (document.querySelector('.sticky') as HTMLElement)?.offsetHeight || 0
  const y = ele.getBoundingClientRect().top + window.scrollY - headerOffset - stickyOffset
  window.scrollTo({ top: y, behavior: 'smooth' })
}
</script>

<style scoped lang="scss"></style>
