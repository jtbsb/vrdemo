<template>
  <div class="floor-plan-container">
    <div class="floor-plan">
      <img :src="floorPlanImage" alt="户型图" />
      <div
        class="location-marker"
        :style="{
          left: `${currentPosition.x}%`,
          top: `${currentPosition.y}%`
        }"
      >
        <div
          class="arrow"
          :style="{
            transform: `rotate(${-currentPosition.rotation}deg)`
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed } from "vue"
import floorPlanImage from "@/assets/huxingtu.webp"

const props = defineProps<{
  currentRoom: number
  currentRotation: number
}>()

// 户型图位置映射
const positionMap = {
  1: { x: 50, y: 50, name: "客厅" },
  2: { x: 70, y: 50, name: "厨房" },
  3: { x: 40, y: 50, name: "阳台" },
  4: { x: 50, y: 30, name: "走廊" },
  5: { x: 60, y: 20, name: "B卧室" },
  6: { x: 40, y: 20, name: "A卧室" },
  7: { x: 30, y: 20, name: "儿童房" }
}

// 计算当前位置
const currentPosition = computed(() => {
  const position = positionMap[props.currentRoom] || positionMap[1]
  return {
    x: position.x,
    y: position.y,
    rotation: props.currentRotation
  }
})
</script>

<style scoped lang="scss">
.floor-plan-container {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.floor-plan {
  position: relative;
  width: 6.2rem;
  height: 6.2rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.location-marker {
  position: absolute;
  width: 23px;
  height: 21px;
  margin-left: -12px;
  margin-top: -12px;
  .arrow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: url("@/assets/shijiao.png") no-repeat center center;
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
    transform-origin: 50% 85% 0;
  }
}
</style>
