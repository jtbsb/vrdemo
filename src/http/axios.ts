/* eslint-disable */
import axios, { AxiosRequestConfig, Axios, AxiosResponse, AxiosError } from "axios"

import { HandlingInterface, setUpConfig } from "./config/utils"
import { RequestOptions, Result } from "./config/type"
import { useUserStore } from "@/stores"
import { ElMessage } from "element-plus"

export default class ZQAxios {
  private instance: Axios // axios
  private option: RequestOptions = {} // axios 配置项
  private reqList: string[] = [] // 全部请求列表
  constructor(config: AxiosRequestConfig) {
    // 创建一个axios
    this.instance = axios.create(config)
    this.interceptors()
  }
  get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<Result<T>> {
    return this.Request({ ...config, method: "GET" }, options)
  }

  post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<Result<T>> {
    return this.Request({ ...config, method: "POST" }, options)
  }

  put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<Result<T>> {
    return this.Request({ ...config, method: "PUT" }, options)
  }

  delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<Result<T>> {
    return this.Request({ ...config, method: "DELETE" }, options)
  }

  // 将定义的配置类型传ResponseResult传过去
  public async Request<T>(config: AxiosRequestConfig, options: RequestOptions = {}) {
    return new Promise((resolve, reject) => {
      this.option = options
      // 处理接口，判断是否需要拼接参数，是否添加时间戳
      const ret = HandlingInterface(config, options)
      this.instance
        .request(ret)
        .then((res: AxiosResponse) => {
          try {
            if(res?.config?.responseType === "blob"){
              res && resolve(res)
            }else{
              res && resolve(res.data)
            }
          } catch (err) {
            reject(err || new Error("request error!"))
          }
          return
        })
        .catch((e: Error | AxiosError) => {
          // console.log(e)
          reject(e)
        })
    }) as Promise<Result<T>>
  }
  /**
   * 阻止重复请求 注意选配了时间戳可能导致url每毫秒都不一样所以无法中断请求
   * @param {Array} reqList - 当前请求列表
   * @param {string} url - 当前请求地址
   * @param {function} cancel - 请求中断函数
   * @param {string} errorMessage - 请求中断是需提示的错误信息
   */
  private handleStopRepeatRequest = (
    reqList: string[],
    url: string,
    cancel: Function,
    errorMessage: string = ""
  ): void => {
    for (let i = 0; i < reqList.length; i++) {
      if (reqList[i] === url && !this.option.preventDuplication) {
        ElMessage({
          message: "正在请求中，请不要重复请求！",
          type: "warning"
        })
        cancel(errorMessage)
        return
      }
    }
    reqList.push(url)
  }
  /**
   * 允许某个请求可以继续进行
   * @param {array} reqList 全部请求列表
   * @param {string} url 请求地址
   */
  private handleAllowRequest = (reqList: string[], url: string): void => {
    const { setupRequestRecord } = useUserStore()
    for (let i = 0; i < reqList.length; i++) {
      if (reqList[i] === url) {
        // 删除当前请求
        reqList.splice(i, 1)
        setupRequestRecord(null, url, "remove")
        break
      }
    }
  }

  private interceptors() {
    // 挂载拦截器
    this.interceptorsRequest()
    this.interceptorsResponse()
  }
  // 添加请求拦截器
  private interceptorsRequest() {
    let cancel: Function // 定义标识符可以中断请求
    this.instance.interceptors.request.use(
      (config: any) => {
        const { setupRequestRecord } = useUserStore()
        config.cancelToken = new axios.CancelToken((c) => {
          cancel = c
          // 将请求记录存起来
          setupRequestRecord(cancel, config.url, "add")
        })
        // // 阻止重复请求
        // this.handleStopRepeatRequest(
        //   this.reqList,
        //   config.url,
        //   cancel,
        //   `${config.url} 正在请求中，请不要重复请求！`
        // )
        // 请求前根据option修改config
        config = { ...setUpConfig(config, this.option) }
        return config
      },
      (error) => {
        // 对请求错误做些什么
        return Promise.reject(error)
      }
    )
  }

  // 添加响应拦截器
  private interceptorsResponse() {
    this.instance.interceptors.response.use(
      (res: AxiosResponse<any>) => {
        this.handleAllowRequest(this.reqList, res?.config?.url ? res?.config?.url : "")
        if(res?.config?.responseType === "blob"){
          return res
        }
        const code = res.data.code || 500
        const msg = res.data.message || res.data.msg || "服务器错误,请联系管理员!"
        // 处理token
        if (res.headers.authorization) {
          const userStore = useUserStore()
          userStore.token = res.headers.authorization
        }
        // 如果登录过期 走这个逻辑
        if (code === "200001") {
          if(window.location.pathname === "/timidLogin"){
            // timid登录失效
            ElMessage({
              message: msg,
              type: "error"
            })
            // return Promise.reject(res.data)
          }else{
            // 登录失效
            localStorage.clear()
            sessionStorage.clear()
            location.reload()
          }
        } else if (code === "200017") {
          ElMessageBox.confirm("您当前登录的账号暂无权限，请您配置权限后再登录。", "提示", {
            confirmButtonText: "确定",
            type: "warning",
            showCancelButton: false,
            lockScroll: false
          })
        } else if (code === "210001") {
          ElMessage.warning(msg)
          return Promise.reject(res.data)
        } else if (code != 200) {
          ElMessage({
            message: msg,
            type: "error"
          })
          return Promise.reject(res.data)
        }

        return res
      },
      (error) => {
        this.handleAllowRequest(this.reqList, error.config?.url)
        error.config && (error.config.__retryCount = error.config?.__retryCount || 0) // 重启机制仅get支持重启
        error.config && (error.config.__retryCount += 1)
        if (error.config?.__retryCount > 2) {
          return Promise.reject(error)
        } else if (error.config?.method === "get") {
          return new Promise(function (resolve) {
            return setTimeout(function () {
              // error.config 失败接口的请求配置
              return resolve(axios(error.config))
            }, 2000)
          })
        } else {
          return Promise.reject(error)
        }
      }
    )
  }
}
