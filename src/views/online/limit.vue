<!-- 更换通道 -->
<template>
  <div>
    <van-nav-bar :title="item.name" left-arrow fixed :border='false' @click-left="onClickLeft"/>
    <div class="warpper_top"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div class="limit_channel">
        <ul>
          <li class="limit_item type theme van-hairline--bottom">
            <div> 银行名称</div>
            <div> 单卡单笔</div>
            <div> 单卡当日</div>
          </li>
          <li class="limit_item van-hairline--bottom" v-for="(item,index) in limitList" :key="index">
            <div> {{ item.supportBankName }}</div>
            <div> {{ item.singleMinLimit }}-{{ item.singleMaxLimit }}</div>
            <div> {{ item.everyDayMaxLimit }}</div>
          </li>
        </ul>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import {NavBar, PullRefresh} from 'vant'
import {channelLimitQuery} from '@/api/online'

export default {
  data() {
    return {
      brandId: this.global.brandId,
      phone: '',
      item: {},
      isLoading: false,
      limitList: []
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
  },
  created() {
    this.item = JSON.parse(this.$route.params.item)
    this._channelLimitQuery(this.item)
  },
  methods: {
    onClickLeft() {
      window.history.back()
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this._channelLimitQuery(this.item)
        this.isLoading = false;
      }, 1000);
    },
    _channelLimitQuery(item) {
      channelLimitQuery(item.channelTag).then(res => {
        if (res.resp_code == '000000') {
          this.limitList = res.result
        }
      })
    }
  }
}

</script>
<style scoped>
.limit_channel {
  background: #fff;
  font-size: 14px;
  width: 100%;
  /* padding: 0 10px; */
}

.limit_item.type {
  background: #f5f5f5;
}

.limit_item {
  display: flex;
  line-height: 50px;
  text-align: center;
}

.limit_item div {
  flex: 1;

}
</style>
