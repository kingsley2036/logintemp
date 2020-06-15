<template>
  <div class="header">
    <div class="titlebox">
      <div class="title-left"><div class="logo">油烟监控平台</div></div>
      <div class="title-middle" :class="tabActive">
        <a class="tab-title tab-monitor" @click="toPage('monitoring')">实时监控</a>
        <a class="tab-title tab-statist" @click="toPage('statistics')">统计分析</a>
        <a class="tab-title tab-alarms" @click="toPage('record')">报警记录</a>
      </div>
      <div class="title-right">
        <a class="opt-button" @click="doLogout"><v-icon name="power-off" /> 退出</a>
      </div>
    </div>
   </div>
</template>
<script>
import {saveContext} from '@/api/context'

export default {
  props: ["tabActive"],
  methods: {
    doLogout() {
      saveContext({})
      this.toPage('login')
    },
    toPage(page) {
      this.$router.push(page)
    }
  }
}
</script>

<style lang="scss" scoped>
  .header{
    margin: 0;
    .titlebox{
      display: flex;
      justify-content: space-between;
      color: white;
      font-size: 14pt;
      border-bottom: solid 1pt rgba(250, 250, 250, 0.2);
      line-height: 30pt;
      padding: 0 0.2rem;
      .title-left {
        color: #05f7f9;
        font-weight: 700;
        .logo {
          padding: 4pt;
          font-size: 16pt;
        }
      }
      .title-middle {
        display: flex;
        flex-flow: row nowrap;
        color: #02a0a2;
        .tab-title {
          margin: 0 36pt;
          padding: 4pt;
        }
      }
      .title-middle.tab-monitor .tab-title.tab-monitor, .title-middle.tab-statist .tab-title.tab-statist, .title-middle.tab-alarms .tab-title.tab-alarms {
        color: #05f7f9;
        font-weight: 700;
        border-bottom: solid 1pt #05f7f9;
      }
      .tab-title {
        cursor: pointer;
      }
      .tab-title:hover {
        background-color: rgba(255, 255, 255, 0.2);
        color: #05f7f9;
      }
      .title-right {
        .opt-button {
          display: inline-block;
          padding: 6pt;
          cursor: pointer;
          color: lightgray;
        }
        .opt-button:hover{
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
        }
      }
    }
  }
</style>