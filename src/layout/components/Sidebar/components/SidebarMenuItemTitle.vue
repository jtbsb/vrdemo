<template>
  <!-- 根据 icon 类型决定使用的不同类型的图标组件 -->
  <el-icon v-if="icon && icon.startsWith('el-icon')" class="sub-el-icon">
    <component :is="icon.replace('el-icon-', '')" />
  </el-icon>
  <svg-icon v-else-if="icon" :icon-class="icon" class="menu-svg" />
  <el-icon v-else class="sub-el-icon"><Menu /></el-icon>
  <!-- 菜单标题 -->
  <span v-if="title" class="ml-1">{{ title }}</span>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default: ""
  }
})
</script>

<style lang="scss" scoped>
.sub-el-icon {
  width: 20px !important;
  height: 20px !important;
  margin-right: 0 !important;
  color: #999fa7;
  svg {
    width: 20px;
    height: 20px;
  }
}
.el-sub-menu .svg-icon {
  width: 20px;
  height: 20px;
}
.menu-svg {
  width: 20px;
  height: 20px;
  // fill: #999fa7;
}

.hideSidebar {
  .el-sub-menu,
  .el-menu-item {
    .svg-icon,
    .sub-el-icon {
      margin-left: 20px;
    }
  }
}
.ml-1 {
  margin-left: 8px;
}
</style>
