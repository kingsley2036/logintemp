import { requestPost } from '@/api/request'
import { strBytes, SHA1Digest, toHex, jeeplusDigest, buildSign } from '@/api/sign'
import urls from '@/api/urls'
import { saveContext } from '@/api/context'

const currentDateString = () => new Date().format("yyyyMMddhhmmss")

function encryptPassword(password, salt, time) {
  let encryptedPassword = jeeplusDigest(password, salt), digest = new SHA1Digest();
  return toHex(digest.digest(strBytes(time + encryptedPassword)));
}

export function preLogin(account) {
  return requestPost(urls.sys.preLogin, {
    account,
  }, false)
}

export function checkLogin() {
  /* global $c */
  if ($c && $c.login && $c.login.token && $c.login.sc) {
    const token = $c.login.token, sc = $c.login.sc, sign = buildSign({token, sc})
    return requestPost(urls.sys.checkLogin, { token, sign }, false)
  } else {
    return Promise.reject()
  }
}

export function login({account, password}) {
  return new Promise((fulfilled, rejected) => {
    preLogin(account).then((resp) => {
      let result = resp.data
      if (result.code === '0') {
        window.context.sc = result.data.sc;
        let salt = window.context.sc;
        let timeString = currentDateString(), passwordDigest = encryptPassword(password, salt, timeString);
        requestPost(urls.sys.login, {
          account: account,
          sign: timeString + passwordDigest
        }, false).then((resp) => {
          let result = resp.data
          // console.log('>> login: %o', result)
          if (result.code === '0') {
            window.context.login = result.data
            saveContext(window.context)
            fulfilled(window.context.login)
          } else {
            rejected(result)
          }
        })
      } else {
        rejected(result)
      }
    })
  })
}
