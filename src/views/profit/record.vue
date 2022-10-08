<template>
  <!-- 多多保重 -->
  <div style="background: #fff;">
    <van-nav-bar class="agent_nav theme_bg" style="background: none;" :border='false' title="提现记录" left-arrow
                 @click-left="onClickLeft" />
    <div class="warpper_top"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div>
        <div class="profit_type_top theme_bg">
          <ul>
            <li class="item">
              <div class="left">
                <div class="title">
                  <span>提现总金额 {{ totalAmount|toFixed }} （元）</span>
                </div>
              </div>
              <div class="right"></div>
            </li>
          </ul>
        </div>
        <div class="profit_share_cont">
          <div class="profit_type_top">
            <div class="profit_type_detail_top_bg">
              <div>时间</div>
              <div>金额</div>
              <div>状态</div>
            </div>
          </div>
          <van-list v-model="isupLoading" :finished="finished" finished-text="" @load="onLoad">
            <ul class="cash_list" v-if="profit.length>0">
              <li class="cash_item van-hairline--bottom" v-for="item in profit" :key="item.id">
                <div class="type">{{ item.createTime }}</div>
                <div class="amount">{{ item.amount|toFixed }}</div>
                <div class="theme amount">{{ handleStatus(item.orderStatus) }}</div>
              </li>
            </ul>
            <van-empty  v-else 
                       description="还没有记录,请先去推广吧">
            </van-empty>
          </van-list>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import {
  NavBar,
  PullRefresh,
  Icon,
  DropdownMenu,
  DropdownItem,
  List,
  empty,
  Button
} from 'vant';
import {withdrawOrderList} from "@/api/profit";

export default {
  data() {
    return {
      form: {
        page: 0,
        size: 20
      },
      totalAmount: 0,
      isLoading: false,
      profit: [],
      isupLoading: false,
      finished: false
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [Icon.name]: Icon,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [List.name]: List,
    [empty.name]: empty,
    [Button.name]: Button
  },
  created() {
    this.totalAmount = this.$route.params.type
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    getData() {
      withdrawOrderList(this.form).then(res => {
        if (res.resp_code == '000000') {
          this.isLoading = false;
          this.profit.push(...res.result.content)
          if (res.result.content.length < this.form.size) {
            this.finished = true;
          }
        }
      })
    },
    handleStatus(status){
      switch (status){
        case 0:
          return '处理中'
        case 1:
          return '已成功'
        case 2:
          return '已失败'
        default:
          return '未知状态'
      }
    },
    onLoad(){
      this.form.page++
      this.getData()
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this.isLoading = false;
      }, 1000);
    }
  }
}
</script>
<style scoped>
.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.agent_nav >>> .van-icon {
  color: #FFFFFF !important;
}


.profit_type_detail_top_bg {
  background: #fff;
  padding: 3px;
  border-radius: 10px;
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.09);
  display: flex;
  font-size: 14px;
  /* margin-bottom: 20px; */
}

.profit_type_detail_top_bg div {
  flex: 1;
  text-align: center;
  color: #666;
  padding: 10px 0;
}

.profit_type_record {
  background: #fff;
  padding: 3px 15px;
  border-radius: 10px;
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.09);
  display: flex;
  font-size: 14px;
}

.profit_type_record div {
  flex: 1;
  color: #666;
  padding: 10px 0;
}

.profit_type_top {
  width: 100%;
  padding: 10px 0 25px 0;
  font-size: 15px;
  color: #fff;
  border-radius: 0 0 20px 20px;
}

.profit_type_top .item {
  display: flex;
  padding-bottom: 20px;
}

.profit_type_top .item > div {
  flex: 1;
  text-align: center;
}

.profit_type_top .item .title {
  font-size: 13px;
  line-height: 30px;
  font-weight: 300;

}

.profit_type_top .item .amount {
  font-size: 32px;
}

.profit_type_top .item .profit_amount {
  font-size: 20px;
}

.profit_type_top .item .right {
  position: relative;
}

.profit_share_cont {
  padding: 0 10px;
  margin-top: -30px;
}

.profit_type_date {
  font-size: 14px;
  color: #333;
  padding-bottom: 20px;
}

.profit_type_date .item {
  display: flex;
  height: 44px;
  text-align: center;
}

.profit_type_date .item .right {
  width: 40px;
  color: #666;
  font-size: 15px;
  line-height: 44px;
}

.profit_type_date .item div {
  flex: 1;
  line-height: 40px;
}

.active {
  color: #30AEFB;
}

.profit_type_date .type {
  font-size: 12px;
  color: #666;
}

.user_empty >>> .van-empty__image img {
  height: auto;
}

.profit_type_date .record {
  display: flex;
  padding: 10px 15px;
  font-size: 13px;
}

/* .profit_type_date li:nth-child(1){
    line-height: 44px;
    font-size: 14px;
    padding: 0 15px;
} */


.profit_type_date li:nth-child(1) img {
  height: 11px;
  width: 18px;
  margin-right: 5px;
}

.profit_type_date .record div {
  flex: 1;
  position: relative;
}

.profit_type_date .record p {
  font-size: 12px;
  color: #999;
  padding-top: 10px;
}

.profit_type_date .record span {
  font-size: 20px;
  color: #30AEFB;
  position: absolute;
  height: 25px;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto 0;
  display: inline-block;
}

.cash_item {
  height: 44px;
  font-size: 12px;

  line-height: 44px;
  display: flex;
  text-align: center;

  background: #fff;
  color: #333;
}

.cash_item .type {
  width: 140px;
}

.cash_item .amount {
  flex: 1;
}
</style>
