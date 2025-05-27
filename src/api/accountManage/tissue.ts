import { Http } from "@/http"
import configLocation from "@/config"

enum Api {
  GetTissueTree = "/management-web/department/queryOrgTree"
}
/**
 * @description: 获取组织树
 */
export const getTissueTree = (): any => {
  return Http.post(
    {
      url: Api.GetTissueTree
    },
    {
      apiUrl: configLocation.roleBaseURL
    }
  )
}
