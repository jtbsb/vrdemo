import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router"
import { getToken, setToken } from "./auth"
import router from "@/router"
import { useAppStore, useUserStore } from "@/stores"
import { getUserInfo } from "@/api/accountManage/employee"
import { clearInvalidSearchData } from "@/utils/common"

export function setupPermission() {
  // 白名单路由
  const whiteList = ["/login", "/timidLogin", "/vr"]
  const appStore = useAppStore()
  const userStore = useUserStore()

  router.beforeEach(async (to, _from, next) => {
    // 存储布局显示隐藏状态
    if (sessionStorage.getItem("workbenchHideLayout")) {
      appStore.setShowLayout(JSON.parse(sessionStorage.getItem("workbenchHideLayout") as string))
    } else {
      appStore.setShowLayout(!to?.query?.workbenchHideLayout)
    }
    // 保存token
    if (to?.query?.workbenchToken || sessionStorage.getItem("workbenchToken")) {
      setToken(
        (to?.query?.workbenchToken as string) || sessionStorage.getItem("workbenchToken") || ""
      )
      if (to?.query?.workbenchToken) {
        sessionStorage.setItem("workbenchToken", to?.query?.workbenchToken as string)
        sessionStorage.setItem(
          "workbenchHideLayout",
          JSON.stringify(!to?.query?.workbenchHideLayout)
        )
        getUserInfo().then((res) => {
          userStore.saveUserInfo(res.data)
        })
      }
    }
    const isLogin = !!getToken() // 开发测试登录页面
    if (isLogin) {
      if (to.path === "/login") {
        // 已登录，访问登录页，跳转到首页
        next({ path: "/" })
      } else {
        next()
      }
    } else {
      // 未登录，判断是否在白名单中
      if (whiteList.includes(to.path)) {
        next()
      } else {
        // 不在白名单，重定向到登录页
        redirectToLogin(to, next)
      }
    }
  })
  // 后置守卫，保证每次路由跳转结束时关闭进度条
  router.afterEach((to) => {
    if (!Array.isArray(to?.meta?.searchStorageKeys)) {
      to.meta.searchStorageKeys = [] // 统一确保是数组
    }
    clearInvalidSearchData(to)
  })
}

/** 重定向到登录页 */
function redirectToLogin(_to: RouteLocationNormalized, next: NavigationGuardNext) {
  // const params = new URLSearchParams(to.query as Record<string, string>)
  // const queryString = params.toString()
  // const redirect = queryString ? `${to.path}?${queryString}` : to.path
  localStorage.clear()
  sessionStorage.clear()
  next(`/login`)
  // next(`/login?redirect=${encodeURIComponent(redirect)}`)
}
