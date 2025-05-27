//接口返回状态
const sys = {
  errMsg217: "登录失效，请重新登录！",
  errMsg403: "抱歉，您无权访问该页面",
  errMsg404: "抱歉，您访问的页面不存在",
  errMsg405: "抱歉，您访问的页面不存在",
  errMsg408: "抱歉，您访问的页面不存在",
  errMsg500: "抱歉，服务器出错了",
  errMsg501: "抱歉，服务器出错了",
  errMsg502: "抱歉，服务器出错了",
  errMsg503: "抱歉，服务器出错了",
  errMsg504: "抱歉，服务器出错了",
  errMsg505: "抱歉，服务器出错了"
}
export const checkStatus = async (status: number, msg: string) => {
  let errMessage = ""
  switch (status) {
    case 217:
      //登录过期操作
      setMessage(sys.errMsg217)
      //跳转登录

      break
    case 400:
      errMessage = `${msg}`
      break
    case 401:
      //登录过期操作
      setMessage(sys.errMsg217)
      //跳转登录

      break
    case 403:
      errMessage = sys.errMsg403
      break
    case 404:
      errMessage = sys.errMsg404
      break
    case 405:
      errMessage = sys.errMsg405
      break
    case 408:
      errMessage = sys.errMsg408
      break
    case 500:
      errMessage = sys.errMsg500
      break
    case 501:
      errMessage = sys.errMsg501
      break
    case 502:
      errMessage = sys.errMsg502
      break
    case 503:
      errMessage = sys.errMsg503
      break
    case 504:
      errMessage = sys.errMsg504
      break
    case 505:
      errMessage = sys.errMsg505
      break
  }
  if (errMessage) {
    ElMessage({
      message: errMessage,
      type: "error"
    })
  }
}
const setMessage = (msg: string) => {
  ElMessage({
    message: msg,
    type: "error"
  })
}
