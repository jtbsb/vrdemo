import { App, Directive } from "vue"

// 防抖指令
export const debounce: Directive = {
  mounted(el: HTMLElement, binding) {
    if (!validateBinding(binding, "debounce")) return

    let timer: number | null = null
    const eventType = binding.arg || "click"
    const delay = binding.value.time || 300
    const handler = binding.value.handler
    const args = binding.value.args || [] // 参数数组

    const listener = () => {
      if (timer) clearTimeout(timer)
      timer = window.setTimeout(() => {
        handler(...args) // 执行方法并传递参数
      }, delay)
    }

    el.addEventListener(eventType, listener)
    ;(el as any).__debounce_listener__ = listener // 保存监听器以便卸载时移除
  },
  unmounted(el: HTMLElement) {
    removeListener(el, "__debounce_listener__", "debounce")
  }
}

// 节流指令
export const throttle: Directive = {
  mounted(el: HTMLElement, binding) {
    if (!validateBinding(binding, "throttle")) return

    let lastTime = 0
    const eventType = binding.arg || "click"
    const delay = binding.value.time || 300
    const handler = binding.value.handler
    const args = binding.value.args || [] // 参数数组

    const listener = () => {
      const now = Date.now()
      if (now - lastTime >= delay) {
        handler(...args) // 执行方法并传递参数
        lastTime = now
      }
    }

    el.addEventListener(eventType, listener)
    ;(el as any).__throttle_listener__ = listener // 保存监听器以便卸载时移除
  },
  unmounted(el: HTMLElement) {
    removeListener(el, "__throttle_listener__", "throttle")
  }
}

// 校验绑定值
function validateBinding(binding: any, directiveName: string): boolean {
  if (
    !binding.value ||
    typeof binding.value.handler !== "function" ||
    (binding.value.args && !Array.isArray(binding.value.args))
  ) {
    console.warn(
      `[v-${directiveName}]: Expected an object with a "handler" function, optional "time" (number), and optional "args" (array). Example: { time: 300, handler: () => {...}, args: [arg1, arg2] }`
    )
    return false
  }
  return true
}

// 移除事件监听器
function removeListener(el: HTMLElement, listenerKey: string, directiveName: string) {
  const eventType = el.getAttribute(`v-${directiveName}-event`) || "click"
  const listener = (el as any)[listenerKey]
  if (listener) {
    el.removeEventListener(eventType, listener)
  }
}
