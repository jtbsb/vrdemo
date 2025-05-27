import { ESearchDataStorageKeys } from "@/types/common"
import { RouteLocationNormalized } from "vue-router"

export const toFormData = (params: any) => {
  const formData = new FormData()
  Object.keys(params).forEach((key) => {
    formData.append(key, params[key])
  })
  return formData
}

/**
 * 清理无效的搜索数据
 * @param to 目标路由
 */
export const clearInvalidSearchData = (to: RouteLocationNormalized) => {
  const validKeys: ESearchDataStorageKeys[] =
    (to?.meta?.searchStorageKeys as ESearchDataStorageKeys[]) || []

  Object.values(ESearchDataStorageKeys).forEach((key) => {
    if (!validKeys.includes(key as ESearchDataStorageKeys)) {
      sessionStorage.removeItem(key)
    }
  })
}

export default {}
