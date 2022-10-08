<template>
  <div>
    <van-nav-bar title="信用卡还款" class="agent_nav theme_bg" left-arrow @click-left="onClickLeft"
                 @click-right="onClickRight" />
    <div class="warpper">
      <van-row type="flex" justify="space-between" class="color_999 add_card ">
        <ul class="card_rate" v-if="!empowerToken">
          <li>
            <span class="theme_color">·</span>
            费率：0.85%（每1万元85元手续费）
          </li>
          <li>
            <span class="theme_color">·</span>
            您是 <span style="color: #F5552A">{{ level.levelName }}</span>用户，每还款1万元可以返<span style="color: #F5552A"> {{ handleFan(85) }}</span>元
          </li>
        </ul>
        <ul class="card_rate" v-else>
          <van-button class="recode_btn theme_btn" @click.native="goRecode()" round type="primary">还款记录</van-button>
        </ul>
      </van-row>
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height="45">
        <div class="card_box">
          <div class="card_item" v-for="item in cardList" :key="item.key">
            <div class="van-hairline--bottom card_item_top_box">
              <van-row type="flex" class="card_item_top" justify="space-between">
                <van-col span='3'>
                  <div class="card_icon_box">
                    <img class="card_icon" :src="require('../../assets/bankIcon/BANK_'+item.logimg+'.png')"/>
                  </div>
                </van-col>
                <van-col span="16">
                  <div class="color_222 card_bank_name van-ellipsis">
                    {{ item.bankName }} &nbsp;
                    <span class="color_999">({{ item.cardNo |cardNoEnd }})
                      <span class="size">&nbsp;额度：{{ item.creditBlance }}</span>
                    </span>
                  </div>
                  <div class="card_type color_999">
                    账单日 每月{{ item.billDay }}日｜还款日 每月{{ item.repaymentDay }}日
                  </div>
                </van-col>
              </van-row>
            </div>
            <van-row v-if="!item.balancePlan" type="flex" justify="space-between" class="plan_detail_box color_666">
              <van-col span="12" class="plan_detail">
                请及时设置本月还款计划
              </van-col>
              <van-col span="12">
                <van-button class="bank_btn theme_btn" @click.native="isuserable(item,'madePlan',$event)" round type="primary">
                  制定计划
                </van-button>
              </van-col>
            </van-row>

            <van-row v-else-if="item.balancePlan"
                     type="flex" justify="space-between" class="plan_detail_box " @click.native="detail(item)">
              <van-col span="16" class="plan_detail  color_666">
                <div> 请等待
                  已还款<span>{{ item.balancePlan.repaymentedAmount }}</span>元
                </div>
              </van-col>
              <van-col span="7">
                <span class="plan_status  two">计划详情</span>
                <z-circle class="circle_box"
                          :percentage="Math.ceil((item.balancePlan.repaymentedAmount/item.balancePlan.taskAmount)*100)" />
              </van-col>
            </van-row>

            <van-row v-else-if="item.planType==2" type="flex" justify="space-between" class="plan_detail_box color_666">
              <van-col span="12" class="plan_detail">
                已制定本月还款计划
              </van-col>
              <van-col span="12">
                <van-button class="bank_btn" round type="info">制定计划</van-button>
              </van-col>
            </van-row>
          </div>
          <nocard v-if="cardList.length==0"></nocard>
        </div>
      </van-pull-refresh>
      <div class="add_btn theme-linear-bg" @click="addCard()">
        <van-icon name="add-o"/>
        <span>添加信用卡</span>
      </div>
      <van-popup
        v-model="helpTrueFalseBy"
        position="right" class="help">
        <div class="help_box">
          <ul>
            <li class="help_item van-hairline--bottom" @click="help">
              <img src="../../assets/help_icon.png" alt="">
              <span>使用说明</span>
            </li>
            <li class="help_item" @click="goDetail">
              <img src="../../assets/plan_icon.png" alt="">
              <span>交易记录</span>
            </li>
            <li class="help_item" @click="getcard">
              <img src="../../assets/refresh_icon.png" alt="">
              <span>点击刷新</span>
            </li>
          </ul>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import {repaymentOrderQuery, getPlanNew} from "@/api/bill";
import {
  NavBar,
  Tab,
  Tabs,
  PullRefresh,
  Row,
  Col,
  Icon,
  SwipeCell,
  Button,
  Popup,
} from "vant";
import {
  cardQuery,
  bankIconQuery
} from "@/api/card/card";
import nocard from "@/components/nodata/nodata";
import ZCircle from "@/components/circle/circle";
import {getLevel} from "@/api/user";
import listener from "@/api/vueListener"

export default {
  data() {
    return {
      yaer: '',
      active: 0,
      isLoading: false,
      count: 0,
      user_id: localStorage.getItem("userId"),
      token: localStorage.getItem("token"),
      empowerToken: null,
      cardList: [],
      currentdate: "", //当天日期
      year: "",
      timeDay: "", //当月天数
      uppermonth: "", //上月月份
      month: "", //当月月份
      nextmonth: "", //下月月份
      day: "", //当天
      monthDay: "",
      bankIconList: [],
      type: "h5",
      typetow: 2,
      helpTrueFalseBy: false,
      hphone: {},
      cardHelpUrl: "",
      monthe: "",
      payList: [],
      size: 20,
      idcard: '',
      level: {}
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [PullRefresh.name]: PullRefresh,
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [SwipeCell.name]: SwipeCell,
    [Button.name]: Button,
    nocard,
    ZCircle,
    [Popup.name]: Popup
  },
  created() {
    if(this.$route.query.empowerToken){
      this.empowerToken = this.$route.query.empowerToken
    }else{
      this.empowerToken = null
    }
    listener.$on('empowerToken', data => {
      if (data) {
        this.empowerToken = data
        listener.$emit('empowerToken', null)
      }
    })
    this.getUserLevel()
    this.getcard()
    this.getbankIcon()
    this.getNowFormatDate()
    this.mGetDate(this.year, this.month)
    this.getnextmonth(Number(this.timeDay - this.day) + 1)
    this.getuppermonth(Number(-this.day))
  },

  methods: {
    getUserLevel(){
      getLevel().then(res => {
        if(res.resp_code == '000000'){
          this.level = res.result
        }
      })
    },
    handleFan(type){
      if(this.level.diffRate){
        return (type-this.level.diffRate.settle*10000).toFixed(0)
      }else{
        return 0
      }
    },
    getUrlParam(name) {
      //截取url参数
      var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
      if (reg.test(location.href))
        return unescape(RegExp.$2.replace(/\+/g, " "));
    },
    onClickLeft() {
      this.publicJs.back()
    },
    onClickRight() {
      this.helpTrueFalseBy = true
    },
    getuppermonth(dates) {
      //获取上个月月份
      var dd = new Date();
      var n = dates || 0;
      dd.setDate(dd.getDate() + n);
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1;
      var d = dd.getDate();
      m = m < 10 ? "0" + m : m;
      d = d < 10 ? "0" + d : d;
      this.uppermonth = m;
      return this.uppermonth;
    },
    getnextmonth(dates) {
      //获取下个月月份
      var dd = new Date();
      var n = dates || 0;
      dd.setDate(dd.getDate() + n);
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1;
      var d = dd.getDate();
      m = m < 10 ? "0" + m : m;
      d = d < 10 ? "0" + d : d;
      this.nextmonth = m;
      return this.nextmonth;
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      this.currentdate = strDate;
      this.year = date.getFullYear();
      this.month = month;
      this.day = strDate;
      this.monthDay = this.month + "-" + this.day;
    },
    mGetDate(year, month) {
      //获取当月的天数
      var d = new Date(year, month, 0);
      this.timeDay = d.getDate();
      return d.getDate();
    },
    amount(item) {
      return Math.ceil((item.successAmount / item.allAmount) * 100);
    },
    addCard() {
      this.$router.push({name: "debitCardAdd", query: {empowerToken: this.empowerToken}});
    },
    getbankIcon() {
      bankIconQuery().then(icon => {
        if (icon.resp_code == "000000") {
          this.bankIconList = icon.result;
        }
      });
    },
    getcard() {

      //查询信用卡
      this.helpTrueFalseBy = false
      //从中介代还进来的路由会带身份证号
      cardQuery({token: this.empowerToken}).then(res => {
        this.cardList = [];
        if (res.resp_code == "000000") {
          res.result.forEach(item => {
            if (item.repaymentDay > item.billDay) {
              // alert(2)
              if (this.day <= item.repaymentDay) {
                item.billDaymonth = this.month;
                item.repaymentDaymonth = this.month;
              } else if (this.day > item.repaymentDay) {
                item.billDaymonth = this.nextmonth;
                item.repaymentDaymonth = this.nextmonth;
              }
            } else if (item.repaymentDay < item.billDay) {
              if (this.day >= item.billDay) {
                item.billDaymonth = this.month;
                item.repaymentDaymonth = this.nextmonth;
              } else if (
                this.day > item.repaymentDay &&
                this.day < item.billDay
              ) {
                item.billDaymonth = this.month;
                item.repaymentDaymonth = this.nextmonth;
              } else if (this.day <= item.repaymentDay) {
                item.billDaymonth = this.uppermonth;
                item.repaymentDaymonth = this.month;
              }
            } else if (item.repaymentDay == item.billDay) {
              if (this.day < item.repaymentDay) {
                item.billDaymonth = this.uppermonth
                item.repaymentDaymonth = this.month

              } else if (this.day > item.repaymentDay) {
                item.billDaymonth = this.month
                item.repaymentDaymonth = this.nextmonth
              }
            }
            for (var j = 0; j < this.bankIconList.length; j++) {
              if (item.bankName == this.bankIconList[j].bank_name) {
                item.logimg = this.bankIconList[j].bank_acronym;
                item.background = this.bankIconList[j].background;
                break;
              } else {
                item.background = "#232528";
                item.logimg = "default";
              }
            }
            this.$nextTick(() => {
              this.cardList.push(item)
            });
          });
        }
      })
    },
    goRecode(){
      this.$router.push({name: "bill", query: {empowerToken: this.empowerToken}});
    },
    goDetail() {
      this.$router.push({
        path: "/bill",
        query: {
          'phone': this.phone,
          'token': localStorage.getItem('token'),
          'brandId': this.brand_id,
          'userId': this.user_id,
          'ip': this.global.ip,
          'type': 'h5',
          'deviceId': localStorage.getItem('deviceId'),
          'billtype': "2"
        }
      })
    },
    detail(items) {  //跳转详情页
      if (items.planType == 3) {
        this.yaer = items.planCreateTime.substring(0, 4)
        this.monthe = items.planCreateTime.substring(5, 7)
        repaymentOrderQuery(items.brandId, items.userId, this.yaer, this.monthe, this.typetow, this.size).then(res => {
          if (res.resp_code == "000000") {
            for (let i = 0; i < res.result.content.length; i++) {
              if (items.cardNo == res.result.content[i].creditCardNumber) {
                if (items.planCreateTime.substring(8, 10) == res.result.content[i].createTime.substring(8, 10)) {
                  this.payList.push(res.result.content[i])
                }
              }
            }
            this.$router.push({
              name: 'executeTask',
              params: {
                item: JSON.stringify(this.payList[0]),
                type: JSON.stringify(this.typetow)
              }
            })
          }
        });
      } else if (items.balancePlan) {
        this.$store.commit('Loading')
        getPlanNew({planId: items.balancePlan.id, empowerToken: this.empowerToken}).then(res => {
          this.$store.commit('closeLoading')
          if (res.resp_code == '000000') {
            this.$router.push({
              name: 'executeTaskNew',
              params: {item: JSON.stringify(items), task: JSON.stringify(res.result)},
              query: {empowerToken: this.empowerToken}
            });
          }
        })
      }
    },
    isuserable(item, type, event) {
      event.cancelBubble = true;
      if (item.repaymentDay == 0 || item.billDay == 0) {
        this.$dialog.confirm({
            title: "温馨提示",
            message: "请先去设置还款日账单日"
          }).then(() => {
            this._router(item, 'updateCard')
          });
        return;
      }

      if (type == 'taskBill') {
        this.gettaskbill(item, type)
      } else {
        this._router(item, type)
      }
    },
    _router(item, type) {
      this.$router.push({
        name: type,
        query: {empowerToken: this.empowerToken},
        params: {item: JSON.stringify(item)}
      })
    },
    help() {
      let num = 0
      this.fuwuList.map((key) => {
        if (key.title == '信用卡还款使用说明') {
          var url = key.content + '?phone=' + this.phone + '&token=' + this.token + '&brandId=' + this.global.brandId + '&userId=' + this.userId + '&ip=' + this.global.ip + '&deviceId=' + localStorage.getItem('kd_webapp_deviceId')
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

    //URL解码
    jqueryUrl(url) {
      return '';
    },
    onRefresh() {
      setTimeout(() => {
        this.$toast("刷新成功");
        this.isLoading = false;
        this.getcard();
      }, 300);
    },
    Refresh() {
      setTimeout(() => {
        this.isLoading = false;
        this.getcard();
      }, 300);
    },
  }
};
</script>
<style scoped>
.card_box {
  padding: 10px 15px 50px 15px;
}

.card_item {
  /* height: 158px; */
  background: rgba(255, 255, 255, 1);
  /* box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.3); */
  border-radius: 12px;
  margin-bottom: 10px;
  padding: 10px 15px;
  font-size: 14px;
}

.card_icon_box {
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  position: relative;
  margin-right: 10px;
}

.card_icon {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background: #fff;
  margin-top: 2px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}

.card_bank_name {
  padding-top: 5px;
}

.card_type {
  font-size: 12px;
}

.card_item_top_box {
  padding-bottom: 10px;
}

.bank_btn {
  height: 27px;
  border: none;
  line-height: 27px;
  font-size: 13px;
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
}

.recode_btn {
  height: 27px;
  border: none;
  line-height: 27px;
  font-size: 13px;
  float: right
}

.circle_box {
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
}

.plan_detail_box {
  line-height: 40px;
  position: relative;
}

.plan_detail {
  font-size: 14px;
}

.add_card {
  font-size: 13px;
  padding: 10px 10px 0 15px;
}

.card_rate {
  background: #fff;
  width: 100%;
  padding: 10px 15px;
  border-radius: 10px;
  line-height: 20px;
}

.card_rate li > span {
  font-weight: 500;
  font-size: 14px;
  padding-right: 5px;

}

.add_card .right {
  text-align: right;
}

.add_card .right span, .van-icon {
  vertical-align: middle;
}

.add_card .right span {
  padding-left: 5px;
}

.add_btn {
  color: #fff;
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 14px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}

.add_btn span {
  padding-left: 5px;
}

.plan_status.two {
  color: rgb(248, 153, 67);
}

.help_box {
  font-size: 14px;
  padding: 10px 15px;

}

.help_item {
  padding: 10px 0;
}

.help_item img {
  height: 20px;
  width: 20px;
  vertical-align: middle;
  margin-right: 10px;
}

.help_item span {
  vertical-align: middle;
}

.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.agent_nav >>> .van-icon {
  color: #FFFFFF !important;
}

.aliW {
  height: 60px;
  color: #fff;
  background: #ff3735;
  text-align: center;
  line-height: 60px;
  font-size: 28px;
  position: fixed;
  bottom: 0;
  width: 100%;
}

.size {
  font-size: 12px;
}

</style>
