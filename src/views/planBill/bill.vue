<!-- 订单 -->
<template>
  <div class="bill">
    <van-nav-bar title="交易记录" left-text="" left-arrow @click-left="onClickLeft"/>
    <div class="wrapper">
      <div class="bill_top_bg"></div>
      <div class="bill_tab_box">
        <div class="bill_tab">
          <ul class="bill_tab_type van-hairline--bottom">
            <li class="item" v-if="!this.form.empowerToken" :class="type==1?'typeActive':''" @click="typeChange(1)">
              <img v-if="type==1"
                   src="../../assets/bill/quick_icon_on.png" alt="">
              <img v-else src="../../assets/bill/quick_icon_off.png"
                   alt="">
              <div>刷卡记录</div>
            </li>
            <li class="item" :class="type==2?'typeActive':''" @click="typeChange(2)">
              <img v-if="type==2"
                   src="../../assets/bill/creditcard_icon_on.png"
                   alt="">
              <img v-else
                   src="../../assets/bill/creditcard_icon_off.png"
                   alt="">
              <div>还款记录</div>
            </li>
          </ul>
          <van-dropdown-menu active-color="#30AEFB" class="menu">
            <van-dropdown-item v-model="yaer" :options="yearList" @change="dateChange"/>
            <van-dropdown-item v-model="month" :options="monthList" @change="dateChange"/>
          </van-dropdown-menu>
        </div>
      </div>
      <div class="bill_cont">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list v-model="isupLoading" :finished="finished" finished-text="" @load="onLoad">
            <ul class="pay_list" v-if="type==1 && quickList.length>0 ">
              <li class="pay_item" v-for="item in quickList" @click='detail(item,"quickDetail")' :key="item.key">
                <div class="pay_item_top van-hairline--bottom">
                  <div class="left">
                    <img
                      :src="require('../../assets/bankIcon/BANK_'+item.logimg+'.png')"/>
                  </div>
                  <div class="right">
                    <div class="pay_card_name">{{ item.bankName }} <span>（{{ item.debitBankCard |cardNoEnd }}）</span>
                    </div>
                    <div class="pay_card_amount"> 费率 <span>{{ Number(item.rate * 100) |toFixed }}%</span></div>
                  </div>
                  <div class="quick_status">
                    <div>{{ item.amount |toFixed }}元</div>
                    <div :class="'brushStatus'+item.orderStatus">{{ item.orderStatus |status }}</div>
                  </div>
                </div>
              </li>
            </ul>
            <ul class="pay_list" v-else-if="type==2&& payList.length>0 ">
              <li class="pay_item" v-for="item in payList" :key="item.key">
                <div>
                  <div class="pay_item_top van-hairline--bottom">
                    <div class="left">
                      <img
                        :src="require('../../assets/bankIcon/BANK_'+item.logimg+'.png')"/>
                    </div>
                    <div class="right">
                      <div class="pay_card_name">{{ item.bankName }}
                        <span>（{{item.creditCardNumber|cardNoEnd }}）</span>
                      </div>
                      <div class="pay_card_amount"> 已还 <span>{{ item.repaymentedAmount | toFixed }}元</span> | 总额
                        {{ item.taskAmount |toFixed }}元
                      </div>
                    </div>
                    <span class="pay_status" :class="'newTaskStatus'+item.status"><span
                      v-show='item.status==7 || item.status ==4'>计划</span>{{ item.status | balanceTaskStatus }}</span>
                  </div>
                  <div class="pay_item_detail" @click='detail(item,type,item.planType)'>
                    <div>{{ item.createTime }}</div>
                    <div class="right">
                      <span>查看详情</span>
                      <img src="../../assets/right_icon.png" alt="">
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <ul class="pay_list" v-else-if="type==3 && zeroPayList.length>0 ">    <!--空卡交易记录 -->
              <li class="pay_item" v-for="item in zeroPayList" :key="item.key">
                <div class="pay_item_top van-hairline--bottom">
                  <div class="left">
                    <img
                      :src="require('../../assets/bankIcon/BANK_'+item.logimg+'.png')"/>
                  </div>
                  <div class="right">
                    <div class="pay_card_name">{{ item.bankName }} <span>（{{ item.creditCardNumber |cardNoEnd }}）</span>
                    </div>
                    <div class="pay_card_amount"> 已还 <span>{{ item.repaymentedAmount | toFixed }}元</span> | 总额
                      {{ item.taskAmount |toFixed }}元
                    </div>
                  </div>
                  <span class="pay_status" :class="'zeroStatus'+item.status">{{ item.status |zerotaskstatus }}</span>
                </div>
                <div class="pay_item_detail" @click='detail(item,type)'>
                  <div>{{ item.createTime }}</div>
                  <div class="right">
                    <span>查看详情</span>
                    <img src="../../assets/right_icon.png" alt="">
                  </div>
                </div>
              </li>
            </ul>
            <van-empty description="暂无数据" v-else-if="payList.length==0 || quickList.length==0 "/>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>

  </div>
</template>
<script>
import {NavBar, DropdownMenu, DropdownItem, PullRefresh, List, Empty} from 'vant'
import {repaymentOrderQuery, bankIconQuery, quickOrderQuery, cardRecords, cardRecordsNew, getPlanNew} from "@/api/bill"
import {checkOrder} from "@/api/zero";

export default {
  data() {
    return {
      scrollTop: 0, //滚动位置
      phone: "",
      token: localStorage.getItem('token'),
      brandId: "100",
      userId: localStorage.getItem('userId'),
      ip: "",
      active: {
        activeCountRecord: 0,
        inviteCount: 0,
        realNameCountRecord: 0
      },
      direct: {
        directPushAcitveCount: 0,
        directPushCount: 0,
        stagePushAcitveCount: 0,
        stagePushCount: 0,
        twoStagePushAcitveCount: 0,
        twoStagePushCount: 0,
      },
      yearList: [],
      yaer: '',
      month: "",
      monthList: [
        {text: "01月", value: '01'}, {text: "02月", value: '02'}, {text: "03月", value: '03'},
        {text: "04月", value: '04'}, {text: "05月", value: '05'}, {text: "06月", value: '06'},
        {text: "07月", value: '07'}, {text: "08月", value: '08'}, {text: "09月", value: '09'},
        {text: "10月", value: 10}, {text: "11月", value: 11}, {text: "12月", value: 12}
      ],
      type: 2,
      payList: [],
      dateTime: "",//当前时间
      bankIconList: [],
      quickList: [],
      isLoading: false,
      isupLoading: false,
      finished: false,
      totalElements: 0,
      page: 1,
      size: 20,
      ltype: '',
      form: {
        minDateTime: null,
        maxDateTime: null,
        userId: localStorage.getItem('userId'),
        page: 0,
        size: 20,
        empowerToken: null
      },
      zeroPayList: []
    }
  },
  created() {
    if(this.$route.query.empowerToken){
      this.form.empowerToken = this.$route.query.empowerToken
    }else{
      this.form.empowerToken = null
    }
    this.getcard()
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  components: {
    [NavBar.name]: NavBar,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Empty.name]: Empty
  },
  methods: {
    getcard() {
      this.getbankIcon()
      this.getData()
    },
    getUrlParam(name) { //截取url参数
      let reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
      if (reg.test(location.href)) return unescape(RegExp.$2.replace(/\+/g, " "));
    },
    handleScroll() {
      this.scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
    },
    onClickLeft() {
      this.publicJs.back();
    },
    formatDateTime(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      this.dateTime = y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    },
    typeChange(type) {
      this.type = type
      if (type == 2) {
        this._cardRecordsNew()
      } else if (type == 3) {
        this._cardRecords()
      } else {
        this._quickOrderQuery()
      }
    },
    dateChange() {
      if (this.type == 2) {
        this._cardRecordsNew()
      } else if (this.type == 3) {
        this._cardRecords()
      } else {
        this._quickOrderQuery()
      }
    },
    getData() {
      var d = new Date(), nowYear = d.getFullYear(), month = d.getMonth() + 1;
      this.yaer = nowYear
      if (month <= 9) {
        month = '0' + (month)
      }
      this.month = month
      this.yearList = [
        {text: nowYear + '年', value: nowYear},
        {text: nowYear - 1 + '年', value: nowYear - 1},
        {text: nowYear - 2 + '年', value: nowYear - 2}
      ]
    },
    getbankIcon() {
      bankIconQuery().then(icon => {
        if (icon.resp_code == "000000") {
          this.bankIconList = icon.result;
          this._cardRecordsNew()
          this._cardRecords()
        }
      });
    },
    _cardRecords() {
    },
    _cardRecordsNew() {
      this.form.userId = localStorage.getItem('userId')
      let yearLet = this.yaer
      let monthLet = Number(this.month)
      this.form.minDateTime = yearLet + '-' + '0' + monthLet + '-01 00:00:00'
      monthLet += 1
      if (monthLet == 13) {
        monthLet = '1'
        yearLet += 1
      }
      this.form.maxDateTime = yearLet + '-' + '0' + monthLet + '-01 00:00:00'
      this.payList = []
      cardRecordsNew(this.form).then(res => {
        res.result.content.forEach(item => {
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
        })
        res.result.content.forEach(item => {
          item['planType'] = 1
          this.payList.push(item)
        })
        this.isupLoading = false
        if(res.result.content.length < this.form.size){
          this.finished = true
        }
      })
    },
    _quickOrderQuery() {
      let startTime = this.yaer + '-' + this.month.toString().padStart(2, '0') + '-01 00:00:00';
      let nextMonth = parseInt(this.month) + 1
      let endTime;
      if(nextMonth > 12){
        endTime = (this.yaer+1) + '-01-01 00:00:00'
      }else{
        endTime = this.yaer + '-' + nextMonth.toString().padStart(2, '0') + '-01 00:00:00'
      }
      quickOrderQuery({startTime: startTime, endTime: endTime }).then(res => {
        if (res.resp_code == "000000") {
          res.result.content.forEach(item => {
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
          })
          this.quickList = res.result.content
          if (res.result.content.length > 0) {
            this.isupLoading = false;
            this.size += 10
            this.totalElements = res.result.totalElements
            if (this.quickList.length >= res.result.totalElements) {
              this.finished = true;
            } else {
              this.finished = false;
            }
          } else {
            this.quickList = [];
            this.finished = true
            this.isupLoading = true;
          }
        }
      });
    },
    detail(item, name, planType) {
      if (name == 2) {
        this.$store.commit('Loading')
        getPlanNew({ planId: item.id, empowerToken: this.form.empowerToken }).then(res => {
          this.$store.commit('closeLoading')
          if (res.resp_code == '000000') {
            this.$router.push({
              name: 'executeTaskNew',
              query: {empowerToken: this.form.empowerToken},
              params: {item: JSON.stringify(item), task: JSON.stringify(res.result)}
            });
          }
        })
      } else if (name == 3) {
        this.$store.commit('Loading')
        checkOrder(item.id).then(res => {
          this.$store.commit('closeLoading')
          if (res.resp_code == '000000') {
            this.$router.push({
              name: 'previewPlan',
              params: {item: JSON.stringify(item), task: JSON.stringify(res.result)}
            });
          }
        })
      } else {
        this.$router.push({
          name: name,
          params: {
            item: JSON.stringify(item)
          }
        })
      }
    },
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this.size = 20
        this.isLoading = false;
        if (this.type == 2) {
          this._cardRecordsNew()
        } else if (this.type == 3) {
          this._cardRecords()
        } else {
          this._quickOrderQuery()
        }
      }, 500);
    },
    onLoad() {
      let time = setTimeout(() => {
        this.form.page++
        this.isupLoading = true
        if (this.type == 2) {
          this._cardRecordsNew()
        } else if (this.type == 3) {
          this._cardRecords()
        } else {
          this._quickOrderQuery()
        }
        clearTimeout(time)
      }, 500);
    }
  }
}
/*  */

</script>
<style scoped>
.bill {
  font-size: 14px;
}

.wrapper {
  padding-top: 46px;
}

.bill_top_bg {
  width: 100%;
  background: #30AEFB;
  background-size: 100% 100%;
  height: 120px;
  color: #fff;
}

.bill_tab_box {
  width: 100%;
  padding: 0 10px;
}

.bill_tab {
  width: 100%;
  /* height: 165px; */
  border-radius: 10px;
  background: #fff;
  margin-top: -70px;
}

.bill_tab_type {
  padding: 25px 0;
  display: flex;
  justify-content: space-between;
  text-align: center;
}

.bill_tab_type .item {
  flex: 1;
}

.bill_tab_type .item img {
  height: 40px;
  width: 40px;
}

.typeActive {
  color: #30AEFB !important;
}

.bill_cont {
  width: 100%;
  padding: 10px;
}

.pay_item {
  background: #fff;
  width: 100%;
  border-radius: 10px;
  padding: 0 15px;
  margin-bottom: 10px;
}

.pay_item_top {
  padding: 15px 0;
  position: relative;
  display: flex;
}

.pay_item_top .left > img {
  height: 45px;
  width: 45px;
  background: #fff;
  border-radius: 50%;
  margin-right: 10px;

}

.pay_item_top .pay_status {
  position: absolute;
  right: 0px;
  top: 10px;
  font-size: 13px;
}

.pay_item_top .right {
  text-align: left;
  padding-top: 4px;
}

.pay_item_top .right .pay_card_name {

  color: #121212;
}

.pay_item_top .right .pay_card_name > span {
  color: #666;
}

.pay_item_top .right .pay_card_amount {
  font-size: 12px;
  padding-top: 5px;
}

.pay_item_top .right .pay_card_amount > span {
  color: #30AEFB;
}

.pay_item_detail {
  height: 36px;
  line-height: 36px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999999;
}

.pay_item_detail .right span {

  vertical-align: middle;
  padding-right: 5px;
}

.pay_item_detail .right img {
  height: 12px;
  width: 6px;
  vertical-align: middle;
}

>>> .van-popup {
  width: 94.7%;
  left: 10px;
  border-radius: 0px 0px 5px 5px;
}

.quick_status {
  position: absolute;
  right: 0px;
  top: 20px;
  font-size: 12px;
  text-align: center;

}

.taskStatus0 {
  color: #ffc107;
}

.taskStatus1 {
  color: #9ae076;
}

.taskStatus2 {
  color: #ffc107;
}

.taskStatus3 {
  color: #9ae076;
}

.taskStatus4, .taskStatus1 {
  color: #ff5722;
}

.newTaskStatus1, .newTaskStatus2, .newTaskStatus5, .newTaskStatus6 {
  color: #ffc107;
}

.newTaskStatus3 {
  color: #9ae076;
}

.newTaskStatus4, .newTaskStatus7 {
  color: #ff5722;
}

.brushStatus0, .brushStatus3 {
  color: #ffc107;
}

.brushStatus1 {
  color: #9ae076;
}

.brushStatus4, .brushStatus2 {
  color: #ff5722;
}

.menu.van-dropdown-menu >>> .van-dropdown-item__content {
  position: absolute !important;
  max-height: 80% !important;
}

.menu.van-dropdown-menu >>> .van-dropdown-item {
  position: absolute !important;
}

.zeroStatus1, .zeroStatus3 {
  color: #ffc107;
}

.zeroStatus2, .zeroStatus6 {
  color: #9ae076;
}

.zeroStatus8, .zeroStatus7 {
  color: #ffc107;
}

.zeroStatus4, .zeroStatus5 {
  color: #ff5722;
}

.menu.van-dropdown-menu >>> .van-dropdown-item__content {
  position: absolute !important;
  max-height: 80% !important;
}

.menu.van-dropdown-menu >>> .van-dropdown-item {
  position: absolute !important;
}


</style>
