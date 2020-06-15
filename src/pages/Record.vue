<template>
  <div class="container">
    <div class="record-box">
      <div class="seachbox"></div>

      <div class="content">
        <Table table-name="alarmList" :columns="columns" :rows="alarms" />
      </div>
    </div>
  </div>
</template>
<script>
import Table from "@/components/base/Table"
import SysApi from '@/api/sys/dict'
import Api from "@/api/alarm/alarm"

const DICTS = {
  alarmType: [
    {
      label: '异常报警',
      value: '0'
    },
    {
      label: '超标报警',
      value: '1'
    },
    {
      label: '上线',
      value: '2'
    },
    {
      label: '离线',
      value: '3'
    }
  ]
}

export default {
  components: {
    Table
  },
  data() {
    return {
      dicts: {
        alarmType: null
      },
      filter: {
        alarmNo: null,
        siteId: null,
        siteName: null,
        districeId: null,
        districtName: null,
        subDistrictId: null,
        subDistrictName: null,
        begDate: null,
        endDate: null
      },
      columns: [
        /*
        {
          label: "报警编号",
          field: "id",
          width: "10%"
        },
        */
        {
          label: "报警类型",
          field: "alarmType",
          width: "5%"
        },
        {
          label: "报警内容",
          field: "content",
          width: "10%"
        },
        {
          label: "办事处名称",
          field: "streetName",
          witch: "15%"
        },
        {
          label: "站点名称",
          field: "siteName",
          width: "15%"
        },
        {
          label: "详细地址",
          field: "address",
          width: "25%"
        },
        {
          label: "报警时间",
          field: "createDate",
          width: "10%"
        }
      ],
      alarms: null
    }
  },
  computed: {
    alarmTypes() {
      // let types = DICTS.alarmType
      let types = this.dicts.alarmType.entries.map(entry => ({
        label: entry.label,
        value: entry.value,
        sort: entry.sort
      }))
      return types.reduce((m, item) => m.set(item.value, item.label), new Map())
    }
  },
  created() {
    // 加载字典
    SysApi.queryDictEntries({
      type: 'oil_smoke_alarm_type'
    }).then(resp => {
      if (isSuccess(resp)) {
        this.dicts.alarmType = resp.data[0]
      }
    })
  },
  mounted() {
    this.queryLastAlarms();
  },
  methods: {
    queryLastAlarms() {
      return Api.queryAlarms().then(resp => {
        console.log("## alarms: ", resp);
        this.alarms = resp.data.map(alarm => {
          alarm.streetName = alarm.officeStreet && alarm.officeStreet.orgName || '无';
          alarm.alarmType = this.alarmTypes.get(alarm.alarmType)
          return alarm;
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: space-between;
  flex-flow: column;
  height: 100%;
  width: 80%;
  min-width: 800pt;
  margin: 0 auto;
  font-size: 12pt;
  .record-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column;
    justify-content: space-around;
    align-items: stretch;
    margin-bottom: 1em;

    .seachbox {
      margin: 0px auto 20px;
      width: 90%;
      padding: 20px 50px;
      height: 120px;
      p {
        margin: 0;
        padding: 0;
      }
    }

    .content {
      margin: 10px auto;
      width: 90%;
      padding: 10px;
      height: 400px;
      border: solid 1.5pt #6296ab;
      border-radius: 8pt;
      padding: 8pt;
      flex: 1;
    }
  }
}
</style>
<style>
.table-alarmList {
  display: flex;
  flex-flow: column;
  height: 100%;
  text-align: left;
  font-size: 10pt;
}
.table-alarmList .row {
  border-bottom: solid 1px #083d6b;
  margin: 0.2em 0.5em;
  padding: 1em 0;
}
.row-title-alarmList {
  color: #abcbff;
  font-weight: 600;
}
.table-alarmList .table-body {
  color: white;
}
.table-alarmList .table-body .col {
  overflow: hidden;
  text-align: left;
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>