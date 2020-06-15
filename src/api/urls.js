/**
 * URL配置
 */
const urls = {
  sys: {
    login: `${basePath}/sys/login`,
    logout: `${basePath}/sys/logout`,
    preLogin: `${basePath}/sys/preLogin`,
    checkLogin: `${basePath}/sys/checkLogin`,
    dict: `${basePath}/sys/dict`,
    upload: `${baseRes}/sys/file/upload`,
    download: `${baseRes}/sys/file/download`,
    users: {
      queryById: `${basePath}/sys/users/`,
      roles: `${basePath}/sys/users/roles`,
      updateMyInfo: `${basePath}/sys/users/update`,
      updateMyPassword: `${basePath}/sys/users/password`
    },
    orgs: {
      queryMyOrg: `${basePath}/sys/orgs/my`,
      queryByIds: `${basePath}/sys/orgs/ids`,
      queryChildOrgsByIds: `${basePath}/sys/orgs/children`
    },
  },
  monitor: {
    alarms: {
      queryByPage: `${basePath}/api/biz/alarms`
    },
    site: {
      queryById: `${basePath}/api/sites/`,
      queryByPage: `${basePath}/api/sites`,
      queryAllSites: `${basePath}/api/sites/all`
    },
    device: {
      queryAllDevices: `${basePath}/api/monitor/devices/all`,
      queryState: `${basePath}/api/monitor/devices/state`,
      query24HoursSummary: `${basePath}/api/monitor/devices/24hours`,
      queryMonitorHistory: `${basePath}/api/monitor/devices/history`
    },
    grade: {
      query7DaysGrade: `${basePath}/api/site/grade/7days`
    },
    config: {
      queryStandardByIds: `${basePath}/api/config/standard`
    }
  },
  statistics: {
    queryDistrictSummary: `${basePath}/api/statistics/district`,
    queryDevicesCountForSubdistricts: `${basePath}/api/statistics/devicesOfSubdistricts`,
    querySubdistrictExceed: `${basePath}/api/statistics/subdistrictExceed`,
    queryExceedCounts: `${basePath}/api/statistics/exceedCounts`,
    queryReachSummary: `${basePath}/api/statistics/reachSummary`,
  },
  ws: `${baseSocket}/socket/`
};

export default urls
