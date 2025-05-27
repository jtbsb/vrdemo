import { Http } from "@/http"
import configLocation from "@/config"
import { toFormData } from "@/utils/common"

/**
 * @description: 上传图片
 * @param {*} data
 */
export const uploadFile = (data: any) => {
  data.tid = localStorage.getItem("tenant_id") || ""
  return Http.post({
    url: configLocation.fileBaseURL + "/file-api/file/upload",
    data: toFormData(data),
    headers: {
      // 设置请求头
      "Content-Type": "multipart/form-data;charset=UTF-8",
      // 'Access-Control-Allow-Origin': '*'
      Accept: "*/*"
    }
  })
}
