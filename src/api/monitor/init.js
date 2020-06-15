'use strict'

import {requestGet, requestPost} from '@/api/request'
import urls from '@/api/urls'

import OrgApi from '@/api/sys/org'

/* global $e */

// 设备离线超时时间
const OFFLINE_TIMEOUT = 1000 * 60 * 3
// 超标排放超时时间
const EXCEED_TIMEOUT = 1000 * 60 * 30
// 实时监控，采样间隔时间
const SAMPLING_DURATION = 1000 * 10

const PARSE_RESULT = (resp) => {
  if (isSuccess(resp.data)) return resp.data
  else throw resp
}
/**
 * 查询所有辖区内的站点
 */
function queryAllSites() {
  return requestGet(urls.monitor.site.queryAllSites, {}).then(PARSE_RESULT)
}

/**
 * 查询所有辖区内安装的设备
 */
function queryAllDevices() {
  return requestGet(urls.monitor.device.queryAllDevices, {}).then(PARSE_RESULT)
}

/**
 * 查询所有相关标准
 * 
 * @param {*} codes 
 */
function queryAllStandards(codes) {
  return requestGet(urls.monitor.config.queryStandardByIds, {
    codes: codes && codes.join(',') || ''
  }).then(PARSE_RESULT)
}

const Monitor = function($e) {
  this.sites = []
  this.devices = []
  this.orgs = []

  let inited = false
  let $this = this
  let orgMap = {}
  let siteMap = {}
  let deviceMap = {}
  let standardMap = {}

  /**
   * 根据是否超标，充值设备超标定时器
   * 
   * @param {*} dev 
   * @param {*} isExceed 
   */
  function resetExceedTimer(dev, flue, isExceed) {
    if (isExceed) {
      if (flue.exceedTimer == null) {
        flue.exceedTimer = setTimeout(() => {
          // 超标事件
          $e.$emit('device-exceed', dev, flue)
        }, EXCEED_TIMEOUT)
      }
    } else {
      if (flue.exceedTimer != null) {
        clearTimeout(flue.exceedTimer)
        flue.exceedTimer = null
      }
    }
  }

  /**
   * 判断是否超标排放
   * 
   * @param {*} flue 
   */
  function isExceed(dev, flue) {
    let site = siteMap[dev.siteId]
    return parseFloat(site.standard.value) < parseFloat(flue.out.lb.value)
  }

  function isFlueFault(flue) {
    return flue.fan.bad || flue.cleaner.bad || flue.out.lb.bad || flue.out.pm.bad || flue.out.nmhc.bad
  }

  function deviceHasFault(dev) {
    return dev.flues.reduce((fault, flue) => {
      return fault || flue.isFault
    }, false)
  }

  const deviceHasExceed = (dev) => {
    return dev.flues.reduce((exceed, flue) => {
      return exceed || flue.isExceed
    }, false)
  }

  /**
   * 重新计算站点排放信息
   * 
   * @param {*} site 
   */
  function reduceSiteState(site) {
    let reduceDev = (dev, arg) => {
      return dev.flues.reduce((val, flue) => {
        let v = parseFloat(flue.out[arg].value)
        return val > v ? val : v
      }, 0.0)
    }
    let reduceSite = (site, arg) => {
      return site.devices.reduce((val, dev) => {
        let v = reduceDev(dev, arg)
        return val > v ? val : v
      }, 0.0)
    }
    site.lb = reduceSite(site, 'lb')
    site.pm = reduceSite(site, 'pm')
    site.nmhc = reduceSite(site, 'nmhc')
    site.hasExceed = site.devices.reduce((exceed, dev) => {
      return exceed || dev.hasExceed
    }, false)
    site.hasFault = site.devices.reduce((fault, dev) => {
      return fault || dev.hasFault || dev.status == '2'
    }, false)
    site.hasOffline = site.devices.reduce((offline, dev) => offline || dev.status == '1', false)

    // 计算站点状态
    if (site.hasOffline) {
      site.status = 'offline'
    } else if (site.hasFault) {
      site.status = 'fault'
    } else if (site.hasExceed) {
      site.status = 'exceed'
    } else {
      site.status = 'online'
    }
  }

  /**
   * 监听实时数据
   */
  this.listen = (record) => {
    console.log('>> listen: %o', record)
    let data = record.data
    let dev = deviceMap[data.devId || data.deviceCode]
    if (!dev) return

    let type = record.type
    if (type == 'online') {
        dev.status = data.online ? '0' : '1'
    }

    // 消息通知
    switch(type) {
      case 'state':
        $e.$emit('flue-update', dev, data)
        $e.$emit('device-update', dev, data)
        break;
      case 'alarm':
        $e.$emit('alarm', dev, data)
        break;
      case 'online':
        console.log(`>> receive online: %o`, data)
        break;
    }
  }

  // 设备数据更新
  $e.$on('device-update', (dev, record) => {
    // 更新设备数据
    record.flues.reduce((dev, flue) => {
      // 更新通道状态
      flue.isExceed = isExceed(dev, flue)
      flue.isFault = isFlueFault(flue)

      dev.flues[parseInt(flue.flueNo)] = flue

      // FIXME 设备的油烟值不应该是烟道的油烟值
      dev.lb = Object.assign({}, flue.out.lb)
      dev.state.lb = flue.out.lb.value
      dev.state.pm = flue.out.pm.value
      dev.state.nmhc = flue.out.nmhc.value
      dev.state.updateTime = new Date()

      // 设置超标排放定时器
      resetExceedTimer(dev, flue, flue.isExceed)
    }, dev)

    dev.hasFault = deviceHasFault(dev)
    dev.hasExceed = deviceHasExceed(dev)
    dev.status = dev.hasFault ? '2' : '0'

    // 更新站点信息
    reduceSiteState(dev.site)
    $e.$emit('site-update', dev.site)
  })

  const init = () => {
    if (inited) {
      return Promise.resolve($this)
    }

    $this.sites = []
    $this.devices = []
    return queryAllSites().then(resp => {
      // 格式化站点数据，并缓存
      $this.sites.push(...resp.data.map(site => Object.assign({
        devices: [],
        flueCount: 0,
        hasExceed: false,
        hasFault: false,
        hasOffline: false,
        lb: 0,
        pm: 0,
        nmhc: 0,
        standard: null,
        grade: null,
        isCurrent: false
      }, site)))

      // 建立索引
      siteMap = {}
      $this.sites.forEach(site => {
        siteMap[site.id] = site
      })

      // 整理相关组织、执行标准信息
      let orgIds = new Set()
      let standardCodes = new Set()
      $this.sites.forEach(site => {
        orgIds.add(site.officeAreaId)
        orgIds.add(site.officeStreetId)
        standardCodes.add(site.standardCode)
      })
      orgIds = Array.from(orgIds)
      standardCodes = Array.from(standardCodes)

      return Promise.all([
        // 请求组织信息
        OrgApi.queryOrgsByIds(orgIds).then(resp => {
          orgMap = {}
          resp.data.forEach(org => {
            orgMap[org.id] = org
          })
          $this.orgs = resp.data
        }),
        // 请求执行标准信息
        queryAllStandards(standardCodes).then(resp => {
          standardMap = {}
          resp.data.forEach(std => {
            // console.log('>> exceed standard: %o', std)
            standardMap[std.code] = {
              code: std.code,
              name: std.name,
              value: std.value
            }
          })
          $this.sites.forEach(site => {
            site.standard = standardMap[site.standardCode]
            // console.log('>> site standard: %s --> %o', site.standardCode, site.standard)
          })
        }),
        // 请求设备信息
        queryAllDevices().then(resp => {
          $this.devices.splice(0)
          resp.data.filter(dev => siteMap[dev.siteId]).forEach(dev => {
            // 格式化设备信息并缓存
            $this.devices.push(Object.assign({
              flues: [],
              history: [],
              hasExceed: false,
              hasFault: false,
              state: {
                lb: null,
                pm: null,
                nmhc: null,
                updateTime: null
              }
            }, dev))
          })
        })
      ])
    }).then(() => {
      // 过滤无效设备，确认设备所属站点都存在
      console.log('>> devices: %o', $this.devices)
      $this.devices = $this.devices.filter(dev => siteMap[dev.siteId])

      // 整理站点信息：1.生成站点查找表；2.准备站点设备数组；3.绑定站点所属区、街道；4.站点适用标准
      siteMap = {}
      $this.sites.forEach(site => {
        siteMap[site.id] = site
        site.flueCount = 0
        site.isCurrent = false
        site.lb = site.pm = site.nmhc = null
        site.devices = []
        site.officeArea = orgMap[site.officeAreaId]
        site.officeStreet = orgMap[site.officeStreetId]
      })

      // 整理设备信息：1.生成设备查找表；2.关联站点、设备信息；3.设备采样定时器
      deviceMap = {}
      $this.devices.forEach(dev => {
        dev.history = []
        deviceMap[dev.no] = dev
        let site = dev.site = siteMap[dev.siteId]
        if (site) {
          site.devices.push(dev)
          site.flueCount++
        }
      })

      $this.sites.forEach(site => {
        reduceSiteState(site)
      })
      $e.$emit('data-ready')

      console.log('>> Monitor INIT DONE')
      console.log('--     sites: %o', $this.sites)
      console.log('--   devices: %o', $this.devices)
    })
  }

  this.init = () => {
    return init().then(() => inited = true).catch(e => {
      console.error('Site Monitor Instance Initialize failed', e)
      setTimeout(this.init, 5000)
    })
  }

  this.reset = () => {
    inited = false

    this.sites = []
    this.devices = []
    this.orgs = []

    orgMap = {}
    siteMap = {}
    deviceMap = {}
    standardMap = {}

    return this.init()
  }

  this.getSite = (siteId) => siteMap[siteId]
  this.getDevice = (devNo) => deviceMap[devNo]
  this.getOrg = (orgId) => orgMap[orgId]
  this.myOrg = () => {
    console.log(`>> resolve my organize: [${$c.login.officeId}] in ${this.orgs.length} entries: ${this.orgs.map(o => o.id)}`)
    return orgMap[$c.login.officeId]
  }
}

export default Monitor