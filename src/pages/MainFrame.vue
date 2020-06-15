<template>
<div class="mainbox">
  <Header :tab-active="activeTab" />
  <router-view/>
  <Footer/>
  <!-- 报警提示 -->
  <div class="alarm-hint">
    <ul>
      <li class="alarm-item" v-for="(alarm, i) of alarms" :key="i">
        <span class="alarm-icon"><v-icon name="bell"></v-icon></span>
        <span class="alarm-message" :title="alarm.message" v-text="alarm.message"></span>
      </li>
    </ul>
  </div>
</div>
</template>
<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import Monitor from '@/api/monitor/init'
import SocketClient from '@/api/websocket/client'

const ALARM_HINT_TIMEOUT = 1000 * 60 * 10;
const mapper = {
  monitoring: 'monitor',
  statistics: 'statist',
  record: 'alarms'
}
const resolveTab = () => {
  return 'tab-' + (mapper[document.location.hash.substring(2).replace('/', '-')] || 'unknow')
}

export default {
  components: {
    Header, Footer
  },
  data() {
    let monitor = new Monitor(this)
    return {
      activeTab: resolveTab(),
      monitor,
      ready: monitor.init(),
      alarms: [],
    }
  },
  created() {
    const $this = this
    window.$e = window.eventBus = this

    this.ready.then(() => {
      SocketClient.startupListener(this)
      this.$nextTick(() => {
        this.$emit('ready', this)
      })
      this.$on('trace', this.monitor.listen)
    })
    this.$on('_sys_init', () => this.init())
    this.$on('_sys_reset', () => this.reset())
    
    // 清理超时的报警提示信息
    setInterval(() => {
      this.alarms = this.alarms.filter(alarm => Date.now() < (alarm.time + ALARM_HINT_TIMEOUT))
    }, 200)

    $e.$on('device-exceed', (dev, flue) => {
      $this.alarms.push({
        time: Date.now(),
        dev, flue,
        message: `[${dev.site.officeStreet.orgName}][${dev.site.siteName}]油烟超标`
      })
      while ($this.alarms.length > 5) {
        $this.alarms.shift()
      }
    })

    $e.$on('alarm', (dev, alarm) => {
      console.log(`## receive alarm: ${dev.no} - ${alarm.type}: ${alarm.content}`)
      $this.alarms.push({
        time: Date.now(),
        dev, alarm,
        message: `[${dev.site.officeStreet.orgName}][${alarm.siteName}]${alarm.content}`
      })
      while ($this.alarms.length > 5) {
        $this.alarms.shift()
      }
    })
  },
  watch: {
    $route: {
      handler: function(val, oldVal){
        this.activeTab = resolveTab()
        console.log(val);
      },
      // 深度观察监听
      deep: true
    }
  },
  methods: {
    init() {
      return this.ready = this.monitor.init()
    },
    reset() {
      return this.ready = this.monitor.reset()
    }
  },
  destoryed() {
    SocketClient.stopListener()
  }
}
</script>
<style>
/* 报警提示 */
.alarm-hint {
  display: block;
  position: absolute;
  right: 24pt;
  top: 120pt;
  width: 240pt;
  height: auto;
  /* border: solid 1pt #083d6b; */
  /* border-radius: 4pt; */
  border: none;
  font-size: 9pt;
  padding: 4pt;
  z-index: 1000;
}
.alarm-item {
  display: flex;
  margin: 4pt 0;
  padding: 4pt;
  background-color: rgba(255, 255, 255, 0.8);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.alarm-icon {
  color: red;
  margin: 0 4pt;
}
.alarm-message {
  flex: 1;
  text-align: left;
}
</style>