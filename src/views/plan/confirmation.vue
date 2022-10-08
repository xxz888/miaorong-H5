<template>
  <div>
    <van-nav-bar title="支付确认" left-arrow @click-left="onClickLeft"/>
    <div class="warpper">
      <div class="upcreditcard_title">信息加密处理，仅用于银行验证，请验证您本人的银行卡</div>
      <div class="card_box">
        <div class="card_item">
          <van-field v-model="card.userName" label="持卡人" placeholder="持卡人" readonly="readonly"/>
          <van-field v-model="card.cardNo" label="卡号" placeholder="信用卡号" clearable minlength="10" readonly="readonly" />
          <van-field v-model="card.securityCode" label="安全码" maxlength="3" readonly="readonly"
                     placeholder="请输入(卡背面CVN2后三位数字)" clearable />
          <van-field v-model="card.expiredTime" label="有效期" maxlength="4" readonly="readonly"
                     placeholder="请输入(如09/22输入0922)" clearable />
          <van-field readonly clickable name="area" :value="showCityName()" label="地区选择" placeholder="点击选择省市区" @click="getCity()" v-if="channel.needCity" />
          <van-field v-model="sms" center clearable label="短信验证码" type="digit" placeholder="请输入验证码" v-if="channel.needCode">
            <template #button>
              <van-button size="small" plain type="danger" @click="message == '获取验证码' ? getCode() : ''">{{ message }}</van-button>
            </template>
          </van-field>
        </div>
      </div>

      <div class=" upcreditcard_btn_box">
        <van-button @click.native="channel.needCode?confirm():getCode()" type="primary" class="upcreditcard_btn" round>确认</van-button>
      </div>
    </div>
    <city ref="verificationMethod" :channel="channel.channelTag" />
  </div>
</template>
<script>
import city from "@/components/city/city"
import {quickOrderQuery} from '@/api/bill'
import {NavBar, Cell, CellGroup, Field, Picker, Popup, Button, Icon, Area} from 'vant';
import { verifyBindcard, getVerifyCode, pay, payQuery } from '@/api/online'

export default {
  data() {
    return {
      channel: {},
      card: {},
      debitCard: {},
      provinceName: '',
      cityName: '',
      provinceCode: '',
      cityCode: '',
      token: localStorage.getItem('token'),
      brandId: localStorage.getItem('brandId'),
      userId: localStorage.getItem('userId'),
      smsCode: "",
      num: 60,
      cityShow: false,
      money: 0,
      sms: '',
      message: '获取验证码',
      isGetSms: '0',
      stepType: true
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [Button.name]: Button,
    [Icon.name]: Icon,
    city,
    [Area.name]: Area
  },
  computed: {},
  created() {
    this.channel = JSON.parse(sessionStorage.getItem('channel'))
    this.card = JSON.parse(sessionStorage.getItem('card'))
    this.debitCard = JSON.parse(sessionStorage.getItem('debitCard'))
    this.money = sessionStorage.getItem('money')
    this.verifyBind()
  },
  methods: {
    time() {  //-------------------------倒计时-------------------------------
      let timer = setInterval(() => {
        this.message = "(" + this.num + ")秒";
        this.num--;
        if (this.num == 0) {
          clearInterval(timer);
          this.num = 60;
          this.message = "获取验证码";
        }
      }, 1000);
    },
    verifyBind(){
      let data = {
        channelTag: this.channel.channelTag,
        loginPhone: localStorage.getItem('phone'),
        idCard: this.card.idcard,
        bankName: this.card.bankName,
        bankCard: this.card.cardNo,
        userName: this.card.userName,
        bankPhone: this.card.phone,
        securityCode: this.card.securityCode,
        expiredTime: this.card.expiredTime,
        debitBankName: this.debitCard.bankName,
        debitBankCard: this.debitCard.cardNo,
        debitPhone: this.debitCard.phone
      }
      this.$store.commit('Loading')
      verifyBindcard(data).then(res => {
        this.$store.commit('closeLoading')
        if(res.resp_code === '999992'){
          this.$router.push('/TiedCard')
        }else if(res.resp_code === '999999'){
          this.$toast({message: res.resp_message, position: 'bottom'})
        }
      })
    },
    getCode() {  // 获得验证码
      if (this.channel.needCity && !this.cityName) {
        this.$toast({message: '请选择地区', position: 'bottom'})
        return
      }
      let data = {
        channelTag: this.channel.channelTag,
        amount: this.money,
        idCard: this.card.idcard,
        bankName: this.card.bankName,
        bankCard: this.card.cardNo,
        userName: this.card.userName,
        bankPhone: this.card.phone,
        securityCode: this.card.securityCode,
        expiredTime: this.card.expiredTime,
        debitBankName: this.debitCard.bankName,
        debitBankCard: this.debitCard.cardNo,
        debitPhone: this.debitCard.phone,
        provinceCode: this.provinceCode,
        cityCode: this.cityCode
      }
      this.$store.commit('Loading')
      getVerifyCode(data).then(res => {
        this.$store.commit('closeLoading')
        if (res.resp_code != '999999') {
          this.isGetSms = 1
          this.orderCode = res.result
          this.time()
        } else {
          this.$toast({message: res.resp_message})
        }
      })
    },
    getCity() {  // 请求地区
      this.$refs.verificationMethod.choseAdd()
    },
    showCityName(){
      if(this.provinceName){
        return this.provinceName + ' - ' + this.cityName
      }
      return ''
    },
    onClickLeft() { // 返回键
      this.publicJs.back();
    },
    topClose() { // 跳转刷卡详情页 关闭新手引导 清除定时器
      this.$store.commit('Loading')
      clearInterval(this.conti)
      let year = new Date().getFullYear()
      let month = new Date().getMonth() + 1
      quickOrderQuery(this.brandId, this.userId, year, month, '20').then(res => {
        this.$store.commit('closeLoading')
        if (res.resp_code == '000000') {
          if (res.result.content.length > 0) {
            let item = res.result.content[0]
            this.$store.commit('closeGuide')
            this.$router.push({name: 'quickDetail', params: {item: JSON.stringify(item)}})
          } else {
            this.$router.push({name: 'online'})
            this.$toast({message: '刷卡成功', position: 'bottom'})
          }
        } else {
          this.$router.push({name: 'online'})
          this.$toast({message: '刷卡成功', position: 'bottom'})
        }
      })
    },
    continueFun() {  //如果返回999998每秒请求一次结果 请求5秒 直到返回000000
      this.conti = setInterval(() => {
        this.$store.commit('Loading')
        payQuery({
          channelTag: this.channel.channelTag,
          idCard: this.card.idcard,
          orderCode: this.orderCode
        }).then(response => {
          this.$store.commit('closeLoading')
          if (response.resp_code == '000000') {
            this.topClose()
          } else if (response.resp_code == '999999') {
            clearInterval(this.conti)
            this.$toast({message: response.resp_message, position: 'bottom'})
          }
        })
      }, 1000);
      let set = setTimeout(() => {
        clearInterval(this.conti)
        clearTimeout(set)
        this.topClose()
      }, 5000);
    },
    confirm() { // 确认
      if (this.channel.needCity && !this.cityName) {
        this.$toast({message: '请选择地区', position: 'bottom'})
        return
      }
      if (this.channel.needCode && this.isGetSms != 1) {
          this.$toast({message: '请先获取验证码', position: 'bottom'})
          return
      }
      let data = {
        channelTag: this.channel.channelTag,
        idCard: this.card.idcard,
        bankCard: this.card.cardNo,
        orderCode: this.orderCode,
        smsMsg: this.sms
      }
      pay(data).then(res => {
        if(res.resp_code == '000000'){
          this.$router.push({name: 'quickDetail', params: {item: JSON.stringify(item)}})
        }else if(res.resp_code == '999992'){
          this.continueFun()
        }else{
          this.$toast({message: res.resp_message, position: 'bottom'})
        }
      })
    },
  }
}

</script>
<style scoped>
.upcreditcard_title {
  height: 40px;
  background: rgba(254, 161, 51, .3);
  line-height: 40px;
  width: 100%;
  color: #F5552A;
  font-size: 12px;
  padding: 0 15px;
}

.upcreditcard_tips {
  font-size: 10px;
  line-height: 22px;
  padding: 0 10px;
}

.upcreditcard_btn_box {
  margin: 20px auto;
  width: 100%;
  text-align: center;
}

.upcreditcard_btn {
  /* height:40px; */
  width: 80%;
}

.card_box {
  width: 100%;
  padding: 10px 10px 0 10px;
}

.card_item {
  width: 100%;
  padding: 5px;
  border-radius: 12px;
  background: #fff;
}

.box {
  text-align: center;
  padding: 30px 39px;
  width: 320px;
}

.box .title {
  font-size: 17px;
}

.box .bg {
  background: url("../../assets/addcard/security_code.png") center no-repeat;
  background-size: 100% 100%;
  height: 123px;
  width: 194px;
  margin: 20px auto 0 auto;
}

.box .tips {
  text-align: left;
  color: #666;
  font-size: 13px;
  margin: 10px 0 30px 0;
}

.box .btn {
  width: 138px;
  height: 33px;
  background: #F71111;
  border-radius: 16px;
  font-size: 14px;
  color: #fff;
  line-height: 33px;
  margin: 0 auto;
}


</style>
