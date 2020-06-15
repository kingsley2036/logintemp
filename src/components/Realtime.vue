<template>
  <div>
    <div class="item" v-for="(item, index) in List" :key="index">
      <dl class="one">
        <dt>设备编号:</dt>
        <dd>{{item.deviceCode}}</dd>
      </dl>
      <dl class="two">
        <dt>油烟值:</dt>
        <dd>{{item.lbValue}}mg/m3</dd>
      </dl>
    </div>
  </div>
</template>

<script>
export default {
  props: ["deviceId"],
  data() {
    return {
      List: []
    };
  },
  methods: {
    initRealTimeList(id) {
      console.log("实时数据传来的ID", id);
      this.$api
        .realDataBySite({
          id: id
        })
        .then(res => {
          console.log("实时数据返回的====", res);
          let data = res.data;
          let list = [];
          data.forEach(item => {
            console.log("循环里oilSmokeDataList=", item.oilSmokeDataList);
            if (item.oilSmokeDataList) {
              list.push(item.oilSmokeDataList);
            }
          });
          console.log("实时数据循环之后的结果", list);
          let obj = [];
          list.forEach(item => {
            obj.push(item[0]);
          });
          this.List = obj;
        });
    }
  },
  watch: {
    deviceId(data) {
      console.log("监测deviceId");
      this.initRealTimeList(data);
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  padding: 5px 10px;
  background: #fff;
  margin-top: 10px;
  .one {
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
  }
  .two {
    padding: 10px;
    dt {
      margin-top: 10px;
    }
    dd {
      margin: 0;
      padding: 0;
      color: #0493d6;
      font-size: 26px;
      font-weight: bold;
    }
    .red {
      color: #ee551f;
    }
  }
  dl {
    margin: 0;
    display: flex;
    justify-content: space-between;
    color: #666;
    font-size: 12px;
  }
}
</style>