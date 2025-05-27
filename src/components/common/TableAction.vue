<template>
  <el-space v-if="actions">
    <template v-for="(item, i) in getActions" :key="i">
      <template v-if="domType === 'tag'">
        <el-tag :hit="isHit" size="small" :type="item.type || 'primary'">
          {{ item.label }}
        </el-tag>
      </template>
      <template v-else-if="domType === 'button' && !item.isHide">
        <el-button
          :type="item.type || 'primary'"
          link
          :disabled="item.disabled"
          v-permission:btn="item.permission"
          @click.stop="item.onClick"
        >
          {{ item.label }}
        </el-button>
      </template>
    </template>
  </el-space>
  <template v-if="avatar">
    <el-avatar :size="avatar.avatarSize" :src="avatar.avatar" />
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue"

type ThemeType = "primary" | "success" | "info" | "warning" | "danger"

interface ActionsItem {
  type?: ThemeType
  label: string
  isHide?: boolean
  disabled?: boolean
  permission?: string
  onClick: () => void
}

interface AvatarType {
  avatar: string
  avatarSize: number
}

interface Props {
  domType?: "tag" | "button"
  tagType?: ThemeType
  isHit?: boolean
  round?: boolean
  actions: ActionsItem[]
  avatar?: AvatarType
}

const props = withDefaults(defineProps<Props>(), {
  domType: "button",
  tagType: "primary",
  isHit: false,
  round: false,
  avatar: undefined // 默认值为 undefined
})

const getActions = computed(() => {
  return props.actions.map((item) => ({
    ...item,
    type: item.type || "primary"
  }))
})
</script>

<style scoped lang="scss"></style>
