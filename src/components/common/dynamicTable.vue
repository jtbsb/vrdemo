<template>
  <div class="dynamic-table">
    <PageTitle v-if="pageTitle" :has-back="hasBack" />
    <div class="dynamic-table-content">
      <!-- 卡片顶部插槽 -->
      <slot name="cardTop"></slot>
      <!-- form筛选 -->
      <div v-if="formItems && formItems.length" class="form-inline">
        <el-form
          :model="formModel"
          :inline="true"
          v-bind="formProps"
          ref="searchFormRef"
          class="dynamic-table-form"
          @submit.prevent
        >
          <el-form-item
            class="mt10 mb10"
            v-for="(item, index) in formItems"
            :key="index"
            :label="item.label + ':'"
            :label-width="showFormLabelWidth ? formProps.labelWidth : 'max-content'"
            label-position="left"
            :prop="item.prop"
          >
            <component
              :is="item.component"
              v-model.trim="formModel[item.prop]"
              v-bind="item.props"
              :placeholder="item.placeholder || item.label"
              :type="item?.type || ''"
              clearable
              :style="{ width: item.width || '232px' }"
            >
              <!-- ElCascader -->
              <template
                v-if="item.formType === 'cascader' && item?.props?.options"
                #default="{ data }"
              >
                <span>{{ data.label || data.categoryName || data.name }}</span>
              </template>
              <!-- ElSelect -->
              <template v-if="item?.props?.selectOptions">
                <el-option
                  v-for="(option, index) in item.props.selectOptions"
                  :key="index"
                  :label="option.label"
                  :value="option.value"
                />
              </template>
            </component>
          </el-form-item>
          <el-form-item :style="{ minWidth: '180px' }">
            <!-- form表单的按钮插槽 -->
            <slot name="formBtnBefore"></slot>
            <el-button type="primary" v-throttle:click="{ time: 1000, handler: fetchData }"
              >查询</el-button
            >
            <el-button v-throttle:click="{ time: 500, handler: resetForm }">重置</el-button>
            <!-- form表单的按钮插槽 -->
            <slot name="formBtn"></slot>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格、分页 -->
      <div class="table-container" v-if="columns && columns.length != 0">
        <el-divider v-if="showDivider" />
        <!-- 表格顶部插槽 -->
        <slot name="tableTop"></slot>
        <el-table
          ref="dynamicTableRef"
          v-bind="tableProps"
          v-loading="loading"
          :data="tableData"
          :stripe="false"
          :row-key="rowKey"
          style="width: 100%; margin-top: 20px"
          :max-height="maxHeight"
          :header-row-style="{ background: '#FAFAFA', height: '54px' }"
          :header-cell-style="{
            background: '#FAFAFA',
            color: '#000000',
            fontSize: '14px',
            fontWeight: '500',
            fontFamily: 'PingFangSC-Medium'
          }"
          :cell-style="{
            color: '#595959',
            fontSize: '14px',
            fontFamily: 'HelveticaNeue',
            height: '54px'
          }"
          @select="handleSelect"
          @select-all="handleSelectAll"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
          @expand-change="handleExpandChange"
        >
          <el-table-column
            v-for="column in columns"
            :key="column.label || column.type"
            v-bind="filteredColumn(column)"
            :type="column.type"
          >
            <template #default="scope">
              <div v-if="column.type == 'expand'">
                <slot name="expand" :row="scope.row" :newRow="scope.row"> </slot>
              </div>
              <div v-else-if="!column.type && column.prop && typeof column.prop === 'function'">
                <component :is="applyDirectives((column.prop as Function)(scope.row))" />
              </div>
              <div v-else-if="column.type == 'custom'">
                <slot name="custom" :row="{ ...scope.row, prop: column.prop }"> </slot>
              </div>
              <div v-else-if="column.slotName">
                <slot :name="column.slotName" :row="scope.row"> </slot>
              </div>
            </template>
            <!-- 表头 -->
            <template #header="scope">
              <slot
                name="headerSlot"
                :row="{ ...scope.row, prop: column.prop, label: column.label }"
                v-if="column.headerType == 'custom'"
              >
              </slot>
            </template>
          </el-table-column>
          <!--空插槽-->
          <template #empty>
            <slot name="empty"> </slot>
          </template>
        </el-table>
        <!-- 表格底部插槽 -->
        <slot name="tableBottom"></slot>
        <div class="paging">
          <el-pagination
            v-if="showPage"
            class="mt20 jce"
            background
            :current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            :page-sizes="pageSizes"
            :disabled="loading"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, reactive, onMounted, resolveDirective, withDirectives, isVNode } from "vue"
import type { FormProps, TableProps } from "element-plus"
import { FormItem, TableColumn } from "@/types/table"

type recordObj = Record<string, any>

// props：接收数据
const props = withDefaults(
  defineProps<{
    formItems?: FormItem[] // formItem配置
    initialData: ((params?: recordObj) => Promise<any>) | recordObj[] // 数据获取函数或者数组
    columns: TableColumn[] // table列配置
    init?: boolean // 是否需要初始化数据
    tableProps?: Partial<TableProps<recordObj>> // table本身配置
    formProps?: Partial<FormProps> // form本身配置
    showPage?: boolean // 是否需要分页
    pageSizes?: number[]
    maxHeight?: number | string
    pageTitle?: string
    loading?: boolean
    hasBack?: boolean
    stripe?: boolean
    rowKey?: string
    tableTotal?: number
    showDivider?: boolean
    showFormLabelWidth?: boolean
  }>(),
  {
    formItems: () => [],
    init: () => true, // 默认值为 true
    tableProps: () => ({}),
    formProps: () => ({}),
    showPage: () => true, // 默认值为 true
    pageSizes: () => [10, 20, 30, 50, 100], // 默认分页大小
    maxHeight: () => "max-content",
    pageTitle: () => "",
    loading: () => false,
    hasBack: () => false,
    stripe: () => true,
    rowKey: () => "id",
    tableTotal: 0,
    showDivider: () => true,
    showFormLabelWidth: () => false
  }
)

const formModelOrigin = {}
// 设置查询条件初始值
if (props.formItems) {
  props.formItems.forEach((item) => {
    formModelOrigin[item.prop] = item.defaultValue ?? ""
  })
}

// 动态生成表单 formModel
const formModel = reactive<recordObj>(JSON.parse(JSON.stringify(formModelOrigin)))

// table列表数据
const tableData = ref<any[]>([])
// 分页数据
const pagination = reactive({
  total: 0,
  pageSize: 10,
  currentPage: 1
})

// 生命周期 start
onMounted(() => {
  if (Array.isArray(props.initialData)) {
    tableData.value = props.initialData
  } else {
    if (props.init) fetchData()
  }
})
// 生命周期 end

watch(
  () => props.initialData,
  (val) => {
    if (Array.isArray(val)) {
      tableData.value = val
    }
  }
)

// watch table total
watch(
  () => props.tableTotal,
  (n) => {
    if (n || n === 0) {
      pagination.total = n
    }
  },
  {
    immediate: true
  }
)

// 事件start
function filteredColumn(column: TableColumn) {
  // 过滤掉不需要绑定的属性
  const { prop, ...filtered } = column
  if (typeof prop === "string") {
    filtered["prop"] = prop
  }
  return filtered
}

// 处理自定义指令
function applyDirectives(vnode) {
  if (!vnode) return
  // // 获取 v-permission 指令
  const permissionDirective = resolveDirective("permission")
  // // 检查传递的 props 中是否有 v-permission
  if (vnode.props && vnode.props["permission"]) {
    const permissionValue = vnode.props["permission"]
    // 删除 props 中的 'v-permission'，因为指令已经处理了
    delete vnode.props["permission"]
    // 应用指令
    return withDirectives(vnode, [
      [permissionDirective, permissionValue.value, permissionValue?.arg || "btn"]
    ])
  }
  if (vnode.children && Array.isArray(vnode.children)) {
    vnode.children.forEach((childVnode) => {
      if (isVNode(childVnode)) applyDirectives(childVnode)
    })
  }
  return vnode
}

// emits start：selection-change多选时选项变化事件
const emits = defineEmits([
  "selection-change",
  "search",
  "sort-change",
  "expand-change",
  "select",
  "select-all"
])
// 记录外部调用fetchData时传入的参数
let fetchDataQuery = {}
const fetchData = () => {
  commonSearchEmit()
}

const searchFormRef = ref()
const resetForm = () => {
  nextTick(() => {
    searchFormRef.value?.resetFields()
    fetchData()
  })
}

const handleSizeChange = (val: number) => {
  // 每页 val 条
  pagination.pageSize = val
  pagination.currentPage = 1
  commonSearchEmit()
}

const handleCurrentChange = (val: number) => {
  // 第 val 页
  pagination.currentPage = val
  commonSearchEmit()
}

const IS_ALL_VALUE = "allValue" // 显示全部 label
const commonSearchEmit = () => {
  const emitFormModel = {}
  Object.entries(formModel).forEach(([key, value]: any) => {
    if (value === IS_ALL_VALUE) {
      emitFormModel[key] = ""
    } else {
      emitFormModel[key] = value
    }
  })

  emits("search", {
    ...emitFormModel,
    ...pagination
  })
}
// 事件end
const dynamicTableRef = ref()
const handleSelect = (selection: recordObj, row) => {
  emits("select", selection, row)
}
const handleSelectAll = (selection: recordObj[]) => {
  emits("select-all", selection)
}
const handleSelectionChange = (selection: recordObj[]) => {
  // 多选时 选择更改时事件触发
  emits("selection-change", selection)
}
/**
 * 多选切换选中数据
 * @param rows
 * @param ignoreSelectable
 */
const toggleSelection = (rows, ignoreSelectable?: boolean) => {
  if (rows) {
    rows.forEach((row) => {
      dynamicTableRef.value!.toggleRowSelection(row, true, ignoreSelectable)
    })
  } else {
    dynamicTableRef.value!.clearSelection()
  }
}

const clearSelection = () => {
  dynamicTableRef.value!.clearSelection()
}

const toggleRowSelection = (row, selected) => {
  dynamicTableRef.value!.toggleRowSelection(row, selected)
}

const toggleRowExpansion = (row, expanded) => {
  dynamicTableRef.value!.toggleRowExpansion(row, expanded)
}

/**
 * 排序
 */
const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  emits("sort-change", data)
}
/**
 * 展开
 * */
const handleExpandChange = (row, expandedRows: any) => {
  emits("expand-change", expandedRows, row)
}
// emits end

const setPageTotal = (total: number) => {
  pagination.total = total
}

const setCurrentPage = (currentPage) => {
  pagination.currentPage = currentPage
}

const setPageSize = (pageSize) => {
  pagination.pageSize = pageSize
}
// 设置分页
const setPagenatin = ({ total, pageIndex, pageSize }) => {
  console.log("setPagenatin =======>", total, pageIndex, pageSize)
  total ?? setPageTotal(total)
  pageIndex ?? setCurrentPage(pageIndex)
  pageSize ?? setPageSize(pageSize)
}

const setFormValues = (values) => {
  if (!values) return

  // 遍历要设置的值
  Object.keys(values).forEach((key) => {
    // 确保表单模型中有这个字段
    if (key in formModel) {
      formModel[key] = values[key]
    }
  })
}

// 暴露方法 start
defineExpose({
  dynamicTableRef,
  fetchData,
  toggleSelection,
  toggleRowSelection,
  toggleRowExpansion,
  clearSelection,
  setPageTotal,
  pagination,
  formModel,
  resetForm,
  setCurrentPage,
  setFormValues,
  setPageSize,
  setPagenatin
})
// 暴露方法 end
</script>

<style lang="scss" scoped>
.dynamic-table {
  width: 100%;
  .page-title {
    padding: 20px;
    font-weight: 500;
    font-size: 18px;
    border-bottom: 1px solid #d6dde6;
    background: #ffffff;
  }
  .dynamic-table-content {
    background-color: #ffffff;
    border-radius: 4px;
  }
  .form-inline {
    position: relative;
    padding: 20px 32px 0;
    display: flex;
    .dynamic-table-form {
      position: relative;
      flex: 1;
      .el-form-item {
        // width: 25%;
        margin: 0;
        padding: 0 20px 10px 0;
        box-sizing: border-box;
      }
      :deep(.el-form-item__label) {
        letter-spacing: 0;
        font-family: "PingFangSC-Regular";
        font-weight: 400;
        font-size: 14px;
        color: #333333;
      }
      :deep(.el-form-item__content) {
        .el-date-editor {
          width: 100%;
        }
      }
      :deep(.el-cascader) {
        width: 100%;
      }
    }
  }

  .table-container {
    padding: 0 32px 20px;

    .more-controls {
      display: flex;
      align-items: center;

      .parting-line {
        width: 2px;
        height: 12px;
        background-color: #d6dde6;
        margin: 0 10px;
      }
    }

    :deep(.el-table) {
      .isSingleChoice {
        .el-checkbox {
          display: none;
        }
      }
    }
  }

  .paging {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
    :deep(.el-select) {
      width: 102px;
    }
  }
}
:deep(.el-date-editor) {
  .el-icon.el-input__icon.el-range__icon {
    display: none;
  }
}
</style>
