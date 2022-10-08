<!-- 更换通道 -->
<template>
  <div class="white">
    <van-nav-bar title="关于我们" left-arrow fixed :border='false' @click-left="onClickLeft"/>
    <div class="warpper_top"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div class="about_box">
        <div class="about_item" v-for="(item,index) in aboutList" :key="index">
          <img class="logo" src="../../assets/profit/logo.jpg" alt="">
          <p>{{ item.pictureContent }}喵融生活联盟生活是行业领先的信用卡还款、刷
            卡、办卡软件，空卡仅需留足手续费
            ，或5%以上的可用余额，即可全额快速还款，每万元手
            续费低至75元，让您彻底远离逾期；刷卡10秒内
            到账，每万元手续费低至38元。银联授信，安全稳定；累积
            注册用户超过1000万，是千万用户的共同信赖。</p>
        </div>
      </div>
      <div class="tel">
        <!-- <p>浙江瀚德网络科技有限公司</p>
        <p>电话：400-6666-085</p> -->
      </div>
    </van-pull-refresh>

  </div>
</template>

<script>
import {NavBar, PullRefresh} from 'vant'
import {aboutQuery} from '@/api/showBrand'

export default {
  data() {
    return {
      brandId: this.global.brandId,
      isLoading: false,
      aboutList: []
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
  },
  created() {
    this._aboutQuery()
  },
  methods: {
    onClickLeft() {
      window.history.back()
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this._aboutQuery()
        this.isLoading = false;
      }, 1000);
    },
    _aboutQuery() {
      aboutQuery().then(res => {
        if (res.resp_code == '000000') {
          this.aboutList = res.result.content
        }
      })
    }
  }
}

</script>
<style scoped>
.white {
  background-color: #fff;
  height: 100vh;
}

.tel {
  padding-top: 150px;
  text-align: center;
  font-size: 15px;
}

.about_box {
  padding: 10px 35px;
  font-size: 14px;
  color: #121212;
}

.about_item {
  margin-bottom: 10px;
}

.about_item p {
  padding-top: 10px;
  text-indent: 20px;
  line-height: 28px;
  width: 100%;

}

.logo {
  width: 180px;
  margin: 0px 60px;
}
</style>
