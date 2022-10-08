<template>
  <div>
    <van-nav-bar class="contact_nav " :border='false' title="消息中心" left-arrow @click-left="onClickLeft"/>
    <div class="tabs">
      <van-tabs v-model="active" color="#30AEFB" line-width="50%" line-height="2px" @change="tab">
        <van-tab title="个人消息"></van-tab>
        <van-tab title="喵融生活通知"></van-tab>
        <!-- <van-tab :dot='$store.state.user.unread!=0' title="在线客服"></van-tab> -->
      </van-tabs>
    </div>
    <div class="main">
      <van-list v-model="loading" :finished="finished" finished-text="" @load="onLoad">
        <div class="list" v-show="active!=2">
          <div class="item" v-for="(item,i) in list" :key="i">
            <div><img style="height:40px;width:auto" src="../../assets/contact/tit_logo.png"> <span>{{ item.createTime }}</span></div>
            <p>{{ item.content }}</p>
          </div>
        </div>
        <div class="list" @click="meiqia()" v-show="active==2">
          <div class="item">
            <div><img style="height:40px;width:auto"  src="../../assets/contact/tit_logo.png"></div>
            <p>喵融生活联盟客服</p>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>
<script>
import {NavBar, Icon, Tag, Badge, Tab, Tabs, List} from 'vant'
import {brandQuery} from '@/api/showBrand'
import {userJpushHistory} from '@/api/user'
import {getBrandNews} from '@/api/showBrand'
import {preUserQuery} from "@/api/user";

export default {
  data() {
    return {
      prepreUserPhone: '',
      brandPhone: '',
      num: '',
      active: 0,
      token: localStorage.getItem('token'),
      type: 1, // 类型 0平台消息，1个人消息
      sizebrand: 20,
      size: 20,
      list: [],
      loading: false,
      finished: false,
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Tag.name]: Tag,
    [Badge.name]: Badge,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [List.name]: List
  },
  created() {
    this.num = this.$route.params.num
    this.getBrand()
    this.getUserPush()
  },
  methods: {
    meiqia() {
      _MEIQIA('init')
      _MEIQIA('showPanel')
    },
    getBrand() {
      brandQuery(this.global.brandId).then(res => {
        if (res.resp_code == "000000") {
          this.brandList = res.result
          this.brandPhone = res.result.brandPhone
        } else {
          this.$toast({message: res.data.resp_message, position: 'bottom'})
        }
      })
    },
    // 标签切换
    tab(item) {
      this.type = item
      if (item == 0) {
        this.getUserPush()
        return
      } else if (item == 1) {
        this.getBrandPush()
        return
      } else if (item == 2) {
        this.meiqia()
        return
      }
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
    onClickLeft() {
      window.history.back()

    },

  }

}
</script>
<style scoped>
>>> .van-tag--warning {
  padding: 2px;
  position: absolute;
  width: 60px;
  bottom: 3px;
  right: -15px;
  text-align: center;
  font-size: 11px;
  background-color: #30AEFB;
}

.tabs {
  padding-top: 45px;
  position: fixed;
  width: 100%;
}

.list {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
}

.item {
  width: 340px;
  background: rgba(250, 255, 255, 0.8);
  border-radius: 8px;
  margin-bottom: 8px;
  box-sizing: border-box;
  color: #333;
  font-size: 12px;
  padding: 10px;
  margin: 20px auto;
  font-size: 15px;
  border-radius: 5px;
}

.item p {
  text-align: left;
  color: #333;
  font-size: 13px;
  margin: 5px 0;
}

.online {
  color: #30AEFB;
  text-align: center;
  font-weight: 600;
  vertical-align: middle;
  font-size: 20px;
}

.kefu {
  font-size: 18px;
  font-weight: 600;
  margin-right: 5px;
  color: #000;
}

.tel {
  float: right;
}

.teler {
  padding: 5px 0px;
}

.zi {
  position: relative;
  color: rgb(123, 123, 123);
  font-size: 13px;
  margin-top: 5px;
  font-weight: 400;
}

.item img {
  margin: 10px 50px 10px 0px;
  vertical-align: middle;
}

.main {
  padding: 60px 25px 0px 20px;
  /* background: url('../../assets/contact/kf_bg.png') no-repeat ; */
  background: linear-gradient(180deg, #30AEFB 0%, #30AEFB 100%) !important;
  background-size: 100% 100%;
  height: 100vh;
  overflow: scroll;
}

>>> .contact_nav {
  background: linear-gradient(180deg, #30AEFB 0%, #30AEFB 100%) !important;

}

>>> .van-nav-bar__title, >>> .van-nav-bar__arrow {
  color: #fff;
}

.liu {
  display: flex;
  justify-content: space-between;
}

.tabs {
  padding-top: 45px;
  position: fixed;
  width: 100%;
}
</style>
