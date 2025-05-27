<template>
  <!-- 如果菜单项未隐藏，显示菜单项 -->
  <template v-if="!item?.meta || !item?.meta?.hidden">
    <!-- 如果只有一个子路由或没有子路由，显示该菜单项 -->
    <template
      v-if="
        (hasOneShowingChild(item.children, item as RouteRecordRaw) &&
          (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
          !item.meta?.alwaysShow) ||
        item.meta?.onlyOneChild
      "
    >
      <el-menu-item
        v-if="onlyOneChild.meta"
        :index="resolvePath(onlyOneChild.path)"
        :class="{ 'submenu-title-noDropdown': !isNest }"
        class="showMini"
      >
        <SidebarMenuItemTitle
          :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
          v-if="!isNest"
        />
        <template #title>
          <span class="only-child-menu-text">{{ onlyOneChild.meta.title }}</span>
        </template>
        <div class="hiddenMenu" v-if="!appStore.sidebar.opened && !isNest">
          <svg-icon :icon-class="item.meta.icon" class="menu-svg" />
        </div>
      </el-menu-item>
    </template>

    <!-- 如果有多个子路由，显示父菜单项 -->
    <el-sub-menu v-else :index="resolvePath(item.path)" teleported>
      <template #title>
        <SidebarMenuItemTitle v-if="item.meta" :title="item.meta.title" :icon="item.meta.icon" />

        <el-popover
          placement="right-start"
          :width="200"
          trigger="hover"
          :offset="12"
          :show-arrow="false"
          popper-class="collapse-menu-popover-left"
        >
          <template #default>
            <div class="menu-popover-box">
              <div class="menu-popover-title">{{ item.meta?.title }}</div>
              <div
                v-for="(itemChild, index) in item.children"
                :key="index"
                v-show="!itemChild?.meta?.hidden"
                :class="[
                  'menu-popover-item',
                  { 'collapse-menu-popover-active': route.path === resolvePath(itemChild.path) }
                ]"
                @click="skipRoute(resolvePath(itemChild.path))"
              >
                <div>{{ itemChild.meta?.title }}</div>
              </div>
            </div>
          </template>
          <template #reference>
            <div class="hiddenMenu" style="left: 6px" v-if="!appStore.sidebar.opened && !isNest">
              <svg-icon :icon-class="item.meta.icon" class="menu-svg" />
            </div>
            <!-- 不要删 保留一个有效节点 ElOnlyChild-->
            <div v-else></div>
          </template>
        </el-popover>
      </template>

      <SidebarMenuItem
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
defineOptions({
  name: "SidebarMenuItem",
  inheritAttrs: false
})

import path from "path-browserify"
import { isExternal } from "@/utils/index"
import { RouteRecordRaw, useRouter } from "vue-router"
import { useAppStore } from "@/stores"
const appStore = useAppStore()

const props = defineProps({
  /**
   * 当前路由对象
   */
  item: {
    type: Object,
    required: true
  },

  /**
   * 父级完整路径
   */
  basePath: {
    type: String,
    required: true
  },

  /**
   * 是否为嵌套路由
   */
  isNest: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const route = useRoute()
const onlyOneChild = ref()

/**
 * 判断是否只有一个可见的子路由
 *
 * @param children 子路由数组
 * @param parent 父级路由对象
 * @returns 是否只有一个可见子路由
 */
function hasOneShowingChild(children: RouteRecordRaw[] = [], parent: RouteRecordRaw) {
  // 筛选出可见的子路由
  const showingChildren = children.filter((route: RouteRecordRaw) => {
    if (route.meta?.hidden) {
      return false
    } else {
      route.meta!.hidden = false
      onlyOneChild.value = route
      return true
    }
  })

  // 如果没有子路由，使用父级路由
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: "", noShowingChildren: true }
    return true
  }
  return false
}

/**
 * 解析路径，将相对路径转换为绝对路径
 *
 * @param routePath 路由路径
 * @returns 绝对路径
 */
function resolvePath(routePath: string) {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }

  // 组合父级路径和路由路径形成完整路径
  const fullPath = path.resolve(props.basePath, routePath)
  return fullPath
}

/**
 * 跳转路由
 * */
function skipRoute(data) {
  router.push(data)
}
</script>

<style lang="scss" scoped>
.hideSidebar {
  .submenu-title-noDropdown {
    position: relative;
    padding: 0 !important;

    .el-tooltip {
      padding: 0 !important;

      .sub-el-icon {
        margin-left: 19px;
      }
    }

    & > span {
      display: inline-block;
      width: 0;
      height: 0;
      overflow: hidden;
      visibility: hidden;
    }
  }

  .el-sub-menu {
    overflow: hidden;

    & > .el-sub-menu__title {
      padding: 0 !important;

      .sub-el-icon {
        margin-left: 19px;
      }
    }
  }

  .el-menu--collapse {
    width: $sidebar-width-collapsed;

    .el-sub-menu {
      & > .el-sub-menu__title {
        & > span {
          display: inline-block;
          width: 0;
          height: 0;
          overflow: hidden;
          visibility: hidden;
        }
      }
    }
  }
}
.only-child-menu-text {
  cursor: default;
}
.hideSidebar {
  .el-menu-item.submenu-title-noDropdown {
    .svg-icon,
    .sub-el-icon {
      margin-left: 0px;
    }
  }
  .logo-container {
    .wh-full {
      justify-content: center;
    }
  }
}
// 菜单小三角样式
.el-sub-menu__icon-arrow {
  opacity: 0;
  transition: opacity 2s ease;
}
.openSidebar {
  .el-sub-menu__icon-arrow {
    animation: fadeInUp 0.5s ease-in-out forwards;
  }
}
@keyframes fadeInUp {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.el-scrollbar__view > .el-menu > li > .el-sub-menu__title,
.el-scrollbar__view > .el-menu > .submenu-title-noDropdown {
  background-color: #3c444d;
  opacity: 0.65;
  height: 40px;
  padding: 0 16px !important;
  box-sizing: border-box;
  font-family: "PingFangSC-Medium";
  font-weight: 500;
  font-size: 14px;
  border-radius: 4px;
  &:hover {
    opacity: 1;
  }
}
.el-scrollbar__view > .el-menu > .submenu-title-noDropdown > .only-child-menu-text {
  margin-left: 8px;
}
.el-scrollbar__view > .el-menu > li > .el-sub-menu__title {
  padding: 0 22px !important;
}
.el-scrollbar__view > .el-menu > .submenu-title-noDropdown {
  margin: 14px 6px;
}
.el-scrollbar__view > .el-menu > .is-active > .el-sub-menu__title {
  opacity: 1;
}
.el-scrollbar__view > .el-menu > .submenu-title-noDropdown.is-active {
  opacity: 1;
  background-color: #161d26;
}
.el-menu--inline {
  padding: 4px 8px;
  background-color: #272f36;
  .el-menu-item {
    border-radius: 4px;
    height: 40px;
    opacity: 0.65;
    color: #fff;
    padding: 0 40px !important;
    margin: 2px 10px;
    &:hover {
      color: #fff;
      opacity: 1;
      background-color: #40484f;
    }
  }
  .el-menu-item.is-active {
    opacity: 1;
    background-color: #161d26 !important;
  }
}
.showMini {
  position: relative;
}
.hiddenMenu {
  width: 52px;
  height: 40px;
  // background: #161d26;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  margin: 0 auto;
  position: absolute;
  left: 0px;
  top: 0;
}
.hiddenMenu .svg-icon {
  width: 20px !important;
  height: 20px !important;
}
.is-active .hiddenMenu {
  background: #161d26;
}
.menu-popover-box {
  padding-top: 5px;
  padding-bottom: 10px;
  .menu-popover-title {
    border-bottom: 1px solid #4e4e4e;
    padding: 7px 8px;
    margin-bottom: 7px;
    font-weight: 600;
    cursor: default;
  }
  .menu-popover-item {
    padding: 7px 8px;
    margin-bottom: 4px;
    font-weight: 400;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background: #40484f;
    }
  }
  .collapse-menu-popover-active.menu-popover-item {
    background-color: var(--el-color-primary);
  }
}
.is-opened {
  background-color: #3c444d;
}
</style>
