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
          label: '站点名称',
          field: 'siteName',
          width: '25%'
        },
        {
          label: '超标总量',
          field: 'totalExceed',
          width: '25%'
        },
        {
          label: '超标时长',
          field: 'duration',
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
    queryGradeSummary() {
      let begDate, endDate = resolveToday()
      switch (this.filter.range) {
        case '1':
          begDate = resolveLastWeek()
          break;
        case '2':
          begDate = resolveLastMonth()
          break;
        case '0':
        default:
          begDate = resolveYesterday()
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
