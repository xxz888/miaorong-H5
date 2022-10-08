<template>
  <div>
    <van-nav-bar title="空卡还款" left-arrow @click-left="onClickLeft" right-text="使用说明" @click-right="help">
    </van-nav-bar>
    <div class="warpper">
      <van-row type="flex" justify="space-between" class="color_999 add_card ">
        <ul class="card_rate">
          <li>
            <span class="theme_color">·</span>费率：1.25%（每1万元125元手续费）
          </li>
          <li>
            <span class="theme_color">·</span>每还款一笔，立返当前金额千分之1的现金
          </li>
        </ul>
      </van-row>
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height="45">
        <div class="card_box">
          <div class="card_item" v-for="item in cardList" :key="item.key">
            <div class="van-hairline--bottom card_item_top_box">
              <van-row type="flex" class="card_item_top" justify="space-between">
                <van-col span="3">
                  <div class="card_icon_box">
                    <img class="card_icon" alt="银行logo"
                         :src="require('../../assets/bankIcon/BANK_'+item.logimg+'.png')">
                  </div>
                </van-col>
                <van-col span="15">
                  <div class="color_222 card_bank_name van-ellipsis">
                    {{ item.bankName }} &nbsp;
                    <span class="color_999">({{ item.cardNo |cardNoEnd }})</span>
                  </div>
                  <div class="card_type color_999">
                    账单日 每月{{ item.billDay }}日｜还款日 每月{{ item.repaymentDay }}日
                  </div>
                </van-col>
                <van-col span="4" class="card_right" @click="carddel(item)">
                  <div class="color_222 card_bank_name">
                    <van-icon name="cross" class="card_arrow_icon color_999"/>
                  </div>
                </van-col>
              </van-row>
            </div>
            <!--没有计划时 -->
            <van-row
              v-if="!item.hasWaitingEmptyOrder && item.allAmount==0 && item.repaymentModel!=1 && !item.balanceAllAmount"
              type="flex" justify="space-between" class="plan_detail_box color_666">
              <van-col span="12" class="plan_detail">
                请及时设置本月还款计划
              </van-col>
              <van-col span="12">
                <van-button class="bank_btn" v-if='!item.hasWaitingEmptyOrder'
                            @click.native="isuserable(item,'zeroPlan',$event)" round type="primary">制定计划
                </van-button>
              </van-col>
            </van-row>

            <!--有计划时 -->
            <van-row v-if="item.hasWaitingEmptyOrder" type="flex" justify="space-between"
                     class="plan_detail_box color_666">
              <van-col span='12' v-if="item.emptyCardPlanStatus!=3">
                <van-button class="bank_btn" v-if="item.emptyCardPlanStatus==1" @click.native="detail(item)" round
                            type="primary">审核中
                </van-button>
                <van-button class="bank_btn" v-else-if="item.emptyCardPlanStatus==4||item.emptyCardPlanStatus==5 "
                            @click.native="detail(item)" round type="primary">暂停中
                </van-button>
                <van-button class="bank_btn" v-if="item.emptyCardPlanStatus==6" @click.native="detail(item)" round
                            type="primary">已完成
                </van-button>
                <van-button class="bank_btn" v-else-if="item.emptyCardPlanStatus==7" round type="info">退还手续费中
                </van-button>
                <div>请您稍作等待</div>
              </van-col>
              <van-col span="12" v-else-if="item.emptyCardPlanStatus==3 ||item.emptyCardPlanStatus==2"
                       @click.native="detail(item)">
                <div>
                  计划正在进行中
                </div>
                <span class="plan_status  two">计划详情</span>
                <z-circle class="circle_box"
                          :percentage="Math.ceil((item.successAmount/item.allAmount)*100)" />
              </van-col>
            </van-row>

            <!--余额还款有计划时 -->
            <van-row v-else-if="(item.planType==1||item.planType==3) && (item.allAmount!=0 || item.balanceAllAmount)"
                     type="flex" justify="space-between" class="plan_detail_box color_666">
              <van-col span="12" class="plan_detail">
                已制定本月还款计划
              </van-col>
              <van-col span="12">
                <van-button class="bank_btn" round type="info">制定计划</van-button>
              </van-col>
            </van-row>
          </div>
          <nocard v-if="cardList.length==0" />
        </div>
      </van-pull-refresh>
      <div class="add_btn theme-linear-bg" @click="addCard()">
        <van-icon name="add-o"/>
        <span>添加信用卡</span>
      </div>
      <van-popup v-model="helpTrueFalseBy" position="right" class="help">
      </van-popup>
    </div>
  </div>
</template>
<script>
import {NavBar, Tab, Tabs, PullRefresh, Row, Col, Icon, SwipeCell, Button, Popup,} from "vant";
import {cardQuery, bankDel, userBankAndNature, cardDefault, bankIconQuery} from "@/api/card/card";
import {newsQuery} from '@/api/showBrand'
import {creditcardPlanListTwo} from "@/api/plan/plan";
import nocard from "@/components/nodata/nodata";
import ZCircle from "@/components/circle/circle";
import {checkOrder} from "@/api/zero";


export default {
  data() {
    return {
      yaer: '',
      monthe: '',
      size: 20,
      payList: [],
      typetow: 3,
      active: 0,
      isLoading: false,
      count: 0,
      user_id: localStorage.getItem("userId"),
      token: localStorage.getItem("token"),
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
      helpTrueFalseBy: false,
      authorityList: {
        result: {
          bankCard: "",
          bankName: "",
          channelTag: "",
          confirmSmsUrl: "",
          expiredTime: "",
          getSmsUrl: "",
          getSmsUrlNew: "",
          idCard: "",
          ipAddress: "",
          phone: "",
          securityCode: "",
          userName: ""
        },
        fuwuList: []
      },
      orderCode: "",//验证码获取之后返回
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
    [Popup.name]: Popup,
    // verification
  },
  computed: {},
  created() {
    window.getcard = this.getcard
    this.getcard()
    var url = window.location.href;
    this.getbankIcon();
    this.getNowFormatDate();
    this.mGetDate(this.year, this.month);

    this.getnextmonth(Number(this.timeDay - this.day) + 1);
    this.getuppermonth(Number(-this.day));
    this.getcard()
  },
  methods: {
    getUrlParam(name) {
      //截取url参数
      var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
      if (reg.test(location.href))
        return unescape(RegExp.$2.replace(/\+/g, " "));
    },
    onClickLeft() {
      if (this.type == "h5") {
        this.$router.push({name: "home"});//首页
      } else {
        try {
          window.android.invokeMethod(7, ["true"]);
        } catch (e) {
          window.webkit.messageHandlers.iosWebKit.postMessage('goroothome');
        }
      }
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
    tabSwitch(name, titile) {
      this.active = name;
      if (name == 0) {
        this.getcard();
      } else {
        this.getDebitCard();
      }
    },
    amount(item) {
      return Math.ceil((item.successAmount / item.allAmount) * 100);
    },
    addCard() {
      if (localStorage.getItem('realnameStatus') != 1 && localStorage.getItem('realnameStatus') != null) {
        this.$dialog.confirm({
          title: '温馨提示',
          message: '您的账号未实名，为了保证正常使用功能请进行实名！',
          confirmButtonText: '去实名',
          cancelButtonText: '暂不实名'
        }).then(() => {
          this.$router.push({name: "faceRecognitionDetail"});
        })
      } else {
        if (this.active == 0) {
          this.$router.push({name: "debitCardAdd"});
        } else {
          this.$router.push({name: "depositCardAdd"});
        }
      }
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
      cardQuery(this.user_id).then(res => {
        this.cardList = [];
        if (res.resp_code == "000000") {
          res.result.forEach(item => {
            if (item.repaymentDay > item.billDay) {
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
            })
          })
        }
      })
      this.getNews()
    },
    getDebitCard() {
      userBankAndNature(this.user_id, 2, 2, 0).then(res => {
        this.cardList = [];
        if (res.resp_code == "000000") {
          res.result.forEach(item => {
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
              this.cardList.push(item);
            })
          })
        }
      })
    },
    goDetail() {
      this.$router.push({
        path: "bill",
        query: {
          'phone': this.phone,
          'token': localStorage.getItem('token'),
          'brandId': this.brand_id,
          'userId': this.user_id,
          'ip': this.global.ip,
          'type': 'h5',
          'deviceId': localStorage.getItem('deviceId'),
          'billtype': "3"
        }
      });

    },
    detail(item) {
      //跳转详情页
      this.$store.commit('Loading')
      checkOrder(item.hasWaitingEmptyOrder).then(res => {
        this.$store.commit('closeLoading')
        if (res.resp_code == '000000') {
          this.$router.push({
            name: 'previewPlan',
            params: {item: JSON.stringify(item), task: JSON.stringify(res.result)}
          });
        }
      })
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
      this._router(item, type)
    },
    _router(item, type) {
      this.$router.push({
        name: type,
        params: {item: JSON.stringify(item)}
      });
    },
    gettaskbill(item, type) {
      creditcardPlanListTwo(item.userId, item.cardNo, 1).then(res => {
        if (res.resp_code == "000000") {
          if (res.result.content.length > 0) {
            if (res.result.content[0].taskStatus == 0 || res.result.content[0].taskStatus == 2) {
              this.$router.push({
                name: 'executeTask',
                params: {item: JSON.stringify(item), task: JSON.stringify(res.result.content[0])}
              })
            } else {
              this._router(item, type)
            }
          } else {
            this._router(item, type)
          }
        }
      })
    },
    carddel(item) {
      //删除银行卡
      this.$dialog.confirm({
        title: "信用卡解绑",
        message: "您确定要解绑尾号‘" + item.cardNo.substring(item.cardNo.length - 4, item.cardNo.length) + "’信用卡吗？"
      }).then(() => {
        bankDel(this.token, item.cardNo, item.type).then(res => {
          if (res.resp_code == "000000") {
            this.$notify({type: "primary", message: res.resp_message});
            if (this.active == 0) {
              this.getcard();
            } else {
              this.getDebitCard();
            }
          }
        })
      })
    },
    defaults(item) {
      cardDefault(this.token, item.cardNo).then(res => {
        if (res.resp_code == "000000") {
          this.$notify({type: "primary", message: res.resp_message});
          if (this.active == 0) {
            this.getcard();
          } else {
            this.getDebitCard();
          }
        }
      })
    },
    getNews() {
      newsQuery(this.global.brandId, '功能跳转').then(res => {
        if (res.resp_code == '000000') {
          this.fuwuList = res.result.content

        }
      })
    },

    help() {
      let num = 0
      this.fuwuList.map((key) => {
        if (key.title == '空卡使用说明') {
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


    toTishi() {
      this.$toast("您有空卡任务待审核，无法重复提交！");
    },
    onRefresh() {
      setTimeout(() => {
        this.$toast({message: "刷新成功", position: 'bottom'});
        this.isLoading = false;
        this.getcard();
      }, 300);
    }
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

.card_right {
  text-align: right;
}

.card_icon_box {
  width: 45px;
  height: 45px;
  overflow: hidden;
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

.card_creditBlance {
  font-size: 17px;
}

.card_bank_tips {
  font-size: 12px;
}

.card_cont {
  font-size: 13px;
  padding: 10px 0;
}

/* .card_cont span {
  font-size: 16px;
  color: #ff1d3b;
} */
.card_taskStatus1 {
  color: #35a7fd !important;

}

.card_taskStatus2 {
  color: #51c854 !important;
}

.card_taskStatus0 {
  color: #ffc107 !important;
}

.card_bottom {
  line-height: 25px;
}

.card_arrow_text {
  vertical-align: middle;
}

.card_arrow_icon {
  vertical-align: middle;
}

.card_del {
  height: 100%;
}

.card_item_top_box {
  padding-bottom: 10px;
}

.bank_date {
  font-size: 26px;
  font-weight: 500;
  line-height: 36px;
}

.bank_btn_box {
  position: relative;
}

.bank_btn {
  height: 27px;
  line-height: 27px;
  font-size: 13px;
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
}

.circle_box {
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
}

#addcard {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  position: fixed;
  background: url("../../assets/help.png") center no-repeat;
  background-size: 100% 100%;
  right: 5px;
  bottom: 60px;
  z-index: 500;
  text-align: center;
  font-size: 14px;
  color: #fff;
  padding: 10px 0;
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

.plan_status.one {
  color: #35CC20;
}

>>> .help.van-popup--right {
  top: 100px !important;
  right: 10px;
  border-radius: 10px;
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

</style>
