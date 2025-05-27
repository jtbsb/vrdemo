// 导入 Element Plus 中英文语言包
import zhCn from "element-plus/es/locale/lang/zh-cn"
import store from "@/stores"
import { SidebarStatusEnum } from "@/enums/SidebarStatusEnum"
import { computed, reactive, ref } from "vue"
import { defineStore } from "pinia"

export const useAppStore = defineStore(
  "app",
  () => {
    // 侧边栏状态
    const sidebarStatus = ref(SidebarStatusEnum.OPENED)
    const sidebar = reactive({
      opened: sidebarStatus.value === SidebarStatusEnum.OPENED,
      withoutAnimation: false
    })

    const showLayout = ref(false)
    /**
     * 根据语言标识读取对应的语言包
     */
    const locale = computed(() => {
      return zhCn
    })

    // 切换侧边栏
    function toggleSidebar() {
      sidebar.opened = !sidebar.opened
      sidebarStatus.value = sidebar.opened ? SidebarStatusEnum.OPENED : SidebarStatusEnum.CLOSED
    }

    // 关闭侧边栏
    function closeSideBar() {
      sidebar.opened = false
      sidebarStatus.value = SidebarStatusEnum.CLOSED
    }

    // 打开侧边栏
    function openSideBar() {
      sidebar.opened = true
      sidebarStatus.value = SidebarStatusEnum.OPENED
    }
    function setShowLayout(val) {
      showLayout.value = val
    }
    return {
      sidebar,
      locale,
      toggleSidebar,
      closeSideBar,
      openSideBar,
      setShowLayout,
      showLayout
    }
  },
  {
    persist: {
      storage: localStorage, // 可以是 localStorage, sessionStorage 或 window.localStorage
      pick: ["sidebarStatus"], // 数据持久化数组
      key: "useAppStore" // 状态的键名
    }
  }
)

/**
 * 用于在组件外部（如在Pinia Store 中）使用 Pinia 提供的 store 实例。
 * 官方文档解释了如何在组件外部使用 Pinia Store：
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
 */
export function useAppStoreHook() {
  return useAppStore(store)
}
