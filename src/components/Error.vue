<template>
  <div class="flex justify-center">
    <div class="text-center">
      <img width="350" :src="errorMap[type].url" alt="" />
      <span style="margin: 0px 0 20px 0">{{ errorMap[type].message }}</span>
      <div class="mt-20px">
        <el-button type="primary" v-if="!workbenchHideLayout" @click="btnClick">{{
          errorMap[type].buttonText
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import pageError from "@/assets/svg/404.svg"
import networkError from "@/assets/svg/500.svg"
import noPermission from "@/assets/svg/403.svg"
import { useRouter } from "vue-router"

interface ErrorMap {
  url: string
  message: string
  buttonText: string
}
const router = useRouter()
const route = useRoute()
// const appStore = useAppStore()

const workbenchHideLayout = route.query.workbenchHideLayout || ""
const errorMap: {
  [key: string]: ErrorMap
} = {
  "404": {
    url: pageError,
    message: "404",
    buttonText: "返回首页"
  },
  "500": {
    url: networkError,
    message: "500",
    buttonText: "返回首页"
  },
  "403": {
    url: noPermission,
    message: "暂无权限",
    buttonText: "返回首页"
  }
}

const props = defineProps({
  type: {
    type: String,
    default: "404"
  }
})

const emit = defineEmits(["errorClick"])

const btnClick = () => {
  router.replace("/")
  emit("errorClick", props.type)
}
</script>
<style lang="scss" scoped>
.text-center {
  width: 100vw;
  height: 100vh;
  padding-top: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}
</style>
