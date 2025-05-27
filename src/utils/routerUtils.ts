import { RouteRecordRaw } from "vue-router"
// 将 import.meta.glob 的动态导入修改为预加载模式，使用 { eager: true } 选项
// 添加类型断言，确保TypeScript能识别模块类型
const modules: Record<string, { default: any }> = import.meta.glob("../views/**/**.vue", {
  eager: true
}) as Record<string, { default: any }>

// 处理router树
export function filterRouterTree(routerItem: any, menuAuth: any, buttonAuth: any) {
  const copy: any = []
  if (Array.isArray(routerItem)) {
    routerItem.forEach((item) => {
      if (menuAuth.value.includes(item?.meta?.menuId) || item?.meta?.menuId === "noPermission") {
        copy.push(JSON.parse(JSON.stringify(item)))
        copy[copy.length - 1].children = []
        copy[copy.length - 1].children = filterRouterTree(item.children, menuAuth, buttonAuth)
      }
    })
  }
  return copy
}

export function filterRouterPath(firstRouter, path = "") {
  path = firstRouter?.path
  if (firstRouter?.children[0] && !firstRouter?.children[0]?.meta?.hidden) {
    path += "/" + filterRouterPath(firstRouter?.children[0], path)
  }
  return path
}

/**
 * 递归过滤有权限的动态路由
 *
 * @param routes 接口返回所有的动态路由
 * @returns 返回用户有权限的动态路由
 */
export const filterAsyncRoutes = (routes: any) => {
  const asyncRoutes: any = []
  routes.forEach((route) => {
    const tmpRoute = { ...route } as RouteRecordRaw // 深拷贝 route 对象 避免污染
    if (tmpRoute.component) {
      const component = modules[`../views/${tmpRoute.component}.vue`]
      if (component) {
        // 使用预加载的组件的默认导出
        tmpRoute.component = component.default
      } else {
        if (tmpRoute.component) {
          // 使用预加载的404组件的默认导出
          tmpRoute.component = modules[`../views/error/404.vue`].default
        }
      }
    }
    if (tmpRoute.children) {
      tmpRoute.children = filterAsyncRoutes(route.children)
    }
    asyncRoutes.push(tmpRoute)
  })

  return asyncRoutes
}
