<template>
    <div class="monitoring_menu_box">
                <select v-model="areaId" @change="changeSelect('area')" >
                    <option :value="item.id" v-for="(item, index) in areaList"  :key="index">{{item.name}}</option>
                </select>
                <select v-model="streetId" @change="changeSelect('street')" >
                    <option :value="''">全部</option>
                    <option :value="item.id" v-for="(item, index) in streetList"  :key="index">{{item.name}}</option>
                </select>
                <select v-model="siteId">
                    <option :value="''">全部</option>
                   <option :value="item.id" v-for="(item, index) in siteList"  :key="index">{{item.siteName}}</option>
                </select>

                <button class="seach-btn" @click="handlegetListSiteByParam"></button>
    </div>
</template>

<script>
export default {
    data(){
        return{
            areaList:'',
            streetList: '',
            siteList: '',
            areaId: '区域',
            streetId: '街道',
            siteId: '站点'
        }
    },
    methods:{
        getListAreaStreet(){
            console.log('开始获取实时监控下拉菜单')
            this.$api.listAreaStreet({
            }).then(res => {
                console.log('获取实时监控初始化菜单', res)
                this.areaList = res.data.areaList
                this.areaId = res.data.areaList[0].id
                this.streetList = res.data.streetList
                this.streetId = res.data.streetList[0].id
                this.siteList = res.data.siteList
                this.siteId = res.data.siteList[0].id

                this.handlegetListSiteByParam()
            })
        },
        
        handlegetListSiteByParam(){
            const condition = {
                areaId: this.areaId,
                streetId: this.streetId,
                siteId: this.siteId
            }
                // 把查询条件派发给父组件
             this.$emit('sendMonitoringCondition', condition)
        },
        changeSelect(data){

            let params = {}
            let apiName = ''
            
            if(data == 'area'){
                params = { areaId: this.areaId }
                apiName = 'getStreetsByArea'
            }else{
                params = { streetId: this.streetId }
                apiName = 'getSitesByStreet'
            }

            this.$api[apiName](
                params
            ).then( res => {
                
                if(data == 'area'){
                      this.streetList = res.data
                      this.streetId = res.data[0].id
                }else{
                    this.siteList = res.data
                    this.siteId = res.data[0].id
                }
            })
        }
    },
    created(){
        this.getListAreaStreet()
    }
}
</script>

<style lang="scss" scoped>

        .monitoring_menu_box{
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

     
</style>