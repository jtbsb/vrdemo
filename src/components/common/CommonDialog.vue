<template>
  <div class="common_dialog_box">
    <el-dialog
      :model-value="commonVisible"
      v-bind="dialogProps"
      @close="emits('update:commonVisible', false)"
    >
      <template #header>
        <div class="common_dialog_header">
          <span>
            {{ dialogProps?.title || "" }}
          </span>
          <span class="tip" v-if="headerTip">{{ headerTip }}</span>
        </div>
      </template>
      <div class="common_dialog_content">
        <slot></slot>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <slot name="footer"></slot>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  commonVisible: {
    type: Boolean,
    default: false
  },
  dialogProps: {
    type: Object,
    default: () => {
      return {}
    }
  },
  headerTip: {
    type: String,
    default: ""
  }
})
const emits = defineEmits(["update:commonVisible"])
</script>
<style scoped lang="scss">
.common_dialog_box {
  :deep(.el-dialog) {
    padding: 0;
  }
  :deep(.el-dialog__header) {
    padding: 18px;
    border-bottom: 1px solid #ebedf0;
  }
  .common_dialog_content {
    padding: 20px;
    box-sizing: border-box;
  }
  .dialog-footer {
    border-top: 1px solid #ebedf0;
    padding: 12px 20px;
    box-sizing: border-box;
    text-align: right;
  }
  .common_dialog_header {
    display: flex;
    align-items: center;
    .tip {
      margin-left: 5px;
      color: #909399;
      font-size: 14px;
      font-weight: 400;
      font-family: "PingFang SC";
    }
  }
}
</style>
