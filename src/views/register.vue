<template>
  <div class="login">
    <div class="top">
      <!-- <van-nav-bar class="online_nav theme_bg" left-arrow fixed :border='false'
                   @click-left="$router.push({name:'login'})" right-text="客服" @click-right="onClickRight"/> -->
                     <van-nav-bar class="online_nav theme_bg" left-arrow fixed :border='false'
                   @click-left="$router.push({name:'login'})"/>
    </div>
    <div class="cont">
      <ul class="list">
        <li class="item theme_border_b">
          <span class="theme">手机号</span>
          <div class="input">
            <div class="left">
              <img src="../assets/login/phone_icon.png" alt=""/>
            </div>
            <div class="right">
              <van-field v-model="phone" type="number" clearable placeholder="请输入手机号" maxlength="11"/>
            </div>
          </div>
        </li>

        <li class="item theme_border_b">
          <span class="theme">验证码</span>
          <div class="input">
            <div class="left">
              <img src="../assets/login/vscode_icon.png" alt=""/>
            </div>
            <div class="right">
              <van-field v-model="smsCode" clearable type="number" placeholder="请输入短信验证码" maxlength="6">
                <template #button>
                  <div class="sms" autocomplete="off" @click="message == '发送验证码' ? getCode() : ''">
                    {{ message }}
                  </div>
                </template>
              </van-field>
            </div>
          </div>
        </li>

        <li class="item theme_border_b" v-show="preUser">
          <span class="theme">推荐人手机号</span>
          <div class="input">
            <div class="left">
              <img src="../assets/login/phone_icon.png" alt=""/>
            </div>
            <div class="right">
              <van-field v-model="preUserPhone" type="number" clearable placeholder="请输入手机号" maxlength="11"/>
            </div>
          </div>
        </li>
      </ul>
      <div class="btn theme_bg" @click="confirm">注册</div>
    </div>
  </div>
</template>

<script>
import {Field, Icon, NavBar} from "vant";
import Cookies from "js-cookie";
import {smsSend, register, authPhone} from "@/api/login";

export default {
  data() {
    return {
      brandId: this.global.brandId,
      password: '',
      phone: "",
      smsCode: "",
      num: 60,
      message: "发送验证码",
      preUserPhone: '',
      preUser: false
    };
  },
  components: {
    [Field.name]: Field,
    [Icon.name]: Icon,
    [NavBar.name]: NavBar
  },
  created() {
    this.phone = Cookies.get("kd_l_phone");
    let did = localStorage.getItem('did')

    localStorage.clear()
    if (did) {
      localStorage.setItem('did', did)
    }
    this.phone = null
  },
  methods: {
    onClickRight() {
      _MEIQIA('init')
      _MEIQIA('showPanel')
    },
    time() {
      let timer = setInterval(() => {
        this.message = "(" + this.num + ")秒";
        this.num--;
        if (this.num == 0) {
          clearInterval(timer);
          this.num = 60;
          this.message = "发送验证码";
        }
      }, 1000);
    },
    // 获取验证码
    getCode() {
      if (this.phone.trim().length == 11) {
        authPhone(this.phone).then(res => {
          if (res.resp_message.indexOf('已注册') > -1) {
            this.$router.push({name: 'login'})
            this.$toast({message: res.resp_message, position: "bottom"});
          } else if (res.resp_message.indexOf('未注册') > -1) {
            this.preUser = true
            smsSend(this.brandId, this.phone).then((res) => {
              if (res.resp_code == "000000") {
                this.time();
                this.$toast({message: res.resp_message, position: "bottom"});
              }
            })
          }
        })
      } else {
        this.$toast({message: '请输入正确的手机号', position: "bottom"});
      }
    },
    isRegister() {
      if (this.phone.trim().length == 11) {
        authPhone(this.phone).then(res => {
          if (res.resp_code == '999999') {
            this.$toast({message: res.resp_message, position: "bottom"});
          } else {
            this.preUser = true
          }
        })
      }
    },
    //注册
    confirm() {
      if (this.publicJs.isPhoneNumber(this.phone)) {
        this.$toast({message: "手机号码有误，请重填", position: "bottom"});
        return;
      }
      if (this.smsCode == "") {
        this.$toast({message: "请先获取输入验证码", position: "bottom"});
        return;
      }
      //
      if (this.publicJs.isPhoneNumber(this.preUserPhone)) {
        this.$toast({message: "推荐人手机号码有误,请重填", position: "bottom"});
        return;
      }
      register(this.brandId, this.phone, this.smsCode, this.preUserPhone).then(res => {
        if (res.resp_code == "000000") {
          this.$router.push({name: 'login'})
          this.$toast({message: "注册成功", position: "bottom"});
        }
      }, err => {
        this.$toast({message: "注册失败", position: "bottom"});
      })
    }
  }
}
</script>
<style scoped>

.online_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.online_nav >>> .van-nav-bar__text {
  color: #fff;
}

.online_nav >>> .van-nav-bar__arrow {
  color: #fff;
}

.van-nav-bar >>> .van-nav-bar__content {
  margin-top: 10px;
}


.theme {
  margin-right: 15px;
}

.login {
  background: #fff;
  height: 100vh;
}

.top {
  background: url("../assets/login/img_register_bg.jpg") center no-repeat;
  background-size: 100% 100%;
  height: 242px;
  width: 100%;
}

.fan {
  margin: 40px 0px 0px 15px;
}

.cont {
  padding: 0 48px;
  font-size: 14px;
  background: #fff;
}

.cont .item > span {
  line-height: 40px;
}

.cont .item .input {
  display: flex;
}

.cont .item .left {
  width: 40px;
  position: relative;
}

.cont .list {
  padding-bottom: 40px;
}

.sms {
  color: #3AC461;
}

.cont .item .left > img {
  height: 24px;
  max-width: 24px;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto 0;
}

.btn {
  width: 100%;
  line-height: 55px;
  border-radius: 28px;
  font-size: 20px;
  font-weight: 500;
  color: #ffffff;
  text-align: center;
  box-shadow: 0 0 16px 2px rgba(240, 131, 0, 0.4);
}

.login_tips {
  font-size: 13px;
  color: #666;
  text-align: center;
  margin-top: 40px;
  line-height: 40px;
}

.login_tips span {
  font-size: 12px;
  color: #2574ea;
}

.right {
  border-bottom: .1px solid rgba(204, 103, 10, 0);
}
</style>
