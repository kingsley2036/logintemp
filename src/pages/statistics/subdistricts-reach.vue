<template>
  <Table
    table-name="reach-list"
    :columns="columns"
    :rows="list"
    :options="{}"
    :row-class-resolver="rowClassResolver"
    class="subdistrict-reach-list"
  >
  </Table>
</template>
<script>
import Table from '@/components/base/Table'
import StatApi from '@/api/statistics/statistics'

export default {
  components: {
    Table
  },
  props: {
    filter: Object,
    org: Object
  },
  data() {
    return {
      list: [],
      columns: [
        {
          label: '',
          field: 'no',
          width: '10%'
        },
        {
          label: '街道',
          field: 'orgName',
          width: '25%'
        },
        {
          label: '达标',
          field: 'reach',
          width: '25%'
        },
        {
          label: '不达标',
          field: 'unreach',
          width: '25%'
        },
        {
          label: '达标率',
          field: 'percent',
          width: '25%'
        }
      ]
    }
  },
  mounted() {
    this.refreshData()
  },
  computed: {
    dateRange() {
      return this.filter.range
    }
  },
  watch: {
    dateRange(val) {
      this.refreshData()
    }
  },
  methods: {
    refreshData() {
      this.queryGradeSummary().then(resp => {
        console.log(`>>>> reach-standard summary: %o`, resp)
        this.list = resp.data.map((org, i) => {
          let values= org.value
          return {
            no: i + 1,
            orgName: values[1],
            reach: values[2],
            unreach: values[3],
            percent: formatFloat(100 * values[2] / (values[2] + values[3]), 2) + '%'
          }
        })
      })
    },
    resolveToday() {
      return new Date().format('yyyy-MM-dd')
    },
    resolveYesterday() {
      let d = new Date(new Date().getTime() - 1000 * 3600 * 24)
      return d.format('yyyy-MM-dd')
    },
    resolveLastWeek() {
      let d = new Date(new Date().getTime() - 1000 * 3600 * 24 * 7)
      return d.format('yyyy-MM-dd')
    },
    resolveLastMonth() {
      let d = new Date(new Date().getTime() - 1000 * 3600 * 24 * 30)
      return d.format('yyyy-MM-dd')
    },
    queryGradeSummary() {
      let begDate, endDate = this.resolveToday()
      switch (this.filter.range) {
        case '1':
          begDate = this.resolveLastWeek()
          break;
        case '2':
          begDate = this.resolveLastMonth()
          break;
        case '0':
        default:
          begDate = this.resolveYesterday()
          break;
      }
      return StatApi.queryReachSummary({ begDate, endDate })
    },
    rowClassResolver(row, index) {
      console.log(`>> row class resolve: [${index}]`, row)
      return index < 2 ? 'highlight-row' : ''
    }
  }
}
</script>
<style lang="scss">
.subdistrict-reach-list {
  display: flex;
  flex-flow: column;
  height: 100%;
  text-align: left;
  font-size: 10pt;
  margin-top: 10pt;
  color: #859dca;
  .row.title {
    font-weight: 600;
  }
  .row {
    border-bottom: solid 1px #083d6b;
    margin: 0.2em 0.5em;
    padding: 0.5em 0;
  }
  .col {
    overflow: hidden;
    text-align: center;
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .row.highlight-row {
    background: #23a9f3;
    color: white;
    font-weight: bold;
    .col.col-no {
      background: #23a9f3;
    }
  }
  .table-body {
    .col-no {
      text-align: left;
      padding-left: 1.5em;
    }
  }
}
</style>