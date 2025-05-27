<template>
  <div class="page-title_back">
    <div class="f aic" v-if="route.meta.grade == 1 || !route.meta.grade">
      <!-- <svg-icon icon-class="back" class="back-icon" v-if="hasBack" @click="router.go(-1)" /> -->
      <!--<el-icon v-if="hasBack" class="back-icon" @click="router.go(-1)"><Back /></el-icon>-->
      <el-button v-if="route.meta.showBack" style="margin-right: 12px" @click="router.go(-1)">{{
        "< 返回"
      }}</el-button>
      <span class="title">{{ title || route.meta.title }}</span>
    </div>
    <div v-else-if="route.meta.grade == 2" class="title-main">
      <span class="title-other" @click="router.go(-1)">{{ route.meta.oneTitle }}</span>
      <span class="segmentation">/</span>
      <span class="title-finally">{{ title || route.meta.title }}</span>
    </div>
    <div
      v-else-if="route.meta.grade == 3 || route.meta.grade == 4 || route.meta.grade == 5"
      class="title-main"
    >
      <el-button class="go-back-btn" @click="router.go(-1)">{{ "< 返回" }}</el-button>
      <span class="title-other" @click="router.go(-(Number(route.meta.grade) - 1))">{{
        route.meta.oneTitle
      }}</span>
      <span class="segmentation">/</span>
      <span class="title-other" @click="router.go(-(Number(route.meta.grade) - 2))">{{
        route.meta.twoTitle
      }}</span>
      <span class="segmentation">/</span>
      <span class="title-finally">{{ getThreeRouterTitle(title || route.meta.title) }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
defineProps({
  hasBack: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ""
  }
})
function getThreeRouterTitle(title) {
  const specsRoutes = ["/products/specs/create", "/productsForChannel/specs/edit"]
  return route?.query?.type === "edit" && specsRoutes.includes(route.path) ? "编辑规格" : title
}
</script>

<style scoped lang="scss">
.page-title_back {
  height: 54px;
  font-weight: 500;
  font-size: 18px;
  //border-bottom: 1px solid #d6dde6;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 32px;

  font-family: "PingFangSC-Medium";
  font-weight: 500;
  font-size: 20px;
  color: #000000d9;

  // margin-left: -24px;
  // width: calc(100% + 48px);
  // margin-bottom: 20px;

  .back-icon {
    cursor: pointer;
    margin-right: 21px;
  }
}
.shopping-cart {
  padding: 0 24px;
  .svg-icon {
    width: 22px;
    height: 20px;
  }
}
.title-main {
  display: flex;
  align-items: center;
  .go-back-btn {
    margin-right: 12px;
  }
  .title-finally {
    font-family: "PingFangSC-Regular";
    font-weight: 400;
    font-size: 14px;
    color: #000000a6;
  }
  .segmentation {
    font-family: "PingFangSC-Regular";
    font-weight: 400;
    font-size: 14px;
    color: #00000073;
    margin: 0 4px;
  }
  .title-other {
    font-family: "PingFangSC-Regular";
    font-weight: 400;
    font-size: 14px;
    color: #00000073;
    cursor: pointer;
    // 鼠标移入变色
    &:hover {
      color: #2394ff;
    }
  }
}
</style>
