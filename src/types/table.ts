import type { TableColumnCtx } from "element-plus"
import type { FormItemProps } from "element-plus"
import type { Component } from "vue"

export interface TableColumn<T = any> extends Omit<Partial<TableColumnCtx<T>>, "prop"> {
  prop?: string | ((row: T) => Component)
  slotName?: string
  headerType?: string
}

export interface FormItem extends Omit<Partial<FormItemProps>, "prop" | "label"> {
  type?: string
  rangeSeparator?: string
  startPlaceholder?: string
  endPlaceholder?: string
  label?: string // 表单项的标签
  width?: string // 表单项的宽度
  formType?: string // 表单类型
  defaultValue?: any // 表单项的默认值
  prop: string // 表单项的字段名，用于数据绑定
  component: string | Component // 表单项对应的组件，例如 'el-input' 或直接传入组件
  props?: Record<string, any> // 传递给组件的其他属性,
  placeholder?: string // 表单项的占位符
}
