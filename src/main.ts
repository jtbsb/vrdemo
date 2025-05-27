import { createApp } from "vue"
import store from "./stores"

import App from "./App.vue"
import router from "./router"
import "./styles/common.scss"
import "./styles/reset.scss"
import globalUtils from "@/utils/global"
import globalComponents from "@/components"
import { setupPermission } from "@/utils/permission"
import "virtual:svg-icons-register"
import directives from "@/directives"
import "wow.js/css/libs/animate.css"

const app = createApp(App)
// 批量注册自定义指令
Object.keys(directives).forEach((directiveName) => {
  app.directive(directiveName, directives[directiveName])
})

// 注册全局工具方法
app.use(globalUtils)
app.use(globalComponents)
app.use(store)
app.use(router)
// 路由守卫
setupPermission()

app.mount("#app")
