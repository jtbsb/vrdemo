import type { RouteRecordRaw } from "vue-router"
import { constantRoutesOther } from "@/router"
import store from "@/stores"
// 直接导入Layout组件，避免懒加载
import router from "@/router"
import { defineStore } from "pinia"
import { queryUserMenuList } from "@/api/manage"
import { filterRouterTree, filterAsyncRoutes } from "@/utils/routerUtils"

export const usePermissionStore = defineStore(
  "permission",
  () => {
    /** 所有路由，包括静态和动态路由 */
    const routes = ref<RouteRecordRaw[]>([])
    //按钮权限
    const btnAuthArr = ref<string[]>([])
    //菜单权限
    const menuAuthArr = ref<any[]>([])
    const menuAuthIds = ref<string[]>([])
    /** 混合模式左侧菜单 */
    const mixLeftMenus = ref<RouteRecordRaw[]>([])

    const isRoutesLoaded = ref(false)

    /**
     * 生成动态路由
     */
    function generateRoutes() {
      return new Promise<RouteRecordRaw[]>((resolve, reject) => {
        queryUserMenuList()
          .then((res: any) => {
            btnAuthArr.value = res?.data?.checkedFunctionList || []
            menuAuthArr.value = res?.data?.menuRespList || []
            menuAuthIds.value = menuAuthArr.value.map((item) => item.menuId)
            // 比对过滤菜单
            routes.value = filterAsyncRoutes(
              filterRouterTree(constantRoutesOther, menuAuthIds, btnAuthArr)
            )
            resolve(routes.value)
          })
          .catch((error) => {
            reject(error)
          })
          .finally(() => {
            isRoutesLoaded.value = true
          })
      })
    }

    /**
     * 混合模式菜单下根据顶部菜单路径设置左侧菜单
     *
     * @param topMenuPath - 顶部菜单路径
     */
    const setMixLeftMenus = (topMenuPath: string) => {
      const matchedItem = routes.value.find((item) => item.path === topMenuPath)
      if (matchedItem && matchedItem.children) {
        mixLeftMenus.value = matchedItem.children
      }
    }

    /**
     * 重置路由
     */
    const resetRouter = () => {
      // 删除动态路由，保留静态路由
      routes.value.forEach((route) => {
        if (route.name && !constantRoutesOther.find((r) => r.name === route.name)) {
          router.removeRoute(route.name) // 从 router 实例中移除动态路由
        }
      })

      routes.value = []
      mixLeftMenus.value = []
      isRoutesLoaded.value = false
    }
    // 设置按钮权限
    function setBtnAuthArr(arr) {
      btnAuthArr.value = arr
    }

    return {
      routes,
      generateRoutes,
      mixLeftMenus,
      setMixLeftMenus,
      isRoutesLoaded,
      resetRouter,
      btnAuthArr,
      setBtnAuthArr
    }
  },
  {
    persist: {
      storage: localStorage, // 可以是 localStorage, sessionStorage 或 window.localStorage
      pick: ["routes"], // 数据持久化数组
      key: "usePermissionStore" // 状态的键名
    }
  }
)

/**
 * 在组件外使用 Pinia store 实例
 * @see https://pinia.vuejs.org/core-concepts/outside-component-usage.html
 */
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
