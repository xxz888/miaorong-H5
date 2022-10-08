<!-- 更换通道 -->
<template>
  <div>
    <van-nav-bar title="官方社群微信号" left-arrow fixed :border='false' @click-left="onClickLeft"/>
    <div class="warpper_top"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div class="wechat_box">
        <div class="wechat_item" v-for="(item,index) in wechatList" :key="index">
          <div>{{ item.groupName }}</div>
          <img :src="item.qrcodeId" alt="">
          <p>长按保存图片，添加微信</p>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import {NavBar, PullRefresh} from 'vant'
import {wechatQuery} from '@/api/showBrand'

export default {
  data() {
    return {
      brandId: this.global.brandId,
      isLoading: false,
      wechatList: []
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
  },
  created() {
    this._wechatQuery()
  },
  methods: {
    onClickLeft() {
      window.history.back()
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this._wechatQuery()
        this.isLoading = false;
      }, 1000);
    },
    _wechatQuery() {
      wechatQuery().then(res => {
        if (res.resp_code == '000000') {
          this.wechatList = res.result.content
        }
      })
    }
  }
}
</script>
<style scoped>
.wechat_box {
  padding: 10px 15px;
  font-size: 14px;
  color: #121212;
}

.wechat_item {
  margin-bottom: 10px;
  background: #fff;
  text-align: center;
  padding: 10px 15px;
  border-radius: 10px;
}

.wechat_item img {
  height: 216px;
  width: 216px;

}

.wechat_item div {
  font-size: 17px;
  text-align: left;
}

.wechat_item p {
  color: #999;
}
</style>
