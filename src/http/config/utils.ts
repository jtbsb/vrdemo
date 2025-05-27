import { AxiosRequestConfig } from "axios"
import { useUserStore } from "@/stores"
import { RequestOptions } from "./type"
import configLocation from "@/config"
import { getToken } from "@/utils/auth"

// 处理接口请求的主函数，返回 AxiosRequestConfig 类型的请求配置
export function HandlingInterface(
  config: AxiosRequestConfig, // 传入的请求配置
  options: RequestOptions // 传入的额外配置选项
): AxiosRequestConfig {
  let RequestConfig: AxiosRequestConfig = Object.assign({}, config) // 克隆传入的 config 为新的请求配置

  // 如果没有 options 直接返回克隆的配置
  if (!options) return RequestConfig

  const { joinParamsToUrl, joinTime, apiUrl } = options // 解构 options，获取 API URL、是否拼接参数到 URL 和是否加入时间戳

  // 如果提供了 apiUrl 且不为空，则替换 baseURL；否则使用默认的 sessionBaseURL
  if (apiUrl && apiUrl.length) {
    RequestConfig.baseURL = apiUrl
  } else {
    RequestConfig.baseURL = configLocation.itemBaseURL
  }

  // 如果是 GET 请求，默认将参数拼接到 URL
  // 其他请求类型则根据 joinParamsToUrl 配置决定是否拼接参数
  RequestConfig.method === "GET"
    ? joinParamsToUrlFn(config) // 如果是 GET 请求，调用 joinParamsToUrlFn 拼接参数到 URL
    : joinParamsToUrl && joinParamsToUrlFn(config) // 如果传入了 joinParamsToUrl 并且请求类型不是 GET，也调用该函数

  // 这个函数负责将参数拼接到 URL 中
  function joinParamsToUrlFn(config: AxiosRequestConfig) {
    let { url, data } = config
    if (!data) return // 如果没有参数，直接返回
    let result = ""

    // 遍历请求数据，将每个键值对编码后拼接成查询字符串
    for (const propName of Object.keys(data)) {
      const value = data[propName]
      let part = encodeURIComponent(propName) + "="

      // 如果值不是 null、空字符串或 undefined，继续拼接
      if (value !== null && value !== "" && typeof value !== "undefined") {
        if (typeof value === "object") {
          // 如果值是对象类型，继续递归拼接其子属性
          for (const key of Object.keys(value)) {
            if (value[key] !== null && value[key] !== "" && typeof value[key] !== "undefined") {
              let params = propName + "[" + key + "]"
              let subPart = encodeURIComponent(params) + "="
              result += subPart + encodeURIComponent(value[key]) + "&"
            }
          }
        } else {
          // 如果值是基本类型，直接拼接
          result += part + encodeURIComponent(value) + "&"
        }
      }
    }

    // 去掉最后一个 "&" 符号，并将拼接好的字符串加入到 URL 中
    result = result.slice(0, result.length - 1)
    RequestConfig.url = url + "?" + result
  }

  // 如果需要加入时间戳，在 URL 末尾添加时间戳参数
  joinTime && setJoinTime(config)
  function setJoinTime(config: AxiosRequestConfig) {
    let { url } = config
    let [str, urlJoin] = ["", RequestConfig.url?.split(url || "") || []]

    // 判断是否已有查询参数，如果有，直接在后面添加时间戳
    if (urlJoin.length) str = urlJoin[1].substring(0, 1) || ""
    if (str === "?") RequestConfig.url += `&_t=${new Date().getTime()}`
    if (!str) RequestConfig.url += `?_t=${new Date().getTime()}` // 如果没有查询参数，加上第一个 "?"
  }
  // 添加token
  const headers = RequestConfig.headers
  RequestConfig.headers = {
    ...headers,
    Authorization: getToken()
  }
  return RequestConfig // 返回最终处理后的请求配置
}

// 另一函数用于处理配置，主要是设置 headers 中的 token 等
export function setUpConfig(config: AxiosRequestConfig, options: RequestOptions) {
  let RequestConfig: AxiosRequestConfig = Object.assign({}, config) // 克隆传入的 config

  if (!options) return RequestConfig // 如果没有 options 直接返回克隆的配置

  const userStore = useUserStore() // 使用 Pinia Store 获取用户信息
  const { ignoreCancelToken, withToken } = options // 从 options 中获取是否忽略取消令牌和是否携带 token

  // 如果没有忽略取消令牌，处理 token
  !ignoreCancelToken && cancelUrlToken()

  // 取消请求 token 的函数
  function cancelUrlToken() {
    // 检查当前 URL 是否包含 "pre-" 或 "dev"（通常是开发环境）
    if (window.location.href.indexOf("pre-") != -1 || import.meta.env.MODE === "dev") {
      // 如果 headers 中没有 token，则从用户 store 中获取并设置
      if (RequestConfig.headers && !RequestConfig.headers["token"]) {
        // RequestConfig.headers["Authorization"] = userStore.token || ""
      }
    }
  }

  // 如果需要携带 token，将 token 添加到 headers 中
  withToken && headersToken()

  // 将用户 token 添加到 headers 中的函数
  function headersToken() {
    if (RequestConfig.headers && !RequestConfig.headers["token"]) {
      RequestConfig.headers["token"] = userStore.token || ""
    }
  }

  return RequestConfig // 返回最终配置
}
