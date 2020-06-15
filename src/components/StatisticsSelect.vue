<template>
    <div class="statistics_menu_box">
                <select v-model="areaId" @change="changeSelect()">
                    <option :value="item.id" v-for="(item, index) in areaList"  :key="index">{{item.name}}</option>
                </select>
                <select v-model="streetId" >
                    <option :value="item.id" v-for="(item, index) in streetList"  :key="index">{{item.name}}</option>                    
                </select>
                <select v-model="dateTypeId">
                    <option value="month">一个月</option>
                    <option value="week">一周</option>
                    <option value="yesterday">昨天</option>
                </select>
                <button class="seach-btn" @click="handleGetSiteStatus"></button>
    </div>
</template>

<script>
export default {
    data(){
        return{
            areaList: [],
            streetList: [],
            areaId: '',
            streetId: '',
            dateTypeId: 'month'
        }
    },
    methods:{
        getListAreaStreet(){
            this.$api.s_listAreaStreet({
            }).then(res => {
                console.log('统计分析初始化菜单====',res)
                this.areaList = res.data.areaList
                this.areaId = res.data.areaList[0].id
                this.streetList = res.data.streetList
                this.streetId = res.data.streetList[0].id

                this.handleGetSiteStatus()
            })
        },
        handleGetSiteStatus(){
            const condition = {
                areaId: this.areaId,
                streetId: this.streetId,
                dateTypeId: this.dateTypeId
            }
            this.$emit('sendStatisticsCondition', condition)
        },
        changeSelect(){
            // 统计分析只联动接到
            this.$api.s_getStreetsByArea({
                areaId: this.areaId
            }).then(res =>{
                this.streetList = res.data
                this.streetId = res.data[0].id
            })
        }
    },
    created(){
        this.getListAreaStreet()
    }
}
</script>

<style lang="scss" scoped>

        .statistics_menu_box{
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