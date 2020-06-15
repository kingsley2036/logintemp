"use strict"

import {requestGet, requestPost} from '@/api/request'
import urls from '@/api/urls'

const PARSE_RESULT = (resp) => {
  if (isSuccess(resp.data)) return resp.data
  else throw resp
}

export default {

  /**
   * 查询所有辖区内的站点
   */
  queryAllSites() {
    return requestGet(urls.monitor.site.queryAllSites, {}).then(PARSE_RESULT)
  },

  /**
   * 查询所有辖区内安装的设备
   */
  queryAllDevices() {
    return requestGet(urls.monitor.device.queryAllDevices, {}).then(PARSE_RESULT)
  },

  /**
   * 查询设备状态，含近期历史
   * 
   * @param {*} devIds 
   */
  queryDeviceState(devIds, begTime) {
    return requestGet(urls.monitor.device.queryState, {
      ids: devIds.join(','),
      begDate: begTime
    }). then(PARSE_RESULT)
  },

  /**
   * 查询设备监控历史
   * 
   * @param {*} devNos 
   * @param {String} begDate
   * @param {String} endDate
   */
  queryMonitorHistory(devNos, begDate, endDate) {
    return requestGet(urls.monitor.device.queryMonitorHistory, {
      nos: devNos.join(','),
      begDate, endDate
    }).then(PARSE_RESULT)
  },

  /**
   * 查询24小时历史统计信息
   * 
   * @param {*} devNos 
   */
  query24HoursSummary(devNos) {
    return requestGet(urls.monitor.device.query24HoursSummary, {
      ids: devNos.join(',')
    }).then(PARSE_RESULT)
  },

  /**
   * 查询7天评级信息
   * @param {*} siteId
   */
  query7DaysGrade(siteId) {
    return requestGet(urls.monitor.grade.query7DaysGrade, {
      siteId: siteId
    }).then(PARSE_RESULT)
  }
}
