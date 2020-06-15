/*
 * 模拟发送超标数据
 */
(function() {
  const mockSites = ['2e7a379d9cb94328a466b5430cceef72', '5d33b7b83e144ade89b3ca88c28f6151']
  const sendMock = () => {
    // 发送模拟数据
    mockSites.map(id => $e.monitor.getSite(id)).filter(o => o)
      .forEach((site, i) => {
        // site.hasExceed = site.hasFault = true
        site.status = 'exceed' // 'fault'
        clearInterval(tid)
        // $e.$emit('alarm', {
        //   no: `mock${i}`,
        //   site
        // }, {
        //   type: 1,
        //   siteName: site.siteName,
        //   content: '模拟报警'
        // })
      })
  }
  let tid = setInterval(sendMock, 1000)
})()