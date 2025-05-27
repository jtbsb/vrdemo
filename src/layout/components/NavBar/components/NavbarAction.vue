<template>
  <div class="flex" style="width: 100%; justify-content: space-between">
    <Hamburger :is-active="appStore.sidebar.opened" @toggle-click="toggleSideBar" />
    <div class="flex">
      <!-- 用户头像 -->
      <el-dropdown class="nav-action-item" trigger="click" popper-class="top-nav-dropdown">
        <div class="flex-center">
          <el-icon color="#8291A9" size="24px" style="margin-right: 8px"><Avatar /></el-icon>
          <span>{{ userStore.userInfo.name }}</span>
          <span class="triangle" style="margin-left: 8px; margin-right: 16px"></span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout"> 退出登录 </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup lang="ts">
import { usePermissionStore, useUserStore } from "@/stores"
import { ElMessageBox } from "element-plus"
import { logoutApi } from "@/api/manage/index"
import { useAppStore } from "@/stores"
import Hamburger from "../../Sidebar/components/Hamburger.vue"

const appStore = useAppStore()

function toggleSideBar() {
  appStore.toggleSidebar()
}

const userStore = useUserStore()
const permissionStore = usePermissionStore()
/**
 * 注销登出
 */
function logout() {
  ElMessageBox.confirm("确定退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false
  }).then(() => {
    logoutApi()
      .then(() => {
        localStorage.clear()
        sessionStorage.clear()
        permissionStore.resetRouter()
        location.reload()
      })
      .catch((err) => {
        console.log(err)
        ElMessage.error("退出失败")
      })
  })
}
</script>
<style lang="scss" scoped>
.nav-action-item {
  display: inline-block;
  min-width: 40px;
  height: $navbar-height;
  line-height: $navbar-height;
  color: var(--el-text-color);
  text-align: center;
  cursor: pointer;
}
.dark .nav-action-item:hover {
  background: rgb(255 255 255 / 20%);
}
.flex {
  display: flex;
  align-items: center;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 10px;
  margin-left: 20px;
}
.rounded-full {
  border-radius: 50%;
  margin-right: 10px;
  width: 24px;
  height: 24px;
}
.triangle {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #c5cae2;
}
.shopping-cart {
  border-right: 1px solid rgba(130, 145, 169, 0.53);
  padding: 0 24px;
  .svg-icon {
    width: 22px;
    height: 20px;
  }
}
</style>
