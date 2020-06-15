

import axios from '@/api/base'
const BASE = '/oilSmoke/api/monitor/'


export default {

// 获取当前用户信息
getUserInfo: data => {
    return axios.get( BASE + 'currentUser', { params: data })
}


}
