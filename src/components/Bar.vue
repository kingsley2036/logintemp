<template>
  <chart class='line-chart' :auto-resize='true' :options='BarOptions'>
  </chart>
</template>

<script>
  import {
    graphic
  } from 'echarts/lib/export'


  export default {
    props:['dataList'],
    data() {
      return {
        exceedNum: [],
        totalNum: [],
        streetNameList: []
    }
  },
  watch:{
    dataList(data){
      console.log('监听各个办事处超标统计柱状图',data)
      const arr = data.dataList
      console.log('打印data',arr)
      let exc, total = []
      arr.forEach(item => {
          exc = item.exceedNum
          total = item.totalNum
      });

      this.exceedNum = exc;
      this.totalNum = total;
      this.streetNameList = data.streetNameList

    }
  },
  computed:{
    BarOptions(){
       const optData = {
                   color: ["#20a8e4",'#ded424'],
          tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'

          }
        },
        legend: {
          data:['总数','超标次数'],
          textStyle: {
            fontSize: '12',
            color:'#fff'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis : [
          {
            type : 'category',
            data : this.streetNameList,
            axisLabel: {
              interval: 0,
              show: true,
              textStyle: {
                fontSize: '12',
                color:'#fff'
              }
            },
          }
        ],
        yAxis : [
          {
                    splitLine: {
                             show: true,
                            //  改变轴线颜色
                            lineStyle: {
                            color: '#2c3698'
                            }
                        },
            type : 'value',
            axisLabel: {
              textStyle: {
                fontSize: '12',
                color:'#fff'
              }
            },
          }
        ],
        series : [
          {
            name:'总数',
            type:'bar',
            stack: '排名',
            data: this.totalNum,
            barWidth:'30%'
          },
          {
            name:'超标次数',
            type:'bar',
            stack: '排名',
            data: this.exceedNum,
            barWidth:'30%',
            itemStyle:{
            }
          },
        ]
       }
       return optData;
    }
  }
}
</script>
