<!-- 在线收款 -->
<template>
  <div class="online">
    <div class="header theme_bg">
      <van-nav-bar class="online_nav" title="信用卡收款" left-arrow fixed :border='false' @click-left="onClickLeft"
                   right-text="使用说明" @click-right="link('使用说明')"/>
      <div class="online_main">
        <div class="online_main_head">
          <span>请输入金额(元)</span>
        </div>
        <div class="online_money_box">
          <div class="online_main_money">
            <span>￥</span>
            <van-field class="money_input" :value="money" placeholder="请输入金额，最低100元" readonly/>
          </div>
        </div>
        <div class="cardItem">
          <span>支付信用卡：</span>
          <div v-if="defDaiCardList.length > 0">
            <img v-if="defDaiCardList[0].logimg"
                 :src="require('../../assets/bankIcon/BANK_'+defDaiCardList[0].logimg+'.png')" alt="">
            <img v-else src="../../assets/bankIcon/BANK_default.png" alt="">
            {{ defDaiCardList[0].bankName }}&nbsp; <span>({{ defDaiCardList[0].cardNo |cardNoEnd }})</span>
          </div>
          <div v-else>
            <img src="../../assets/bankIcon/BANK_default.png" alt="">
            暂无信用卡
          </div>
          <span class="set" @click="seleDefCard(0)">更换 ></span>
        </div>
        <div class="cardItem">
          <span>到账储蓄卡：</span>
          <div v-if="defJieCardList.length > 0">
            <img v-if="defJieCardList[0].logimg"
                 :src="require('../../assets/bankIcon/BANK_'+defJieCardList[0].logimg+'.png')" alt="">
            <img v-else src="../../assets/bankIcon/BANK_default.png" alt="">
            {{ defJieCardList[0].bankName }}&nbsp; <span>({{ defJieCardList[0].cardNo |cardNoEnd }})</span>
          </div>
          <div v-else>
            <img src="../../assets/bankIcon/BANK_default.png" alt="">
            暂无储蓄卡
          </div>
          <span class="set" @click="seleDefCard(1)">更换 ></span>
        </div>
        <div style="color:#999;font-size:13px;line-height:20px;">
          <!-- <p>大额费率：0.65%（每1万元65元手续费）+2元/次</p>
          <p>您是 <span style="color:red">{{ level.levelName }}</span> 用户，每1万元可以返 <span
            style="color:red">{{ handleAmount(1) }} </span> 元</p>
          <br> -->
          <p>费率：0.65%（每1万元65元手续费）</p>
          <p>您是 <span style="color:red">{{ level.levelName }} </span>用户，每1万元可以返 <span
            style="color:red">{{ handleAmount(65) }} </span>元</p>
        </div>
      </div>
    </div>

    <van-number-keyboard class="online_keyboard" v-model="money" :show="true" :extra-key="['00', '.']"
                         close-button-text="立即收款" theme="custom" @close="setChannel(2)" :safe-area-inset-bottom="true"/>

    <!-- 选择更换默认卡 -->
    <van-popup v-model="showPop" position="bottom" closeable close-icon-position="top-left" :style="{ height: '50%' }">
      <h5 class="poph5" v-if="cardType == 0">收款信用卡</h5>
      <h5 class="poph5" v-if="cardType == 2">到账储蓄卡</h5>
      <span class="card_add" @click="goPage('card')">添加</span>
      <div class="popupList">
        <div class="popupItem" v-for="(item,i) in cardList" :key="i" @click="setDefCard(item)">
          <img v-if="item.logimg" :src="require('../../assets/bankIcon/BANK_'+item.logimg+'.png')" alt="">
          <img v-else src="../../assets/bankIcon/BANK_default.png" alt="">
          <div class="item_right">
            <div class="item_right_left">
              <h6>{{ item.bankName }}</h6>
              <p>{{ item.cardType }}</p>
              <h6>{{ item.cardNo |cardNoEnd }}</h6>
            </div>
            <div class="item_right_right theme_bg">{{ item.type |cardType }}</div>
          </div>
        </div>
      </div>
    </van-popup>
    <cardconfirm ref="cardconfirm" but='1' @disconfirm='tian()' :src='require("@/assets/alert/alert.png")'
                 zi='您还未添加银行卡，是否前往添加？'/>
  </div>
</template>

<script>
import cardconfirm from '@/components/confirm/alert'
import {NavBar, NumberKeyboard, Field, Divider, Popup, Dialog, Tag} from 'vant'
import {userBankAndNature, bankcardIsdefault, getchannelBybankcardNew, newFacadeTopup} from '@/api/online'
import {bankIconQuery} from '@/api/card/card'
import {newsQuery} from '@/api/showBrand'
import {getLevel} from "@/api/user";

export default {
  data() {
    return {
      brandName: this.global.brandName,
      money: '',
      show: true,
      userId: '',
      defDaiCardList: [], // 贷记卡
      defJieCardList: [], // 借记卡
      cardList: [],
      showPop: false,
      cardType: 0, // 类型 0 信用卡  2 储蓄卡
      channelShow: false,
      channel: {}, // 通道信息
      phone: '',
      fuwuList: [],
      tiantype: null,
      level: {}
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [NumberKeyboard.name]: NumberKeyboard,
    [Field.name]: Field,
    [Divider.name]: Divider,
    [Popup.name]: Popup,
    [Dialog.Component.name]: Dialog.Component,
    [Tag.name]: Tag,
    cardconfirm
  },
  beforeRouteEnter(to, from, next) {
    sessionStorage.setItem('routerFrom', from.name)
    // 设置下一个路由的 meta
    if (from.name != 'home') {
      to.meta.isBack = true;
    } // 让 A 缓存，即不刷新
    next();
  },
  activated() {
    if (!this.$route.meta.isBack) {
      this.money = ''
      // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
    }
    this.getCard(0, 0, 1)
    this.getCard(2, 2, 1)
    // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
    this.$route.meta.isBack = false

  },
  created() {
    this.userId = localStorage.getItem('userId')
    this.phone = localStorage.getItem('phone')
    this.getLevelPage()
    this.getCard(0, 0, 1)
    this.getCard(2, 2, 1)
    this._newsQuery()
  },

  methods: {
    goPage(page) {
      this.$router.push({name: page})
    },
    getLevelPage() {
      getLevel().then(res => {
        if (res.resp_code == '000000') {
          this.level = res.result
        }
      })
    },
    onClickLeft() {
      this.$router.push({name: 'home'})
      //window.history.back()
      return
      let name = sessionStorage.getItem('routerFrom')
      if (name == 'null' || name == 'link') {
        this.$router.go(-1)
      } else if (name == 'selectPassageway' || name == 'card') {
        this.$router.push({name: 'home'})
      } else {
        this.$router.push({name: name})
      }
    },
    onClickRight() {
    },
    // 获取默认卡
    getCard(type, nature, isDefault) {
      userBankAndNature(this.userId, type, nature, isDefault).then(res => {
        if (res.resp_code == '000000') {
          for (let i = 0; i < res.result.length; i++) {
            bankIconQuery().then(res1 => {
              if (res1.resp_code == '000000') {
                for (let j = 0; j < res1.result.length; j++) {
                  if (res.result[i].bankName == res1.result[j].bank_name) {
                    res.result[i].logimg = res1.result[j].bank_acronym
                  }
                }
                if (isDefault == 1) {
                  if (type == 0) {
                    this.defDaiCardList = res.result
                  } else if (type == 2) {
                    this.defJieCardList = res.result
                  }
                } else if (i == res.result.length - 1) {
                  this.cardList = res.result
                  this.cardType = type
                  this.showPop = true
                }
              } else {
                this.$toast({message: res1.resp_message, position: 'bottom'})
              }
            })
          }
        } else if (res.resp_code == '666666') {
          this.$refs.cardconfirm.disopen()
          this.tiantype = type
        } else {
          this.$toast({message: res.resp_message, position: 'bottom'})
        }
      })
    },
    tian(type) {
      this.$router.push({name: 'debitCardAdd', params: {'type': JSON.stringify(this.tian)}})
    },
    seleDefCard(active) {
      this.$router.push({
        name: 'myCard',
        params: {active: JSON.stringify(active), type: JSON.stringify(2), title: JSON.stringify('选择银行卡')}
      })
    },
    handleAmount(type) {
      if (this.level.diffRate) {
          return (type - this.level.diffRate.bigFast * 10000).toFixed(0)
      } else {
        return 0
      }
    },
    // 设置默认卡
    setDefCard(item) {
      bankcardIsdefault(this.userId, item.cardNo, this.cardType).then(res => {
        if (res.resp_code == '000000') {
          this.showPop = false
          this.getCard(0, 0, 1)
          this.getCard(2, 2, 1)
        } else {
          this.$toast({message: res.resp_message, position: 'bottom'})
        }
      })
    },
    // 选择通道
    setChannel(recommend) {
      if (this.money < 100) {
        this.$toast({message: '交易金额不能小于100元', position: 'bottom'})
        return
      }
      if (this.defDaiCardList.length == 0) {
        this.$toast({message: '请先添加收款信用卡', position: 'bottom'})
        return
      }
      if (this.defJieCardList.length == 0) {
        this.$toast({message: '请先添加到账储蓄卡', position: 'bottom'})
        return
      }
      getchannelBybankcardNew({
        bankName: this.defDaiCardList[0].bankName,
        debitBankName: this.defJieCardList[0].bankName,
        amount: this.money
      }).then(res => {
        if (res.resp_code == '000000') {
          this.selChannel(res.result)
        } else {
          this.$toast({message: res.resp_message, position: 'bottom'})
        }
      })
      // getchannelBybankcard(this.userId, this.defDaiCardList[0].cardNo, this.money, this.brandId, recommend).then(res => {
      //   if (res.resp_code == '000000') {
      //     this.channel = res.result
      //     this.selChannel()
      //   } else {
      //     this.$toast({message: res.resp_message, position: 'bottom'})
      //   }
      // })
    },
    // 更换通道
    selChannel(channel) {
      sessionStorage.setItem('selChannel', JSON.stringify(channel))
      sessionStorage.setItem('card', JSON.stringify(this.defDaiCardList[0]))
      sessionStorage.setItem('debitCard', JSON.stringify(this.defJieCardList[0]))
      sessionStorage.setItem("money", this.money)
      this.$router.push({name: 'selectPassageway'})
    },
    // 确认收款
    toOnline(channel) {
      let order_desc = "在线收款【" + channel.name + "(" + channel.channelParams + ")】"
      newFacadeTopup(this.phone, this.defDaiCardList[0].userId, this.brandId, this.money, channel.channelTag, order_desc, this.defDaiCardList[0].cardNo, this.defDaiCardList[0].bankName).then(res => {
        if (res.resp_code == '000000') {
          this.$router.push({
            name: 'link',
            params: {url: JSON.stringify(res.result), title: JSON.stringify('确认充值信息')}
          })
        } else {
          this.$toast({message: res.resp_message, position: 'bottom'})
        }
      })
    },
    _newsQuery(type) {
      newsQuery(this.global.brandId, '功能跳转').then(res => {
        if (res.resp_code == '000000') {
          this.fuwuList = res.result.content
        }
      })
    },
    link(item) {
      let num = 0
      this.fuwuList.map((key) => {
        if (key.title == item) {
          var url = key.content + '?phone=' + this.phone + '&token=' + this.token + '&brandId=' + this.global.brandId + '&userId=' + this.userId + '&ip=' + this.global.ip + '&deviceId=' + localStorage.getItem('kd_webapp_deviceId')
          this.$router.push({
            name: 'appLink',
            params: {
              url: JSON.stringify(url),
              title: JSON.stringify(key.title),
              type: "2"
            }
          });
          return
        } else {
          num++
        }
      })
      if (num == this.fuwuList.length) {
        this.$toast({
          message: '敬请期待',
          position: 'bottom'
        })
      }
    },
  }
}

</script>
<style>
.online .van-nav-bar .van-icon {
  color: #FFFFFF !important;
}
</style>
<style scoped>
.online .van-nav-bar {
  background: none;
}

.online .van-nav-bar__left::before {
  color: #FFFFFF;
}

.header {
  height: 150px;
  position: relative;
  border-radius: 0 0 15px 15px;
}

.header_cont {
  padding: 60px 20px 0;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #FFFFFF;
}

.header_cont img {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.online_main {
  width: 360px;
  height: auto;
  overflow: scroll;
  position: absolute;
  padding: 15px 20px 10px;
  background: #FFFFFF;
  box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.09);
  border-radius: 17px;
  top: 70px;
  box-sizing: border-box;
  left: 0;
  right: 0;
  margin: 0 auto;
  font-size: 14px;
}

.online_main_head {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-bottom: 5px;
  color: #666;
}

.online_main_head img {
  width: 30px;
  margin-right: 10px;
}

.online_money_box {
  width: 100%;
  background: #f5f5f5;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 15px;
}

.online_main_money {
  display: flex;
  align-items: center;
  font-size: 24px;
}

.online_main_money >>> .van-cell {
  background: none;
  font-size: 24px;
  padding: 10px 5px;
}

.online_main_rate {
  font-size: 12px;
  display: flex;
  padding: 5px 10px;
  justify-content: space-between;
}

.online_main_rate > div {
  text-align: center;
  line-height: 20px;
}

.cardItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0px;
  color: #616161;
  font-size: 13px;
}

.cardItem img {
  width: 25px;
  margin-right: 5px;
}

.cardItem > div {
  display: flex;
  align-items: center;
  flex: 1;
}

.cardItem .set {
  font-size: 12px;
  color: #999;
}

.online_submit {
  height: 40px;
  line-height: 40px;
  color: #FFFFFF;
  font-size: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(130, 130, 130, .3);
  text-align: center;
}

/* 设置默认卡 */
.poph5 {
  height: 45px;
  line-height: 45px;
  border-bottom: 1px solid rgba(130, 130, 130, .1);
  font-size: 14px;
}

.card_add {
  font-size: 12px;
  color: #222;
  position: absolute;
  right: 20px;
  top: 15px;
  display: block;
}

.popupItem {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(130, 130, 130, .1);
  padding: 10px 0;
  text-align: left;
}

.popupItem img {
  width: 40px;
  height: 40px;
  margin: 0 10px;
}

.item_right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  padding: 0 20px 0 0px;
  box-sizing: border-box;
}

.item_right p {
  font-size: 12px;
}

.item_right_right {
  color: #FFFFFF;
  padding: 3px 5px;
  border-radius: 30px;
  font-size: 10px;
  box-shadow: 2px 3px 3px 0 rgba(130, 130, 130, .2);
}

.cursor {
  -webkit-animation: Blink 1s ease-in 0s infinite;
  animation: Blink 1s ease-in 0s infinite;
  font-size: 25px;
  font-weight: 100;
  position: absolute;
  left: 55px;
}

@-webkit-keyframes RevealText {
  from {
    width: 0;
  }
}

@keyframes RevealText {
  from {
    width: 0;
  }
}

@-webkit-keyframes Blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes Blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}


.online_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.online_nav >>> .van-nav-bar__text {
  color: #fff;
}

>>> .online_keyboard.van-number-keyboard {
  background: #fff;
}

.online_keyboard >>> .van-key--blue {
  background: #30AEFB;
}

.money_input >>> .van-field__control::-webkit-input-placeholder {
  font-size: 16px;
}
</style>
