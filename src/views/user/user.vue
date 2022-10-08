<!-- 个人信息 -->
<template>
  <div>
    <van-nav-bar title="个人信息" left-arrow fixed @click-left="onClickLeft"/>
    <div class="main">
      <van-cell title="昵称" @click="show=true" v-if="userInfo.nickname!='' && userInfo.nickname!=null"
                :value=" userInfo.nickname"/>
      <van-cell title="昵称" @click="show=true" v-else value="-"/>
      <van-cell title="真实姓名" :value="userInfo.realname"/>
      <van-cell title="手机号" :value="userInfo.phone"/>
      <van-cell title="ID编号" :value="userInfo.userid"/>
      <van-cell title="注册日期" :value="userInfo.createTime"/>
      <van-cell title="实名状态" :value="(userInfo.realnameStatus)"/>
    </div>
    <van-dialog v-model="show" show-cancel-button :beforeClose="beforeClose">
      <van-field v-model="userInfo.nickname"/>
    </van-dialog>
  </div>
</template>

<script>
import {NavBar, Cell, Dialog, Field} from 'vant';
import {userInfoQuery, setUsernickName} from '@/api/user'

export default {
  data() {
    return {
      show: false,
      token: '',
      userInfo: {},
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Cell.name]: Cell,
    [Dialog.Component.name]: Dialog.Component,
    [Field.name]: Field
  },
  created() {
    this.token = localStorage.getItem('token')
    this.getUser()
  },
  methods: {
    beforeClose(e, dene) {
      if (e === 'confirm') {
        if (this.userInfo.nickname) {
          setUsernickName(this.userInfo.nickname).then(res => {

            if (res.resp_code === '000000') {
              this.$toast({message: res.resp_message, position: 'bottom'})
            }
          })
          dene()
        } else {
          this.$toast({message: '昵称不能为空', position: 'bottom'})
          dene(false)
        }

      } else if (e === 'cancel') {
        dene()
      }
    },
    // 返回
    onClickLeft() {
      window.history.back()
      return
    },
    // 获取个人信息
    getUser() {
      userInfoQuery(this.token).then(res => {
        if (res.resp_code == '000000') {
          let date = new Date(res.result.createTime)
          let year = date.getFullYear()
          let month = date.getMonth() + 1
          let day = date.getDate()
          if (month < 10) {
            month = '0' + month
          }
          if (day < 10) {
            day = '0' + day
          }
          let str = year + '-' + month + '-' + day
          res.result.createTime = str
          if (res.result.realnameStatus == '0') {
            res.result.realnameStatus = '审核中'
          }
          if (res.result.realnameStatus == '1') {
            res.result.realnameStatus = '已实名'
          }
          if (res.result.realnameStatus == '2') {
            res.result.realnameStatus = '已拒绝'
          }
          if (res.result.realnameStatus == '3') {
            res.result.realnameStatus = '未提交'
          }
          this.userInfo = res.result
        } else {
          this.$toast({message: res.resp_message, position: 'bottom'})
        }
      })
    }
  }
}
</script>
<style scoped>
.main {
  padding-top: 47px;
  text-align: left;
}
</style>
