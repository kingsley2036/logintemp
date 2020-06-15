<template>
  <div class='container'>
    <Summary class="left-panel"
      :summary="summary"
      :filter="filter"
      :siteList="sortedSites"
      :current="currentSite"
      @chooseSite="chooseSiteHandler"
      @toggleState="handleToggleState"
      @chooseAllStates="handleChooseAllStates"
    ></Summary>
    <div class="right-panel" style="">
      <SiteSearch :sites="sortedSites" :filter="filter" @search-site="searchSiteHandler"/>
      <Map class="site-map" :siteList="sortedSites" :current="currentSite" :filter="filter" @choose-site="chooseSiteHandler" @toggleState="handleToggleState"/>
      <!-- 站点详情 -->
      <SiteDetail v-if="currentSite" :class="['site-detail', currentSite ? 'show' : 'hidden' ]" :site="currentSite" @hide-detail="chooseSiteHandler()"></SiteDetail>
    </div>
  </div>
</template>

<script>
import Summary from '@/pages/monitoring/summary'
import SiteDetail from '@/pages/monitoring/site-detail'
import SiteSearch from '@/pages/monitoring/site-search'
import Map from '@/pages/monitoring/Map'

const STATES = ['online', 'offline', 'fault', 'exceed']

function sortSite(site1, site2) {
  let v1 = site1.lb == null ? -1 : site1.lb
  let v2 = site2.lb == null ? -1 : site2.lb
  let r = v2 - v1
  return r == 0 ? (site2.flueCount - site1.flueCount) : r
}

export default {
  components: {
    Summary, SiteDetail, SiteSearch, Map
  },
  data() {
    return {
      summary: {
        total: 0,
        exceed: 0,
        fault: 0,
        offline: 0
      },
      filter: {
        subdistrict: '',
        siteName: '',
        states: [].concat(STATES)
      },
      monitor: $e.monitor,
      sites: [],
      currentSite: null,
    }
  },
  computed: {
    sortedSites() {
      const $states = this.filter.states
      let sorted = this.sites.filter(site => {
        let b = !this.filter.subdistrict || [site.officeAreaId, site.officeStreetId].includes(this.filter.subdistrict)
        let c = false
        c |= ($states.includes('exceed') && site.hasExceed)
        c |= ($states.includes('fault') && site.hasFault)
        c |= ($states.includes('offline') && site.hasOffline)
        c |= ($states.includes('online') && !site.hasOffline)
        return b && c
      })
      return sorted
    },
    showMap() {
      this.sites != null
    },
  },
  created() {
    const $this = window.$monitor = this

    $e.$on('device-update', (dev, record) => {
      if ($this.currentSite && dev.siteId == $this.currentSite.id && record.flues.length > 0) {
        let flue = record.flues[0]
      }
    })

    $e.$on('site-update', (site) => {
      console.log('## site updated')
      $this.rebuildSiteData()
    })
  },
  mounted() {
    const $this = this
    $e.ready.then(() => {
      $this.sites = $e.monitor.sites.slice()
      $this.rebuildSiteData()
    })
  },
  watch: {
    'filter.states' () {
      this.rebuildSiteData()
    }
  },
  methods: {
    sortSites() {
      this.sites.sort(sortSite)
      // this.$set(this, 'sortedSites', this.sortedSites)
      // console.log('>> sorted sites: %o', this.sortedSites)
    },
    rebuildSiteData() {
      // 统计站点
      this.summary.total = this.sortedSites.length
      this.summary.exceed = this.summary.fault = this.summary.offline = 0
      // this.sortedSites.forEach(site => {
      this.sites.forEach(site => {
        site.hasExceed && this.summary.exceed++
        site.hasFault && this.summary.fault++
        site.hasOffline && this.summary.offline++
      })
      // 站点排序
      this.sortSites()
    },
    chooseSiteHandler(site) {
      console.log('## choose site: %o', site)
      let lastOne = this.currentSite
      if (lastOne && lastOne != site) {
        this.$set(lastOne, 'isCurrent', false)
      }
      if (site == null) {
        this.currentSite = null
        return
      } 
      if (lastOne && lastOne.id == site.id) {
        this.$set(lastOne, 'isCurrent', false)
        this.currentSite = null
        return
      }
      this.currentSite = site
      if (site == null) return
      this.$set(this.currentSite, 'isCurrent', true)
    },
    searchSiteHandler(siteName) {
      let site = this.sortedSites.filter(site => site.siteName == siteName)[0]
      if (site) {
        this.chooseSiteHandler(site)
      }
      console.log(`>> choose site ${siteName} %o`, this.currentSite)
    },
    handleToggleState(state) {
      this.toggleState(state)
    },
    handleChooseAllStates() {
      this.chooseAllStates()
    },
    // ----------------
    // 状态过滤
    hasState(state) {
      return this.filter.states.includes(state)
    },
    chooseAllStates() {
      this.filter.states = [].concat(STATES)
    },
    isChooseAllStates () {
      return STATES.filter(s => !this.filter.states.includes(s)).length == 0
    },
    toggleState(state) {
      if (this.hasState(state)) {
        this.filter.states = this.filter.states.filter(s => s != state)
      } else {
        this.filter.states.push(state)
      }
    }
  }
}
 </script>

<style lang="scss">
.container{
  display: flex;
  justify-content: space-between;
  flex: 1 1 auto;
  overflow: hidden;
  margin: 8pt;
  .left-panel {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    font-size: 12pt;
    min-width: 300pt;
    max-width: 300pt;
    border: solid 1.5pt #1e7fc6;
    border-radius: 8pt;
    margin-right: 9pt;
    padding: 4pt;
  }
  .right-panel {
    flex: 1;
    display: flex;
    flex-flow:column nowrap;
    overflow: hidden;
    .site-detail.show {
      animation: popout .3s linear;
    }
    .site-detail.hidden {
      animation: popin .3s linear;
    }
  }
}
</style>
<style>
.table-siteList {
  display: flex;
  flex-flow: column;
  min-height: 0;
  text-align: left;
  font-size: 10pt;
}
.table-siteList .row {
  border-bottom: solid 1px #083d6b;
  margin: 0.2em 0.5em;
  padding: 0.5em 1em;
}
.table-siteList .row.current {
  background-color: rgba(30, 127, 198, 0.3);
}
.row-title-siteList {
  color: #abcbff;
  font-weight: 600;
}
.table-siteList .table-body {
  color: white;
}
.table-siteList .table-body .col {
  overflow: hidden;
  text-align: left;
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.table-siteList .table-body .col-lb, .table-siteList .table-body .col-pm, .table-siteList .table-body .col-nmhc {
  padding: 1pt 4pt;
}
.table-siteList .row.exceed .col-lb {
  background-color: red;
  border-radius: 4pt;
}
</style>