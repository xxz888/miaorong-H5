<template>
  <div>
    <!-- 支付方式 -->
    <van-popup v-model="payPasswordTrueFalseBy" position="bottom" :style="{ height: '70%' }">
      <div class="pay-box">
        <van-nav-bar class="pay-nav" title="请输入支付密码" left-text="取消" left-arrow
                     @click-left="payPasswordTrueFalseBy=false"/>
        <div class="pay-content">
          <!-- 密码输入框 -->
          <van-password-input :value="password" info="密码为 6 位数字" @focus="showKeyboard = true"/>
          <!-- 数字键盘 -->
          <van-number-keyboard :show="showKeyboard" @input="onInput" @delete="onDelete"/>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import {
  NavBar,
  Row,
  Col,
  Popup,
  Image,
  Dialog,
  NumberKeyboard,
  PasswordInput
} from "vant";
import {paypassAuth} from '@/api/user'

export default {
  props: {
    productDteail: Object,
  },
  data() {
    return {
      brandId: localStorage.getItem('brandId'),
      userId: localStorage.getItem('userId'),
      token: localStorage.getItem('token'),
      payPasswordTrueFalseBy: false,//密码框
      password: "",//支付密码
      showKeyboard: true,
      channelList: [],
      activeChannel: {},//点击时候通道
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Row.name]: Row,
    [Col.name]: Col,
    [Popup.name]: Popup,
    [Image.name]: Image,
    [Dialog.name]: Dialog,
    [NumberKeyboard.name]: NumberKeyboard,
    [PasswordInput.name]: PasswordInput
  },
  methods: {
    onhide() {
      this.payPasswordTrueFalseBy = false
    },
    onshow() {
      this.payPasswordTrueFalseBy = true
    },
    onInput(key) {   //支付密码
      this.password = (this.password + key).slice(0, 6);
      if (this.password.length == 6) {
        paypassAuth(this.token, this.password).then(res => {
          if (res.resp_code == "000000") {
            this.$emit("confirmPlan");
          }
        })
      }
    },
    onDelete() { //删除支付
      this.password = this.password.slice(0, this.password.length - 1);
    },
  }
};
</script>
<style scoped>

.pay-box {
  position: relative;
}

.pay-nav {
  position: fixed;
  z-index: 3000;
  width: 100%;

}

.pay-content {
  padding-top: 47px;
}

.pay-col {
  text-align: center;
}

.pay-title {
  color: #424242;
  font-size: 20px;
  text-align: center;
  line-height: 80px;
  font-family: PingFang-SC-Bold;
  font-weight: bold;

}

.pay-icon {
  height: 54px;
  width: 54px;
}

.pay-tips {
  font-size: 15px;
}
</style>
