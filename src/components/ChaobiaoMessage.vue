<template>
    <ul>
        <li v-for="(item, index) in List" :key="index" v-show="item.status == 0"><img src="../assets/images/chaobiao_baojing.png" />{{item.siteName}}超标了</li>
    </ul> 
</template>

<script>
export default {
    props:['message'],
    data(){
        return{
            List:''
        }
    },
    watch:{
        message(data){
            console.log("message 监听触发",data)
            this.List = data
        }
    },
    created(){
      this.List = this.message
    }
}
</script>

<style lang="scss" scoped>
 ul{
                    margin: 0;
                    padding: 0;
                    li{
                        margin: 10px;
                        padding: 0;
                        list-style: none;
                        font-size: 12px;
                        width: 100%;
                        height: 40px;
                        line-height: 0px;
                        background: rgba(54,229,225,.5);
                        color: #fff;
                        border-radius: 100px;
                        display: flex;
                        align-items: center;
                        padding: 5px;
                        img{
                            display: block;
                            width: 30px;
                            height: 30px;
                            margin-right: 8px;
                        }
                        // opacity: 0;
                        animation: ani 2s ease 1
                    }
                }

  @keyframes ani{
    0% {
              transform: translateX(-300px);
    }


    100% {
         transform: translateX(0px);
    }
  }

</style>