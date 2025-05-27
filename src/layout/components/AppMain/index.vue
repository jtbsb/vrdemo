<template>
  <section class="app-main" :style="{ height: height }">
    <router-view>
      <template #default="{ Component, route }">
        <component :is="Component" :key="route.path" />
      </template>
    </router-view>
  </section>
</template>

<script setup lang="ts">
import variables from "@/styles/variables.module.scss"
import { useAppStore } from "@/stores"

const appStore = useAppStore()
const height = computed(() => {
  return appStore.showLayout ? `calc(100vh - ${variables["navbar-height"]} - 4px)` : "100%"
})
</script>

<style lang="scss" scoped>
.app-main {
  position: relative;
  background-color: var(--el-bg-color-page);
  overflow-y: auto;
}
</style>
