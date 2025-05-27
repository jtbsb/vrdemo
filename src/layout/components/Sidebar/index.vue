<template>
  <div>
    <!-- 左侧和顶部布局的Sidebar -->
    <SidebarLogo :collapse="!appStore.sidebar.opened" />
    <el-scrollbar>
      <SidebarMenu :menu-list="menuFilterList" base-path="" />
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { usePermissionStore, useAppStore } from "@/stores"

const appStore = useAppStore()
const permissionStore = usePermissionStore()
let menuFilterList = ref([]) as any
onMounted(async () => {
  menuFilterList.value = permissionStore.routes
})
</script>

<style lang="scss" scoped>
.el-scrollbar {
  height: calc(100vh - $navbar-height - 30px);
}
</style>
