<template>
  <div>
    <van-nav-bar class="agent_nav theme_bg" style="background: none;" :border='false' title="信用管理" left-arrow
                 @click-left="onClickLeft" />
    <div class="warpper_top"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div>
        <div class="agent_top_bg theme_bg"></div>
        <div class="credit_list_cont">
          <div class="credit_list_tabs">
            <van-tabs v-model="active" @change="onSearch" background='none' title-inactive-color="#fff"
                      title-active-color="#fff" line-width="24" line-height="3" color="#fff">
              <van-tab title="未授信" name="2"></van-tab>
              <van-tab title="已授信" name="1"></van-tab>
            </van-tabs>
          </div>
          <div class="credit_list_search">
            <van-search v-model="userSonPhone" background='none' show-action placeholder="请输入手机号或者姓名">
              <template #action>
                <div class="theme" @click="onSearch">搜索</div>
              </template>
            </van-search>
          </div>
          <div>
            <ul class="credit_list" v-if="sonList.length>0">
              <li class="credit_list_item_box" v-for="(item,index) in sonList" :key="index">
                <div class="credit_list_item_clear" @click="next(item,2,'取消授信')" v-if="active==1">
                  <van-icon name="clear"/>
                </div>
                <div class="credit_list_item">
                  <div class="left">
                    <img src="../../assets/agent/img_icon.png" alt="">
                  </div>
                  <div class="cont">
                    <div v-if="item.firstUserName!=null && item.firstUserName!=''">{{ item.firstUserName }}</div>
                    <div v-else>未实名</div>
                    <span class="id">ID:{{ item.firstUserId }}</span>
                  </div>
                  <div class="right" v-if="active==2">
                    <div class="time">授信时间：{{ item.accreditTime.split(' ')[0] }}</div>
                    <span class="btn theme-linear-bg " @click="next(item,0,'确认授信')"> 授信</span>
                  </div>
                  <div class="right" v-else>
                    <div class="phone">{{ item.firstUserPhone |dataHidden }}</div>
                    <div class="time">授信时间：{{ item.accreditTime.split(' ')[0] }}</div>
                  </div>
                </div>
                <div class="credit_list_item_amount" v-if="active==1" @click="next(item,1,'修改授信')">
                  <span>授信额度(元):<span>{{ item.superiorQuota }}</span></span>
                  <van-icon class="icon theme" name="edit"/>
                </div>
              </li>
            </ul>
            <van-empty description="暂无数据" v-else />
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import {
  NavBar,
  PullRefresh,
  Empty,
  Icon,
  Tab, Tabs, Search, List
} from 'vant';
import {
  userSonQuotaQuery
} from "@/api/creditManage";

export default {
  data() {
    return {
      brandId: localStorage.getItem('brandId'),
      userId: localStorage.getItem('userId'),
      phone: localStorage.getItem('phone'),
      isLoading: false,
      isupLoading: false,
      finished: false,
      active: '2',
      userSonPhone: "",
      sonList: [],
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [Empty.name]: Empty,
    [Icon.name]: Icon,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Search.name]: Search,
    [List.name]: List
  },
  created() {
    this._userSonQuotaQuery()
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    _userSonQuotaQuery() {
      userSonQuotaQuery(this.userSonPhone, this.active, undefined, '1', this.size).then(res => {
        this.sonList = [];
        if (res.resp_code == "000000") {
          this.sonList = res.result;
        }
      })
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        // this._userQuotaQuery()
        this.isLoading = false;
      }, 1000);
    },
    onSearch() {
      this._userSonQuotaQuery()
    },
    next(item, type, title) {
      if (item.firstUserName == '' || item.firstUserName == null) {
        this.$toast({
          message: '对方还未实名，不能给对方授信',
          position: 'bottom'
        })
        return
      }
      this.$router.push({
        name: 'creditConfirm',
        params: {item: JSON.stringify(item), type: JSON.stringify(type), title: JSON.stringify(title)}
      })
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

.agent_top_bg {
  height: 140px;
  border-radius: 0 0 25px 25px;
  width: 100%;
  font-size: 17px;
  display: flex;
  color: #fff;
  padding: 27px 30px;
  box-shadow: 0px 3px 15px 0px rgba(0, 0, 0, 0.09);
}

.credit_list_search {
  background: #fff;
  border-radius: 10px;
  margin-bottom: 10px;
}

.credit_list_search .van-search {
  padding: 0;
}

.credit_list_search >>> .van-search .van-search__content {
  background: #fff;
  padding-left: 10px;
  border-radius: 12px;
}

.credit_list_tabs {
  padding-bottom: 10px;
}

.credit_list_tabs >>> .van-tab--active {
  font-size: 18px !important
}

.credit_list_tabs >>> .van-tab {
  font-size: 15px;
}

.credit_list_cont {
  padding: 0 10px;
  margin-top: -130px;
  position: relative;
}

.credit_list_item_box {
  background: #fff;
  font-size: 14px;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 12px;
}

.credit_list_item {
  display: flex;
}

.credit_list_item .left {
  width: 50px;
}

.credit_list_item .left > img {
  height: 40px;
  width: 40px;
}

.credit_list_item .cont, .right {
  flex: 1;
  position: relative;
}

.credit_list_item .cont .id {
  display: inline-block;
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.credit_list_item .right .time {
  font-size: 11px;
  color: #999;
}

.credit_list_item .right {
  text-align: right;
}

.credit_list_item .right .phone {
  color: #666;
  font-size: 13px;
  margin-bottom: 8px;
}

.credit_list_item .right .btn {
  display: inline-block;
  padding: 0 10px;
  border-radius: 9px;
  color: #fff;
  font-size: 11px;
  margin-top: 5px;
}

.credit_list_item_clear {
  color: #999;
  text-align: right;
  padding: 5px 0;
}

.credit_list_item_amount {
  padding-left: 50px;
  font-size: 13px;
  color: #333;
}

.credit_list_item_amount > span {
  vertical-align: middle;
}

.credit_list_item_amount span > span {
  color: #2574EA;
}

.credit_list_item_amount .icon {
  vertical-align: middle;
  margin-left: 7px;

}

.credit_empty {
  padding: 100px 0;
}

.credit_empty >>> .van-empty__image img {
  height: auto;
}

</style>
