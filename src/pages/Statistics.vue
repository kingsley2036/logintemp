<template>
  <div class="mainbox">
    <Header tab-active="tab-statist" />
    <div class="selector-bar">
      <Selector class="district-selector" v-model="filter.district">
        <Option v-for="(entry, i) of districtEntries" :key="i" :label="entry.label" :value="entry.value">
        </Option>
      </Selector>
      <Selector class="subdistrict-selector" v-model="filter.subdistrict">
        <Option label="-- 全部 --" value=""></Option>
        <Option v-for="(entry, i) of subdistrictEntries" :key="i" :label="entry.label" :value="entry.value">
        </Option>
      </Selector>
      <Selector class="date-range-selector" v-model="filter.range">
        <Option v-for="(entry, i) of dicts.ranges" :key="i" :label="entry.label" :value="entry.value">
        </Option>
      </Selector>
    </div>
    <div class="container">
      <div class="statistics-box">
        <div class="sidebar">
          <SiteSummary :filter="filter" :org="org" :org-grade="orgGrade"></SiteSummary>
        </div>

        <div class="content">
          <!-- 区级别 -->
          <div class="area" v-if="orgGrade == '2'">
            <div class="row-panel top">
              <div class="box sbtj-box">
                <h6 class="title">安装设备统计</h6>
                <div class="content sbtj-content">
                  <SubdistrictDevice :org="org"/>
                </div>
              </div>
              <div class="box cbtj-box">
                <h6 class="title">超标统计</h6>
                <div class="content cbtj-content">
                  <ExceedCharts :filter="filter"/>
                </div>
              </div>
            </div>
            <div class="row-panel bottom">
              <div class="box cbzb-box">
                <h6 class="title">超标占比</h6>
                <div class="content cbzb-content">
                  <ExceedCounts :filter="filter"/>
                </div>
              </div>
              <div class="box level-box">
                <h6 class="title">办事处评级</h6>
                <div class="content level-content">
                  <SubdistrictReach :filter="filter"/>
                </div>
              </div>
            </div>
          </div>

          <!-- 办事处级别 -->
          <div class="office" v-if="orgGrade == '3'">
            <div class="topbox">
              <div class="l">
                <h6 class="title">超标站点TOP</h6>
                <div class="cbzd-content">
                  <!-- <Table :tables="topTableData" type="top" /> -->
                </div>
              </div>
              <div class="r">
                <h6 class="title">设备统计</h6>
                <div class="zdpj-content">
                  <div class="zdpjzb-box"></div>
                  <div class="bbox">
                    <div class="cbzb-box">
                      <!-- <PingjiDoughnut color="yellow" title="超标" myValue="45" /> -->
                      <dl>
                        <dt>超标占比</dt>
                        <dd>45%</dd>
                      </dl>
                    </div>

                    <div class="gzzb-box">
                      <!-- <PingjiDoughnut color="pink" title="故障" myValue="25" /> -->
                      <dl>
                        <dt>故障占比</dt>
                        <dd>25%</dd>
                      </dl>
                    </div>

                    <div class="bjzb-box">
                      <!-- <PingjiDoughnut  color="green" title="报警" myValue="90" /> -->
                      <dl>
                        <dt>报警占比</dt>
                        <dd>90%</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bottombox">
              <div class="sitelevel">
                <h6 class="title">站点评级</h6>
                <Table :columns="[]" :data="[]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Selector from '@/components/base/Selector'
import Option from '@/components/base/Option'
import Table from '@/components/GradeTable'

import StatApi from '@/api/statistics/statistics'
import OrgApi from '@/api/sys/org'

// 站点统计
import SiteSummary from '@/pages/statistics/site-summary'
// 各办事处设备安装统计
import SubdistrictDevice from '@/pages/statistics/subdistrict-device'
// 超标统计（图表）
import ExceedCharts from '@/pages/statistics/exceed-charts'
// 超标占比（饼图）
import ExceedCounts from '@/pages/statistics/exceed-counts'
// 街道达标统计表
import SubdistrictReach from '@/pages/statistics/subdistricts-reach.vue'

export default {
  components: {
    Selector,
    Option,
    SiteSummary,
    SubdistrictDevice,
    ExceedCharts,
    ExceedCounts,
    SubdistrictReach
  },
  data() {
    return {
      dicts: {
        district: [],
        subdistrict: [],
        ranges: [
          {
            value: "0",
            label: "昨天"
          },
          {
            value: "1",
            label: "上周"
          },
          {
            value: "2",
            label: "上月"
          }
        ]
      },
      filter: {
        city: '',
        district: '',
        subdistrict: '',
        range: '0'
      },
      statistics: {
        site: {
          total: 0,
          online: 0,
          fault: 0,
          exceed: 0
        },
        subdistrictDevice: [],
      },
      subdistricts: [
        {
          id: null,
          name: null,
          deviceTotal: 0,
          siteTotal: 0,
          siteGrades: [
            {
              grade: "达标",
              count: 0
            },
            {
              grade: "不达标",
              count: 0
            }
          ]
        }
      ],
      orgs: {},
      grades: {
        '1': [],
        '2': [],
        '3': []
      },
      org: {children:[]},
      orgGrade: "2"
    };
  },
  created() {
    // TODO load data
    this.queryDicts()
    // this.queryDistrictSummary()
    window.t = this
  },
  watch: {
    'grades.2'(val) {
      if (val.length == 1) {
        this.filter.district = val[0].id
      }
    }
  },
  computed: {
    districtEntries() {
      return this.grades['2']
          .filter(org => !this.filter.city || org.parentId == this.filter.city)
          .map(org => {
            return {
              label: org.orgName,
              value: org.id
            }
          })
    },
    subdistrictEntries() {
      return this.grades['3']
          .filter(org => !this.filter.district || org.parentId == this.filter.district)
          .map(org => {
            return {
              label: org.orgName,
              value: org.id
            }
          })
    }
  },
  methods: {
    queryChildOrgsByIds(orgs) {
      let $this = this
      let orgIds = Array.from(orgs.reduce((set, org) => set.add(org.id), new Set()))
      let orgMap = orgs.reduce((map, org) => {
        map[org.id] = org
        return map
      }, {})
      return OrgApi.queryChildOrgsByIds(orgIds).then(resp => {
        console.log("## child orgs %o", resp.data);
        let orgIds = new Set();
        resp.data.forEach(org => {
          orgIds.add(org.id)
          let parentOrg = orgMap[org.parentId]
          parentOrg && (parentOrg.children = parentOrg.children || []).push(org)
        })
        if (resp.data.length > 0 && resp.data[0].grade < '3') {
          return $this.queryChildOrgsByIds(resp.data)
        }
        return orgs
      })
    },
    queryDicts() {
      // 清除已加载数据
      const $this = this
      const addGradeList = (org) => {
        if (org) {
          let list = this.grades[org.grade]
          if (list) list.push(org)
        }
      }
      this.orgs = {}
      this.grades['1'].splice(0)
      this.grades['2'].splice(0)
      this.grades['3'].splice(0)

      // 二级部门树
      OrgApi.queryMyOrg().then(resp => {
        let org = resp.data
        let orgIds = Array.of(org.id)
        console.log('## my organization: %o', org)

        org.children = []
        $this.org = org
        $this.orgs[org.id] = org
        $this.orgGrade = org.grade
        addGradeList(org)

        if (org.grade == '3') {
            // 取回上级部门（区）作为一级部门选项
            OrgApi.queryOrgsByIds([org.parentId]).then(resp => {
              console.log("## parent org %o", resp.data)
              let parentOrg = org.parentOrg = resp.data[0]
              if (parentOrg) {
                $this.orgs[parentOrg.id] = parentOrg
                addGradeList(parentOrg)
              }
            })
        }

        return this.queryChildOrgsByIds([org]).then(orgs => {
          orgs.forEach(rootOrg => rootOrg.children.forEach(org => {
            $this.orgs[org.id] = org
            addGradeList(org)
          }))
          return orgs
        })
      })
    },
    queryDistrictSummary() {
      // deprecated
      return StatApi.queryDistrictSummary().then(resp => {
        console.log('## query districts statistics info: %o', resp.data)
        this.subdistrictDevice = resp.data.devicesForSubdistricts
      })
    }
  }
}
</script>
<style>
.select-list-wrapper{
  margin-top: 4pt;
  margin-left: -4pt;
}
.select-list {
  background: black;
}
.select-option:hover {
  background: darkblue;
  color: lightgray;
}
</style>
<style lang="scss" scoped>
.selector-bar {
  display: flex;
  align-items: left;
  color: lightgray;
  padding: 2pt 4pt;
}
.select-element {
  width: 80pt;
  border: solid 1pt rgba(255, 255, 255, 0.2);
  border-radius: 2pt;
  margin: 0 6pt;
  padding: 3pt;
}
.container {
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 810px;
  width: 100%;

  .statistics-box {
    width: 96%;
    // height: 550px;
    margin: 5px auto 0px;
    position: relative;
    display: flex;
    justify-content: space-between;
    .sidebar {
      width: 32%;
      height: 100%;
      background: url(../assets/images/tj_bg.png) no-repeat center bottom;
    }

    .content {
      width: 65%;
      height: 100%;
      .title {
        font-size: 14pt;
        border-left: 5px solid #407ac1;
        font-weight: bold;
        color: #a7dbff;
        margin: 10pt 0 0 20pt ;
        display: inline-block;
        padding-left: 10px;
        text-align: left;
      }
      .content {
        flex: 1;
        width: 100%;
      }
      .row-panel {
        display: flex;
        flex: 1;
        .box {
          flex: 1;
          display: flex;
          flex-flow: column;
          padding: 6pt;
        }
        .sbtj-box {
          max-width: 35%;
          flex: 1;
          border: solid 1.5pt #1e7fc6;
          border-radius: 8pt;
          margin: 10pt;
        }
        .cbtj-box {
          flex: 1;
          border: solid 1.5pt #1e7fc6;
          border-radius: 8pt;
          margin: 10pt;
        }
        .cbzb-box {
          max-width: 35%;
          flex: 1;
        }
        .level-box {
          flex: 1;
        }
      }
      .row-panel.top {
        height: 40pt;
        flex-grow: 4;
      }
      .row-panel.bottom {
        border: solid 1.5pt #1e7fc6;
        border-radius: 8pt;
        height: 50pt;
        flex-grow: 5;
        margin: 10pt;
      }
      .area {
        height: 100%;
        display: flex;
        flex-flow: column;
          .cbzb {
            width: 25%;
            height: 100%;
            position: relative;
            .cbzb-content {
              border-right: 1px solid #112c4a;
              height: 100%;
              width: 100%;
              position: absolute;
              bottom: 10px;
              left: 0;
            }
          }
          .officelevel {
            width: 70%;
            height: 100%;
            position: relative;
          }
      }

      .office {
        height: 100%;
        .topbox {
          height: 380px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          .l {
            position: relative;
            width: 33%;
            height: 100%;
            box-shadow: inset 0px 0px 15px 0px rgba(0, 128, 202, 0.8);
            .cbzd-content {
              overflow: hidden;
              height: 100%;
              width: 100%;
              position: absolute;
              // bottom: 0;
              padding: 0px 15px;
              table {
                margin: 0;
                tr {
                  color: #fff;
                }
              }
            }
          }
          .r {
            position: relative;
            width: 64%;
            height: 100%;
            box-shadow: inset 0px 0px 15px 0px rgba(0, 128, 202, 0.8);
            .zdpj-content {
              height: 330px;
              width: 100%;
              position: absolute;
              bottom: 0;

              .zdpjzb-box {
                width: 100%;
                height: 70%;
              }

              .bbox {
                height: 100px;
                width: 100%;
                margin: 0px auto;
                display: flex;
                justify-content: center;
                .cbzb-box {
                  width: 100%;
                  height: 100%;
                  display: flex;
                  justify-content: center;
                  dl {
                    width: 100%;
                    font-size: 14px;
                    text-align: left;
                    margin: 0;
                    padding: 0;
                    dt {
                      margin: 0;
                      color: #a7dbff;
                      font-weight: bold;
                    }
                    dd {
                      margin: 0;
                      color: #eda72d;
                      font-size: 18px;
                      font-weight: bold;
                    }
                  }
                }
                .gzzb-box {
                  width: 100%;
                  height: 100%;
                  display: flex;
                  justify-content: center;
                  dl {
                    width: 100%;
                    font-size: 14px;
                    text-align: left;
                    margin: 0;
                    padding: 0;
                    dt {
                      margin: 0;
                      color: #a7dbff;
                      font-weight: bold;
                    }
                    dd {
                      margin: 0;
                      color: #ed2dd9;
                      font-size: 18px;
                      font-weight: bold;
                    }
                  }
                }
                .bjzb-box {
                  width: 100%;
                  height: 100%;
                  display: flex;
                  justify-content: center;
                  dl {
                    width: 100%;
                    font-size: 14px;
                    text-align: left;
                    margin: 0;
                    padding: 0;
                    dt {
                      margin: 0;
                      color: #a7dbff;
                      font-weight: bold;
                    }
                    dd {
                      margin: 0;
                      color: #2dedc7;
                      font-size: 18px;
                      font-weight: bold;
                    }
                  }
                }
              }
            }
          }
        }

        .bottombox {
          position: relative;
          display: flex;
          justify-content: space-between;
          width: 100%;
          padding: 20px;
          box-shadow: inset 0px 0px 15px 0px rgba(0, 128, 202, 0.8);
          height: 390px;
          .sitelevel {
            width: 100%;
            height: 100%;
            position: relative;
          }
        }
      }
    }
  }
}
</style>
<style>
</style>