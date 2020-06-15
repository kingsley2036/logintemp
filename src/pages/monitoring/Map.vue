<template>
  <div class="mapbox">
    <el-amap
      :amapManager="amapManager"
      :vid="'amap-vue'"
      :zoom="zoom"
      :center="center"
      :events="events"
    >   

      <el-amap-marker 
        v-for="(item, index) in mapList" 
        :key="index" 
        :position="[item.lng, item.lat]"
        :events="markerEvents"
        :vid="index"
        :extData="item"
        :class="{'marker-current': current && item.id == current.id}"
        :style="{'z-index': (current && item.id == current.id) && 1000}"
      ><div class="marker" :class="['status-' + item.status, {'marker-current': current && item.id == current.id}]">
        <img :src="markerImage(item)"/>
        <div v-text="item.siteName"></div>
      </div></el-amap-marker>

    </el-amap>

    <div class="counttipsbox">
      <dl>
        <dt @click="$emit('toggleState', 'exceed')">
          <div class="corner-marker">
            <v-icon class="check-flag" :name="'check-square'" scale="0.7" v-if="isChecked('exceed')"></v-icon>
          </div>
          <img src="@/assets/images/marker-exceed-1.gif" alt="">
        </dt>
        <dd @click="$emit('toggleState', 'exceed')">超标</dd>
        <dt @click="$emit('toggleState', 'fault')">
          <div class="corner-marker">
            <v-icon class="check-flag" :name="'check-square'" scale="0.7" v-if="isChecked('fault')"></v-icon>
          </div>
          <img src="@/assets/images/marker-fault-1.png" alt="">
        </dt>
        <dd @click="$emit('toggleState', 'fault')">故障</dd>
        <dt @click="$emit('toggleState', 'offline')">
          <div class="corner-marker">
            <v-icon class="check-flag" :name="'check-square'" scale="0.7" v-if="isChecked('offline')"></v-icon>
          </div>
          <img src="@/assets/images/marker-offline-1.png" alt="">
        </dt>
        <dd @click="$emit('toggleState', 'offline')">离线</dd>
        <dt @click="$emit('toggleState', 'online')">
          <div class="corner-marker">
            <v-icon class="check-flag" :name="'check-square'" scale="0.7" v-if="isChecked('online')"></v-icon>
          </div>
          <img src="@/assets/images/marker-online-1.gif" alt="">
        </dt>
        <dd @click="$emit('toggleState', 'online')">在线</dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { AMapManager } from 'vue-amap'
import DoubleLine from '@/components/DoubleLine'
import Realtime from '@/components/Realtime'
import ChaobiaoMessage from '@/components/ChaobiaoMessage'
import icon_point_changgui from '@/assets/images/marker-online-1.gif'
import icon_point_chaobiao from '@/assets/images/marker-exceed-1.gif'
import icon_point_guzhang from '@/assets/images/marker-fault-1.png'
import icon_point_lixian from '@/assets/images/marker-offline-1.png'

let amapManager = new AMapManager();

export default {
  props:{
    siteList:'',
    current: Object,
    filter: Object
  },
  components: {
    DoubleLine,
    Realtime,
    ChaobiaoMessage
  },
  data() {
    return {
      mapList: '',
      tabbarCurr: 0,
      amapManager,
      center: DEFAULT_MAP_CENTER,
      zoom: 15,
      map: null,
      icons:{
        0: icon_point_chaobiao,
        1: icon_point_guzhang,
        2: icon_point_lixian,
        3: icon_point_changgui
      },
      markerEvents:{
        click: (e) => {
          const site = e.target.getExtData()
          const type = e.type
          console.log('## Map event: %s : %o', e.type, site)
          if (type === 'click') {
            this.inChoose = true
            new Promise((resolved) => {
              this.$emit('choose-site', site)
              resolved()
            }).finally(() => this.inChoose = false)
          }
        }
      },
      events: {
        init (map) {
          // 自定义样式
          map.setMapStyle('amap://styles/c6340949e6dd7737b902118c440b8dfc')
          // map.setMapStyle('amap://styles/6580d041ea270c1bed352c3e7f042fb8')
          // map.setMapStyle('amap://styles/darkblue')
        }
      },
      inChoose: false
    }
  },
  mounted() {
    $e.ready.then(() => {
      let myOrg = $e.monitor.myOrg()
      this.center = myOrg && resolveCenter(myOrg.orgName) || DEFAULT_MAP_CENTER
    })
  },
  methods: {
    markerImage(data) {
      switch (data.status) {
        case 'online':
          return icon_point_changgui
        case 'fault':
          return icon_point_guzhang
        case 'exceed':
          return icon_point_chaobiao
        case 'offline':
          return icon_point_lixian
        default:
          return data.hasExceed ? icon_point_chaobiao : icon_point_changgui
      }
    },
    isChecked(state) {
      return this.filter.states.includes(state)
    }
  },
  watch:{
    siteList(data) {
      // console.log('Map 组件监听 siteList =====',data)
      this.mapList = data
    },
    current(site) {
      if (site && !this.inChoose) {
        this.center = [site.lng, site.lat]
      }
    }
  },
  created(){
    this.mapList = this.siteList
  }
}
</script>
<style>
.amap-marker.marker-current {
  z-index: 1000;
}
.marker {
  font-size: 10pt;
  color: black;
  width: 100pt;
}
.marker img {
  width: 36px;
  height: 36px;
}
.marker.marker-current {
  background-repeat: no-repeat;
  background-position: center 30px;
}
.marker-current.status-online {
  background-image: url(../../assets/images/marker-online-bg-1.png)
}
.marker-current.status-offline {
  background-image: url(../../assets/images/marker-offline-bg-1.png)
}
.marker-current.status-exceed {
  background-image: url(../../assets/images/marker-exceed-bg-1.png)
}
.marker-current.status-fault {
  background-image: url(../../assets/images/marker-fault-bg-1.png)
}
</style>

<style lang="scss" scoped>
.mapbox{
  flex: 1;
  position: relative;
  .counttipsbox{
    width: 350px;
    position: absolute;
    bottom: 30pt;
    right:30pt;
    // border: solid 1pt #1e7fc6;
    border-radius: 8pt;
    background-color: rgba(30, 127, 198, 0.2);
    // background-color: rgba(255, 255, 255, 0.8);
    padding: 0.2em;
    dl{
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      dt{
        margin: 0;
        float: left;
        margin-left: 10px;
        img{
          display: block;
          width: 36px;
          height: 36px;
          margin: 0;
        }
        .corner-marker {
          display: block;
          float: right;
          width: 0;
          height: 0;
          overflow: visible;
          background-color: white;
          .check-flag {
            position: relative;
            right: 10px;
            top: -10px;
            border-radius: 2pt;
          }
        }
      }
      dd{
        margin:5px;
        float: left;
        font-size: 12px;
        font-weight: bold;
      }
    }
  }
}
</style>