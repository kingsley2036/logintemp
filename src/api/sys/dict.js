import urls from '@/api/urls'
import {requestGet} from '@/api/request'

const PARSE_RESULT = (resp) => {
  if (isSuccess(resp.data)) return resp.data
  else throw resp
}

export default {
  queryDictEntries(params) {
    return requestGet(urls.sys.dict, params).then(PARSE_RESULT)
  }
}