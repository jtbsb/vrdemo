<template>
  <div class="navbar-container">
    <!-- 导航栏右侧 -->
    <NavbarAction />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.navbar-container {
  display: flex;
  align-items: center;
  justify-content: end;
  margin-bottom: 4px;
  box-sizing: border-box;
  height: $navbar-height;
  background: var(--el-bg-color);
  box-shadow: 0 1px 4px 0 rgba(0, 21, 41, 0.12);
}
.flex {
  display: flex;
}
</style>
