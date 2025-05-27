import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import { accountManageBtnMap } from "./menus/accountManage"

// 导入页面组件，将动态导入改为静态导入
import LoginView from "../views/login/index.vue"
import NotFoundView from "../views/error/404.vue"
import ForbiddenView from "../views/error/403.vue"
import ServerErrorView from "../views/error/500.vue"
import Vr from "../views/vr.vue"

export const constantRoutesOther: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    redirect: "/agreementManage/index"
  },
  {
    path: "/vr",
    name: "Vr",
    component: Vr
  },
  {
    path: "/login",
    component: LoginView, // 使用静态导入替换动态导入
    name: "Login",
    meta: {
      hidden: true,
      title: "登录"
    }
  },
  {
    path: "/404",
    component: NotFoundView, // 使用静态导入替换动态导入
    name: "NoFind",
    meta: {
      hidden: true,
      title: ""
    }
  },
  {
    path: "/403",
    component: ForbiddenView, // 使用静态导入替换动态导入
    name: "NoAuth",
    meta: {
      hidden: true,
      title: ""
    }
  },
  {
    path: "/500",
    component: ServerErrorView, // 使用静态导入替换动态导入
    name: "ServerError",
    meta: {
      hidden: true,
      title: ""
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...constantRoutesOther],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const btnAuthMap = {
  ...accountManageBtnMap
}

export default router
