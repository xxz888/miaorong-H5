<template>
  <div style="background: #fff;">
    <van-nav-bar class="agent_nav theme_bg" style="background: none;" :border='false' title="直推用户" left-arrow
                 @click-left="onClickLeft" />
    <div class="warpper_top"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div>
        <div class="profit_type_top theme_bg">
          <ul>
            <li class="item">
              <div class="left">
                <div class="title">总人数</div>
                <div class="amount">{{ totalData.all }}</div>
              </div>
              <div class="right">
                <van-field v-model="form.phone" placeholder="请输入手机号"
                           style="height:36px;background:url(0) no-repeat;padding:5px 20px;border:1px solid #3CB556;border-radius:10px;">
                  <template #button>
                    <img src="@/assets/profit/search.png" style="width:20px;height:20px;" @click="search()">
                  </template>
                </van-field>
              </div>
            </li>
            <li class="item">
              <div class="left">
                <div class="title">已实名</div>
                <div class="profit_amount">{{ totalData.realname }}</div>
              </div>
              <div class="right">
                <div class="title">已认证</div>
                <div class="profit_amount">{{ totalData.auth }}</div>
              </div>
              <div class="right">
                <div class="title">已激活</div>
                <div class="profit_amount">{{ totalData.active }}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="profit_share_cont">
          <div class="cash_box">
            <div class="cash_title">
              <div class="type">用户</div>
              <div class="amount">注册日期</div>
              <div class="amount">操作</div>
            </div>
            <van-list v-model="isupLoading" :finished="finished" finished-text="" @load="onLoad">
              <ul class="cash_list" v-if="profit.length>0">
                <li class="cash_item van-hairline--bottom" v-for="item in profit" :key="item.id">
                  <div class="type">{{ handleName(item.fullname) }}<br>{{ item.phone }}</div>
                  <div class="theme amount">{{ item.createTime.substring(0, 10) }}</div>
                  <div class="amount">
                    <van-button size="small" round type="primary" style="height: 30px" @click="levelList(item)">
                      更改等级
                    </van-button>
                  </div>
                </li>
              </ul>
              <van-empty v-else description="暂无记录"
                        />
            </van-list>
          </div>
        </div>
      </div>
    </van-pull-refresh>
    <level ref="levelSelect" :diffs="diffList" />
  </div>
</template>
<script>
import {
  NavBar,
  PullRefresh,
  Icon,
  List,
  Empty,
  DropdownMenu,
  DropdownItem,
  Button, Field
} from 'vant'
import { getBelow, belowCount, getUserLevelList, changeUserLevel } from "@/api/user";
import level from "@/components/level/level";

export default {
  data() {
    return {
      brandId: localStorage.getItem('brandId'),
      userId: localStorage.getItem('userId'),
      phone: localStorage.getItem('phone'),
      isLoading: false,
      form: {
        page: 0,
        size: 20,
        phone: ''
      },
      fuwuList: [],
      queryType: 1, //1:快捷,2:余额还款,3:空卡还款,6:花呗
      title: "刷卡",
      totalData: {},
      profit: [],
      isupLoading: false,
      finished: false,
      diffList: [],
      diffShow: false,
      selectUserId: 0
    }
  },
  components: {
    level,
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [Icon.name]: Icon,
    [Field.name]: Field,
    [List.name]: List,
    [Empty.name]: Empty,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Button.name]: Button
  },
  created() {
    this.total()
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    total(){
      belowCount().then(res => {
        if (res.resp_code == '000000') {
          this.totalData = res.result
        }
      })
    },
    _profitSumQuery() {
      getBelow(this.form).then(res => {
        if (res.resp_code == '000000') {
          this.profit.push(...res.result)
          this.isupLoading = false
          if (res.result.length == 0) {
            this.finished = true;
          }
        }
      })
    },
    handleName(name){
      if(name){
        return name
      }
      return '未实名'
    },
    search(){
      this.form.page = 1;
      this.profit = []
      this._profitSumQuery();
    },
    levelList(user){
      this.selectUserId = user.id
      getUserLevelList({ userId: user.id }).then(res => {
        if(res.resp_code == '000000'){
          if(res.result.length > 0){
            this.diffList = res.result
            this.$refs.levelSelect.open()
          }else{
            this.$toast( { message: '您的vip等级不够', position: 'bottom' } )
          }
        }
      })
    },
    changeLevel(level){
      changeUserLevel({ userId: this.selectUserId, level }).then(res => {
        this.$toast({ message: res.resp_message, position: 'bottom' })
      })
    },
    onLoad() {  //上啦加载
      setTimeout(() => {
        this.form.page += 1
        this._profitSumQuery()
      }, 500);
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this.isLoading = false;
      }, 1000);
    }
  }
}
</script>
<style scoped>
>>> .van-popup {
  width: 94.7%;
  left: 10px;
  border-radius: 0px 0px 5px 5px;
}

.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.agent_nav >>> .van-icon {
  color: #FFFFFF !important;
}

.profit_type_top_bg {
  background: #fff;
  padding: 3px;
  border-radius: 10px;
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.09);
}

.profit_type_top_bg >>> .van-dropdown-menu__bar {
  box-shadow: none;
}

.profit_type_top {
  width: 100%;
  padding: 10px 0 25px 0;
  font-size: 15px;
  color: #fff;
  border-radius: 0 0 20px 20px;
}

.profit_type_top .item {
  display: flex;
  padding-bottom: 20px;
}

.profit_type_top .item > div {
  flex: 1;
  text-align: center;
}

.profit_type_top .item .title {
  font-size: 13px;
  line-height: 30px;
  font-weight: 300;

}

.profit_type_top .item .amount {
  font-size: 32px;
}

.profit_type_top .item .profit_amount {
  font-size: 20px;
}

.profit_type_top .item .right {
  position: relative;
}

.profit_share_cont {
  padding: 0 10px;
  margin-top: -30px;
}

.profit_type_date {
  font-size: 14px;
  color: #333;
}

.profit_type_date .item {
  display: flex;
  line-height: 44px;
  text-align: center;
}

.profit_type_date .item .right {
  width: 40px;
  color: #666;
  font-size: 15px;
  line-height: 44px;
}

.profit_type_date .item div {
  flex: 1;
}

.active {
  color: #30AEFB;
}

.profit_type_date .type {
  font-size: 12px;
  color: #666;
}

.cash_box {
  margin-top: -20px;
  padding: 0 10px;
}


.cash_title {
  width: 100%;
  height: 50px;
  background: #FFFFFF;
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.09);
  border-radius: 10px;
  display: flex;
  text-align: center;
  line-height: 50px;
  font-size: 13px;
  color: #666;
}

.cash_title .type {
  width: 100px;
}

.cash_title .amount {
  flex: 1;
}

.cash_list {
  padding-top: 10px
}

.cash_item {
  height: 54px;
  font-size: 12px;

  line-height: 27px;
  display: flex;
  text-align: center;

  background: #fff;
  color: #333;
  border-bottom: 1px solid #ddd;
}

.cash_item .type {
  width: 100px;
}

.cash_item .amount {
  line-height: 54px;
  flex: 1;
}
</style>
