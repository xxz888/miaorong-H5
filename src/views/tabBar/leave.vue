<template>
  <div>
    <van-nav-bar class="contact_nav " :border='false' title="客服留言" left-arrow @click-left="onClickLeft"/>
    <div class="main">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-row v-for=" (item,index) of leaveMassgeList" :key="index">
          <van-row>
            <van-col span="24">
              <span class="time">{{ item.createTime }}</span>
            </van-col>
          </van-row>
          <van-col span="3">
            <img width="30px" src="../../assets/logo.png">
          </van-col>
          <van-col span="21">
            <p class="content" @click=" (item.content.indexOf('在线客服')> -1) ? meiqia():'' "
               v-html="handlerContent(item.content)">
            </p>
          </van-col>
        </van-row>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
import {NavBar, Row, Col, PullRefresh} from 'vant'
import {getMessage, updateMessage} from '@/api/showBrand'

export default {
  data() {
    return {
      userId: localStorage.getItem('userId'),
      leaveMassgeList: [],
      isLoading: false
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [Row.name]: Row,
    [Col.name]: Col,
    [PullRefresh.name]: PullRefresh
  },
  created() {
    this._getMessage()
    this.$store.commit('Unread', 0)
  },
  methods: {
    //--------查询用户留言-----------
    _getMessage() {
      getMessage(this.userId).then(res => {
        if (res.resp_code == '000000') {
          this.leaveMassgeList = res.result
          this._updateMessage()
        }
      })
    },
    _updateMessage() {
      this.leaveMassgeList.forEach(item => {
        if (item.type == 0) {
          updateMessage(item.id).then(res => {
          })
        }
      })
    },
    meiqia() {
      _MEIQIA('init')
      _MEIQIA('showPanel')
    },
    onClickLeft() {
      window.history.back()
      return
    },
    handlerContent(content) {
      if (content.indexOf('在线客服')) {
        return content.replace('在线客服', '<span style="color:blue">在线客服</span>')
      }
      return content
    },
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false;
        this._getMessage()
      }, 1000);
    }
  }
}
</script>
<style scoped>
.main {
  background-color: #fff;
  height: 100vh;
  padding: 80px 20px 0px 20px;
  font-size: 14px;
}

.content {
  background-color: #eee;
  padding: 6px;
  border-radius: 4px;
}

.time {
  font-size: 12px;
  text-align: center;
  width: 100%;
  display: inline-block;
  margin: 10px;
  color: #aaa;
}
</style>
