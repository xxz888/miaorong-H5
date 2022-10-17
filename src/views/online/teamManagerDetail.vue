<!-- 消息 -->
<template>
  <div style="background:#F9FAFE ;min-height: 100vh;">
    <van-nav-bar
      class="agent_nav theme_bg"
      style="background: none"
      :border="false"
      title="团队成员"
      left-arrow
      @click-left="onClickLeft"
    >
    </van-nav-bar>
    <div class="warpper_top"></div>

    <div class="agent_search">
      <van-search
        v-model="fullname"
        show-action
        background="none"
        placeholder="请输入手机号或者姓名"
        @search="onSearch"
      >
        <template #action>
          <div class="agent_search_btn" @click="onSearch">搜索</div>
        </template>
      </van-search>
    </div>

    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      loading-text="加载中..."
    >
      <div class="profit_share_cont" v-for="(item, index) in list" :key="index">
  

       <div class="user">
          <div class="left">

            <div>
              <span class="theme1">{{ item.fullname + "(" + item.phone + ")" }}</span>
            </div>
          </div>
          <div class="right">

            <div>
            </div>
          </div>
          <div class="right_right">
               <div class="detailClass" @click="getTeamExtension(item.userId)">推广查看</div>
            <div>
               </div> 
            </div>
        </div> 















        <div class="user">
          <div class="left">
            <div class="userTitle">在线收款</div>

            <div>
              <span class="theme1">{{
                (type == 0 ? item.curFastTotal : item.preFastTotal) | toFixed
              }}</span>
            </div>
          </div>
          <div class="left">
            <div class="userTitle">智能还款</div>

            <div>
              <span class="theme1">{{
                (type == 0 ? item.curBalanceTotal : item.preBalanceTotal)
                  | toFixed
              }}</span>
            </div>
          </div>
          <!-- <div class="right">
            <div class="userTitle">空卡还款</div>

            <div>
              <span class="theme1">{{
                (type == 0 ? item.curEmptyTotal : item.preEmptyTotal) | toFixed
              }}</span>
            </div>
          </div> -->
          <!--  -->
        </div>
      </div>
    </van-pull-refresh>
    <van-empty
      class="user_empty"
      v-if="list.length == 0"
      description="暂无团队成员"
      :image="require('../../assets/user_empty.png')"
    />

  </div>
</template>

<script>
import {
  NavBar,
  Tab,
  Tabs,
  List,
  Icon,
  Empty,
  PullRefresh,
  Sticky,
  Search,
  Dialog
} from "vant";
import { getTeamManagerDetail,getTeamExtension} from "@/api/user";
import { getBrandNews } from "@/api/showBrand";
    

export default {
  data() {
    return {
      active: 0,
      isLoading: false,
      isupLoading: false,
      finished: false,
      list: [],
      userMessageList: [],
      brandMessageList: [],
      type: 0, // 类型 0当月交易，1上月交易
      token: "",
      sizebrand: 20,
      size: 20,
      totalElementsBrand: 0,
      totalElements: 0,
      userId: "",
      text: "",
      fullname: "",
      level: "",
      showDetail:true
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [List.name]: List,
    [Icon.name]: Icon,
    [Empty.name]: Empty,
    [PullRefresh.name]: PullRefresh,
    [Sticky.name]: Sticky,
    [Search.name]: Search,
    [Dialog.Component.name]: Dialog.Component,

  },
  created() {
         


        
    this.token = localStorage.getItem("token");

    this.level = this.$route.params.level;
    this.type = this.$route.params.type;
    this.getTeamManagerDetail();
  },
  methods: {
    onClickLeft() {
      window.history.back();
      return;
      this.$router.push({ name: "home" });
    },

    //
    getTeamExtension(userId){
      getTeamExtension(userId).then((res) => {
          Dialog.alert({
              theme: 'round-button',
          confirmButtonColor:'#30AEFB',
          title: '',
          message: `今天新增注册:${res.result.todayTotal}人\n今天新增实名:${res.result.todayRealname}人\n\n当月新增注册:${res.result.curMonthTotal}人\n当月新增实名:${res.result.curMonthRealname}人\n\n昨天新增注册:${res.result.yesterdayTotal}人\n昨天新增实名:${res.result.yesterdayRealname}人\n\n上月新增注册:${res.result.preMonthTotal}人\n上月新增实名:${res.result.preMonthRealname}人\n`,
        }).then(() => {
          // on close
        });
      })


      
    },
    getTeamManagerDetail() {
      var that = this;
      getTeamManagerDetail(this.level, 1, this.fullname).then((res) => {
        if (res.resp_code == "000000") {
          that.list = [];
          that.list = res.result;
          for (var item of this.list) {
            item.fullname = item.fullname  ?item.fullname:'' ;
            if (that.level != 1 && item.phone.length == 11) {
              item.phone = that.dataHiddenPhone(item.phone);
            }
          }
        } else {
          that.$toast({ message: res.resp_message, position: "bottom" });
        }
      });
    },
    dataHiddenPhone(value) {
      if (value) {
        let str1 = value.substring(0, 3);
        let str2 = value.substring(value.length - 4);
        return str1 + " **** " + str2;
      } else {
        return "";
      }
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast("刷新成功");
        this.getTeamManagerDetail();
        this.isLoading = false;
      }, 1000);
    },

    onSearch() {
      this.getTeamManagerDetail();
    },
    // 跳转消息详情
    gonext(item) {
      this.$router.push({
        name: "messagedetail",
        params: { item: JSON.stringify(item) },
      });
    },
  },
};
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
  background: #ffffff;
  border-radius: 8px;
  margin-bottom: 8px;
  padding: 10px 10px 5px;
  box-sizing: border-box;
  text-align: right;
  color: #aaaaaa;
  font-size: 12px;
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
.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.agent_nav >>> .van-icon {
  color: #ffffff !important;
}
.topClass {
  padding-top: 45px;
}
.profit_share_cont {
  padding: 0 10px;
  margin-top: 10px;
}

.user {
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  background: #fff;
  padding-top: 5px;
  padding-left: 10px;
  padding-bottom: 5px;
  font-size: 13px;
  color: #333;
  display: flex;
}
.user1 {
  background: #fff;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  padding-top: 10px;
  padding-left: 10px;
  font-size: 14px;
  color: #333;
  display: flex;
}

.user .left,
.right {
  flex: 1;
  line-height: 24px;
  position: relative;
}

.right .right_right {
  font-size: 20px;
  color: #666;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto 0;
  height: 20px;
}
.userTitle {
  color: #30AEFB;
}
.themeTitle {
  padding: 5px;
  font-size: 15px;
  color: #333;
}
.agent_right_tip {
  font-size: 13px;
  background: #ffffff;
  border-radius: 10px 0px 0px 10px;
  padding: 2px 2px 2px 8px;
  margin-right: -16px;
}

.agent_top_bg {
  height: 140px;
  border-radius: 0 0 25px 25px;
  width: 100%;
  font-size: 17px;
  display: flex;
  color: #fff;
  padding: 27px 30px;
}

.agent_top_bg .left {
  width: 65px;
}
.agent_search {
  margin: 10px 0;
  border-radius: 10px;
  padding: 10px 10px 0px 10px;
}

.agent_search >>> .van-search {
  padding: 0;
}

.agent_search >>> .van-search__content {
  background: #fff;
  border-radius: 10px;
}

.agent_search_btn {
  color: #2574ea;
}
.detailClass{
    width: 70px;
    height: 24px;
    background: #30AEFB;
    border-radius: 12px;
    color: #fff;
    text-align: center;
    line-height: 23px;
    margin-right: 5px;

}
</style>
