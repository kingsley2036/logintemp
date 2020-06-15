<template>
  <div class="item">
    <!-- 如果是站点则不显示办事处数据 -->
    <dl v-if="orgGrade == '2'">
      <dt v-text="subCount">3</dt>
      <dd>办事处数</dd>
    </dl>
    <dl>
      <!-- <dt>{{SiteStatusInfo.siteNum}}</dt> -->
      <dt v-text="siteTotal.length">22</dt>
      <dd>监控站点数</dd>
    </dl>
    <dl>
      <!-- <dt>{{SiteStatusInfo.onlineSiteNum}}</dt> -->
      <dt v-text="siteOnline.length">22</dt>
      <dd>在线站点数</dd>
    </dl>
    <dl>
      <!-- <dt>{{SiteStatusInfo.brokenSiteNum}}</dt> -->
      <dt v-text="siteFault.length">0</dt>
      <dd>故障站点数</dd>
    </dl>
    <dl>
      <!-- <dt>{{SiteStatusInfo.exceedSiteNum}}</dt> -->
      <dt v-text="siteFault.length">2</dt>
      <dd>超标站点数</dd>
    </dl>
  </div>
</template>
<script>
export default {
  props: {
    filter: Object,
    org: Object,
    orgGrade: String
  },
  computed: {
    subCount() {
      return this.org && this.org.children.length || 0
    },
    siteTotal() {
      return $e.monitor.sites.filter(this.execFilter)
    },
    siteOffline() {
      return this.siteTotal.filter(dev => dev.status == '1')
    },
    siteOnline() {
      return this.siteTotal.filter(dev => dev.status != '1')
    },
    siteExceed() {
      return this.siteTotal.filter(dev => dev.hasExceed)
    },
    siteFault() {
      return this.siteTotal.filter(dev => dev.hasFault)
    }
  },
  methods: {
    execFilter(site) {
      return site && site.devices.length > 0 && (!this.filter.district || site.officeAreaId == this.filter.district) && 
          (!this.filter.subdistrict || site.officeStreetId == this.filter.subdistrict)
    }
  }
}
</script>
<style lang="scss" scoped>
.item {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  dl {
    width: 150px;
    height: 122px;
    text-align: center;
    padding: 25px 0px;
    box-shadow: inset 0px 0px 15px 0px rgba(0, 128, 202, 0.8);
    margin: 15px;
    dt {
      font-size: 42px;
      color: #3ce4ff;
      font-weight: bold;
      margin: 0;
    }
    dd {
      font-size: 18px;
      font-weight: bold;
      margin: 0;
      color: #fff;
    }
  }
}
</style>