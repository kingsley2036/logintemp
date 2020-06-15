import axios from 'axios'

// axios 基础配置
axios.defaults.timeout = 150000
// const service = 'http://192.168.0.19:8080'
// const service = 'http://123.58.240.194:9005'
const service = 'http://fume.ttantu.cn:8001'
axios.defaults.baseURL = service
axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'


// request请求拦截
axios.interceptors.request.use(
  // 在请求发送之前做一些事
  config => {
    let setParams = config.params
    console.log(setParams, 'AXIOS  base 在请求发送之前做一些事')
    if (setParams) {
      let pindex = setParams.pindex || false
      if (pindex) {
        let limit = setParams.limit
        let offset = limit * (pindex - 1)
        let obj = { limit, offset }
        Object.assign(obj, setParams)
        delete obj.pindex
        setParams = obj
      }
      let params = { 
        userId:'3150c54f22434486b2732aa9a8eccd35'
      }
      for (let i in setParams) {
        if (setParams[i] !== '') {
          params[i] = setParams[i]
        }
      }

      config.params = params
    }

    // console.log('验证用户是否登录')
    // console.log('请求拦截，统一处理请求')
    // let localToken = getStore('token')
    // console.log('请求头加token ==>', localToken)
    // if (localToken) {
    //   config.headers.common['Authorization'] = 'JWT ' + localToken
    // }
    return config
  },
  // 当出现请求错误时做一些事
  err => {
    console.log('err' + err)
    Promise.reject(err)
  }
)

// respone拦截器
axios.interceptors.response.use(
  res => {
    // console.log(res, 'respone拦截器')
    //  console.log(res, '统一处理返回结果')
    /*  if (res.data.result !== 1) {
       Message.error({
         content: '请求失败，请重新登录！',
         onClose: () => {
           router.push('login')
         }
       })
     } else {
       return res.data
     } */
    return res.data
  },
  err => {
    console.log('err => ', err)
    if (err.toString().indexOf('timeout') !== -1) {
      console.log('请求超时')
    }
  }

)

export default axios
