<template>
  <div class="logo-container">
    <transition enter-active-class="animate__animated animate__fadeInLeft">
      <img
        src="@/assets/images/document.png"
        alt=""
        class="title_class"
        v-if="appStore.sidebar.opened"
      />
      <svg-icon icon-class="logo" class="minititle_class" v-else />
      <!-- <img src="@/assets/title.png" alt="" class="title_class" v-if="appStore.sidebar.opened" /> -->
      <!-- <img src="@/assets/minititle.png" alt="" class="minititle_class" v-else /> -->
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/stores"

const appStore = useAppStore()

defineProps({
  collapse: {
    type: Boolean,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.logo-container {
  width: 100%;
  height: $navbar-height;
  // border-bottom: 1px solid #3C444D;
  background-color: #3c444d;
  display: flex;
  align-items: center;
  justify-content: center;
  .title_class {
    width: 232px;
    height: 58px;
  }
  .minititle_class {
    width: 48px;
    height: 29px;
  }
}
</style>
