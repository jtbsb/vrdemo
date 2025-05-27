import { Http } from "@/http"
import configLocation from "@/config"

enum Api {
  GetRoleList = "/management-web/role/pageQueryRole",
  AddRole = "/management-web/role/addRole",
  EditRole = "/management-web/role/updateRole",
  EditRoleStatus = "/management-web/role/updateRoleStatus",
  DelRole = "/management-web/role/delRole",
  EditRoleDataPermission = "/management-web/role/data/allotDataPermit",
  GetCopyRoleList = "/management-web/role/pageQueryCanCopyRole",
  SetCopyRole = "/management-web/role/function/copyRoleFunction",
  GetAuthorityList = "/management-web/role/function/queryRoleMenuTree",
  SetAuthority = "/management-web/role/function/allotRoleFunction"
}
/**
 * @description: 获取角色列表
 */
export const getRoleList = <T>(data: T): any => {
  return Http.post(
    {
      url: Api.GetRoleList,
      data
    },
    {
      apiUrl: configLocation.roleBaseURL
    }
  )
}
/**
 * @description: 添加角色
 */
export const addRole = <T>(data: T): any => {
  return Http.post(
    {
      url: Api.AddRole,
      data
    },
    {
      apiUrl: configLocation.roleBaseURL
    }
  )
}
/**
 * @description: 修改角色
 */
export const editRole = <T>(data: T): any => {
  return Http.post(
    {
      url: Api.EditRole,
      data
    },
    {
      apiUrl: configLocation.roleBaseURL
    }
  )
}
/**
 * @description: 修改角色状态
 */
export const editRoleStatus = <T>(data: T): any => {
  return Http.post(
    {
      url: Api.EditRoleStatus,
      data
    },
    {
      apiUrl: configLocation.roleBaseURL
    }
  )
}
/**
 * @description: 删除角色
 */
export const delRole = <T>(data: T): any => {
  return Http.post(
    {
      url: Api.DelRole,
      data
    },
    {
      apiUrl: configLocation.roleBaseURL
    }
  )
}
/**
 * @description: 修改角色数据权限
 */
export const editRoleDataPermission = <T>(data: T): any => {
  return Http.post(
    {
      url: Api.EditRoleDataPermission,
      data
    },
    {
      apiUrl: configLocation.roleBaseURL
    }
  )
}
/**
 * @description: 获取复制权限角色列表
 */
export const getCopyRoleList = <T>(data: T): any => {
  return Http.post(
    {
      url: Api.GetCopyRoleList,
      data
    },
    {
      apiUrl: configLocation.roleBaseURL
    }
  )
}
/**
 * @description: 复制角色权限
 */
export const setCopyRole = <T>(data: T): any => {
  return Http.post(
    {
      url: Api.SetCopyRole,
      data
    },
    {
      apiUrl: configLocation.roleBaseURL
    }
  )
}
/**
 * @description: 获取权限列表
 */
export const getAuthorityList = <T>(data: T): any => {
  return Http.get(
    {
      url: Api.GetAuthorityList,
      data
    },
    {
      apiUrl: configLocation.roleBaseURL
    }
  )
}
/**
 * @description: 设置权限
 */
export const setAuthority = <T>(data: T): any => {
  return Http.post(
    {
      url: Api.SetAuthority,
      data
    },
    {
      apiUrl: configLocation.roleBaseURL
    }
  )
}
