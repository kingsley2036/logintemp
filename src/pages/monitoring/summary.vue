<template>
  <div class="left-panel">
    <div id="box-summary">
      <div class="summary-item item-total" :class="{active: isChooseAllStates()}" @click="$emit('chooseAllStates')">
        <div class="summary-item-title">监控站点</div>
        <div class="summary-item-value" v-text="summary.total"></div>
      </div>
      <div class="summary-item item-fault" :class="{active: filter.states.includes('fault')}" @click="$emit('toggleState', 'fault')">
        <div class="summary-item-title">故障站点</div>
        <div class="summary-item-value" v-text="summary.fault"></div>
      </div>
      <div class="summary-item item-exceed" :class="{active: filter.states.includes('exceed')}" @click="$emit('toggleState', 'exceed')">
        <div class="summary-item-title">超标站点</div>
        <div class="summary-item-value" v-text="summary.exceed"></div>
      </div>
      <div class="summary-item item-offline" :class="{active: filter.states.includes('offline')}" @click="$emit('toggleState', 'offline')">
        <div class="summary-item-title">离线站点</div>
        <div class="summary-item-value" v-text="summary.offline"></div>
      </div>
    </div>
    <div class="site-list">
      <div class="site-list-title">
        <span>站点列表</span>
        <span style="flex: 1;"></span>
        <Selector class="subdist-selector" value="" v-model="filter.subdistrict">
          <Option label="全部街道" value=""></Option>
          <Option v-for="(item, i) of subdistricts" :key="i" :label="item.label" :value="item.value"></Option>
        </Selector>
      </div>
      <Table
        table-name="siteList"
        ref="siteList"
        :columns="siteColumns"
        :rows="siteList"
        :options="{}"
        :row-class-resolver="siteStateClassResolver"
        :col-class-resolver="columnClassResolver"
        @row-click="chooseRowHandler"
      ></Table>
    </div>
  </div>
</template>
<script>
import Selector from '@/components/base/Selector'
import Option from '@/components/base/Option'
import Table from '@/components/base/Table'

export default {
  components: {
    Selector, Option, Table
  },
  props: {
    summary: Object,
    current: Object,
    filter: Object,
    siteList: Array
  },
  data() {
    return {
      allStates: ['online', 'offline', 'fault', 'exceed'],
      siteColumns: [
        {
          field: 'siteName',
          label: '站点名称',
          width: '35%'
        },
        {
          field: 'flueCount',
          label: '烟道',
          width: '10%'
        },
        {
          field: 'lb',
          label: '油烟',
          width: '15%'
        }
      ],
    }
  },
  computed: {
    'subdistricts'() {
      return $e.monitor.orgs.filter(site => site.grade == '3').map(org => {
        return {
          label: org.orgName,
          value: org.id
        }
      })
    }
  },
  watch: {
    current(val) {
      if (val) {
        this.$nextTick(() => {
          let rowEl = this.$refs.siteList.currentRowEl()
          rowEl && rowEl.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          })
        })
      }
    }
  },
  methods: {
    columnClassResolver(column, site, index) {
      return site && column.field == 'lb' && site.hasExceed && 'site-exceed'
    },
    siteStateClassResolver(site) {
      return (site && this.current && site.id == this.current.id) ? 'current' : ''
    },
    chooseRowHandler(row) {
      this.$emit('chooseSite', row)
    },
    isChooseAllStates() {
      return this.allStates.filter(s => !this.filter.states.includes(s)).length == 0
    }
  }
}
</script>
<style scoped>
#box-summary {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  font-size: 16pt;
  font-weight: 600;
  color: #05f7f9;
}
#box-summary .summary-item {
  display: flex;
  flex-flow: row wrap;
  font-family: yahei, serif;
  align-items: center;
  justify-content: space-between;
  width: 100pt;
  border: solid 1pt rgba(255, 255, 255, 0.0);
  border-radius: 4pt;
  padding: 4pt 8pt;
  margin: 8pt;
  cursor: pointer;
}
#box-summary .summary-item:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
#box-summary .summary-item.active {
  border: solid 1pt rgba(255, 255, 255, 0.3);
}
#box-summary .summary-item .summary-item-title {
  font-size: 11.5pt;
}
#box-summary .summary-item .summary-item-value {
  font-size: 16pt;
}

.subdist-selector {
  flex: 1;
  border: solid 1pt rgba(255,255,255, 0.3);
  border-radius: 20pt;
  padding: 0 0.4em;
}

.site-list{
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-flow: column;
}
.site-list .subdist-selector {
  font: 10pt/11pt normal;
  color: white;
}
.site-list .site-list-title {
  display: flex;
  text-align: left;
  color: #05f7f9;
  font-weight: 600;
  margin-left: 0.5em;
}
.site-list .site-list-title:before {
  content: ' ';
  background-color: #0a9fca;
  padding: 0 2pt;
  margin-right: 4pt;
}
</style>
<style>
.site-exceed {
  background-color: #fc1c03;
  border-radius: 1pt;
}
</style>