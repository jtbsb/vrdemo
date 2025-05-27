<template>
  <div class="main-div">
    <div class="transfer-box-left">
      <div class="transfer-title">
        <el-checkbox
          v-model="checkedLeft"
          :label="props.titles[0]"
          @change="changeChecked(dataLeft, treeRef)"
        />
      </div>
      <div class="transfer-content">
        <el-input
          :prefix-icon="Search"
          v-model="filterTextLeft"
          style="margin-bottom: 9px"
          placeholder="请输入搜索内容"
        />
        <el-tree
          ref="treeRef"
          class="filter-tree"
          :data="dataLeft"
          :props="defaultProps"
          node-key="id"
          @node-click="handleNodeClick"
          default-expand-all
          show-checkbox
          :check-on-click-node="true"
          :filter-node-method="filterNode"
        />
      </div>
    </div>
    <div class="transfer-box-button">
      <el-button type="primary" class="button-div" @click="setCheckedKeysLeft">&lt;</el-button>
      <el-button type="primary" class="button-div" @click="setCheckedKeys">&gt;</el-button>
    </div>
    <div class="transfer-box-right">
      <div class="transfer-title">
        <el-checkbox
          v-model="checkedRight"
          :label="props.titles[1]"
          @change="changeChecked(dataRight, treeRefRight)"
        />
      </div>
      <div class="transfer-content">
        <el-input
          :prefix-icon="Search"
          v-model="filterTextRight"
          style="margin-bottom: 9px"
          placeholder="请输入搜索内容"
        />
        <el-tree
          ref="treeRefRight"
          class="filter-tree"
          :data="dataRight"
          :props="defaultProps"
          @node-click="handleNodeClick"
          default-expand-all
          node-key="id"
          :check-on-click-node="true"
          show-checkbox
          :filter-node-method="filterNode"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { Search } from "@element-plus/icons-vue"

const props = defineProps(["dataAll", "checkedIds", "titles"])
const filterTextLeft = ref("") // 左侧搜索
const filterTextRight = ref("") // 右侧搜索
const treeRef = ref() // 左侧树
const treeRefRight = ref() // 右侧树
const checkedLeft = ref(false) // 左侧全选
const checkedRight = ref(false) // 右侧全选
const defaultProps = {
  // 树形结构
  children: "children",
  label: "label"
}

watch(filterTextLeft, (val) => {
  treeRef.value?.filter(val)
})
watch(filterTextRight, (val) => {
  treeRefRight.value?.filter(val)
})
const filterNode = (value, data) => {
  if (!value) return true
  return data.label.includes(value)
}
const checkList = ref([])

const dataLeft = ref([])
const dataRight = ref([])
const emit = defineEmits(["changeChecked"])
watch(
  checkList,
  () => {
    let data = JSON.parse(JSON.stringify(props.dataAll))
    data = filterTreeData(data, checkList.value, false)
    dataLeft.value = data

    let dataR = JSON.parse(JSON.stringify(props.dataAll))
    dataR = filterTreeData(dataR, checkList.value, true)
    dataRight.value = dataR
    emit("changeChecked", checkList.value)
  },
  { deep: true }
)
//穿梭
const filterTreeData = (treeData, checkList, flag) => {
  return treeData.filter((node) => {
    if (checkList.includes(node.id)) {
      return flag
    } else if (node.children) {
      node.children = filterTreeData(node.children, checkList, flag)
      return node.children.length > 0
    }
    return !flag
  })
}

//添加到右边
const setCheckedKeys = () => {
  let checks = checkList.value
  treeRef.value.getCheckedNodes(true).map((item) => checks.push(item.id))
  checkList.value = [...new Set(checks)]
}
//添加到左边
const setCheckedKeysLeft = () => {
  let checks = []
  treeRefRight.value.getCheckedNodes(true).map((item) => checks.push(item.id))
  checkList.value = checkList.value.filter((value) => !checks.includes(value))
}

//选中
const handleNodeClick = (nodeData) => {
  nodeData.selected = !nodeData.selected
}

const changeChecked = (treeData, ref) => {
  // 遍历树的每个节点，设置所有子节点选中
  if (checkedLeft.value || checkedRight.value) {
    // 初始化存储所有 id 的数组
    let allIds = []
    // 遍历树的每个节点，获取所有节点的 id
    treeData.forEach((node) => {
      getAllNodeIds(node, allIds)
    })
    ref?.setCheckedKeys(allIds)
  } else {
    ref?.setCheckedKeys([], false)
  }
}

// 递归获取所有节点的 id
const getAllNodeIds = (node, ids) => {
  ids.push(node.id)
  if (node.children) {
    node.children.forEach((child) => {
      getAllNodeIds(child, ids)
    })
  }
}

onMounted(() => {
  checkList.value = [...props.checkedIds]
})
</script>
<style scoped lang="scss">
.main-div {
  display: flex;
  width: 100%;
  height: 400px;
  align-items: center;
  .transfer-box-left,
  .transfer-box-right {
    display: inline-block;
    width: calc(50% - 80px);
    height: 100%;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid #e4e7ed;
    .transfer-title {
      background: #f5f7fa;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 4px 16px;
    }
    .transfer-content {
      padding: 12px;
      height: calc(100% - 40px);
    }
  }
  .transfer-box-button {
    display: inline-block;
    width: 160px;
    text-align: center;
    .button-div {
      width: 46px;
      height: 36px;
      border-radius: 2px;
    }
    .el-button + .el-button {
      margin-left: 8px;
    }
  }
}
.filter-tree {
  width: auto;
  height: calc(100% - 50px);
  overflow: auto;
}
/* 滚动条 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #0003;
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
}
::-webkit-scrollbar-track {
  border-radius: 10px;
}
:deep .is-penultimate > .el-tree-node__content {
  color: #626aef;
}
</style>
