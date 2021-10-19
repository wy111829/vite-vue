<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from '_element-plus@1.1.0-beta.20@element-plus'
import api from '../../api'
import IpInput from '../../components/IpInput.vue'
import ConfimDialog from '../../components/confimDialog.vue'
import ProgressDialog from '../../components/progressDialog.vue'

const form = reactive({
  logoUrl: '',
  systemName: '',
  webServiceIp: '',
  minioServiceIp: '',
  transcodeServiceIp: '',
  aiDomain: '',
  aiStatus: 0,
  minioDomain: ''
})
const loading = ref(false)
const uploadUrl = ref(`${import.meta.env.VITE_BASE_URL}/media/getLocalUrl`)
const confirm = ref(null)
const progress = ref()

const getInfo = async() => {
  loading.value = true
  const res = await api.getSetUpInfo()
  loading.value = false

  // loading = false
  if (res.success) {
    Object.keys(res.data[0]).forEach(key => { form[key] = res.data[0][key] })
  }
}

const sendInfo = async() => {
  const res = await api.baseSetUp(form)
  if (res.success) {
    ElMessage.success(res.message)
  }
}

const beforeUpload = (file) => {
  const isLt1M = file.size / 1024 / 1024 < 1
  if (!isLt1M) {
    ElMessage.error('请上传小于1M大小的文件')
  }
  return isLt1M
}
const uploadSuccess = (res, file) => {
  form.logoUrl = res.data[0]
}

const changeAiStatus = (val) => {
  if (val === 0) {
    form.aiDomain = ''
  }
}

const checkForm = () => {
  function isValidIP(ip) {
    const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip)
  }
  function isValidURL(url) {
    const reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
    return reg.test(url)
  }
  if (form.logoUrl === '') {
    ElMessage.warning('请上传系统Logo')
    return false
  }
  if (form.systemName === '') {
    ElMessage.warning('请输入系统名称')
    return false
  }
  if (!isValidIP(form.webServiceIp)) {
    ElMessage.warning('请输入正确WebIP')
    return false
  }
  if (!isValidIP(form.minioServiceIp)) {
    ElMessage.warning('请输入正确组件IP')
    return false
  }
  if (!isValidIP(form.transcodeServiceIp)) {
    ElMessage.warning('请输入正确转码服务IP')
    return false
  }
  if (form.aiStatus === 1 && !isValidURL(form.aiDomain)) {
    ElMessage.warning('请输入正确智能能力外网访问域名')
    return false
  }
  if (form.minioDomain !== '' && !isValidURL(form.minioDomain)) {
    ElMessage.warning('请输入访问设置正确外网访问域名')
    return false
  }
  return true
}

const handleSubmit = () => {
  if (checkForm()) {
    confirm.value.dialogVisible = true
  }
}

const handleConfirm = async() => {
  confirm.value.dialogVisible = false
  await sendInfo()
  progress.value.dialogVisible = true
  progress.value.startProgress()
}
const refresh = () => {
  progress.value.dialogVisible = false
  getInfo()
}

onMounted(() => {
  getInfo()
})

</script>
<template>
  <div class="wrap">
    <div class="content" v-loading="loading">
      <el-form
        label-position="left"
        label-width="150px"
        :show-message="false"
        :model="form"
      >
        <el-form-item label="设置系统Logo：" prop="logoUrl" required >
          <el-upload class="uploader" :action="uploadUrl" :show-file-list="false" accept=".jpg,.jpeg,.png" :before-upload="beforeUpload" :on-success="uploadSuccess">
            <img v-if="form.logoUrl" :src="form.logoUrl" alt="系统logo" class="logoImg"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="tips">注：可自定义系统LOGO用户登录界面和系统导航展示，请上传小于1M以下的JPG、PNG图片，建议LOGO像素在100px*100px左右。</div>
        </el-form-item>
        <el-form-item label="设置系统名称：" prop="systemName" required>
          <el-input v-model="form.systemName"/>
        </el-form-item>
        <el-form-item label="设置WebIP：" prop="webServiceIp" required>
          <IpInput v-model="form.webServiceIp"/>
        </el-form-item>
        <el-form-item label="设置组件IP" prop="minioServiceIp" required>
          <IpInput v-model="form.minioServiceIp"/>
        </el-form-item>
        <el-form-item label="设置转码服务IP" prop="transcodeServiceIp" required>
          <IpInput v-model="form.transcodeServiceIp"/>
          <div class="tips">注：请输入硬件配置中相应的IP，请仔细填写，填写错误会导致系统无法运行。</div>
        </el-form-item>
        <el-form-item label="系统智能能力配置：" class="AIrow" :required="form.aiStatus===1">
          <div class="inputBox">
            <el-switch v-model="form.aiStatus" :active-value="1" :inactive-value="0" @change='changeAiStatus'/>
            <el-input v-model="form.aiDomain" :disabled="form.aiStatus===0"/>
          </div>
          <div class="tips">注：请填入外网可访问域名，并且确保域名映射至web服务IP。</div>
        </el-form-item>
        <el-form-item label="访问设置：" prop="minioDomain">
          <el-input v-model="form.minioDomain"/>
          <div class="tips">注：请填入外网可访问域名，并且确保域名映射至组件服务IP。</div>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="medium" @click="handleSubmit">开启数字资产管理新章程</el-button>
    </div>
    <ConfimDialog ref="confirm" confirmText='确定要提交初始化配置？该操作需要重启！' @confirm='handleConfirm'/>
    <ProgressDialog ref="progress" @confirm='refresh'/>
  </div>
</template>
<style lang="less">
.wrap{
  width: 100%;
  height: 100vh;
  background-color: #0079FE;
  background-image: url('../../assets/images/bg.png');
  display: flex;
  align-items: center;
  justify-content: center;
  .content{
    width: 900px;
    padding:20px 100px;
    border-radius: 10px;
    background-color: #F7F7F7;
    .tips{
      color: #979797;
      text-align: left;
    }
    .uploader {
      display: flex;
      .el-upload{
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .el-upload:hover {
        border-color: #409eff;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
      }
      .logoImg{
        width: 100px;
        height: 100px;
        display: block;
        background-color: #F7F7F7;
      }
    }
    .AIrow .el-form-item__content{
      display: flex;
      flex-direction: column;
      .inputBox{
        display: flex;
        align-items: center;
        .el-switch{
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
