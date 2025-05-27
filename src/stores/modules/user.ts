import { ref } from "vue"
import { defineStore } from "pinia"
import store, { usePermissionStoreHook } from "@/stores"
import type { UserStateRequestRecord } from "./types/user"
import { clearToken } from "@/utils/auth"

export const useUserStore = defineStore(
  "user",
  () => {
    const isSign = ref<boolean>(false)
    const token = ref<string>()
    // 保存请求的接口
    const requestRecord = ref<Array<UserStateRequestRecord>>([])

    const userInfo: any = ref({
      name: "",
      avatar: "",
      userId: "",
      mobile: "",
      email: ""
    })

    //处理请求，防止重复请求
    const setupRequestRecord = (cancel: any | null, url: string, type: string = "add") => {
      if (type === "add") {
        requestRecord.value.unshift({ url: url, fn: cancel })
        if (requestRecord.value.length > 15) requestRecord.value.pop()
      } else if (type === "cancel") {
        requestRecord.value.forEach((item) => {
          item.fn && item.fn()
        })
        requestRecord.value = []
      } else {
        requestRecord.value = requestRecord.value.filter((x) => x.url !== url)
      }
    }
    /**
     *  清理用户会话
     */
    function clearUserSession() {
      return new Promise<void>((resolve) => {
        clearToken()
        usePermissionStoreHook().resetRouter()
        resolve()
      })
    }

    function saveUserInfo(data: any) {
      if (data) {
        userInfo.value = data
      }
    }
    return {
      token,
      requestRecord,
      setupRequestRecord,
      isSign,
      userInfo,
      clearUserSession,
      saveUserInfo
    }
  },
  {
    persist: {
      storage: localStorage, // 可以是 localStorage, sessionStorage 或 window.localStorage
      pick: ["userInfo"], // 数据持久化数组
      key: "useUserStore" // 状态的键名
    }
  }
)
/**
 * 用于在组件外部（如在Pinia Store 中）使用 Pinia 提供的 store 实例。
 * 官方文档解释了如何在组件外部使用 Pinia Store：
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
 */
export function useUserStoreHook() {
  return useUserStore(store)
}
