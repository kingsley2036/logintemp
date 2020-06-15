<template>
    <div class="mainbox">Welcome, please wating for loading...</div>
</template>
<script>
import {checkLogin} from '@/api/sys/login'

export default {
    data() {
        return { }
    },
    mounted() {
        // 检查登录
        checkLogin().then(() => {
            // to monitoring
            this.$router.push('/monitoring')
        }).catch(() => {
            // to login
            this.$router.push('/login')
        });
    }
}
</script>