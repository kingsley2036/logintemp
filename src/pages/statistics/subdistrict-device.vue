<template>
  <chart class="line-chart" :auto-resize="true" :options="options"></chart>
</template>
<script>
export default {
  props: {
    org: Object,
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
          type: "category",
          axisLabel: {
            color: 'lightgray'
          },
          data: []
        }
      ],
      xAxis: [
        {
          type: "value",
          show: false
        }
      ],
      series: [
        {
          name: "安装设备",
          type: "bar",
          data: [],
          barWidth: "10",
          itemStyle: {}
        }
      ]
    };
    return {
      options
    };
  },
  computed: {
    subOrgs() {
      let subOrgs = this.org.children.map(org => {
        return {
          id: org.id,
          name: org.orgName,
          count: 0
        }
      })
      let subMap = subOrgs.reduce((m, o) => {
        m[o.id] = o
        return m
      }, {})
      $e.monitor.devices.filter(dev => dev.site).forEach(dev => {
        let sub = subMap[dev.site.officeStreetId]
        sub && sub.count++
      })
      return subOrgs
    }
  },
  watch: {
    subOrgs() {
      this.options.yAxis[0].data = this.subOrgs.map(o => o.name)
      this.options.series[0].data = this.subOrgs.map(o => o.count)
    }
  }
};
</script>