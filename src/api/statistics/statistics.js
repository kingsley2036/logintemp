'use strict'

import urls from '@/api/urls'
import {requestGet} from '@/api/request'

const PARSE_RESULT = (resp) => {
  if (isSuccess(resp.data)) return resp.data
  else throw resp
}

export default {

  /**
   * 区级组织统计信息
   */
  queryDistrictSummary() {
    return requestGet(urls.statistics.queryDistrictSummary).then(PARSE_RESULT)
  },

  /**
   * 各街道办事处安装设备统计
   * 
   * @param {*} orgIds 
   */
  queryDevicesCountForSubdistrices(orgIds) {
    return requestGet(urls.statistics.queryDevicesCountForSubdistrices, {
        ids: orgIds.join(',')
    }).then(PARSE_RESULT)
  },

  /**
   * 各办事处超标统计
   * @param {*} 时间区间 
   */
  querySubdistrictExceed({begDate, endDate}) {
    return requestGet(urls.statistics.querySubdistrictExceed, {
      begDate, endDate
    }).then(PARSE_RESULT)
  },

  /**
   * 当前部门，指定区间内超标占比
   * @param {*} 时间区间 
   */
  queryExceedCounts({begDate, endDate}) {
    return requestGet(urls.statistics.queryExceedCounts, {
      begDate, endDate
    }).then(PARSE_RESULT)
  },

  /**
   * 办事处评级统计
   * 
   * @param {*} 时间区间 
   */
  queryReachSummary({begDate, endDate}) {
    return requestGet(urls.statistics.queryReachSummary, {
      begDate, endDate,
      codes: 'excellent,good,pass'
    }).then(PARSE_RESULT)
  }
}