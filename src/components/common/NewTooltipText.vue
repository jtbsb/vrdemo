<template>
  <el-tooltip
    effect="dark"
    :placement="placement"
    :enterable="true"
    :show-after="200"
    :offset="10"
    :popper-class="props.textTooltipPopperClass"
    :content="props.content"
    :disabled="disabledTooltip"
  >
    <slot :mouseoverSelf="handleHover"></slot>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { ref } from "vue"

const props = defineProps({
  content: {
    type: String,
    default: ""
  },
  line: {
    type: Number,
    default: 1
  },
  textTooltipPopperClass: {
    type: String,
    default: ""
  },
  placement: {
    type: String,
    default: "top"
  }
})

function handleHover(event: MouseEvent) {
  disabledTooltip.value = !isTextEllipsis(event.target as HTMLElement)
}

function setPrecision(num, Places) {
  if (!num) {
    return 0
  }
  let backwardLead: any = "1"
  for (let i = 0; i < Places; i++) {
    backwardLead += "0"
  }
  return Math.floor(num * +backwardLead) / backwardLead
}

const getPadding = (el: HTMLElement) => {
  const style = window.getComputedStyle(el, null)
  const paddingLeft = Number.parseInt(style.paddingLeft, 10) || 0
  const paddingRight = Number.parseInt(style.paddingRight, 10) || 0
  const paddingTop = Number.parseInt(style.paddingTop, 10) || 0
  const paddingBottom = Number.parseInt(style.paddingBottom, 10) || 0
  return {
    left: paddingLeft,
    right: paddingRight,
    top: paddingTop,
    bottom: paddingBottom
  }
}

const isTextEllipsis = (el: HTMLElement) => {
  const range = document.createRange()
  range.setStart(el, 0)
  range.setEnd(el, el.childNodes.length)
  let rangeWidth = range.getBoundingClientRect().width
  let rangeHeight = range.getBoundingClientRect().height
  const offsetWidth = rangeWidth - Math.floor(rangeWidth)
  const { width: cellChildWidth, height: cellChildHeight } = el.getBoundingClientRect()
  if (offsetWidth < 0.001) {
    rangeWidth = Math.floor(rangeWidth)
  }
  const offsetHeight = rangeHeight - Math.floor(rangeHeight)
  if (offsetHeight < 0.001) {
    rangeHeight = Math.floor(rangeHeight)
  }
  const { top, left, right, bottom } = getPadding(el)
  const horizontalPadding = left + right
  const verticalPadding = top + bottom
  if (props.line === 1) {
    // 单行省略判断
    return (
      setPrecision(rangeWidth + horizontalPadding, 2) > setPrecision(cellChildWidth, 2) ||
      rangeHeight + verticalPadding > cellChildHeight ||
      el.scrollWidth > el.clientWidth
    )
  } else {
    // 多行省略判断
    return el.scrollHeight > el.clientHeight
  }
}
const disabledTooltip = ref(true)
</script>
