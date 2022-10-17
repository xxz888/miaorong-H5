<template>
  <div class="home">
    <van-nav-bar class=" " style="background: none;" :border='false' title="收益中心"
                 @click-left="onClickLeft" />
    <div class="warpper_top"></div>






    <div>
      <div class=" ">



    <div class="titleBg">
      <div class="flex jc-sb">
        <div class="ml-16">
          <div class="ketixian">可提现(元)</div>
          <div class="ketixianjine"> {{ userAccount.currentBalance |toFixed }}</div>
        </div>

        <div class="shouyiguize fcc mt-30 mr-10" @click="withdraw()">
          立即提现
        </div>
      </div>
      <div class="flex ml-16 mt-20">
        <div class="shouyi ml-16">当日收益(元): {{+  userAccount.todayTotal | toFixed   }}</div>
        <div class="shouyi ml-16">当月收益(元): {{ +  userAccount.curMonthTotal | toFixed   }}</div>
      </div>
    </div>

 


   <div class="profit_home_cont_box">
        <div class="profit_home_cont">
          <ul>
            <li class="item" @click="next('profitUser',1)">
              <img
                class="img60"
                src="../../assets/profit/组 17899@2x.png"
                alt=""
              />
              <p class="mt-25">我的直推</p>
            </li>

            <li class="item" @click="next('profitType',2)">
              <img
                class="img60"
                src="../../assets/profit/组 17898@2x.png"
                alt=""
              />
              <p class="mt-25">刷卡分润</p>
            </li>
            <li class="item" @click="next('profitType',12)">
              <img
                class="img60"
                src="../../assets/profit/组 17897@2x.png"
                alt=""
              />
              <p class="mt-25">还款分润</p>
            </li>




            <li class="item" @click="next('profitType',333)">
              <img
                class="img60"
                src="../../assets/profit/组 17903@2x.png"
                alt=""
              />
              <p class="mt-25">平级收益</p>
            </li>
            
            <li class="item" @click="next('profitType',444)">
              <img
                class="img60"
                src="../../assets/profit/组 17902@2x.png"
                alt=""
              />
              <p class="mt-25">自用返现</p>
            </li>


          <li class="item" @click="next('profitType',555)">
              <img src="../../assets/profit/组 17901@2x.png" class="img60" alt="">
              <p class="mt-25">绑卡收益</p>
            </li> 


            



       

            <!-- <li class="item" @click="next('profitType',3,'空卡')">
              <img
                class="img60"
                src="../../assets/profit/组 17846@2x.png"
                alt=""
              />
              <p class="mt-25">空卡分润</p>
            </li> -->

            <!-- <li class="item" @click="next('profitCashback',10)">
              <img src="../../assets/profit/vipcommission.png" alt="">
              <p>直推首还奖</p>
            </li>
            <li class="item" @click="next('profitCashback',0)">
              <img src="../../assets/profit/standard_subsidy_icon.png" alt="">
              <p>直推激活奖</p>
            </li>
            <li class="item" @click="next('profitType',3)">
              <img src="../../assets/profit/subsidy.png" alt="">
              <p>平级管理奖</p>
            </li> -->

            <li class="item" @click="next('profitType',666)">
              <img
                class="img60"
                src="../../assets/profit/组 17904@2x.png"
                alt=""
              />
              <p class="mt-25">激活收益</p>
            </li>
            <li
              class="item"
              @click="next('profitRecord',userAccount.totalPay)"
            >
              <img
                class="img60"
                src="../../assets/profit/组 17905@2x.png"
                alt=""
              />
              <p class="mt-25">提现记录</p>
            </li>
            <!-- <li class="item" @click="next('profitUser',1)">
              <img src="../../assets/profit/user_icon.png" alt="">
              <p>我的直推</p>
            </li> -->
            <!-- <li class="item" @click="next('shouyiguize', 22)">
              <img src="../../assets/profit/rule_icon.png" alt="">
              <p>收益规则</p>
            </li> -->
            <li class="item" @click="next('profitType',777)">
              <img
                class="img60"
                src="../../assets/profit/组 17906@2x.png"
                alt=""
              />
              <p class="mt-25">笔数收益</p>
            </li>

            
          </ul>
        </div>
      </div>
</div>
</div>
































    <!-- <div>
      <div class="profit_home_top theme_bg">
        <div class="item">
          <div class="userAvatar">
            <img class='appLogo' 
                 src="../../assets/agent/img_icon.png" alt=""/>
        
          </div>
          <div class="userdata">
            <p>{{ user.nickname }}</p>
            <p class="userid">ID： {{ user.userid }}</p>
          </div>
        </div>
        <div class="item">
          <div class="schedule">
            <h3>{{ userAccount.totalBalance | toFixed }}</h3>
            <p class="allRebate">累计总收益（元）</p>
          </div>
        </div>
        <div class="item item_view">
          <div class="right_border">
            <p>{{ userAccount.curMonthTotal |toFixed }}</p>
            <p class="userid">当月收益（元）</p>
          </div>
          <div class="right_border">
            <p>{{ userAccount.todayTotal |toFixed }}</p>
            <p class="userid">当日收益（元）</p>
          </div>
          <div>
            <p>{{ userAccount.currentBalance |toFixed }}</p>
            <p class="userid">可提现金额（元）</p>
          </div>
        </div>
        <div class="item">
          <div class="withdrawal " @click="withdraw()">立即提现</div>
        </div>
      </div>
      <div class="profit_home_cont_box">
        <div class="profit_home_cont">
          <ul>
            <li class="item" @click="next('profitCashback',1)">
              <img src="../../assets/profit/bonus_icon.png" alt="">
              <p>自用返现</p>
            </li>
            <li class="item" @click="next('profitType',12)">
              <img src="../../assets/profit/repayment_icon.png" alt="">
              <p>还款分润</p>
            </li>
            <li class="item" @click="next('profitType',2)">
              <img src="../../assets/profit/slotcard_icon.png" alt="">
              <p>刷卡分润</p>
            </li>
            <li class="item" @click="next('profitCashback',10)">
              <img src="../../assets/profit/vipcommission.png" alt="">
              <p>直推首还奖</p>
            </li>
            <li class="item" @click="next('profitCashback',0)">
              <img src="../../assets/profit/standard_subsidy_icon.png" alt="">
              <p>直推激活奖</p>
            </li>
         
            <li class="item" @click="next('profitRecord',userAccount.totalPay)">
              <img src="../../assets/profit/withdrawal_icon.png" alt="">
              <p>提现记录</p>
            </li>
            <li class="item" @click="next('profitUser',1)">
              <img src="../../assets/profit/user_icon.png" alt="">
              <p>我的直推</p>
            </li>
               <li class="item" @click="next('profitType',3)">
              <img src="../../assets/profit/subsidy.png" alt="">
              <p>平级管理奖</p>
            </li>
            <li class="item" @click="next('shouyiguize', 22)">
              <img src="../../assets/profit/rule_icon.png" alt="">
              <p>收益规则</p>
            </li>
          </ul>
        </div>
      </div>
    </div> -->
    <tabbar></tabbar>
  </div>
</template>

<script>
import tabbar from '@/components/tabbar'
import {
  NavBar,
  PullRefresh,
  Icon
} from 'vant';
import {
  newsQuery,
  getMessage
} from '@/api/showBrand'
import {
  getAccountQuery, getSumrebater, userInfoQuery, getUserHead
} from "@/api/user";

export default {
  data() {
    return {
      brandId: localStorage.getItem('brandId'),
      userId: localStorage.getItem('userId'),
      token: localStorage.getItem('token'),
      phone: localStorage.getItem('phone'),
      isLoading: false,
      fuwuList: [],
      balance: 0,
      userAvatar: '',
      allRebate: 0,
      user: {},
      userAccount: {
        curMonthTotal:0,
        todayTotal:0
      },
    };
  },
  components: {
    tabbar,
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [Icon.name]: Icon
  },
  created() {
    this._newsQuery()
    this._getAccountQuery()
    this.getUserHeader()
    this._userInfoQuery()
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    //--------查询用户留言-----------
    _getMessage() {
      getMessage(this.userId).then(res => {

      })
    },
    _newsQuery() {
      newsQuery(this.global.brandId, '功能跳转').then(res => {
        if (res.resp_code == '000000') {
          this.fuwuList = res.result.content
        }
      })
    },
    _getAccountQuery() {
      getAccountQuery().then(res => {
        if (res.resp_code == '000000') {
          this.userAccount = res.result
        }
      })
    },
    withdraw() {
      if(this.user.realnameStatus != '1'){
        this.$dialog.confirm({
          title: '温馨提示',
          message: '您的账号未实名，为了保证正常使用功能请进行实名！',
          confirmButtonText: '去实名',
          cancelButtonText: '暂不实名'
        }).then(() => {
          this.$router.push({name: "faceRecognitionDetail"});
        })
      }else{
        this.$router.push({name: 'withdraw', params: {item: {}}})
      }
    },
    next(path, type) {
      this.$router.push({name: path, params: {type : type}});
    },
    link(item) {
      let num = 0
      this.fuwuList.map((key) => {
        if (key.title == item) {
          var url = key.content
          this.$router.push({
            name: 'appLink',
            params: {
              url: JSON.stringify(url),
              title: JSON.stringify(key.title),
              type: "2"
            }
          });
          return
        } else {
          num++
        }
      })
      if (num == this.fuwuList.length) {
        this.$toast({
          message: '敬请期待',
          position: 'bottom'
        })
      }
    },
       showMsg1(){
      this.$toast({message: '敬请期待', position: 'bottom'})
    },
    _userInfoQuery() {
      userInfoQuery(this.token).then(res => {
        if (res.resp_code == '000000') {
          this.user = res.result
        }
      })
    },
    // 获取用户头像
    getUserHeader() {
      getUserHead(this.phone, this.global.brandId).then(res => {
        if (res.resp_code == '000000') {
          this.userAvatar = res.result
        }
      })
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
.home {
  height: 100vh;
  background: #F9FAFE;
}
.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.agent_nav >>> .van-icon {
  color: #FFFFFF !important;
}

.profit_home_top {
  width: 100%;
  padding: 10px 17px;
  font-size: 15px;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding-bottom: 50px;
}

.home_box {

}

.profit_home_top .item {
  display: flex;
  padding-bottom: 15px;
}

.item > .userAvatar {
  flex: 1;
}

.item > .userdata {
  padding-top: 5px;
  flex: 4;
  font-size: 14px;
}

.userid {
  font-size: 12px;
  margin-top: 5px;
  color: rgb(241, 223, 119);
}

.profit_home_top .item .title {
  font-size: 13px;
  line-height: 30px;
  font-weight: 300;
}

.profit_home_top .item .amount {
  font-size: 32px;
}

.profit_home_top .item .profit_amount {
  font-size: 20px;
}

.profit_home_top .item .right {
  position: relative;
}

.profit_home_top .item .right .btn {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

.profit_home_top .item .right .btn span {
  display: inline-block;
  border-radius: 13px;
  font-size: 15px;
}

.withdrawal {
  background: #65D385;
  margin-right: 10px;
  margin: 0px auto;
  width: 200px;
  height: 35px;
  border-radius: 5px;
  line-height: 35px;
  text-align: center;

}

.profit_home_top .item .right .btn .makeup {
  border: 1px solid #FFFFFF;
  padding: 2px 9px;
}

.profit_home_cont {
  width: 330px;
  margin: 0px auto 0px auto;
  border-radius: 5px;
  background: #fff;
}

.profit_home_cont_box {
  margin-top: 16px;
  margin-left: 16px;
  width: calc(100% - 32px);
  background: #fff;
  border-radius: 10px;
}

.profit_home_cont .title {
  font-size: 14px;
  color: #333;
}

.profit_home_cont .title > img {
  height: 11px;
  width: 18px;
  vertical-align: middle;
}

.profit_home_cont .title span {
  vertical-align: middle;
  padding-left: 5px;
}

.profit_home_cont > ul {
  padding: 20px 0;
  display: flex;
  flex-wrap: wrap;
}

.profit_home_cont .item {
  width: 33%;
  text-align: center;
  margin: 15px 0px;
  position: relative;
}

.profit_home_cont .item > img {
  /* width: 30px; */
}

.profit_home_cont .item > p {
  font-size: 12px;
  color: #333;
  width: 100%;
  text-align: center;
  position: absolute;
  top: 40px;
  bottom: 0;
}

.item_view div {
  font-size: 16px;
  text-align: center;
  flex: 1;
}

.appLogo {
  height: 55px;
  width: 55px;
  border-radius: 50%;
}

.schedule {
  color: #fff;
  background: url('../../assets/profit/schedule.png') no-repeat;
  background-size: 100%;
  width: 200px;
  height: 110px;
  margin: 0px auto;
  text-align: center;
  padding-top: 65px;
}

.allRebate {
  margin-top: 5px;
  font-size: 13px;
}

.btnClass {
  margin-top: -10px;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-left: 16px;
  width: calc(100% - 32px);
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}
.titleBg {
  margin-left: 16px;
  width: calc(100% - 32px);
  height: 150px;
  background: url("../../assets/profit/组 17900@2x.png") no-repeat;
  background-size: cover;
  border-radius: 15px;
}
.ketixian {
  margin-top: 16px;
  margin-left: 16px;
  height: 19px;
  font-size: 13px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 17px;
  color: #ffffff;
  opacity: 0.8;
}
.ketixianjine {
  margin-top: 7px;
  margin-left: 16px;
  height: 36px;
  font-size: 30px;
  font-family: DIN-Bold;
  line-height: 35px;
  color: #ffffff;
  opacity: 1;
}
.shouyiguize {
 width: 106px;
height: 33px;
color: #30AEFB;
background: rgba(255,255,255,1); 
  border-radius: 24px;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  opacity: 1;
}
.shouyi {
  font-size: 13px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 14px;
  color: #ffffff;
  opacity: 0.8;
}
.lijitixian {
  width: 163px;
  height: 44px;
  background: linear-gradient(180deg, #da8cdc 0%, #ad53af 100%);
  opacity: 1;
  border-radius: 24px;

  font-size: 15px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 14px;
  color: #ffffff;
  opacity: 1;
}

.mibu {
  width: 163px;
  height: 44px;
  border: 1px solid #9b3c9d;
  opacity: 1;
  border-radius: 24px;

  font-size: 15px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 14px;
  color: #9b3c9d;
  opacity: 1;
}

.img60 {
  width: 60px;
  height: 60px;
}
</style>
