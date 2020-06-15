<template>
  <chart class="line-chart" :auto-resize="true" :options="options"></chart>
</template>
<script>
import StatApi from '@/api/statistics/statistics'

export default {
  props: {
    filter: Object
  },
  data() {
    const options = {
      color: ["#20a8e4", "#ded424"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      yAxis: [
        {
          type: "value",
          axisLabel: {
            color: "lightgray"
          },
        }
      ],
      xAxis: [
        {
          type: "category",
          axisLabel: {
            color: "lightgray"
          },
          data: []
        }
      ],
      series: [
        {
          name: "超标次数",
          type: "line",
          data: [],
          itemStyle: {}
        },
        {
          name: "超标排放",
          type: "bar",
          data: [],
          barWidth: 30,
          itemStyle: {}
        }
      ]
    };
    return {
      options
    };
  },
  mounted() {
    this.refreshCharts()
  },
  computed: {
    dateRange() {
      return this.filter.range
    }
  },
  watch: {
    dateRange(val) {
      this.refreshCharts()
    }
  },
  methods: {
    refreshCharts() {
      this.queryExceedSummary().then(resp => {
        console.log('########### subdistrice exceed ###############', resp)
        let list = resp.data || []
        this.options.xAxis[0].data = list.map(entry => entry.name)
        this.options.series[0].data = list.map(entry => entry.count || 0)
        this.options.series[1].data = list.map(entry => formatFloat(entry.sum || 0, 2))
      })
    },
    queryExceedSummary() {
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
      return StatApi.querySubdistrictExceed({begDate, endDate})
    }
  }
};
</script>