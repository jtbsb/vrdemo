<template>
  <el-upload
    :http-request="uploadImage"
    with-credentials
    list-type="picture-card"
    :limit="limit"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :on-exceed="handleExceed"
    :before-upload="beforeUpload"
    :file-list="fileList"
    :disabled="disabled"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <div class="dialog-img">
      <img :src="dialogImageUrl" alt="预览图片" />
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus"
import type { UploadProps, UploadUserFile } from "element-plus"
import { uploadFile } from "@/api/common"
import { uploadCodeStr } from "@/types/common"

const props = defineProps({
  accept: {
    type: String,
    default: ".jpg,.jpeg,.png"
  },
  limit: {
    type: Number,
    default: 1
  },
  fileList: {
    type: Array,
    default: () => []
  },
  fileSize: {
    type: Number,
    default: 3
  },
  noSizeLt: {
    type: Boolean,
    default: false
  },
  uploadCode: {
    type: String,
    default: uploadCodeStr
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(["remove", "success", "exceed", "before"])

const dialogImageUrl = ref("")
const dialogVisible = ref(false)

const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  emits("remove", uploadFile, uploadFiles)
}

const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(`只能上传 ${props.limit} 张图片`)
  emits("exceed", files, uploadFiles)
}

// 文件格式和大小校验
const beforeUpload = (file: File) => {
  const isImage = /\.(jpg|jpeg|png)$/i.test(file.name)
  const isLt3M = file.size / 1024 / 1024 < props.fileSize
  emits("before")
  if (!props.noSizeLt && !isLt3M) {
    ElMessage.error(`图片大小不能超过 ${props.fileSize} MB！`)
    return false
  }
  if (!isImage) {
    ElMessage.error("仅支持 JPG、JPEG、PNG 格式的图片！")
    return false
  }

  return true
}

const uploadImage = async (file) => {
  let UploadFormData = {
    multipartFile: file.file,
    code: props.uploadCode
  }
  const res = await uploadFile(UploadFormData)
  if (res.code && res.code === "200") {
    emits("success", res.data, file.file)
  } else {
    ElMessage.error(res.msg || "未知错误")
  }
}
</script>

<style scoped>
.el-upload--picture-card {
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog-img {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog-img img {
  width: 100%;
  height: 100%;
}
</style>
