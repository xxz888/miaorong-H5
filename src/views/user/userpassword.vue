<!-- 忘记密码  right-text="客服"
                 @click-right="onClickRight"-->
<template>
  <div>
    <van-nav-bar title="修改登录密码" left-text="" left-arrow fixed @click-left="onClickLeft" />
    <div class="main">
      <div class="input_item">
        <van-field clearable label="手机号" v-model="phone" type="number" placeholder="请输入手机号" maxlength="11"/>
      </div>
      <div class="input_item">
        <van-field clearable label="新密码" v-model="password"  :placeholder="'请输入'+title+'密码'"/>
      </div>
      <div class="input_item">
        <van-field clearable label="确认密码" v-model="passsure"  :placeholder="'请再次输入'+title+'密码'"/>
      </div>
      <div class="input_item">
        <van-field clearable label="验证码" maxlength="6" v-model="msm" type="number" :placeholder="'请输入验证码'">
          <template #button>
            <div class="sms" @click="message == '发送验证码' ? getCode() : ''">
              {{ message }}
            </div>
          </template>
        </van-field>
      </div>
      <div class="submit theme_btn" @click="next()">确定</div>
    </div>
  </div>
</template>

<script>
import {NavBar, Field} from 'vant';
import {userSms, updatepassword} from '@/api/login'

export default {
  data() {
    return {
      type: '0',
      title: '登录',
      phone: localStorage.getItem('phone'),
      password: '',
      passsure: '', // 确认密码
      msm: '',
      message: "发送验证码",
      brandId: this.global.brandId,
      num: 60
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [Field.name]: Field,
  },
  methods: {
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
    getCode() {
      userSms(this.phone, this.brandId).then(res => {
        if (res.resp_code == "000000") {
          this.time();
          this.$toast({message: res.resp_message, position: "bottom"});
        } else if (res.resp_code == "999999") {
          this.$toast({message: '请输入手机号', position: "bottom"});
        }
      })
    },
    onClickRight() {
      _MEIQIA('init')
      _MEIQIA('showPanel')
    },
    onClickLeft() {
      window.history.go(-1)
    },
    next() {
      if (this.phone == '') {
        this.$toast({message: '请输入手机号', position: 'bottom'})
        return
      }
      if (this.password == '') {
        this.$toast({message: '请输入密码', position: 'bottom'})
        return
      }

      if (this.passsure == '') {
        this.$toast({message: '确认密码不能为空', position: 'bottom'})
        return
      }
      if (this.passsure != this.password) {
        this.$toast({message: '两次密码输入不一致', position: 'bottom'})
        return
      }

      updatepassword(this.phone, this.msm, this.password, this.brandId).then(res => {
        if (res.resp_code == '000000') {
          this.$toast({message: '密码修改' + res.resp_message + '请重新登录', position: 'bottom'})
          let did = localStorage.getItem('did')
          localStorage.clear()
          if (did)
            localStorage.setItem('did', did)
          this.$router.push({name: 'login'})
        }
      })
    }
  }
}

</script>
<style scoped>
.main {

  padding: 60px 10px 0px 10px;
}

.input_item {
  margin-bottom: 1px;
}

.submit {
  width: 300px;
  margin: 20px auto;
  height: 45px;
  line-height: 45px;
  border-radius: 25px;
  color: #FFFFFF;
  font-size: 18px;
  text-align: center;
}

.sms {
  color: #30AEFB;
}
</style>
