'use strict'

import urls from '@/api/urls'

let ws

/**
 * 启动WebSocket监听
 */
function startupListener($e = $e) {
  const clientId = `monitor-show-${('' + Math.random()).substr(2, 8)}`
  const url = urls.ws + clientId
  const webSocket = ws = new WebSocket(url)

  webSocket.onerror = function (event) {
    console.log('#WebSocket# 发生错误')
  }

  //连接成功建立的回调方法
  webSocket.onopen = function () {
    $e.$emit('connected', [])
    console.log('#WebSocket# 连接成功', url)
  }

  // 接收到消息的回调方法
  webSocket.onmessage = function (event) {
    // console.log('#WebSocket# 收取消息')
    try {
      let message = JSON.parse(event.data)
      // console.log('## message ## %o', message)
      $e.$emit('trace', message)
    } catch (e) {
      console.error(e)
    }
  }

  webSocket.onclose = function () {
    console.log('#WebSocket# 连接关闭')
    setTimeout(startupListener, 2000)
  }
}

/**
 * 停止WebSocket监听
 */
function stopListener() {
  if (ws) {
    ws.close()
    ws = null
  }
}

export default {
  startupListener, stopListener
}