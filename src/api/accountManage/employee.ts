import { Http } from "@/http"
import configLocation from "@/config"

enum Api {
  GetAccountList = "/management-web/user/pageQueryUserInfo",
  AssignRoles = "/management-web/user/role/allotUserRole"
}
/**
 * @description: 获取员工列表
 */
export const getAccountList = <T>(data: T): any => {
  return Http.post(
    {
      url: Api.GetAccountList,
      data
    },
    {
      apiUrl: configLocation.roleBaseURL
    }
  )
}
/**
 * @description: 给人员分配角色
 */
export const assignRoles = <T>(data: T): any => {
  return Http.post(
    {
      url: Api.AssignRoles,
      data
    },
    {
      apiUrl: configLocation.roleBaseURL
    }
  )
}

/**
 * 用户获取用户信息
 * /management-web/user/queryUserInfo
 */
export const getUserInfo = () => {
  return Http.get(
    {
      url: "/management-web/user/queryUserInfo"
    },
    {
      apiUrl: configLocation.roleBaseURL
    }
  )
}
