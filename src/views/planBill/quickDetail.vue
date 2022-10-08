<!-- 账单详情 -->
<template>
  <div>
    <van-nav-bar title="账单详情" left-arrow fixed :border='false' @click-left="onClickLeft"/>
    <div class="main">
      <div class="header">
        <div>
          <img :src="item.imglog" alt="">
          <h4>{{ item.channelName }}</h4>
          <i>{{ item.rate * 100 |toFixed }}%</i>
        </div>
        <p><span style="color: #30AEFB;">￥{{ item.amount |toFixed }}</span></p>
        <span class="status">订单状态：{{ item.orderStatus |status }}</span>
      </div>
      <van-cell-group>
        <van-cell title="到账金额" center :value="item.realAmount.toFixed(2)+'元'"/>
        <van-cell title="手续费用" center :value="(item.amount-item.realAmount).toFixed(2)+'元'"/>
        <van-cell title="到帐卡" center :value="item.debitBankCard"/>
        <van-cell title="创建日期" center :value="item.createTime"/>
        <van-cell title="订单号" center :value="item.orderCode"/>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import {NavBar, CellGroup, Cell, Loading} from 'vant'
import {userInfoQuery} from "@/api/user";

export default {
  data() {
    return {
      item: {},
      typeList: [
        {text: '充值', value: 0},
        {text: '支付', value: 1},
        {text: '提现', value: 2},
        {text: '退款', value: 3},
        {text: '信用卡消费', value: 10},
        {text: '信用卡还款', value: 11},
      ],
      token: localStorage.getItem('token'),
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [Loading.name]: Loading
  },
  created() {
    this.item = JSON.parse(this.$route.params.item)
    this._getUserMessage()
  },
  methods: {
    onClickLeft() {
      window.history.back()
    },
    //-----------获得用户信息-----------
    _getUserMessage() {
      userInfoQuery(this.token).then(res => {
        if (res.resp_code == "000000") {
          if (res.result.verificationStatus != 0) {
            this.$store.commit('closeGuide')
          }
        }
      })
    }
  }
}
</script>
<style scoped>
.main {
  padding-top: 47px;
  text-align: left;
}

.header {
  height: 140px;
  background: #FFFFFF;
  padding-top: 25px;
  box-sizing: border-box;
  margin-bottom: 5px;
  text-align: center
}

.header div {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header div img {
  width: 30px;
  margin-right: 3px;
}

.header div h4 {
  font-size: 18px;
  margin-right: 5px;
}

.header div i {
  font-style: normal;
  background: #121212;
  border-radius: 3px;
  color: #FFFFFF;
  padding: 2px 5px;
  font-size: 12px;
}

.header p {
  font-size: 18px;
  margin: 8px 0;
}

.status {
  font-size: 14px;
}
</style>
