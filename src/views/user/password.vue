<!-- 忘记密码 -->
<template>
  <div>
    <van-nav-bar :title="'修改支付密码'" left-text="" left-arrow fixed @click-left="onClickLeft"/>
    <div class="main">
      <div class="input_item">
        <van-field clearable label="新密码" v-model="password" type="password" :placeholder="'请输入您新的'+title+'密码'"/>
      </div>
      <div class="input_item">
        <van-field clearable label="确认密码" v-model="passsure" type="password" :placeholder="'请再次输入您新的'+title+'密码'"/>
      </div>
      <div class="submit theme_btn" @click="next()">下一步</div>
    </div>
  </div>
</template>

<script>
import {NavBar, Field} from 'vant';
import {passwordUpdate, paypassUpdate} from '@/api/login'

export default {
  data() {
    return {
      type: '0',
      title: '登录',
      phone: localStorage.getItem('phone'),
      password: '',
      passsure: '', // 确认密码
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Field.name]: Field,
  },
  methods: {
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
      if (this.password.length > 7) {
        this.$toast({message: '密码长度不能大于6位', position: 'bottom'})
        return
      }
      let reg = new RegExp(/^[0-9]*$/);
      if (!reg.test(this.password)) {
        this.$toast({message: '支付密码必须为纯数字', position: 'bottom'})
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
      this.$router.push({
        name: 'smsSend',
        params: {phone: JSON.stringify(this.phone), password: JSON.stringify(this.password)}
      })
    }
  }
}
</script>
<style scoped>
.main {
  padding-top: 50px;
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
</style>
