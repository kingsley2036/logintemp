"use strict"

import {requestGet, requestPost} from '@/api/request'
import urls from '@/api/urls'

export default {
  queryAlarms(filter) {
    return requestGet(urls.monitor.alarms.queryByPage, filter).then(resp => {
      if (isSuccess(resp.data)) return resp.data
      else throw resp
    })
  }
}