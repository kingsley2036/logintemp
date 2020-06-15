<template>
  <chart :auto-resize='true' :options='options'>
  </chart>
</template>

<script>
 const colors = {
    yellow: '#eda72d',
    pink: '#ed2dd9',
    green: '#2dedc7',
 }
  export default {
    props:['color','title','myValue'],
    data() {
      return {
        options: {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          series: [
            {
              name: this.title + '占比',
              type: 'pie',
              radius: ['70%', '25%'],
              avoidLabelOverlap: true,
              label: {
                normal: {
                  show: false,
                },
              },
              startAngle: 0,
              data: [
                {
                  value: this.myValue,
                  name: this.title,
                  itemStyle: {
                    normal: {
                      color: colors[this.color]
                    }
                  }},
                {
                  value: 100-this.myValue,
                  name: '正常',
                  itemStyle: {
                    normal: {
                      color: '#042d6b'
                    }
                  }}
              ]
            }
          ]
        }
      }
    }
  }
</script>
