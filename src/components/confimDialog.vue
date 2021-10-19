<script setup>
import {
  ref, defineProps, defineExpose, defineEmits
} from 'vue'

const props = defineProps({
  confirmText: String
})

const emit = defineEmits(['confirm'])
const dialogVisible = ref(false)

const handleConfirm = () => {
  emit('confirm')
}
defineExpose({
  dialogVisible
})
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    title="确认提示"
    width="30%"
    destroy-on-close
    :show-close="true"
    custom-class="confirmDialog"
  >
    <!-- <el-icon color="#FE9400" size="20">
      <warning-filled style="width: 1em; height: 1em; margin-right: 8px;"/>
    </el-icon> -->
    <span>{{props.confirmText}}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style lang="less">
.confirmDialog{
  .el-dialog__header{
    text-align: left;
  }
}

</style>
