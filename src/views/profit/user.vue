<template>
  <div>
    <van-nav-bar class="agent_nav theme_bg" style="background: none;" :border='false' :title="title" left-arrow
                 @click-left="onClickLeft" />
    <div class="warpper_top"></div>
    <van-sticky :offset-top="46">
      <div class="profit_user_search">
        <div class="left">
          <van-search v-model="condition" show-action background="#fff" placeholder="请输入手机号或者姓名" @search="onSearch">
            <template #action>
              <div class="profit_user_search_btn" @click="onSearch">搜索</div>
            </template>
          </van-search>
        </div>
        <div class="right" @click="statusTrueFalseBy=true">
          <span>{{ statusName(status) }}</span>
          <img src="../../assets/profit/bottom_icon.png" alt="">
        </div>
      </div>
    </van-sticky>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div>
        <van-list v-model="isupLoading" :finished="finished" finished-text="" @load="onLoad">
          <ul class="profit_user_list" v-if="sonList.length>0">
            <li class="profit_user_item_box" v-for="(item,index) in sonList" :key="index">
              <div class="profit_user_item">
                <div class="left">
                  <img src="../../assets/agent/img_icon.png" alt="">
                </div>
                <div class="cont">
                  <div class="title" v-if="item.realName==null">
                    未实名
                    <span :class="'userStatus_'+userStatusC(item)">{{ userStatus(item) }}</span>
                  </div>
                  <div class="title" v-else>
                    {{ item.realName }}
                    <span :class="'userStatus_'+userStatusC(item)">{{ userStatus(item) }}</span>
                  </div>
                  <span class="tips">ID:{{ item.userId }}</span>
                </div>
                <div class="right">
                  <div class="phone">
                    <span>{{ item.phone |dataHidden }}</span>
                    <a v-if="title=='直推用户'" :href="'tel:'+item.phone">
                      <img src="../../assets/profit/phone_icon.png" alt="">
                    </a>
                  </div>
                  <span class="tips">注册时间：{{ item.createTime }}</span>
                </div>
              </div>
              <div class="profit_user_transaction">
                <div>
                  <p>直推激活(人):<span class="theme">{{ item.direct1ActiveCount }}</span></p>
                  <p>直推交易量(元):<span class="theme">{{ item.direct1Amount | toFixed }}</span></p>
                </div>
                <div>
                  <p>间推激活(人):<span class="theme">{{ item.direct2ActiveCount }}</span></p>
                  <p>间推交易量(元):<span class="theme">{{ item.direct2Amount | toFixed }}</span></p>
                </div>
              </div>
            </li>
          </ul>
          <van-empty  v-else description="还没有直推用户请前去立即推广哦"
                    >
            <van-button round @click="next('/sharePage','8')" class="bottom-button theme-linear-bg color_fff ">
              立即推广
            </van-button>
          </van-empty>
        </van-list>
      </div>
    </van-pull-refresh>
    <van-popup v-model="statusTrueFalseBy" position="right" class="user_status">
      <div class="user_status_box">
        <ul>
          <li class="user_status_item van-hairline--bottom" :class="item.status==status?'activeStatus':''"
              v-for="(item,index) in statusLsit" :key="index" @click="statusSel(item)">
            {{ item.title }}
          </li>
        </ul>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  NavBar,
  Sticky,
  Search,
  PullRefresh,
  List,
  Empty,
  Icon,
  Popup,
  Button
} from 'vant';
import {newsQuery} from '@/api/showBrand'
import {
  userDirectQuery
} from "@/api/profit";

export default {
  data() {
    return {
      brandId: localStorage.getItem('brandId'),
      userId: localStorage.getItem('userId'),
      phone: localStorage.getItem('phone'),
      isLoading: false,
      isupLoading: false,
      finished: false,
      sonList: [],
      condition: "",
      size: 10,
      level: 1,
      title: "直推用户",
      status: "0",
      statusLsit: [
        {status: "0", title: "全部"},
        {status: "1", title: "已注册"},
        {status: "2", title: "已实名"},
        {status: "4", title: "已认证"},
        {status: "3", title: "已激活"},
      ],
      statusTrueFalseBy: false,
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Sticky.name]: Sticky,
    [Search.name]: Search,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Empty.name]: Empty,
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [Button.name]: Button
  },
  created() {
    this.title = JSON.parse(this.$route.params.title)
    this.level = JSON.parse(this.$route.params.level)
    this._userDirectQuery()
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    statusName(val) {
      var name = ''
      if (val == 0) {
        name = '全部'
      } else if (val == 1) {
        name = '已注册'
      } else if (val == 2) {
        name = '已实名'
      } else if (val == 3) {
        name = '已激活'
      } else if (val == 4) {
        name = '已认证'
      }
      return name
    },
    next(path, type) {
      this.$router.push({path: path});
    },
    _userDirectQuery() {
      userDirectQuery(this.level, this.status, this.condition, this.size).then(res => {
        this.sonList = [];
        if (res.resp_code == "000000") {
          if (res.result.length > 0) {
            this.sonList = res.result;
            this.isupLoading = false;
            if (this.sonList.length == this.size) {
              this.finished = false;
            } else if (this.size > this.sonList.length) {
              this.finished = true;
            } else {
              this.finished = true;
            }
            this.size += 10
          } else {
            this.sonList = [];
            this.finished = true
            this.isupLoading = true;
          }
        } else {
          this.sonList = [];
        }
      });
    },
    userStatus(item) {
      var title = ''
      if (item.activeSatatus == 1 && this.status == 4) {
        title = '已认证'
      } else if (item.activeSatatus == 1 && this.status == 2) {
        title = '已实名'
      } else if (item.activeSatatus == 1) {
        title = '已激活'
      } else {
        if (item.realNameStatus == 0) {
          title = '实名中'
        } else if (item.realNameStatus == 1 && this.status == 4) {
          title = '已认证'
        } else if (item.realNameStatus == 1) {
          title = '已实名'
        } else if (item.realNameStatus == 2) {
          title = '实名失败'
        } else if (item.realNameStatus == 3) {
          title = '已注册'
        }
      }
      return title
    },
    userStatusC(item) {
      var status = ''
      if (item.activeSatatus == 1 && this.status == 4) {
        status = '4'
      } else if (item.activeSatatus == 1 && this.status == 2) {
        status = '4'
      } else if (item.activeSatatus == 1) {
        status = '4'
      } else {
        if (item.realNameStatus == 0) {
          status = '0'
        } else if (item.realNameStatus == 1 && this.status == 4) {
          status = '4'
        } else if (item.realNameStatus == 1) {
          status = '1'
        } else if (item.realNameStatus == 2) {
          status = '2'
        } else if (item.realNameStatus == 3) {
          status = '3'
        }
      }
      return status
    },
    statusSel(item) {
      this.status = item.status
      this.statusTrueFalseBy = false
      this.onSearch()
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this._userDirectQuery()
        this.isLoading = false;
      }, 1000);
    },
    onLoad() {  //上啦加载
      setTimeout(() => {
        this._userDirectQuery()
      }, 500);
    },
    onSearch() {
      this.size = 20
      this._userDirectQuery()
    }
  }
}
</script>
<style scoped>
.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.agent_nav >>> .van-icon {
  color: #FFFFFF !important;
}

.profit_user_list {
  padding: 0 10px;
}

.profit_user_item_box {
  padding: 10px 15px;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 10px;
  font-size: 13px;
}

.profit_user_item {
  display: flex;
}

.profit_user_item .cont {
  flex: 1;
}

.profit_user_item .cont .title > span {
  font-size: 11px;
  display: inline-block;
  padding: 0 6px;
  border-radius: 5px;
}

.userStatus_1 {
  border: 1px solid #cccccc;
  background: #e8e8e8;
  color: #333333;
}

.userStatus_3 {
  border: 1px solid #cccccc;
  background: #e8e8e8;
  color: #999999;
}

.userStatus_0, .userStatus_2, .userStatus_4 {
  border: 1px solid #ffaf78;
  background: #ffefdd;
  color: #30AEFB;
}

.profit_user_item .right {
  flex: 1;
}

.profit_user_item .left {
  width: 50px;
}

.profit_user_item .left > img {
  height: 40px;
  width: 40px;
}

.profit_user_item .right {
  text-align: right;
}

.profit_user_item .tips {
  color: #999;
  font-size: 12px;
  line-height: 30px;
}

.profit_user_item .phone {
  color: #666;
}

.profit_user_item .phone span {
  vertical-align: middle;
}

.profit_user_item .phone img {
  height: 16px;
  width: 16px;
  vertical-align: middle;
  margin-left: 5px;
}

.agent_search {
  background: #fff;
  margin: 10px 0;
  border-radius: 10px;
}

.profit_user_search {
  display: flex;
  padding: 10px;
  font-size: 14px;
  background: #f5f5f5;


}

.profit_user_search .left {
  flex: 1;
}

.profit_user_search .right {
  width: 60px;
  text-align: right;
  line-height: 34px;
}

.profit_user_search .right img {
  height: 6px;
  width: 8px;
  vertical-align: middle;
  margin-left: 5px;
}

.profit_user_search >>> .van-search {
  padding: 0;
  border-radius: 10px;

}

.profit_user_search >>> .van-search__content {
  background: #fff;
  border-radius: 10px;
}

.profit_user_search_btn {
  color: #2574EA;
}

.agent_grade_name {
  display: inline-block;
  background: #30AEFB;
  border-radius: 9px;
  padding: 0 8px;
  font-size: 11px;
  color: #fff;
  margin-left: 5px;
}

.user_empty >>> .van-empty__image img {
  height: auto;
}

.profit_user_transaction {
  background: rgba(255, 150, 48, .06);
  padding: 8px 15px;
  font-size: 11px;
  color: #333;
  display: flex;
  border-radius: 10px;
}

.profit_user_transaction div {
  flex: 1;
  line-height: 20px;
}

>>> .user_status.van-popup--right {
  top: 160px !important;
  right: 10px;
  border-radius: 3px;

}

.user_status_box {
  font-size: 14px;
}

.user_status_item {
  padding: 10px 15px;
  text-align: center;
}

.activeStatus {
  background: #30AEFB;
  color: #fff;
}
</style>
