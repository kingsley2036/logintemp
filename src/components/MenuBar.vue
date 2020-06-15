<template>
    <div class="menubox">
        <div class="n" v-if="$route.name == 'record'">
            <h6>报警记录</h6>
        </div>

        <!-- 实时监控 下拉框 -->
        <MonitoringSelect  
            v-if="$route.name == 'monitoring'" 
            @sendMonitoringCondition="getMapList"
            />

        <!-- 统计信息 下拉框 -->
        <StatisticsSelect 
            v-if="$route.name == 'statistics'"
            @sendStatisticsCondition="getStatisticsList"
        />

        <div class="m" v-if="$route.name == 'record'">

        </div>
        <div class="menulist" v-else>
            <button :class="{active:$route.name == 'monitoring'}" ><router-link  class="btn"  :to="{name:'monitoring'}">实时监控</router-link></button>
            <button :class="{active:$route.name == 'statistics'}" ><router-link  class="btn"  :to="{name:'statistics'}">统计分析</router-link></button>
        </div>
        <div class="right">
            <dl v-show="$route.name =='monitoring'">
                <dt>监控站点:</dt>
                <dd>{{siteInfo.siteNum}}个</dd>
                <dt>超标站点:</dt>
                <dd>{{siteInfo.exceedSiteNum}}个</dd>
                <dt>故障站点:</dt>
                <dd>{{siteInfo.brokenSiteNum}}个</dd>
            </dl>
            <div class="optionbox">
                <a class="icon-message"><div class="red-count">14</div></a>
                <div class="avatarbox">
                    <img :src="'http://fume.ttantu.cn:8001/' + avatarUrl" class="avatar" alt="">
                    <div class="d3"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Axios from 'axios'
import MonitoringSelect from '@/components/MonitoringSelect'
import StatisticsSelect from '@/components/StatisticsSelect'

export default {
    components: {
        MonitoringSelect,
        StatisticsSelect
    },
    data(){
        return{
            avatarUrl: $c.login.avatarUrl,
            siteInfo: {
                siteNum: 0,
                exceedSiteNum: 0,
                brokenSiteNum: 0
            },
            siteList:{}
        }
    },
    methods:{
        getMapList(data){
            const condition = data
            this.seachSiteList(condition)
        },
        seachSiteList(data) {
            this.$api.listSiteByParam(
                data
            ).then(res =>{
                this.siteInfo.siteNum = res.data.siteNum
                this.siteInfo.exceedSiteNum = res.data.exceedSiteNum
                this.siteInfo.brokenSiteNum = res.data.brokenSiteNum
                if(res.data.siteList){
                    this.$emit('sendSiteList', res.data.siteList)
                    console.log('MenuBar中 emit后的res.data.siteList', res.data.siteList)
                }
            })
        },
        getStatisticsList(data){
            this.getSiteStatusStatistic(data)
            this.getExceedStandardNumStatistic(data)
            this.getExceedStandardPercent(data)
        },
        getSiteStatusStatistic(data){
            this.$api.getSiteStatusStatistic(
                data
            ).then( res => {
                console.log('统计分析查询结果集', res)
                this.$emit('sendSiteStatusInfo',res.data)
            })
        },
        getExceedStandardNumStatistic(data){
            this.$api.getExceedStandardNumStatistic(
                data
            ).then( res => {
                console.log('根据查询条件获取到的各办事处超标占比统计柱状图=========', res)
                this.$emit('sendExceedStandardNum', res.data)
            })
        },
        getExceedStandardPercent(data){
            this.$api.getExceedStandardPercent(
                data
            ).then(res => {
                console.log('根据查询条件获取到的超标占比统计环形图', res)
                this.$emit('sendPercent', res.data.percent)
            })
        }
        

    },
    created(){
    }
}
</script>

<style lang="scss" scoped>
    .menubox{
        width: 94%;
        margin: 0px auto 5px;
        height: 50px;
        display: flex;
        justify-content: space-between;

        h6{
            font-size: 16px;
            color: #a7dbff;
            width: 200px;
            line-height: 50px;
            margin: 0;
            padding: 0;
        }
        .seachbox{
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            select,option{
                width: 110px;
                text-align: center;
                text-align-last: center;
                height: 26px;
                margin:0px 10px;
                background: #0b1c3d;
                border: 1px solid #0a1b36;
                color: #a7dbff;
                box-shadow: inset 0px 0px 5px 0px rgba(40, 94, 229, 0.4);
                font-weight: bold;

            }

            .seach-btn{
                width: 25px;
                height:25px;
                border-style: none;
                background: url(../assets/images/seach_btn.png) no-repeat;
            }
        }

        .menulist{
            display: flex;
            justify-content: space-between;
            width: 50%;
            height: 50px;
            button{
                margin: 0;
             
                border-style: none;
                background: none;
                padding: 0;
                width: 43%;
                height: 40px;
                line-height: 40px;
                font-size: 16px;
                font-weight: bold;
                color: #fff;
                &.active{
                       background-color: rgba(8, 29, 97, 0);
                    box-shadow: inset 0px 0px 40px 0px rgba(40, 94, 229, 0.6);
                }
                .btn{
                    color: #fff;
                    text-decoration: none;
                }
            }
        }

        .right{
            width: 100%;
            display: flex;
            justify-content: flex-end;
            padding-left: 60px;
            dl{
                margin: 0;
                font-size: 14px;
                line-height: 50px;
                height: 50px;
                color: #fff;
                dt{
                    float: left;
                    margin: 0 10px;
                }
                dd{
                    float: left;
                    margin: 0;
                    font-size: 12px;
                    color: #89eaff;
                    font-weight: bold;
                }
            }
            .optionbox{
                width: 90px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-left: 50px;
                .icon-message{
                    position: relative;
                    display: block;
                    width: 30px;
                    height: 25px;
                    background: url(../assets/images/icon_baojing.png) no-repeat left;
                    .red-count{
                        text-overflow: ellipsis;
                        overflow: hidden;
                        margin: 0;
                        padding: 0;
                        position: absolute;
                        background: #ee4356;
                        color: #fff;
                        font-size: 10px;
                        text-align: center;
                        width: 15px;
                        height: 15px;
                        border-radius: 15px;
                        font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
                        top:0;
                        right:0;
                    }
                }

                .avatarbox{
                    display: flex;
                    .avatar{
                        display: block;
                        width: 31px;
                        height: 31px;
                        border-radius: 31px;
                        margin-right: 3px;
                    }
                .d3{
                    width: 0; 
                    height: 0;
                    border-width: 4px;
                    margin-top: 15px;
                    border-style: solid;
                    border-color:#fff transparent transparent transparent;
                }
                }
                

            }
        }
    }
</style>