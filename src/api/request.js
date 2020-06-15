/**
 *创建axios服务实例
 */
import axios from 'axios/index'
import Qs from 'qs'
import {buildUrlSign} from '@/api/sign'

const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  timeout: 45000 // 请求超时时间
})

/**
 * request请求拦截器
 */
// service.interceptors.request.use(config => {
//   // console.log(config)
//   return config
// }, error => {
//   // 请求失败报错
//   console.log('请求失败报错:' + error) // for debug
//   Promise.reject(error)
// })

/**
 * respone拦截器
 */
// service.interceptors.response.use(
//   response => {
//     return response
//   },
//   error => {
//     if (error.response) {
//       // 响应时触发错误
//       if (error.response.status >= 500) { // 如果是服务器端错误则跳转至服务错误页面
//         router.push({ path: '/500' })
//       }
//       if (error.response.status === 404) {
//         router.push({ path: '/404' })
//       }
//     } else {
//       console.log('Error', error.message)
//     }
//     return Promise.reject(error)
//   }
// )

export default service

/**
 * get请求
 * @param url
 * @param data
 */
export function requestGet(url, data, withSign = true) {
  data = data || {}
  return service({
    url: withSign ? buildUrlSign(url) : url,
    method: 'get',
    params: data
  })
}

/**
 * post请求
 * @param url
 * @param data
 */
export function requestPost(url, data, withSign = true) {
  data = data || {}
  return service({
    url: withSign ? buildUrlSign(url) : url,
    method: 'post',
    transformRequest: [function (data) {
      data = Qs.stringify(data)
      return data
    }],
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: data
  })
}

/**
 * post请求
 * @param url
 * @param data
 */
export function requestPost2(url, data, withSign = true) {
  data = data || {}
  return service({
    url: withSign ? buildUrlSign(url) : url,
    method: 'post',
    data: data
  })
}

/**
 * post请求
 * @param url
 * @param formData
 */
export function requestPostFormData(url, formData, withSign = true) {
  formData = formData || {}
  return service({
    url: withSign ? buildUrlSign(url) : url,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData
  })
}
