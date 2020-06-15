<template>

            <chart :auto-resize='true' :options="shebeiOptions"></chart>

</template>

<script>
 import echarts from 'echarts/lib/echarts'
export default {
    props:['dataList'],
    data() {
        return {
            title:[],
            data:[],
        }
    },
    methods:{
        initDeviceData(data){ 
            let arr = data || this.dataList
            let mt = []
            let md = []
            arr.forEach(item => {
                mt.push(item.name)
                md.push(item.value)
            });
            this.title = mt;
            this.data = md;
        }
    },
    watch:{
        dataList(data){
            console.log('设备统计监听触发=====',data)
            this.initDeviceData(data)
        }
    },
    computed:{
        shebeiOptions(){
            const optData = {
                 textStyle: {
                    color: 'rgba(255, 255, 255, 1)'
                },
                grid: {
                   left: '70px',
                   top: '10px'
                },
                xAxis: {
                    type: 'value',
                               splitLine: {
                            //  改变轴线颜色
                            lineStyle: {
                            color: "rgba(0,0,0,0)"
                            }
                        },
                        axisTick: {
                            //y轴刻度线
                            show: false
                        },
                        axisLine: {
                            //隐藏y轴线
                            show: false
                        },
                             axisLabel: {
                          show: false
                        }
                },
                yAxis: {
                    type: 'category',
                    data: this.title,
                    axisLabel:{
                     textStyle:{
                         color:"#fff",
                         fontSize:12
                     }
                 }
                },
                series: [
                    {
                        name: '安装设备统计',
                        type: 'bar',
                        color: '#007dff',
                        data: this.data
                    }
                ]
            }
            return optData;
        }
    }
}
</script>

<style scoped lang="scss">

</style>
