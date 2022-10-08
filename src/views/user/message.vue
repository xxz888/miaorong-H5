<!-- 消息 -->
<template>
  <div>
    <van-nav-bar title="消息中心" left-arrow fixed :border='false' @click-left="onClickLeft"/>
    <div class="tabs">
      <van-tabs v-model="active" color="#FB933F" line-width="50%" line-height="2px" @change="tab">
        <van-tab title="个人消息"></van-tab>
        <van-tab title="平台消息"></van-tab>
      </van-tabs>
    </div>
    <van-list v-model="loading" :finished="finished" finished-text="" @load="onLoad">
      <div class="list">
        <div class="item" v-for="(item,i) in list" :key="i">
          <h6>{{ item.title }}</h6>
          <p>{{ item.content }}</p>
          <span>{{ item.createTime }}</span>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import {NavBar, Tab, Tabs, List} from 'vant'
import {userJpushHistory} from '@/api/user'
import {getBrandNews} from '@/api/showBrand'

export default {
  data() {
    return {
      active: 0,
      loading: false,
      finished: false,
      list: [],
      userMessageList: [],
      brandMessageList: [],
      type: 1, // 类型 0平台消息，1个人消息
      token: '',
      sizebrand: 20,
      size: 20,
      totalElementsBrand: 0,
      totalElements: 0,
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [List.name]: List,
  },
  created() {
    this.token = localStorage.getItem('token')
    // this.getBrandPush()
    this.getUserPush()
  },
  methods: {
    onClickLeft() {
      window.history.back()
      return
      this.$router.push({name: 'home'})
    },
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        if (this.type == 0) {
          this.sizebrand += 10
          this.getBrandPush()
          if (this.totalElementsBrand <= this.sizebrand) {
            this.finished = true;
          }
          return
        } else if (this.type == 1) {
          this.size += 10
          this.getUserPush()
          if (this.totalElements <= this.size) {
            this.finished = true
          }
          return
        }
        this.loading = false;
      }, 1000);
    },
    // 标签切换
    tab(item) {
      this.type = item
      this.finished = false
      if (item == 0) {
        this.getUserPush()
        return
      } else {
        this.getBrandPush()
        return
      }
    },
    // 获取平台消息
    getBrandPush() {
      getBrandNews(this.token, this.sizebrand)
        .then(res => {
          if (res.resp_code == "000000") {
            this.list = res.result.content
            this.totalElementsBrand = res.result.totalElements
          } else {
            this.$toast({message: res.resp_message, position: 'bottom'})
          }
        })
    },

    // 获取个人消息
    getUserPush() {
      userJpushHistory(this.token, this.size)
        .then(res => {
          if (res.resp_code == "000000") {
            this.list = res.result.content
            this.totalElements = res.result.totalElements
          } else {
            this.$toast({message: res.resp_message, position: 'bottom'})
          }
        })
    },
    // 跳转消息详情
    gonext(item) {
      this.$router.push({name: 'messagedetail', params: {item: JSON.stringify(item)}})
    }
  }
}

</script>
<style scoped>
.tabs {
  padding-top: 45px;
  position: fixed;
  width: 100%;
}

.list {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 93px;
}

.item {
  width: 340px;
  background: #FFFFFF;
  border-radius: 8px;
  margin-bottom: 8px;
  padding: 10px 10px 5px;
  box-sizing: border-box;
  text-align: right;
  color: #aaaaaa;
  font-size: 12px
}

.item h6 {
  text-align: left;
  color: #333333;
  font-size: 14px;
}

.item p {
  text-align: left;
  color: #666666;
  font-size: 13px;
  margin: 5px 0;
}
</style>
