<template>
  <div class="site-detail">
    <div class="close-btn" style="position: absolute; height: 0;">
      <button
        type="button"
        style="
      bottom: 18pt;
      width: 60pt;
      position: relative;
      z-index: 1000;
      background: gray;
      height: 18pt;
      border: none;
      color: white;
      font-size: 9pt;"
        @click="hideDetailHandler"
      >隐藏</button>
    </div>
    <div class="site-infos">
      <div class="site-title">
        <span v-text="site.siteName"></span>
        <span class="grade-level" v-if="site.grade" :class="'level-' + site.grade.gradeCode" v-text="site.grade.grade"></span>
      </div>
      <div class="site-address">
        <v-icon class="detail-flag" name="map-marker" scale="0.7"></v-icon>
        <span v-text="'地址：'"></span>
        <span :title="site.address" v-text="site.address"></span>
      </div>
      <div class="site-phone">
        <v-icon class="detail-flag" name="phone" scale="0.7"></v-icon>
        <span v-text="site.legalPerson + '：'"></span>
        <span v-text="site.phone"></span>
      </div>
      <div class="site-cleaner">
        <v-icon class="detail-flag" name="tint" scale="0.7"></v-icon>
        <span v-text="'净化器：'"></span>
        <span v-text="todayRun('cleaner')"></span>
        <span v-for="(flue, i) of flues" :key="i">
          <span class="on-off">{{ onOffState(flue.cleaner.onOff )}}</span>
        </span>
      </div>
      <div class="site-fan">
        <v-icon class="detail-flag" name="cog" scale="0.7"></v-icon>
        <span v-text="'风机：'"></span>
        <span v-text="todayRun('fan')"></span>
        <span v-for="(flue, i) of flues" :key="i">
          <span class="on-off">{{ onOffState(flue.fan.onOff )}}</span>
        </span>
      </div>
      <div class="last-voc">
        <span class="detail-flag"></span>
        <span>VOC：</span>
        <span v-text="formatFloat(summary.yesterday.voc, 2) || '无'"></span>
        <span v-if="formatFloat(summary.yesterday.voc, 2)" class="param-unit">&nbsp;ppm</span>
        <span class="param-info">（昨日均值）</span>
      </div>
      <div class="last-lb">
        <span class="detail-flag"></span>
        <span>油烟：</span>
        <span v-text="formatFloat(summary.yesterday.lb, 2) || '无'"></span>
        <span v-if="formatFloat(summary.yesterday.lb, 2)" class="param-unit">&nbsp;mg/m<sup>3</sup></span>
        <span class="param-info">（昨日均值）</span>
      </div>
      <div class="last-ss">
        <span class="detail-flag"></span>
        <span>颗粒物：</span>
        <span v-text="formatFloat(summary.yesterday.pm, 2) || '无'"></span>
        <span v-if="formatFloat(summary.yesterday.pm, 2)" class="param-unit">&nbsp;mg/m<sup>3</sup></span>
        <span class="param-info">（昨日均值）</span>
      </div>
      <div class="last-nmhc">
        <span class="detail-flag"></span>
        <span>非甲烷总烃：</span>
        <span v-text="formatFloat(summary.yesterday.nmhc, 2) || '无'"></span>
        <span v-if="formatFloat(summary.yesterday.nmhc, 2)" class="param-unit">&nbsp;mg/m<sup>3</sup></span>
        <span class="param-info">（昨日均值）</span>
      </div>
    </div>
    <div class="detail-panel">
      <div class="detail-title">
        <a
          class="tab"
          :class="{'tab-active': detail.active == 'realtime'}"
          @click="detail.active = 'realtime'"
        >实时监控</a>
        <!-- <a class="tab" :class="{'tab-active': detail.active == '24hours'}" @click="detail.active = '24hours'">24小时数据</a> -->
        <a
          class="tab"
          :class="{'tab-active': detail.active == 'history'}"
          @click="detail.active = 'history'"
        >历史数据</a>
        <a
          class="tab"
          :class="{'tab-active': detail.active == 'grade'}"
          @click="detail.active = 'grade'"
        >评级走势</a>
        <a class="tab" @click="toAlarms">报警记录</a>
      </div>
      <div class="detail-content">
        <div class="site-graph" v-if="detail.active == 'realtime'">
          <!-- 单一设备 -->
          <chart v-if="flues.length == 1" :auto-resize="true" :options="echarts.realtime.options[0]"></chart>
          <div v-if="flues.length == 1" class="flue-current-state">
            <span class="flue-state-label">油烟值:</span>
            <span class="flue-state-value state-lb" v-text="formatFloat(site.devices[0].state.lb, 2) || '无'"></span>
            <span class="flue-state-label">颗粒物:</span>
            <span class="flue-state-value state-pm" v-text="formatFloat(site.devices[0].state.pm, 2) || '无'"></span>
            <span class="flue-state-label">非甲烷总烃:</span>
            <span class="flue-state-value state-nmhc" v-text="formatFloat(site.devices[0].state.nmhc, 2) || '无'"></span>
            <span class="update-time-label">更新时间:</span>
            <span class="update-time" v-text="formatUpdateTime(site.devices[0].state.updateTime)"></span>
          </div>
          <!-- 多台设备 -->
          <div v-if="flues.length >  1" class="chart-container">
            <div class="flues-selector">
              <a v-for="(flue, i) of flues" :key="i" class="flue-label"
                :class="[(i == detail.chartNo) && 'active']" v-text="flue.label" @click="handleChooseFlue(i, flue)"></a>
            </div>
            <chart :auto-resize="true" :options="echarts.realtime.options[detail.chartNo]"></chart>
            <div class="flue-current-state">
              <span class="flue-state-label">油烟值:</span>
              <span class="flue-state-value state-lb" v-text="formatFloat(site.devices[detail.chartNo].state.lb, 2) || '无'"></span>
              <span class="flue-state-label">颗粒物:</span>
              <span class="flue-state-value state-pm" v-text="formatFloat(site.devices[detail.chartNo].state.pm, 2) || '无'"></span>
              <span class="flue-state-label">非甲烷总烃:</span>
              <span class="flue-state-value state-nmhc" v-text="formatFloat(site.devices[detail.chartNo].state.nmhc, 2) || '无'"></span>
              <span class="update-time-label">更新时间:</span>
              <span class="update-time" v-text="formatUpdateTime(site.devices[detail.chartNo].state.updateTime)"></span>
            </div>
          </div>
          <!-- 无配置设备 -->
          <div class="nodata-box" v-if="flues.length == 0">
            没有有效烟道配置
          </div>
        </div>
        <div class="site-graph" v-if="detail.active == 'history'">
          <div class="choose-date-range">
            <DatePicker
              :date="history.startDate"
              :limit="history.filter.limit"
              :option="history.filter.option"
              @change="startDateChangeHandler"
              class="calendar"
            />
            <span class="split" style="padding: 4pt 8pt; display: inline-block;">至</span>
            <DatePicker
              :date="history.endDate"
              :limit="history.filter.limit"
              :option="history.filter.option"
              @change="startDateChangeHandler"
              class="calendar"
            />
            <button type="button" @click="doSearchHistory">
              查询
            </button>
          </div>
          <chart v-if="flues.length == 1" :auto-resize="true" :options="echarts.history.options[0]"></chart>
          <div v-if="flues.length > 1" class="chart-container">
            <div class="flues-selector">
              <a v-for="(flue, i) of flues" :key="i" class="flue-label"
                :class="[(i == detail.chartNo) && 'active']" v-text="flue.label" @click="handleChooseFlue(i, flue)"></a>
            </div>
            <chart :auto-resize="true" :options="echarts.history.options[detail.chartNo]"></chart>
          </div>
          <div class="nodata-box" v-if="flues.length == 0">
            没有有效烟道配置
          </div>
        </div>
        <div class="site-graph" v-if="detail.active == 'grade'">
          <chart :auto-resize="true" :options="echarts.grade.options"></chart>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DatePicker from "vue-datepicker/vue-datepicker-es6"
import Api from "@/api/monitoring/monitoring"

const colors = ["#5793f3", "#d14a61", "#675bba", "black", 'white']
const DEFAULT_FORMATER = function(params) {
  return (
    "油烟值  " +
    params.value +
    (params.seriesData.length
      ? "：" + formatFloat(params.seriesData[0].data, 4)
      : "")
  )
}

const options = (titles, data, formatter = DEFAULT_FORMATER) => {
  return {
    color: colors,
    tooltip: {
      trigger: "none",
      axisPointer: { type: "cross" }
    },
    grid: { top: 28, bottom: 20 },
    xAxis: [
      {
        type: "category",
        axisTick: { alignWithLabel: true },
        axisLine: { onZero: true, lineStyle: { color: colors[3] } },
        axisPointer: {
          label: {
            color: colors[4],
            formatter
          }
        },
        data: titles
      }
    ],
    yAxis: [
      {
        name: "油烟（mg/m3）",
        type: "value",
        show: true,
        color: colors[3],
        minInterval: 1,
        axisTick: { lineStyle: { color: colors[3] } },
        axisLine: { onZero: true, lineStyle: { color: colors[3] } },
        splitLine: {
          show: false,
          interval: 1,
          lineStyle: { color: "darkgray" }
        },
        axisLabel: { show: true },
        axisPointer: { show: false }
      }
    ],
    series: [
      {
        name: "油烟值",
        type: "line",
        smooth: true,
        data: data
      },
      {
        name: "标准值",
        type: "line",
        smooth: true,
        symbol: "none",
        data: data.map(v => 0)
      }
    ]
  }
}

const resolveSimpling = (list, now) => {
  let a = list.filter(item => {
    return new Date(item.createDate).getTime() >= now;
  })
  return a
}

export default {
  components: {
    DatePicker
  },
  props: {
    site: Object
  },
  data() {
    return {
      detail: {
        active: null,
        chartNo: 0
      },
      current: {
        device: null,
        history: [],
        grade: []
      },
      summary: {
        yesterday: {
          voc: null,
          lb: null,
          pm: null,
          nmhc: null
        }
      },
      echarts: {
        realtime: {
          options: []
        },
        history: {
          options: []
        },
        grade: {
          options: null
        }
      },
      history: {
        filter: {
          start: new Date(new Date().getTime() - 1000 * 3600 * 24 * 180),
          end: "",
          option: {
            type: "day", // day , multi-day //针对日期的限制，
            week: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            month: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月"
            ],
            format: "YYYY-MM-DD", // YYYY-MM-DD 日期
            inputStyle: {    			// input 样式
              'display': 'inline-block',
              'padding': '6px',
              'width':'120px',
              'border': '2px solid #fff',
              'border-radius': '2px',
              'color': '#5F5F5F',
              'margin':'0'
            },
            color: {
              // 字体颜色
              header: "#35acff", // 头部
              headerText: "#fff" // 头部文案
            },
            buttons: {
              // button 内容自定义
              ok: "确定",
              cancel: "取消"
            },
            overlayOpacity: 0.5, // 遮罩透明度
            placeholder: "请选时间", // 提示日期
            dismissible: false // 默认true 待定
          },
          limit: [
            {
              type: "fromto",
              from: resolveDay(-90), //最早的开始时间
              to: new Date() //这个时间是我自己拼接出来的当前时间，也可以自己写入
            }
          ]
        },
        startDate: {
          time: resolveLastWeek()
        },
        endDate: {
          time: resolveYesterday()
        }
      },
      monitor: $e.monitor
    };
  },
  mounted() {
    this.init()
  },
  computed: {
    flues() {
      let f = this.site.devices
        .map(dev => Object.assign({
            label: dev.no
          }, dev.flues.filter(f => f)[0] || {
            fan: {},
            cleaner: {}
          })
        )
      return f
    }
  },
  watch: {
    site() {
      this.init()
    }
  },
  methods: {
    init() {
      this.detail.active = "realtime"
      this.detail.chartNo = 0
      this.summary.yesterday = {
        voc: null,
        lb: null,
        pm: null,
        nmhc: null
      }

      // 获取站点下设备历史，并启动实时记录
      let devIds = []
      let devNos = new Set()
      console.log(`>> devices of current site: %o`, this.site.devices)
      this.site.devices.forEach(dev => {
        dev.history.splice(0)
        devIds.push(dev.id)
        devNos.add(dev.no)
      });
      devNos = Array.from(devNos)

      // rebuild echarts options Array
      this.echarts.realtime.options = devIds.map(i => options([], []))
      this.echarts.history.options = devIds.map(i =>
        Object.assign(options([], []), {
          grid: { top: 28, bottom: 20 }
        })
      );
      this.echarts.grade.options = options([], [], (params) => {
        return (
          "评级 " +
          params.value +
          (params.seriesData.length
            ? "：" + formatFloat(params.seriesData[0].data, 1)
            : "")
        )
      })

      let $this = this

      // 实时曲线：定时采样
      setInterval(() => {
        if (!$this.site) return

        this.site.devices.forEach((dev, i) => {
          let now = Date.now(),
            history = dev.history
          let titles = [],
            data = []

          for (let beg = now - 1000 * 60 * 30; beg <= now; beg += 1000 * 20) {
            titles.push(new Date(beg).format("hh:mm"));
            history = resolveSimpling(history, beg)
            if (history.length == 0) break
            data.push(history[0].lbValue)
          }

          // 清除过期数据
          dev.history = dev.history.filter(
            item => new Date(item.createDate) >= now - 1000 * 60 * 30
          )
          // 添加新采样数据
          let firstFlue = dev.flues.filter(flue => flue != null)[0]
          if (firstFlue) {
            dev.history.push({
              deviceNo: dev.no,
              lbValue: firstFlue.out.lb.value,
              lbAlarm: firstFlue.out.lb.alarm,
              lbBad: firstFlue.out.lb.isBad,
              createDate: new Date().format("yyyy-MM-dd hh:mm:ss")
            });
          } else {
            dev.history.push({
              deviceNo: dev.no,
              lbValue: 0,
              lbAlarm: false,
              lbBad: null,
              createDate: new Date().format("yyyy-MM-dd hh:mm:ss")
            })
          }

          // 更新图表
          // console.log(`>> realtime options[${i}]`, $this.echarts.realtime.options[i])
          $this.echarts.realtime.options[i].xAxis[0].data = titles
          $this.echarts.realtime.options[i].series[0].data = data
          $this.echarts.realtime.options[i].series[1].data = data.map(
            v => dev.site.standard.value
          )
        })
      }, 1000 * 20)

      // 近期历史，实时监控
      let begTime = new Date(Date.now() - 1000 * 60 * 30).format('yyyy-MM-dd hh:mm:ss')
      Api.queryDeviceState(devIds, begTime).then(resp => {
        console.log("## device state: %o", resp.data)
        // build titles/data list
        resp.data.forEach(devState => {
          let dev = this.monitor.getDevice(devState.deviceNo)
          dev.history.push(...devState.history)
          if (devState.history.length > 0) {
            let last = devState.history[devState.history.length - 1]
            dev.state.lb = last.lbValue
            dev.state.pm = last.pmValue
            dev.state.nmhc = last.nmhcValue
            dev.state.updateTime = new Date(last.createDate)
          }
        })
        this.refreshRealtimeHistory()
      })

      /*
      Api.query24HoursSummary(devIds).then(resp => {
        console.log("## 24 Hours summary", resp.data)
      })
      */

      let yesterday = resolveYesterday()
      Api.queryMonitorHistory(devNos, yesterday, yesterday).then(resp => {
        console.log(`yesterday summary:`, resp.data)
        if (resp.data && resp.data.length > 0) {
          let data = resp.data[0]
          let s = $this.summary
          s.yesterday.lb = data.lbValue
          s.yesterday.pm = data.pmValue
          s.yesterday.nmhc = data.nmhcValue
        }
      })

      // 按默认参数查询历史
      this.doSearchHistory()

      // TODO 7天评级
      Api.query7DaysGrade($this.site.id).then(resp => {
        console.log("## 7 Days grade", resp.data)
        let grades = ($this.current.grade = resp.data.filter(g => g.score))
        let titles = grades.map(g => new Date(g.beginDate).format("MM-dd"))
        let data = grades.map(g => g.score)
        $this.site.grade = (grades && grades.length > 0 && grades[grades.length - 1]) || null
        $this.echarts.grade.options.xAxis[0].data = titles
        $this.echarts.grade.options.series[0].data = data
      })
    },
    refreshRealtimeHistory() {
      let $this = this;

      this.site.devices.forEach((dev, i) => {
        let now = Date.now(),
          history = dev.history
        let titles = [],
          data = [];
        for (let beg = now - 1000 * 60 * 30; beg <= now; beg += 1000 * 20) {
          titles.push(new Date(beg).format("hh:mm"))
          history = resolveSimpling(history, beg)
          if (history.length == 0) break
          data.push(history[0].lbValue)
        }
        dev.history = dev.history.filter(
          item => new Date(item.createDate) >= now - 1000 * 60 * 30
        )

        $this.echarts.realtime.options[i].xAxis[0].data = titles
        $this.echarts.realtime.options[i].series[0].data = data
        $this.echarts.realtime.options[i].series[1].data = data.map(
          v => dev.site.standard.value
        )
      })
    },
    startDateChangeHandler(date) {
      console.log('>> choose start date', date)
    },
    doSearchHistory() {
      console.log(`>> do search history: ${this.history.startDate.time} - ${this.history.endDate.time}`)
      const $this = this
      // 历史记录
      let devNos = this.site.devices
        .map(dev => dev.no)
        .reduce((a, d) => a.concat([d]), []);
      let historys = this.current.history = devNos.map(no => {
        return {
          no: no,
          data: []
        }
      })
      let historyMap = historys.reduce((m, h) => {
        m[h.no] = h
        return m
      }, {})
      Api.queryMonitorHistory(devNos, this.history.startDate.time, this.history.endDate.time).then(resp => {
        console.log("## device monitor history: %o", resp.data);
        // build titles/data list
        resp.data.forEach(d => {
          historyMap[d.deviceNo].data.push(d)
        });
        console.log("## device monitor history: %o", historys);
        $this.current.history.forEach((list, i) => {
          let titles = list.data.map(l => l.date)
          let data = list.data.map(l => l.lbValue)
          let start = titles.length - 60 * 24
          $this.echarts.history.options[i].xAxis[0].data = titles
          $this.echarts.history.options[i].series[0].data = data
        })
      })
    },
    todayRun(prop) {
      if (this.site) {
        let run = 0;
        this.site.devices.forEach(dev => {
          dev.flues
            .filter(flue => flue[prop].onOff == "on")
            .forEach(flue => {
              run += 1;
            });
        });
        return `${parseInt(run / 60)}小时${parseInt(run % 60)}分钟（今日运行）`;
      }
    },
    onOffState: state => (state == "on" ? "开" : "关"),
    hideDetailHandler() {
      this.$emit("hide-detail");
    },
    toAlarms() {
      this.$router.push("record", {
        siteId: this.site.id
      });
    },
    handleChooseFlue(i, flue) {
      this.detail.chartNo = i
    },
    formatFloat,
    formatUpdateTime(time) {
      return time && time.format('hh:mm:ss') || '无'
    }
  }
};
</script>
<style lang="scss" scoped>
.site-detail {
  display: flex;
  font-size: 10pt;
  text-align: left;
  border: none;
  background-color: #00192e;
  height: 185pt;
  color: black;
  .site-infos {
    color: white;
    min-width: 280pt;
    padding: 8pt;
    background-color: #0b4e92;
    > * {
      margin: 2pt 4pt;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .detail-flag {
      display: inline-block;
      width: 14pt;
    }
    .site-title {
      display: inline-block;
      font-size: 15pt;
      font-weight: 600;
    }
    .grade-level {
      font-size: 9pt;
      margin-left: 1em;
      padding: 2pt 4pt;
      background-color: #ccc;
    }
    .grade-level.level-excellent {
      background-color: #fc9701;
    }
    .grade-level.level-good {
      background-color: #fc9701;
    }
    .grade-level.level-pass {
      background-color: #fc9701;
    }
    .grade-level.level-fail {
      background-color: #fc9701;
    }
    .on-off {
      background-color: #fc9701;
      border: none;
      border-radius: 3pt;
      padding: 1pt 2pt;
      margin: 0 2pt;
    }
  }
  .detail-panel {
    display: flex;
    flex: 1;
    flex-flow: column nowrap;
    align-items: stretch;
    background: white;
    .detail-title {
      display: flex;
      justify-content: space-around;
      width: 250pt;
      font-size: 9pt;
      color: #2b8fff;
      margin: 0 0 1em;
      .tab {
        padding: 4pt 2pt;
        cursor: pointer;
      }
      .tab-active {
        font-weight: bold;
        border-bottom: solid 1.5pt #2b8fff;
      }
    }
    .detail-content {
      display: flex;
      flex: 1;
      justify-content: flex-start;
      align-items: stretch;
      .nodata-box {
        margin: auto;
        color: #ccc;
        font-size: 16pt;
      }
      .site-infos {
        width: 180pt;
        .site-title {
          font-size: 13pt;
          margin: 4pt 0;
        }
      }
      .site-graph {
        flex: 1;
        display: flex;
        justify-content: stretch;
        flex-flow: column nowrap;
        .chart-container {
          flex: 1;
          display: flex;
          .flues-selector {
            display: flex;
            flex-flow: column nowrap;
            width: 140pt;
            border-right: solid 1pt #ccc;
            text-align: right;
            .flue-label {
              margin: 4pt;
              font-size: 9pt;
              color: #2b8fff;
              cursor: pointer;
            }
            .flue-label.active {
              font-weight: bold;
            }
          }
        }
        .flue-current-state {
          position: absolute;
          right: 20pt;
          display: inline-block;
          vertical-align: bottom;
          font-size: 9pt;
          .flue-state-value {
            margin-right: 0.5em;
            margin-left: 0.2em;
            font-size: 14pt;
            font-weight: bold;
          }
          .state-lb {
            color: #0098db;
          }
          .state-pm {
            color: #f25604;
          }
          .state-nmhc {
            color: #ff9800;
          }
          .update-time-label, .update-time {
            color: gray;
          }
        }
      }
      .choose-date-range {
        display: flex;
        align-items: stretch;
        position: absolute;
        right: 20pt;
        z-index: 100;
        button {
          padding: 2pt 8pt;
        }
      }
      .choose-date-range input {
        border: none;
      }
    }
  }
}
</style>