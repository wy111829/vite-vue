import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
})

// 添加请求拦截器
service.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
)
// 添加响应拦截器
service.interceptors.response.use(
  // 对响应数据做点什么
  response => response.data,
  error => {
    ElMessage.error('网络连接错误')
    return Promise.reject(error)
  }
)

export default {
  getSetUpInfo: (params = {}, config = {}) => service.post('/inone/getSetUpInfo', params, config),
  baseSetUp: (params = {}, config = {}) => service.post('/inone/baseSetUp', params, config)
}
