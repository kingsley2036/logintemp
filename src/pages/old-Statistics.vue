<template>
  <div class="mainbox">
    <Header tab-active="tab-statist"/>
    <div class='container'>
      <div class="statistics-box">
        <div class="sidebar">
          <div class="item">

            <!-- 如果是站点则不显示办事处数据 -->
            <dl>
                <!-- <dt>{{StreetNum}}</dt> -->
                <dt>3</dt>
                <dd>办事处数</dd>
            </dl>
            <dl>
              <!-- <dt>{{SiteStatusInfo.siteNum}}</dt> -->
              <dt>22</dt>
              <dd>监控站点数</dd>
            </dl>
            <dl>
              <!-- <dt>{{SiteStatusInfo.onlineSiteNum}}</dt> -->
              <dt>22</dt>
              <dd>在线站点数</dd>
            </dl>
            <dl>
              <!-- <dt>{{SiteStatusInfo.brokenSiteNum}}</dt> -->
              <dt>0</dt>
              <dd>故障站点数</dd>
            </dl>
            <dl>
              <!-- <dt>{{SiteStatusInfo.exceedSiteNum}}</dt> -->
              <dt>2</dt>
              <dd>超标站点数</dd>
            </dl>
          </div>
        </div>

        <div class="content">
          <!-- 区级别 -->
          <div class="area" v-show="false">
            <div class="topbox">
              <div class="l">
                  <div class="image-top"></div>
                  <div class="image-bottom"></div>
                  <h6 class="title">安装设备统计</h6>
                  <div class="sbtj-content">
                    <Shebeitongji  :dataList="DeviceData" />
                  </div>
              </div>
              <div class="r">
                <div class="image-top"></div>
                  <div class="image-bottom"></div>
                <h6 class="title">超标统计</h6>
                <div class="cbtj-content">
                  <Bar :dataList="ExceedStandardData" />
                </div>
              </div>
            </div>
            <div class="bottombox">
              <div class="image-top"></div>
              <div class="image-bottom"></div>
              <div class="cbzb">
                <h6 class="title">超标占比</h6>
                <div class="cbzb-content">
                  <Doughnut :Percent="PercentNum" />
                </div>
              </div>
              <div class="officelevel"> 
                <h6 class="title">办事处评级</h6>
                  <Table  :tables="officeTableData" type='office' />
              </div>
            </div>
          </div>


          <!-- 办事处级别 -->
          <div class="office" v-show="true">
            <div class="topbox">
              <div class="l">
                  <div class="image-top"></div>
                  <div class="image-bottom"></div>
                  <h6 class="title">超标站点TOP</h6>
                  <div class="cbzd-content">
                    <Table :tables="topTableData" type="top" />
                  </div>
              </div>
              <div class="r">
                <div class="image-top"></div>
                <div class="image-bottom"></div>
                <h6 class="title">站点评级占比</h6>
                <div class="zdpj-content">
                  <div class="zdpjzb-box">
                    <PingjiPie />
                  </div>
                  <div class="bbox">
                    <div class="cbzb-box">
                      <PingjiDoughnut color="yellow" title="超标" myValue="45" />
                      <dl>
                        <dt>超标占比</dt>
                        <dd>45%</dd>
                      </dl>
                    </div>

                    <div class="gzzb-box">
                      <PingjiDoughnut color="pink" title="故障" myValue="25" />
                      <dl>
                        <dt>故障占比</dt>
                        <dd>25%</dd>
                      </dl>
                    </div>

                    <div class="bjzb-box">
                      <PingjiDoughnut  color="green" title="报警" myValue="90" />
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
              <div class="image-top"></div>
              <div class="image-bottom"></div>

              <div class="sitelevel"> 
                <h6 class="title">站点评级</h6>
                <Table  :tables="siteTableData" type="site" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Doughnut from '@/components/Doughnut'
import Bar from '@/components/Bar'
import Shebeitongji from '@/components/Shebeitongji'
import PingjiPie from '@/components/PingjiPie'
import PingjiDoughnut from '@/components/PingjiDoughnut'
import Table from '@/components/GradeTable'
export default {
    components: {
      Header, Footer,
      Doughnut,
      Bar,
      Shebeitongji,
      PingjiPie,
      PingjiDoughnut,
      Table
    },
    data() {
        return{
            SiteStatusInfo:[],
            StreetNum:0,
            DeviceData:[],
            officeTableData:[],
            siteTableData:[],
            topTableData:[],
            PercentNum: '',
            ExceedStandardData:[]
        }
    },
    methods: {
        getSiteStatusInfo(data){
            this.SiteStatusInfo = data
            this.StreetNum = data.streetList.length

             this.getDeviceStatisticByStreet() // 获取安装设备统计
        },
        getPercent(data){
            console.log('实时监控页面收到的超标统计比例=====', data)
            this.PercentNum = data
        },
        getExceedStandardNum(data){
            console.log('实时监控页面收到的各个办事处超标柱状图', data)
            this.ExceedStandardData = data
        },
        getDeviceStatisticByStreet(){
            this.$api.getDeviceStatisticByStreet({
            }).then(res => {
                this.DeviceData = res.data
            })
        },
        getStreetLevelList(){
            this.$api.getStreetLevelList({
            }).then(res =>{
                console.log('办事处评级返回======',res)
                this.officeTableData = res.data
            })
        },
        getSiteLevelList(){
            this.$api.getsitesLevelList({
            }).then(res =>{
                console.log('站点评级返回=====',res)
                this.siteTableData = res.data
            })
        },
        getSiteTopList(){
            this.$api.getExceedStandardSites({
            }).then(res =>{
                console.log('站点排名TOP10=====', res)
                this.topTableData = res.data
            })
        }
    },
    created(){

        console.log('当前用户身份>>>>>>>>>>>>>>',$userinfo.role)

        //安装设备统计
        this.getDeviceStatisticByStreet()
        // 办事处评级
        this.getStreetLevelList()
        //站点评级
        this.getSiteLevelList()
        //站点排名
        this.getSiteTopList()
        
    }
}


</script>


<style lang="scss" scoped>
.mainbox{
  height: 870px;
  overflow: hidden;
  position: relative;
}
.container{
    position: relative;
    display: flex;
    justify-content: space-between;
    height:810px;
    width: 100%;
        .left-border{
            width: 30px;
            height: 560px;
            background: url(../assets/images/left_border.png) no-repeat;
        }
        .right-border{
            width: 30px;
            height: 560px;
            background: url(../assets/images/right_border.png) no-repeat;
        }

        .statistics-box{
            width: 96%;
            // height: 550px;
            margin: 5px auto 0px;
            position: relative;
            display: flex;
            justify-content: space-between;
            .sidebar{
                width: 32%;
                height: 100%;
                background:url(../assets/images/tj_bg.png) no-repeat center bottom;


                .item{
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                   dl{
                       width: 150px;
                       height: 122px;
                       text-align: center;
                       padding: 25px 0px;
                       box-shadow: inset 0px 0px 15px 0px rgba(0, 128, 202, 0.8);
                       margin: 15px;
                       dt{
                           font-size: 42px;
                           color: #3ce4ff;
                           font-weight: bold;
                           margin: 0;

                       }
                       dd{
                           font-size: 18px;
                           font-weight: bold;
                           margin: 0;
                           color: #fff;
                       }
                   }
                }
            }

            .content{
                width: 65%;
                height: 100%;
                .title{
                    font-size: 14px;
                    border-left: 5px solid #407ac1;
                    font-weight: bold;
                    color: #a7dbff;
                    margin: 0;
                    display: inline-block;
                    padding-left: 10px;
                    text-align: left;
                    position: absolute;
                    top: 18px;
                    left: 18px;
                }

           


                .area{
                    height: 100%;
                    .topbox{
                        height: 380px;
                        margin-bottom: 20px;
                        display: flex;
                        justify-content: space-between;
                        .l{
                            position: relative;
                            width: 40%;
                            height: 100%;
                            box-shadow: inset 0px 0px 15px 0px rgba(0, 128, 202, 0.8);
                            .sbtj-content{
                                height: 200px;
                                width: 100%;
                                position: absolute;
                                bottom: 0;
                            }
                        }
                        .r{
                            position: relative;
                            width: 58%;
                            height: 100%;
                            box-shadow: inset 0px 0px 15px 0px rgba(0, 128, 202, 0.8);
                            .cbtj-content{
                                height: 200px;
                                width: 100%;
                                position: absolute;
                                bottom: 0;
                            }
                        }
                    }

                    .bottombox{
                        position: relative;
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        padding: 10px;
                        box-shadow: inset 0px 0px 15px 0px rgba(0, 128, 202, 0.8);
                        height: 390px;
                        .cbzb{
                            width: 25%;
                            height: 100%;
                            position: relative;
                            .cbzb-content{
                                border-right: 1px solid #112c4a;
                                height: 100%;
                                width: 100%;
                                position: absolute;
                                bottom: 10px;
                                left: 0;
                            }
                        }
                        .officelevel{
                            width: 70%;
                            height: 100%;
                            position: relative;
                        }
                    }
                }


            .office{
                    height: 100%;
                    .topbox{
                        height: 380px;
                        margin-bottom: 20px;
                        display: flex;
                        justify-content: space-between;
                        .l{
                            position: relative;
                            width: 33%;
                            height: 100%;
                            box-shadow: inset 0px 0px 15px 0px rgba(0, 128, 202, 0.8);
                            .cbzd-content{
                                overflow: hidden;
                                height: 100%;
                                width: 100%;
                                position: absolute;
                                // bottom: 0;
                                padding: 0px 15px;
                                table{
                                    margin: 0;
                                   tr{
                                        color: #fff;
                                   }
                                }
                            }
                        }
                        .r{
                            position: relative;
                            width: 64%;
                            height: 100%;
                            box-shadow: inset 0px 0px 15px 0px rgba(0, 128, 202, 0.8);
                            .zdpj-content{
                                height: 330px;
                                width: 100%;
                                position: absolute;
                                bottom: 0;

                                .zdpjzb-box{
                                    width: 100%;
                                    height: 70%;
                                }

                                .bbox{
                                    height: 100px;
                                    width: 100%;
                                    margin: 0px auto;
                                    display: flex;
                                    justify-content: center;
                                    .cbzb-box{
                                        width: 100%;
                                        height: 100%;
                                        display: flex;
                                        justify-content: center;
                                        dl{
                                            width: 100%;
                                            font-size: 14px;
                                            text-align: left;
                                            margin: 0;
                                            padding: 0;
                                            dt{
                                                margin: 0;
                                                color: #a7dbff;
                                                font-weight: bold;
                                            }
                                            dd{
                                                margin: 0;
                                                color: #eda72d;
                                                font-size: 18px;
                                                font-weight: bold;
                                            }
                                        }
                                    }
                                    .gzzb-box{
                                        width: 100%;
                                        height: 100%;
                                             display: flex;
                                        justify-content: center;
                                        dl{
                                            width: 100%;
                                            font-size: 14px;
                                            text-align: left;
                                            margin: 0;
                                            padding: 0;
                                            dt{
                                                margin: 0;
                                                color: #a7dbff;
                                                font-weight: bold;
                                            }
                                            dd{
                                                margin: 0;
                                                color: #ed2dd9;
                                                font-size: 18px;
                                                font-weight: bold;
                                            }
                                        }
                                    }
                                    .bjzb-box{
                                        width: 100%;
                                        height: 100%;
                                             display: flex;
                                        justify-content: center;
                                        dl{
                                            width: 100%;
                                            font-size: 14px;
                                            text-align: left;
                                            margin: 0;
                                            padding: 0;
                                            dt{
                                                margin: 0;
                                                color: #a7dbff;
                                                font-weight: bold;
                                            }
                                            dd{
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

                    .bottombox{
                        position: relative;
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        padding: 20px;
                        box-shadow: inset 0px 0px 15px 0px rgba(0, 128, 202, 0.8);
                        height: 390px;
                        .sitelevel{
                            width: 100%;
                            height: 100%;
                            position: relative;
                        }
                    }
                }
            }
        }

               .image-top::before{
                                content: '';
                                border-top:2px solid #00fcf9;
                                border-left: 1px solid #00fcf9;
                                position: absolute;
                                width: 15px;
                                height: 25px;
                                top: -1px;
                                left: -1px;
                                z-index: 2;
                            }
                            .image-top::after{
                                content: '';
                                border-top:2px solid #00fcf9;
                                border-right: 1px solid #00fcf9;
                                position: absolute;
                                width: 15px;
                                height: 25px;
                                top: -1px;
                                right:-1px;
                                z-index: 2;
                            }
                            .image-bottom::before{
                                content: '';
                                border-bottom:2px solid #00fcf9;
                                border-left: 1px solid #00fcf9;
                                position: absolute;
                                width: 15px;
                                height: 25px;
                                bottom: -1px;
                                left:-1px;
                                z-index: 2;
                            }
                            .image-bottom::after{
                                content: '';
                                border-bottom:2px solid #00fcf9;
                                border-right: 1px solid #00fcf9;
                                position: absolute;
                                width: 15px;
                                height: 25px;
                                bottom: -1px;
                                right:-1px;
                                z-index: 2;
                            }
}

</style>