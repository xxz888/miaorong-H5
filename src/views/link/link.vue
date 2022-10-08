<template>
  <div class="">
    <!-- <x-header :left-options="{backText: ''}">{{title}}</x-header> -->
    <van-nav-bar :title="title" left-arrow @click-left="onClickLeft"/>
    <div
      style="width:100%;height:100%;-webkit-overflow-scrolling:touch;overflow-y:scroll;position:fixed;padding-top: 46px;">
      <iframe width="100%" height="100%" frameborder="0" :src="url"></iframe>
    </div>
  </div>
</template>

<script>
import {NavBar} from 'vant';

export default {
  data() {
    return {
      url: "",
      title: "",
    }
  },
  components: {
    [NavBar.name]: NavBar,
  },
  created() {
    this.url = JSON.parse(this.$route.params.url)
    this.title = JSON.parse(this.$route.params.title)
  },
  methods: {
    onClickLeft() {
      this.$router.push({path: "/creditcard",
        query: {
          'phone': localStorage.getItem('phone'),
          'token': localStorage.getItem('token'),
          'brandId': localStorage.getItem('brandId'),
          'userId': localStorage.getItem('userId'),
          'ip': this.global.ip,
          'type': 'h5',
          'deviceId': localStorage.getItem('deviceId')
        }
      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
