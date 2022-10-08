<template>
  <div>
    <van-nav-bar class="agent_nav theme_bg" style="background: none;" :border='false' title="丢失信用" left-arrow
                 @click-left="onClickLeft" />
    <div class="warpper_top"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div>
        <ul class="agent_list" v-if="loseList.length>0">
          <li class="credit_list_item_box" v-for="(item,index) in loseList" :key="index">
            <div class="credit_list_item">
              <div class="left">
                <img src="../../assets/agent/img_icon.png" alt="">
              </div>
              <div class="cont">
                <div v-if="item.firstUserName!=null && item.firstUserName!=''">{{ item.firstUserName }}</div>
                <div v-else>未实名</div>
                <span class="id">ID:{{ item.firstUserId }}</span>
              </div>
              <div class="right" v-if="type==0">
                <div class="amount ">-{{ item.lostSuperiorQuota }}</div>
              </div>
              <div class="right" v-else>
                <div class="amountT">-{{ item.lostSuperiorQuota }}</div>
                <span class="btn theme-linear-bg " @click="makeUp(item)">立即弥补</span>
              </div>
            </div>
          </li>
        </ul>
         <van-empty description="暂无数据"  v-else/>
      </div>
    </van-pull-refresh>
    <van-popup v-model="detailTrueFasleBy" closeable position="bottom" close-icon-position="top-left" :style="{ height: '70%' }">
      <div>
        <div class="detail_title  van-hairline--bottom ">付款详情</div>
        <div class="detail_cont">
          <div class="detail_amount">{{ active.lostSuperiorQuota }}</div>
          <ul>
            <li class="detail_type van-hairline--bottom">
              <div class="color_666">订单信息</div>
              <div>信用弥补</div>
            </li>
            <li class="detail_type van-hairline--bottom">
              <div class="color_666">付款方式</div>
              <div>可提现余额</div>
            </li>
          </ul>
          <div class="detail_num">
            <p>总弥补金额：{{ sum.totalAmount }}</p>
            <p>已弥补金额：{{ sum.successAmount }}</p>
            <p>剩余弥补金额：{{ sum.needAmount }}</p>
            <span>联系客服线下弥补：{{ brandPhone }}</span>
          </div>
          <div class="detail_btn theme-linear-bg" @click="pay()">立即支付</div>
        </div>
      </div>
    </van-popup>
    <van-popup class="pass" v-model="passTrueFalseBy" round closeable close-icon-position="top-left">
      <div class="pass_box">
        <div class="pass_title">
          输入支付密码
        </div>
        <div class="cont">
          <div class="title">弥补金额 {{ active.lostSuperiorQuota }} 元</div>
          <div class="pass_input">
            <div class="left">
              <van-field v-model="paypass" maxlength="6" minlength="0" type="number" clearable placeholder="请输入支付密码"/>
            </div>
            <div class="right theme_bg" @click="confirm">确定</div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  NavBar,
  PullRefresh,
  Empty,
  Popup,
  Field
} from 'vant';
import {
  userSonQuotaQuery, userQuotaSumQuery, excludingDebt
} from '@/api/creditManage'
import {brandQuery} from '@/api/showBrand'

export default {
  data() {
    return {
      brandId: localStorage.getItem('brandId'),
      userId: localStorage.getItem('userId'),
      phone: localStorage.getItem('phone'),
      isLoading: false,
      loseList: [],
      type: 0,
      detailTrueFasleBy: false,
      active: {},
      sum: {
        needAmount: 0,
        successAmount: 0,
        totalAmount: 0,
      },
      brandPhone: "",
      passTrueFalseBy: false,
      paypass: "",
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [Empty.name]: Empty,
    [Popup.name]: Popup,
    [Field.name]: Field
  },
  created() {
    this.type = JSON.parse(this.$route.params.type)
    this._userSonQuotaQuery()
    this.getBrand()
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    _userSonQuotaQuery() {
      userSonQuotaQuery(undefined, undefined, 1).then(res => {
        this.loseList = [];
        if (res.resp_code == "000000") {
          this.loseList = res.result;
        }
      });
    },
    getBrand() {
      brandQuery(this.global.brandId).then(res => {
        if (res.resp_code == "000000") {
          this.brandPhone = res.result.brandPhone
        } else {
          this.$toast({message: res.data.resp_message, position: 'bottom'})
        }
      })
    },
    makeUp(item) {
      this.active = item
      userQuotaSumQuery().then(res => {
        if (res.resp_code == "000000") {
          this.sum = res.result
        }
      });
      this.detailTrueFasleBy = true
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this._userSonQuotaQuery()
        this.isLoading = false;
      }, 1000);
    },
    pay() {
      this.detailTrueFasleBy = false
      this.passTrueFalseBy = true
    },
    confirm() {
      if (this.paypass == '') {
        this.$toast({message: '请输入支付密码', position: "bottom"});
        return
      }
      excludingDebt(this.active.firstUserId, this.active.lostSuperiorQuota, this.paypass).then(res => {
        if (res.resp_code == '000000') {
          this.passTrueFalseBy = false
          this._userSonQuotaQuery()
          this.$toast({message: res.resp_message, position: "bottom"});
        }
      })
    }
  }
};

</script>
<style scoped>
.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.agent_nav >>> .van-icon {
  color: #FFFFFF !important;
}

.user_empty >>> .van-empty__image img {
  height: auto;
}

.agent_list {
  padding: 10px 15px;
}

.credit_list_item_box {

  background: #fff;
  margin-bottom: 20px;
  padding: 10px 15px;
  border-radius: 12px;
  font-size: 14px;

}

.credit_list_item {
  display: flex;
}

.credit_list_item img {
  height: 40px;
  width: 40px;
}

.credit_list_item .left {
  width: 50px;
}

.credit_list_item .cont .id {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  display: inline-block;
}

.credit_list_item .cont {
  flex: 1;
}

.credit_list_item .right {
  flex: 1;
  text-align: right;
}

.credit_list_item .right .amount {
  font-size: 20px;
  line-height: 43px;
  color: #30AEFB;
}

.credit_list_item .right .amountT {
  font-size: 16px;
  color: #30AEFB;
}

.credit_list_item .right .btn {
  font-size: 12px;
  color: #fff;
  padding: 2px 10px;
  border-radius: 15px;
  text-align: center;
  margin-top: 5px;
  display: inline-block;
}

/* 详情 */
.detail_title {
  line-height: 50px;
  font-size: 14px;
  text-align: center;
}

.detail_cont {
  text-align: center;
  font-size: 14px;
}

.detail_amount {
  font-size: 16px;
  padding: 40px 0;
}

.detail_type {
  display: flex;
  padding: 0 15px;
  justify-content: space-between;
  line-height: 44px;
}

.detail_num {
  padding-top: 20px;
  color: #666;
}

.detail_num p {
  font-size: 12px;
  line-height: 22px;
}

.detail_num span {
  font-size: 13px;
  padding: 10px 0;
  display: inline-block;
}

.detail_btn {
  font-size: 14px;
  color: #fff;
  border-radius: 15px;
  text-align: center;
  margin-top: 5px;
  display: inline-block;
  width: 80%;
  line-height: 40px;

}

>>> .pass.van-popup {
  background: #f5f5f5 !important;
}

.pass_box {
  width: 300px;
  font-size: 14px;
  padding: 10px 15px 25px 15px;
  text-align: center;
}

.pass_title {
  height: 40px;
  line-height: 40px;
  position: relative;
}

.pass_box .cont .title {
  line-height: 40px;
}

.pass_input {
  display: flex;
  justify-content: space-between;
  line-height: 44px;
  /* padding: 20px 0 5px 0; */
}

.pass_input .left {
  font-size: 26px;
  font-weight: 500;
  width: 75%;
  border-radius: 10px 0 0 10px;
  padding-left: 10px;
  background: #fff;
}

.pass_input .right {
  text-align: center;
  color: #fff;
  font-size: 16px;
  flex: 1;
  border-radius: 0 10px 10px 0;

}


</style>
