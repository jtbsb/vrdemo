import ZQAxios from "./axios"
import { ResultEnum, ContentTypeEnum } from "./config/httpEnum"
import configLocation from "@/config"
const Http = new ZQAxios({
  baseURL: configLocation.itemBaseURL,
  timeout: ResultEnum.TIMEOUT as number,
  headers: {
    "Content-Type": ContentTypeEnum.JSON
    // "Access-Control-Allow-Origin": "*"
  }
  // withCredentials: true
})
export { Http }
