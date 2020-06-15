<template>
  <div class="mainbox">
    <Header :tab-active="active"/>
    <router-view/>
    <Footer/>
</template>
<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default {
  components: {
    Header, Footer
  },
  data() {
    return {
      active: null
    }
  }
}
</script>