<template>
  <chart :auto-resize='true' :options='lineOptions'>
  </chart>
</template>

<script>
  const colors = ['#5793f3', '#d14a61', '#675bba']
  export default {
    props:['deviceId'],
    data() {
      return {
        data:[],
        title:[]
      }
    },
    methods:{
      initDoubleLineData(id){
        console.log('传参了吗?', id)
        if(id){
          this.$api.dailyTotalStatisticBySite({
            id:id
          }).then(res =>{
            //  let data = JSON.stringify(res.data.totalList)
            //  let title = JSON.stringify(res.data.dayList)

            // this.data = JSON.parse(data)
            // this.title = JSON.parse(title)
            this.data = res.data.totalList
            this.title = res.data.dayList


          }).catch(err => {
            console.log('7天统计出错',err)
          })
        }

      }
    },
    watch: {
        deviceId(data){
            console.log('7天统计监听deviceId===',data)
            this.initDoubleLineData(data)
        }
    },
    created(){
      this.initDoubleLineData()
    },
    computed:{
      lineOptions(){
          const optData = {
                    color: colors,
                  tooltip: {
                    trigger: 'none',
                    axisPointer: {
                      type: 'cross'
                    }
                  },
                  grid: {
                    top: 30,
                    bottom: 30
                  },
                  xAxis: [{
                      type: 'category',
                      axisTick: {
                        alignWithLabel: true
                      },
                      axisLine: {
                        onZero: true,
                        lineStyle: {
                          color: colors[1]
                        }
                      },
                      axisPointer: {
                        label: {
                          formatter: function (params) {
                            return '油烟值  ' + params.value +
                              (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                          }
                        }
                      },
                      data: this.title
                    }
                  ],
                  yAxis: [{
                    type: 'value'
                  }],
                  series: [
                    {
                      name: '油烟值',
                      type: 'line',
                      smooth: true,
                      data: this.data
                    }
                  ]
          }
          return optData;
      }
    }
  }
</script>
