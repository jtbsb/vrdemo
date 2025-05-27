<template>
  <div class="lyouters">
    <div class="login-wrap">
      <el-form
        label-position="left"
        :model="ruleForm"
        :rules="rules"
        ref="ruleFormRef"
        label-width="0px"
        class="demo-ruleForm login-container"
      >
        <h3 class="title">
          <div class="login-logo">
            <img style="width: 100%" src="@/assets/logo.svg" alt="logo" />
          </div>
          <span>用户登录</span>
        </h3>
        <el-form-item prop="username">
          <el-input
            type="text"
            size="large"
            style="font-size: 16px"
            v-model.trim="ruleForm.username"
            auto-complete="off"
            placeholder="请输入账号"
            maxlength="60"
          >
            <template #prepend>
              <el-icon :size="20"><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            size="large"
            style="font-size: 16px"
            v-model.trim="ruleForm.password"
            auto-complete="off"
            placeholder="请输入密码"
            maxlength="60"
          >
            <template #prepend>
              <el-icon :size="20"><lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <el-input
            type="text"
            size="large"
            style="font-size: 16px"
            v-model.trim="ruleForm.captcha"
            auto-complete="off"
            placeholder="验证码"
          >
            <template #prepend>
              <el-icon :size="20"><circle-check /></el-icon>
            </template>
            <template #append>
              <img class="login-code" :src="image_base" @click="getCaptcha" />
            </template>
          </el-input>
        </el-form-item>
        <el-checkbox class="remember" v-model="rememberpassword"> 记住密码 </el-checkbox>
        <el-form-item style="width: 100%">
          <el-button
            type="primary"
            size="large"
            :loading="loadingLg"
            style="width: 100%; font-size: 18px"
            @click="confirm(ruleFormRef)"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { setToken } from "@/utils/auth"
import { temporaryLogin } from "@/api/manage/index"
import { useUserStore } from "@/stores"
import { ElMessage } from "element-plus"
import { usePermissionStore } from "@/stores"
import type { FormInstance } from "element-plus"

const ruleFormRef = ref<FormInstance>()
const permissionStore = usePermissionStore()
const route = useRoute()
const router = useRouter()
const redirect = ref<any>()
const otherQuery = ref<any>({})
const userStore = useUserStore()
let ruleForm = ref({
  username: "outer",
  password: "123456",
  captcha: "111111"
})
let rules = ref({
  username: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
  ],
  captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }]
})
let image_base = ref("")
const getCaptcha = async () => {
  //
}
// 确定按钮
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        let { code, data } = await temporaryLogin({
          name: ruleForm.value.username
        })
        if (code && code == 200) {
          setToken(data?.token || "")
          userStore.saveUserInfo(data || {})
          await permissionStore.generateRoutes()
          router.push({ path: redirect.value || "/", query: otherQuery.value })
        }
      } catch (error: any) {
        error?.msg && ElMessage.error(error?.msg)
      }
    } else {
      console.log("error submit!", fields)
    }
  })
}
let rememberpassword = ref(true)
let loadingLg = ref(false)

const getOtherQuery = (query) => {
  return Object.keys(query).reduce((acc, cur) => {
    if (cur !== "redirect") {
      acc[cur] = query[cur]
    }
    return acc
  }, {})
}
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery) {
      redirect.value = newQuery.redirect
      otherQuery.value = getOtherQuery(newQuery)
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.lyouters {
  width: 100%;
  height: 100%;
}
.login-logo {
  overflow: hidden;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  -webkit-box-shadow: 0 4px 40px rgb(0 0 0 / 7%);
  box-shadow: 0 4px 40px rgb(0 0 0 / 7%);
  background-color: var(--el-bg-color);
  z-index: 10;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;
}
.login-wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  .login-container {
    inset: 2px;
    z-index: 2;
    border-radius: 10px;
    margin: 0px auto;
    width: 450px;
    height: 520px;
    padding: 30px 35px 15px 35px;
    background: var(--el-bg-color);
    border: 1px solid #eaeaea;
    text-align: left;
    box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
  }
  .title {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-content: center;
    font-size: 19px;
    margin: 0px auto 25px auto;
    color: var(--el-color-primary);
    font-weight: 700;
  }
  .remember {
    margin: 0px 0px 15px 0px;
  }
}
.login-code {
  height: 40px - 2px;
  display: block;
  margin: 0px -20px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}
::v-deep(.el-input__inner) {
  &::placeholder {
    font-size: 14px !important;
  }
}
::v-deep(.el-input-group__append) {
  background-color: var(--el-bg-color) !important;
  width: 70px;
}
::v-deep(.el-input-group__prepend) {
  background-color: var(--el-bg-color) !important;
  .el-icon {
    color: var(--el-color-primary);
  }
}
</style>
