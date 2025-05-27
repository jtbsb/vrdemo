<template>
  <div class="flex" @click="toggleClick">
    <!-- <el-icon class="hamburger" :class="{ 'is-active': isActive }"><Fold /></el-icon> -->
    <el-icon size="24" color="#000000" style="cursor: pointer" v-if="isActive"><Fold /></el-icon>
    <el-icon size="24" color="#000000" style="cursor: pointer" v-else><Expand /></el-icon>
  </div>
</template>
<script setup lang="ts">
defineProps({
  isActive: {
    required: true,
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(["toggleClick"])

function toggleClick() {
  emit("toggleClick")
}
</script>

<style scoped lang="scss">
.hamburger {
  vertical-align: middle;
  cursor: pointer;
  transform: scaleX(-1);
  color: #fff;
}

.hamburger.is-active {
  transform: scaleX(1);
}
.flex {
  padding: 0 24px;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-regular);
}
</style>
