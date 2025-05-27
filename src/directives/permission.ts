import { btnAuthMap } from "@/router"
import { usePermissionStore } from "@/stores"
import { DirectiveBinding } from "vue"

// 定义一个 v-focus 指令
const vPermission = {
  // 当绑定元素插入到 DOM 中时
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // console.log(el, binding)
    switch (binding.arg) {
      case "btn": // 控制按钮的显示
        if (!getVisibleStatus(binding?.value) && el?.parentNode) {
          el.parentNode.removeChild(el)
        }
        break
    }
  }
}
export default vPermission
//判断当前按钮权限是否在菜单权限内
export function getVisibleStatus(key) {
  // 动态控制不需要权限控制的组件
  if (!key || key === "noAuth") return true
  // 检验按钮权限
  const permissionStore = usePermissionStore()
  return permissionStore.btnAuthArr.includes(btnAuthMap[key])
}
