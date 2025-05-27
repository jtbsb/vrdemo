import { createPinia } from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate) // 数据持久化

export * from "./modules/user"
export * from "./modules/app"
export * from "./modules/permission"
export default pinia
