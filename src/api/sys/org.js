'use strict'

import urls from '@/api/urls'
import {requestGet} from '@/api/request'

const PARSE_RESULT = (resp) => {
  if (isSuccess(resp.data)) return resp.data
  else throw resp
}

export default {

  /**
   * 查询当前用户所属部门
   */
  queryMyOrg() {
      return requestGet(urls.sys.orgs.queryMyOrg).then(PARSE_RESULT)
  },

  /**
   * 查询所有相关部门信息
   * @param {Array} orgIds 
   */
  queryOrgsByIds(orgIds) {
    return requestGet(urls.sys.orgs.queryByIds, {
        ids: orgIds && orgIds.join(',') || ''
    }).then(PARSE_RESULT)
  },

  /**
   * 查询下级部门
   * @param {*} ids 
   */
  queryChildOrgsByIds(ids) {
    return requestGet(urls.sys.orgs.queryChildOrgsByIds, {
      ids: ids.join(',')
    }).then(PARSE_RESULT)
  }
}