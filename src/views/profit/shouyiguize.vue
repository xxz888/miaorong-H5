<template>
  <div>
    <van-nav-bar class="agent_nav theme_bg" style="background: none;" :border='false' title="收益规则" left-arrow
                 @click-left="onClickLeft" />
    <img src="../../assets/profit/shouyi.png" width="100%" style="margin-top: 40px">
  </div>
</template>
<script>
import {NavBar} from 'vant';

export default {
  data() {
    return {}
  },
  components: {
    [NavBar.name]: NavBar
  },
  methods: {
    onClickLeft() {
      window.history.back()
    }
  }
}
</script>
<style scoped>

</style>
