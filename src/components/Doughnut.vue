<template>
  <chart :auto-resize='true' :options='DoughnutOptions'>
  </chart>
</template>

<script>
  export default {
props:['Percent'],
    data() {
      return {
        percentNum:0
      }
    },
    watch: {
      Percent(data){
        console.log('监听超标占比环形图比例数据===',data)
          this.percentNum = data
      }
    },
    computed:{
      DoughnutOptions(){
        const optData = {
              title: {
            textStyle: {
              fontSize: 14,
              color: '#fff',
            },
            subtextStyle: {
              fontSize: 14,
              color: '#fff',
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          series: [
            {
              name: '超标比例',
              type: 'pie',
              radius: ['40%', '60%'],
              avoidLabelOverlap: false,
              hoverAnimation: false,
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  formatter:  '超标\n' + this.percentNum + '%',
                  textStyle:{
                    color:'#36e3fd',
                    fontSize: 20,
                    fontWeight: 'bolder'
                  }
                },
              },
              startAngle: 0,
              data: [
                {
                  value: 80,
                  name: '超标',
                  itemStyle: {
                    normal: {
                      color: '#36e5ff'
                    }
                  }},
                {
                  value: 20,
                  name: '正常',
                  itemStyle: {
                    normal: {
                      color: '#ffae5c'
                    }
                  }}
              ]
            }
          ]
        }
        return optData;
      }
    }
  }
</script>
