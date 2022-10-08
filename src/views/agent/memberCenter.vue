<template>
  <div>
    <!-- 充值vip -->
    <van-nav-bar v-if="!android" class="agent_nav theme_bg" left-arrow style="background: none;" :border='false' title="会员中心"
                 @click-left="onClickLeft" />
    <div style="padding-top:50px">暂未实现</div>
<!--    <div class="box">-->
<!--      <div class="title_img">-->
<!--        <img class="vip_title" width="40%" src="@/assets/agent/vip_title.png">-->
<!--        <img class="vip_logo" width="90%" src="@/assets/agent/vip_logo.png" alt="">-->
<!--      </div>-->
<!--      <div class="vip_content">-->
<!--        <div class="radio">-->
<!--          <div>支付方式：</div>-->
<!--          <div class="wx" @click="radio='WX'"><img src="@/assets/agent/vip_wx.png" alt="">微信支付<img-->
<!--            v-show="radio=='WX'" class="active" src="@/assets/agent/active.png" alt=""></div>-->
<!--          <div class="zfb" @click="radio='ALI'"><img src="@/assets/agent/vip_zfb.png" alt="">支付宝支付<img-->
<!--            v-show="radio=='ALI'" class="active" src="@/assets/agent/active.png" alt=""></div>-->
<!--        </div>-->
<!--        <div class="power">-->
<!--          <p style="margin-bottom: 12px">会员须知</p>-->
<!--          <p class="cont">1、充值成功后升级为VIP，享受VIP费率待遇及推广收益；</p>-->
<!--          <p class="cont">2、30天内推广激活5名会员，可全额退还购买会员的费用；</p>-->
<!--          <p class="cont">3、会员不得转让或转借他人使用，解释权归本公司所有。</p>-->
<!--        </div>-->
<!--        <div v-if="level.vipLevel">-->
<!--          您已经是VIP会员了-->
<!--          <p v-if="level.days>0">-->
<!--            返还会员费还需要推广-->
<!--            <span style="color:#1577FF">{{level.needActive}}</span>-->
<!--            个激活会员，还剩-->
<!--            <span style="color:#1577FF">{{level.days}}</span>-->
<!--            天-->
<!--          </p>-->
<!--        </div>-->
<!--        <div class="payment" v-else>-->
<!--          <div> 金额：￥{{amount}}（元）</div>-->
<!--          <div class="payment_but" @click="_rechargeVip()">立即支付</div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>
<script>
import {NavBar} from 'vant'
import {getLevel, memberAmountApi} from "@/api/user";
import {getIp} from "@/utils/request";

export default {
  components: {
    [NavBar.name]: NavBar
  },
  data() {
    return {
      android: localStorage.getItem('android'),
      radio: 'WX',
      token: localStorage.getItem('token'),
      level: {},
      amount: 0
    }
  },
  created(){
    if(!this.token) {
      if (location.href.indexOf('token=') != -1) {
        this.android = true
        let urlToken = location.href.substring(location.href.indexOf('token=')+6)
        localStorage.setItem('token', urlToken)
        localStorage.setItem('android', true)
        this.token = urlToken
      }
    }
    // this.getMemberAmount()
    // this.getUserLevel()
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    getUserLevel(){
      getLevel().then(res => {
        if(res.resp_code == '000000'){
          this.level = res.result
        }
      })
    },
    getMemberAmount(){
      memberAmountApi().then(res => {
        if(res.resp_code == '000000'){
          this.amount = res.result
        }
      })
    },
    _rechargeVip() {
      let api = getIp() + '/paymentgateway/app/purchase/aliandwx/pay?token='+this.token+'&type='
      if (this.radio == 'WX') {
        window.open(`${api}1`)
      } else {
        window.open(`${api}0`)
      }
    }
  }
}
</script>
<style scoped>
.box {
  padding: 20px 0px;
  height: 100%;
  width: 100vw;
  background: url('../../assets/agent/vip_bg.png') no-repeat;
  background-size: 100% 100%;
}

.box .title_img {
  text-align: center;
}

.vip_title {
  margin-top: 60px;
}

.vip_logo {
  margin-top: -100px;
}

.vip_content {
  margin: 20px 15px;

}

.radio {
  color: #fff;
  font-size: 14px;
  text-align: center;
  display: flex;
}

.radio img {
  width: 25px;
  vertical-align: middle;
}

.radio > div {
  padding: 5px;
}

.wx, .zfb {
  flex: 2;
  position: relative;
  border: 1px solid #fff;
  border-radius: 5px;
  margin: 0px 10px;

}

.active {
  position: absolute;
  right: 0;
  bottom: 0;
}

.cont{
  font-size: 12px;
  text-align: left;
  margin-left: 12px;
  margin-bottom: 12px;
}

.power {
  width: 100%;
  height: 160px;
  background-color: #CEF0D8;
  border-radius: 20px;
  text-align: center;
  margin: 60px auto;
}

.advantage {
  display: flex;
  flex-wrap: wrap;
  width: 300px;
  margin: 0px auto;
}

.advantage img {
  width: 25%;
  height: 80px;
  padding: 10px;
}

.payment {
  color: #fff;
  font-size: 16px;
  display: flex;
  padding: 5px;
  margin: 0px auto;
  width: 100%;
  border: 1px solid rgb(232,232,18);
  margin-top: 70px;
  border-radius: 50px;
  text-align: center;
  font-size: 17px;
}

.payment div {
  padding: 5px 10px;
}

.payment_but {
  border: 1px solid rgb(232,232,18);
  border-radius: 50px;
  margin-left: 50px;
  background-color: #00DE01;
}

.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.agent_nav >>> .van-icon {
  color: #FFFFFF !important;
}
</style>
