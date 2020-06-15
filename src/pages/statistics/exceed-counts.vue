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
      color: ["#20a8e4", "#ded424", '#ffae5c', 'transparent'],
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
      series: [
        {
          name: "达标占比",
          type: "pie",
          data: [],
          radius: ['40%', '45%'],
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          itemStyle: { }
        },
        {
          name: "超标占比",
          type: "pie",
          data: [],
          radius: ['35%', '40%'],
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          itemStyle: { }
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
      this.queryExceedCounts().then(resp => {
        console.log('########### subdistrice exceed ###############', resp)
        let data = resp.data
        this.options.series[0].data = [
            {
                name: '未超标',
                value: data.total - data.exceed,
                itemStyle: {
                  color: '#36e5ff'
                },
              },
              {
                name: '超标',
                value: data.exceed,
                itemStyle: {
                  color: 'rgba(0, 0, 0, 0)'
                }
            }
        ]
        this.options.series[1].data = [
            {
                name: '未超标',
                value: data.total - data.exceed,
                itemStyle: {
                  color: 'rgba(0, 0, 0, 0)'
                }
            },
            {
              name: '超标',
              value: data.exceed,
              label: {
                show: true,
                position: 'center',
                formatter: '{a|超标}\n{b|{d}%}',
                rich: {
                  a: {
                    color: 'red',
                    fontSize: 24,
                    lineHeight: 40
                  },
                  b: {
                    color: '#36e5ff',
                    fontSize: 36,
                    fontWeight: 'bold',
                    height: 40
                  },
                },
              },
              itemStyle: {
                color: '#ffae5c'
              }
            }
        ]
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
    queryExceedCounts() {
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
      return StatApi.queryExceedCounts({begDate, endDate})
    }
  }
};
</script>
