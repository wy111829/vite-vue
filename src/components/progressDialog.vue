<script setup>
import {
  ref, defineExpose, defineEmits
} from 'vue'

const emit = defineEmits(['confirm'])
const dialogVisible = ref(false)
const percent = ref(0)

const startProgress = () => {
  percent.value = 0
  let startTime
  let myReq
  const step = () => {
    const time = Date.now()
    if (startTime === undefined) {
      startTime = time
    }
    if (percent.value < 100) {
      percent.value = Math.floor((((time - startTime) / (1000 * 60 * 2)) * 100) * 100) / 100
    } else {
      percent.value = 100
    }
    // console.log(Math.floor((((time - startTime) / (1000 * 60 * 2)) * 100) * 100) / 100)
  }
  (function animateloop() {
    step()
    if (percent.value < 100) {
      myReq = requestAnimationFrame(animateloop)
    } else {
      cancelAnimationFrame(myReq)
    }
  })()
}

const handleConfirm = () => {
  emit('confirm')
}
defineExpose({
  dialogVisible,
  startProgress
})
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    width="30%"
    destroy-on-close
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    custom-class="progressDialog"
    center
  >
    <el-progress :stroke-width="26" :percentage="percent" status="success" :show-text="false"/>
    <p class="waiting" v-if="percent<100">重启中请耐心等待...</p>
    <p class="success" v-else>重启成功</p>
    <template #footer>
      <span class="dialog-footer">
        <el-button disabled size="medium" v-if="percent<100" type="info">重启中</el-button>
        <el-button  v-else size="medium" type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style lang="less">
.progressDialog{
  .el-dialog__header{
    display: none;
  }
  .el-dialog__body{
    padding-top: 60px;
    .waiting{
      color: #B4B4B4;
      text-align: center;
      font-size: 16px;
    }
    .success{
      color:#67c23a;
      text-align: center;
      font-size: 16px;
    }
  }
}

</style>
