/**
 * 用户相关接口
 */
import request from '@/utils/request'

export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: ''
  })
  // return request.get('url')
}
