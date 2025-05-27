<template>
  <div class="wh-full layout-left" :class="classObj">
    <!-- 公用侧边栏 -->
    <Sidebar class="sidebar-container" v-if="appStore.showLayout" />
    <!-- 左侧和顶部布局 -->
    <div :class="['main-container', { 'no-layout-container': !appStore.showLayout }]">
      <NavBar v-if="appStore.showLayout" />
      <AppMain />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores"

const appStore = useAppStore()
// 设置左侧菜单展开收起
const classObj = computed(() => ({
  hideSidebar: !appStore.sidebar.opened,
  openSidebar: appStore.sidebar.opened
}))
</script>

<style lang="scss" scoped>
.wh-full {
  width: 100%;
  height: 100%;
}
.sidebar-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  width: $sidebar-width;
  transition: width 0.28s;
  // background-image: $menu-background;
  background-color: #3c444d;
  // opacity: 0.65;
  box-shadow: 2px 0 6px 0 #00152959;
  :deep(.el-menu) {
    border: none;
  }
}
.main-container {
  position: relative;
  height: 100%;
  margin-left: $sidebar-width;
  overflow-y: auto;
  transition: margin-left 0.28s;
}
.no-layout-container {
  margin-left: 0;
}
.hideSidebar {
  .main-container {
    margin-left: $sidebar-width-collapsed;
  }
}
.layout-left.hideSidebar {
  .sidebar-container {
    width: $sidebar-width-collapsed !important;
  }
  .main-container {
    margin-left: $sidebar-width-collapsed;
  }
}
</style>
