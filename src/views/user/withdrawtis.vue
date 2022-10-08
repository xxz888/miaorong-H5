<template>
  <div>
    <van-nav-bar left-arrow class="agent_nav theme_bg" title="提现" @click-left="onClickLeft"/>
    <div class="box">
      <div class="tis_img">
        <span v-for=" index in normal" :key="index">
          <img v-if="index <= active"
               src="../../assets/withdraw/withdraw_active.png">
          <img v-else
               src="../../assets/withdraw/withdeaw_normal.png">
        </span>
        <hr/>
      </div>
      <p class="tis_txt conter" v-if="active">恭喜您已成功直推激活{{ active }}人，还差{{ normal - active }}人即可提现。</p>
      <p v-else class="tis_txt conter">您尚未达到提现标准，直推激活8人后即可提现。</p>
      <div class="tis_txt">
        <p>规则说明：</p>
        <p>1、推广收益直推激活8人为一次提现周期</p>
        <p>2、每直推激活1人会点亮1盏灯，累计点亮8盏灯提现</p>
        <p class="indent">提现时间：工作日9:00-18:00</p>
        <p class="indent">提现规则：需大于100元，2元/笔</p>
        <p class="indent">到账时间：小于等于500元，秒到账；大于500，下一个工作日12:00前到账</p>
      </div>
    </div>
  </div>
</template>
<script>
import {
  NavBar
} from 'vant';

export default {
  components: {
    [NavBar.name]: NavBar
  },
  data() {
    return {
      normal: 8,
      active: 0
    }
  },
  created() {
    this.active = this.$route.params.activateCount
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    }
  }
}
</script>
<style scoped>
.box {
  height: 100vh;
  width: 100%;
  background-color: #fff;
}

.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.agent_nav >>> .van-icon {
  color: #FFFFFF !important;
}

.box {
  padding-top: 130px;
}

.tis_img {
  width: 300px;
  height: 40px;
  background: #E8E8E8;
  border-radius: 30px;
  margin: 10px auto;
  padding-left: 15px;
}

.tis_img hr {
  width: 250px;
  margin: -10px auto 0px auto;
  border-top: #fff 1px solid;
  background: #fff;
}

.tis_img img {
  width: 20px;
  margin: 5px 10px 5px 5px;
}

.tis_txt {
  width: 285px;
  font-size: 12px;
  margin: 0px auto;
  font-family: PingFang SC;
  font-weight: 400;
  color: #1C1C1C;
  line-height: 24px;
  word-wrap: break-word
}

.tis_content {
}

.conter {
  text-align: center;

}

.indent {
  padding-left: 20px;
}

</style>
