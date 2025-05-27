<template>
  <div class="app-container">
    <page-title :title="title" :has-back="hasBack" />
    <div class="app-fullscreen-scroll">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  title: String,
  hasBack: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="scss"></style>
