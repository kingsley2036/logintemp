<template>
  <chart class='line-chart' :auto-resize='true' :options='options'>
  </chart>
</template>

<script>

  export default {
    data() {
      return {
        options: {
          textStyle: {
            color: 'rgba(255, 255, 255, 1)'
          },
 
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
      
          series: [{
            name: '评级占比',
            type: 'pie',
            radius : '80%',
            roseType: 'radius',
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: true
              }
            },
            lableLine: {
              normal: {
                show: false
              },
              emphasis: {
                show: true
              }
            },
            data: [{
                value: 10,
                name: '优',
                itemStyle: {
                    normal: {
                      color: '#fdd100'
                    }
                  }
              },
              {
                value: 15,
                name: '良',
                   itemStyle: {
                    normal: {
                      color: '#ff4873'
                    }
                  }
              },
              {
                value: 15,
                name: '中',
                     itemStyle: {
                    normal: {
                      color: '#3fecff'
                    }
                  }
                
              },
              {
                value: 25,
                name: '差',
                     itemStyle: {
                    normal: {
                      color: '#7351e3'
                    }
                  }
              }
            ]
          }]
        }
      }
    }
  }
</script>
