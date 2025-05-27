// 环境判断函数
export const getEnvPrefix = () => {
  // 开发环境可以通过环境变量指定使用哪个环境的API
  if (import.meta.env.MODE === "dev") {
    // 可以根据需要返回开发环境使用的前缀，默认使用pre环境
    return import.meta.env.VITE_API_ENV || "pre-"
  }

  // 预发布环境
  if (window.location.href.indexOf("pre-") !== -1) {
    return "pre-"
  }

  // 测试环境
  if (window.location.href.indexOf("test-") !== -1) {
    return "test-"
  }

  // 生产环境，无前缀
  return ""
}

// 根据环境生成URL
const generateURL = (baseDomain: string) => {
  const prefix = getEnvPrefix()
  // 从基础域名中提取协议和域名部分
  const domainParts = baseDomain.split("//")
  return `${domainParts[0]}//${prefix}${domainParts[1]}`
}

// 生成agent服务的URL
const generateAgentURL = (serviceName: string, domain = "gboss.tech") => {
  const prefix = getEnvPrefix()
  return `${prefix ? "//" + prefix : "//"}agent-${serviceName}.${domain}`
}

// 服务基础域名配置
const domains = {
  file: "//file.gmarketing.tech",
  item: "//item.gboss.tech",
  order: "//order.gboss.tech",
  contract: "//contract.gboss.tech",
  contractConfig: "//config.gboss.tech",
  promotion: "//promotion.gboss.tech",
  serve: "//serve.gboss.tech",
  management: "//management.gboss.tech",
  financial: "//financial.gboss.tech",
  cart: "//cart.gboss.tech/",
  filePath: "//file.gmarketing.tech/file/",
  wallet: "//wallet.gboss.tech",
  invoice: "//invoice.gboss.tech",
  achievement: "//achievement.gboss.tech",
  channel: "//channel.gboss.tech"
}

export default {
  // 标准服务
  fileBaseURL: generateURL(domains.file),
  itemBaseURL: generateURL(domains.item),
  orderBaseURL: generateURL(domains.order),
  contractBaseURL: generateURL(domains.contract),
  contractConfigBaseURL: generateURL(domains.contractConfig),
  promotionBaseURL: generateURL(domains.promotion),
  serviceBaseURL: generateURL(domains.serve),
  manageBaseURL: generateURL(domains.management),
  roleBaseURL: generateURL(domains.management),
  financeBaseURL: generateURL(domains.financial),
  CartBaseURL: generateURL(domains.cart),
  filePathUrl: generateURL(domains.filePath),
  walletBaseURL: generateURL(domains.wallet),
  invoiceBaseURL: generateURL(domains.invoice),
  achievementBaseUrl: generateURL(domains.achievement),

  // Agent服务
  contractForChannelsBaseURL: generateAgentURL("contract"),
  invoiceForChannelsBaseURL: generateAgentURL("invoice"),
  itemAgentBaseURL: generateAgentURL("item"),
  contractAgentBaseURL: generateAgentURL("contract"),
  orderAgentBaseURL: generateAgentURL("order"),
  financeAgentBaseURL: generateAgentURL("financial"),
  cartAgentBaseURL: generateAgentURL("cart"),
  invoiceAgentBaseURL: generateAgentURL("invoice"),
  walletAgentBaseURL: generateAgentURL("wallet"),
  payAgentBaseURL: generateAgentURL("pay"),

  // 渠道
  channelBaseURL: generateURL(domains.channel)
}
