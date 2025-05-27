/**
 * 转换window.location.search的值变成键值对
 * @param queryString
 * @returns 键值对对象 {a:b}
 */
export function parseQueryString(queryString: string) {
  // 创建一个空对象来存储键值对
  const params = {}

  // 使用正则表达式匹配查询字符串中的键值对
  const regex = /([^&=]+)=([^&]*)/g
  let match

  // 迭代所有匹配的结果
  while ((match = regex.exec(queryString)) !== null) {
    // 提取键和值，并进行URL解码
    const key = decodeURIComponent(match[1])
    const value = decodeURIComponent(match[2].replace(/\+/g, " "))

    // 将键值对存储到对象中
    params[key] = value
  }

  return params
}

// 动态判断有没有协议头部
export function dynamicAddHttpHead(url) {
  return /^https?:\/\//g.test(url) ? url : `https://${url}`
}
