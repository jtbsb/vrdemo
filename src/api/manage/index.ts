import { Http } from "@/http"
import configLocation from "@/config"
const manageBaseRequest = ({ url, method, data }) => {
  return Http.Request({ url, data, method }, { apiUrl: configLocation.manageBaseURL })
}
/**
 * 企微登录
 */
export const loginApi = (data) =>
  manageBaseRequest({ url: "/management-web/user/login", method: "GET", data })
/**
 * timid登录
 */
export const loginTimidApi = (data) =>
  manageBaseRequest({ url: "/management-web/user/timid/login", method: "GET", data })

/**
 * 登录后查询用户菜单树平铺列表
 */
export const queryUserMenuList = () =>
  manageBaseRequest({ url: "/management-web/user/queryUserMenuList", method: "POST", data: {} })

/**
 * 退出登录
 */
export const logoutApi = () =>
  manageBaseRequest({ url: "/management-web/user/logout", method: "POST", data: {} })

/**
 * 临时登录
 */
export const temporaryLogin = <T>(data: T): any =>
  manageBaseRequest({ url: "/management-web/user/loginByUserName", method: "GET", data })
