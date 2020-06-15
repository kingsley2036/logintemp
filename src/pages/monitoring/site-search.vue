<template>
  <div class="search-box-wrapper">
    <Search class="search-input" v-model="filter.siteName" @do-search="searchSiteHandler">
      <Option v-for="site of filteredSites" :key="site.if" :label="site.siteName" :value="site.siteName" :disabled="site.disabled"></Option>
    </Search>
  </div>
</template>
<script>
import Search from '@/components/base/Search'
import Option from '@/components/base/Option'

export default {
  components: {
    Search, Option
  },
  props: {
    sites: Array,
    filter: Object
  },
  data() {
    return {}
  },
  computed: {
    filteredSites() {
      let sites = this.sites.filter(site => {
        let result = !this.filter.siteName || site.siteName.includes(this.filter.siteName)
        return result
      })
      sites = sites.length ? sites : [{
        siteName: '-- 没有匹配的站点 --',
        disabled: true
      }]
      return sites
    },
  },
  methods: {
    searchSiteHandler(siteName) {
      console.log(`>> choose site ${siteName}`)
      this.$emit('search-site', siteName)
    }
  }
}
</script>
<style scoped>
.search-box-wrapper {
  display: block;
  width: 180pt;
  height: 0;
  overflow: visible;
  position: relative;
  left: 40pt;
  top: 40pt;
  z-index: 1000;
}
.select-option:hover {
  background-color: rgba(70, 70, 70, 0.9);
}
</style>>