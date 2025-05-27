<!-- 左侧边菜单：包括左侧布局(left)、顶部布局(all)、混合布局(left) -->
<template>
  <el-menu
    ref="menuRef"
    popper-class="left-menu-popper"
    :default-active="activeMenu"
    :collapse="!appStore.sidebar.opened"
    background-color="transparent"
    :text-color="variables['menu-text']"
    :active-text-color="variables['menu-active-text']"
    :unique-opened="false"
    :collapse-transition="false"
    :router="true"
    mode="vertical"
    @open="handleOpen"
    @close="handleClose"
  >
    <SidebarMenuItem
      v-for="route in menuList"
      :key="route.path"
      :item="route"
      :base-path="getFullPath(route.path)"
    />
  </el-menu>
</template>

<script lang="ts" setup>
import path from "path-browserify" // 第三方库
import { useAppStore } from "@/stores" // 内部模块
import { isExternal } from "@/utils/index" // 工具函数
import variables from "@/styles/variables.module.scss" // 样式
import type { MenuInstance } from "element-plus" // 类型

// 定义组件 props
const props = defineProps({
  menuList: {
    type: Array<any>,
    required: true,
    default: () => []
  },
  basePath: {
    type: String,
    required: true
  }
})
const menuRef = ref<MenuInstance>()
const appStore = useAppStore()
const currentRoute = useRoute()
const activeMenu = computed(() => {
  return currentRoute?.meta?.activeMenu || "/"
})
/**
 * 获取完整路径
 * @param routePath 路由路径 /user
 * @returns 完整的路径
 */
function getFullPath(routePath: string) {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  return path.resolve(props.basePath, routePath) // 父路径 + 子路径
}

// 存储已打开菜单的索引
const openMenuIndexes = ref<string[]>([])

/**
 * 菜单打开时添加索引
 * @param index 当前菜单索引
 */
const handleOpen = (index: string) => {
  openMenuIndexes.value.push(index)
}

/**
 * 菜单关闭时移除索引
 * @param index 当前菜单索引
 */
const handleClose = (index: string) => {
  openMenuIndexes.value = openMenuIndexes.value.filter((item) => item !== index)
}
</script>
<style lang="scss">
.el-sub-menu {
  .svg-icon {
    width: 10px;
    height: 10px;
  }
  .el-menu-item {
    font-weight: 600;
    color: #8291a9;
  }
}
.el-sub-menu .el-sub-menu__icon-arrow {
  font-size: 14px;
  margin-top: -7px;
  margin-right: 7px;
}
.el-menu-item.is-active {
  background-color: $menu-hover;
  .svg-icon {
    fill: var(--el-color-primary);
  }
}
.el-sub-menu.is-active {
  background-color: $menu-hover;
  .el-sub-menu__title {
    .svg-icon {
      fill: var(--el-color-primary);
    }
  }
  .el-menu-item.is-active {
    &::before {
      display: none;
    }
    background-color: $menu-hover;
    .svg-icon {
      fill: #8291a9;
    }
    font-weight: 600;
    color: #fff;
  }
}
.left-menu-popper {
  display: none;
}
</style>
