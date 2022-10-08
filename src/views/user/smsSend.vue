<!-- 发送短信 -->
<template>
  <div>
    <van-nav-bar :title="'短信发送'" left-text="" left-arrow fixed @click-left="onClickLeft"/>
    <div class="main">
      <p>您正在发起<span class="theme">修改支付密码</span>业务，短信验证码已下发手机尾号为<span class="theme">{{ phone | cardNoEnd }}</span>用户手机请查收
      </p>
      <div class="input_item">
        <van-field clearable v-model="vericode" placeholder="请输入验证码">
          <van-button type="primary" size="small" slot="button" :color="num==60?'#FB933F':'#FB933F'"
                      loading-type="spinner" :loading="num==60?false:true" :loading-text="num==60?message:message"
                      @click="getCode()">获取验证码
          </van-button>
        </van-field>
      </div>
      <div class="submit theme_bg" @click="next()">下一步</div>
    </div>
  </div>
</template>

<script>
import {smsSend, paypassUpdate} from '@/api/login'
import {NavBar, Field, Button} from 'vant';

export default {
  data() {
    return {
      phone: '',
      password: '',
      num: 60,
      message: '获取验证码',
      vericode: '',
      brandId: this.global.brandId,
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Field.name]: Field,
    [Button.name]: Button,
  },
  created() {
    this.phone = JSON.parse(this.$route.params.phone)
    this.password = JSON.parse(this.$route.params.password)
    // this.getCode()
  },
  methods: {
    onClickLeft() {
      window.history.go(-1)
    },
    // 获取验证码
    getCode() {
      if (this.phone == '') {
        this.$toast({message: '请输入手机号', position: 'bottom'})
      } else if (this.phone.length != 11) {
        this.$toast({message: '请确认手机号的格式是否正确', position: 'bottom'})
      } else {
        smsSend(this.brandId, this.phone).then(res => {
          if (res.resp_code == '000000') {
            let timer = setInterval(() => {
              this.message = '(' + this.num + ')秒'
              this.num--
              if (this.num == 0) {
                clearInterval(timer)
                this.num = 60
                this.message = '获取验证码'
              }
            }, 1000)
          }
          this.$toast({message: res.resp_message, position: 'bottom'})
        })
      }
    },
    next() {
      if (this.vericode == '') {
        this.$toast({message: '请输入验证码', position: 'bottom'})
      } else {
        paypassUpdate(this.phone, this.vericode, this.password).then(res => {
          if (res.resp_code == '000000') {
            this.$toast({message: res.resp_message, position: 'bottom'})
            this.$router.push({name: 'my'})
          } else {
            this.$toast({message: res.resp_message, position: 'bottom'})
          }
        })
      }
    }
  }
}
</script>
<style scoped>
.main {
  padding: 50px 40px 0;
  font-size: 16px;
}

p {
  margin-top: 50px;
  margin-bottom: 30px;
}

.input_item {
  width: 260px;
  height: 45px;
  background: #FFFFFF;
  margin: 0 auto;
}

.submit {
  width: 300px;
  margin: 20px auto;
  height: 45px;
  line-height: 45px;
  border-radius: 6px;
  color: #FFFFFF;
  font-size: 18px;
  text-align: center;
}
</style>
