/**
 * @description: 接口传入参数类型
 */
export interface GetDataQueryType {
  pageIndex?: number
  pageSize?: number
  name?: string
  token?: string
  roleId?: string
  description?: string
  enableStatus?: string | number
  headquarters?: string | number
  dataPermissionsType?: string | number
  sourceRoleId?: string | number
  targetRoleId?: string | number
}
