<template>
  <div>
    <van-nav-bar title="支付验证" left-arrow @click-left="onClickLeft"/>
    <div class="warpper">
      <div class="upcreditcard_title">信息加密处理，仅用于银行验证，请验证您本人的银行卡</div>
      <div class="card_box">
        <div class="card_item">
          <van-field v-model="card.userName" label="持卡人" readonly="readonly"/>
          <van-field v-model="card.cardNo" label="卡号" placeholder="请输入信用卡号" clearable minlength="10"
                     readonly="readonly" />
          <van-field v-model="card.securityCode" label="安全码" maxlength="3" readonly="readonly"
                     placeholder="请输入(卡背面CVN2后三位数字)" clearable>
          </van-field>
          <van-field v-model="card.expiredTime" label="有效期" maxlength="4" readonly="readonly"
                     placeholder="请输入(如09/22输入0922)" clearable/>
          <van-field v-model="sms" center clearable label="短信验证码" placeholder="请输入验证码">
            <template #button>
              <van-button size="small" plain type="danger" @click="message == '获取验证码' ? getCode() : ''">{{ message }}
              </van-button>
            </template>
          </van-field>
        </div>
      </div>
      <div class=" upcreditcard_btn_box">
        <van-button @click.native="confirm()" type="primary" class=" upcreditcard_btn  " round>确认</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import {NavBar, Cell, CellGroup, Field, Picker, Popup, Button, Icon} from 'vant';
import request from '@/utils/request'
import qs from 'qs'

export default {
  data() {
    return {
      url: '',
      token: localStorage.getItem('token'),
      card: "",
      brandId: localStorage.getItem('brandId'),
      userId: localStorage.getItem('userId'),
      phoneTrueFalseBy: false,
      codeTrueFalseBy: false,
      smsCode: "",
      num: 60,
      orderCode: "",
      channelactive: {},
      authorityList: {
        result: {
          bankCard: "",
          userName: "",
          phone: "",
          securityCode: "",
          expiredTime: "",
        }
      },
      userList: {},
      sms: '',
      message: '获取验证码',
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
  },
  created() {
    this.card = JSON.parse(this.$route.params.card)
    this.url = this.$route.params.url
    this.cityCode = this.$route.params.cityCode
    this.provinceCode = this.$route.params.provinceCode
    this.getsms = this.$route.params.getSms
  },
  methods: {
    time() {
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
    getCode() {
      request({
        url: this.getsms,
        method: 'post',
        data: qs.stringify({
          'provinceCode': this.provinceCode[0],
          'city': this.cityCode[0]
        })
      }).then(res => {
        this.url = res.result
        this.time()
      })
    },
    onClickLeft() {
      this.publicJs.back();
    },
    confirm() {
      if (this.sms == '' || this.sms == null) {
        this.$toast({message: '请填写验证码', position: 'bottom'})
        return
      }
      request({
        url: this.url + this.sms,
        method: 'post',
      }).then(response => {
        this.$store.commit('closeLoading')
        if (response.resp_code == '000000') {
          this.$toast({message: response.resp_message, position: 'bottom'})
          this.$router.push({name: 'online'})
        } else if (response.resp_code == '999999') {
          this.$toast({message: response.resp_message, position: 'bottom'})
        }
      })
    }
  }
};
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
