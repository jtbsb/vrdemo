import common from "./common"
import { App } from "vue"

const globalUtils = {
  ...common
}

export default {
  install(app: App) {
    // 将工具函数挂载到全局上下文中
    app.config.globalProperties.$globalUtils = globalUtils
    // 提供到 setup 中使用
    app.provide("globalUtils", globalUtils)
  }
}
