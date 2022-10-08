<template>
  <div>
    <van-nav-bar title="空卡制定计划" left-arrow @click-left="onClickLeft"/>
    <div class="warpper">
      <div class="card_box">
        <div class="card_item">
          <div class="card_item_top ">
            <van-row type="flex" class="card_item_top" justify="space-between">
              <van-col span='3'>
                <div class="card_icon_box">
                  <img
                    class="card_icon"
                    :src="require('../../assets/bankIcon/BANK_'+item.logimg+'.png')"
                  />
                </div>
              </van-col>
              <van-col span="15" class="card_bank">
                <div class="  van-ellipsis">
                  {{ item.bankName }} &nbsp;
                  <span class="">({{ item.cardNo |cardNoEnd }})</span>
                </div>
                <div class="card_type ">
                  账单日 每月{{ item.billDay }}日｜还款日 每月{{ item.repaymentDay }}日
                </div>
              </van-col>
              <van-col @click="isuserable(item,'updateCard',$event)"
                       span="4"
                       class="card_right"
              >
                <div class=" card_bank_name">
                  <span class="card_arrow_text">编辑</span>
                </div>
              </van-col>
            </van-row>
          </div>
        </div>
        <div class="make_plan_box">
          <div class="make_plan_item van-hairline--bottom">
            <van-row type="flex" justify="space-between">
              <van-col span="12">
                <div class="make_plan_dec">还款总金额(元):</div>
              </van-col>
              <van-col span="12" class="">
                <van-field
                  class="make_plan_input"
                  v-model="money"
                  placeholder="¥0.00"
                  clearable
                  type="number"
                  right-icon="edit"
                  input-align="right"
                />
              </van-col>
            </van-row>
          </div>
          <div class="make_plan_item">
            <van-row type="flex" justify="space-between">
              <van-col span="12">
                <div class="make_plan_dec">手续费(元):</div>
              </van-col>
              <van-col span="12" class="">
                <van-field
                  class="make_plan_input"
                  v-model="totalServiceCharge"
                  placeholder="¥0.00"
                  clearable
                  type="number"
                  disabled="disabled"
                  input-align="right"
                />
              </van-col>
            </van-row>
            <div class="color_999 reserved_amount_tips">
              <span class="">注：</span>请确保信用卡余额不低于手续费，否则会导致信用卡空卡还
              款失败。
            </div>
            <!-- theme_color -->
          </div>
          <div class=" dayR van-hairline--bottom">
            <van-cell title="每日还款次数：" is-link :value="dayRepaymentCount+'次'" @click="dayPayCountTrueFalseBy=true"/>
          </div>

          <van-cell :value="valExtra" is-link @click="diycity()">
            <!-- 使用 title 插槽来自定义标题 -->
            <template #title>
              <span class="custom-title">消费地区</span>
            </template>
          </van-cell>

          <div v-if="money<600" class="make_plan_btn">制定计划</div>
          <div @click="selChannel('free')" v-else-if="money!=0 && active==1" class="make_plan_btn theme_btn color_fff">
            制定计划
          </div>
          <div @click="selChannel('free')" v-else-if="money!=0 && active==2" class="make_plan_btn theme_btn color_fff">
            制定计划
          </div>
        </div>
      </div>
    </div>
    <confirmorcancel ref="Dialog" src='../../assets/alert.png' but='3'
                     :zi='start'/>
    <city ref="verificationMethod" :card="item" :extraList="task" v-on:merchant="merchant"></city>
    <!-- <verification  ref="verificationMethod" :authorityList="authorityList" :channelactive="channelactive"  :orderCode="orderCode"   :type="type"   v-on:createTask="createTask" ></verification> -->
    <!-- <channelAuth :item="item"  :type="active" ref="channelAuth"></channelAuth> -->
    <!-- <van-popup v-model="showArea" position="bottom">
     <van-area
       :value="adcode"
       :area-list="areaList"
       :columns-num="2"
       @confirm="onConfirm"
       @cancel="showArea = false"
     />
   </van-popup> -->

    <van-popup v-model="dayPayCountTrueFalseBy" position="bottom" class="day_pay_count">
      <ul class="day_pay_count_list">
        <li class="day_pay_count_item" v-for="item in dayRepaymentCountList"
            :class="{'payCountActive':dayRepaymentCount==item.id}"
            @click="dayRepaymentCountset(item,0)" :key="item.key">
          {{ item.id }}{{ item.title }}
        </li>
      </ul>
      <div class="day_pay_count_cancel" @click="dayPayCountTrueFalseBy=false">取消</div>
    </van-popup>

    <van-popup v-model="preTruefalseBy" round>
      <div class="pre_bg">
        <div class="pre_tips">
          小主人！你还没有获得信用额度呢！赶快联系你的推荐人给我授信吧！
        </div>
        <div class="pre_btn" @click="goNext('pre')">找推荐人授信</div>
      </div>
    </van-popup>


  </div>
</template>
<script defer=true>
import city from "@/components/city/city"
import {queryMerchant} from "@/api/city/city";
import areaList from "@/js/area";
import confirmorcancel from '@/components/confirm/alert'
import {
  NavBar,
  Row,
  Col,
  Icon,
  Tab,
  Tabs,
  Field,
  Switch,
  Popup,
  Cell,
  Area,
  RadioGroup,
  Radio,
  ActionSheet
} from "vant";
import {creditcardChannel, creditcardTask} from "@/api/plan/plan";
import {calculatereservedamount, creditcardmanagerapplyorder, zeroChannel} from "@/api/zero";
import verification from "@/components/verification/verification"
import request from '@/utils/request'

import qs from 'qs'

export default {
  data() {
    return {
      list: {},
      isFirstEnter: false, // 是否第一次进入，默认false
      brandId: localStorage.getItem("brandId"),
      userId: localStorage.getItem("userId"),
      item: {},
      currentdate: "", //当天日期
      year: "",
      timeDay: "", //当月天数
      uppermonth: "", //上月月份
      month: "", //当月月份
      nextmonth: "", //下月月份
      day: "", //当天
      hour: "",
      dayDate: "",
      monthDay: "",
      active: "1", //tab指向 /1一键还款，2自动还款
      money: "", //还款金额
      autoreservedAmount: "", //一键还款预留金额
      freereservedAmount: "", //自选通道还款预留金额
      dayRepaymentCount: 2, //单日还款笔数
      dayRepaymentCountList: [
        {id: 1, title: "次/日"},
        {id: 2, title: "次/日"},
        {id: 3, title: "次/日"},
        // { id: 4, title: "次/日" },
        // { id: 5, title: "次/日" },
        // { id: 6, title: "次/日" },
      ],

      isNotPointCheck: false, //是否还款消费去小数点
      dataArr: [],  //还款日期区间
      weekDay: ["日", "一", "二", "三", "四", "五", "六"],
      dataArrOne: "",
      dateWeekList: [],//包含周几的日期
      planDateTrueFalseBy: false,//还款日期选择器
      dataActive: '1',//1间隔选择，2连续选择
      arr: [],
      firstData: '', // 开始
      lastData: '', // 结束
      dateList: [''], // 确定日期
      channelTrueFalseBy: false,//通道弹框
      channelList: {
        result: [
          {
            descriptionOne: "",
            singleLimit: "",
            everydayLimit: "",
            rate: "",
            serviceCharge: "",
            tradeTime: "",
            channelName: ""
          }
        ]
      },//查询出来通道
      channelactive: {},//当前选中的通道
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
        }

      },
      orderCode: "",//验证码获取之后返回
      type: "",
      activeAutoDate: "",
      activeDateLength: 10,
      addresstitle: '正在获取地址，请稍后。。。',
      value: '',
      showArea: false,
      areaList,
      adcode: "",
      dayPayCountTrueFalseBy: false,
      // 日期

      currentMonthDateLen: 0, // 当月天数
      preMonthDateLen: 0, // 当月中，上月多余天数
      allArr: [], // 当月所有数据
      currentYear: new Date().getFullYear(),
      currentMonth: "",
      startDay: "",
      endDay: "",
      totalServiceCharge: "",
      reservedAmount: "",
      allRepaymentCount: "",
      preTruefalseBy: false,
      task: {version: '99-6', extra: ''},
      extra: {},
      version: '',
      valExtra: '请选择消费地区',
      //弹窗的内容
      start: ''

    };
  },
  components: {
    city,
    [NavBar.name]: NavBar,
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Field.name]: Field,
    [Switch.name]: Switch,
    [Popup.name]: Popup,
    // verification,
    // channelAuth,
    [Cell.name]: Cell,
    [Area.name]: Area,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [ActionSheet.name]: ActionSheet,
    confirmorcancel
  },
  // computed: {},
  mounted() {
    this.authOnShow()
  },
  created() {
    this.isFirstEnter = true;
    this.item = JSON.parse(this.$route.params.item);
    this.getDayDate()
    this.getNowFormatDate();
    this.mGetDate(this.year, this.month);
    this.getPlanDate(2)
    this.getAllArr()
    localStorage.removeItem('isNotPoint')
    //查询空卡通道
    this._zeroChannel()

  },

  activated() {
    this.channelTrueFalseBy = false
    if (!this.$route.meta.isBack) {
      // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
      // 如果isFirstEnter是true，表明是第一次进入此页面或用户刷新了页面，需获取新数据
      // this.str=''// 把数据清空，可以稍微避免让用户看到之前缓存的数据
      //  this.gettaskbill()
      this.item = JSON.parse(this.$route.params.item);
      this.getNowFormatDate();
      this.mGetDate(this.year, this.month);
      this.getPlanDate(2)
      this.money = ""
      this.autoreservedAmount = "",
        this.active = '1'
      this.getAllArr()
      //查询空卡通道
      this._zeroChannel()
    }
    // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
    this.$route.meta.isBack = true
    // 恢复成默认的false，避免isBack一直是true，导致每次都获取新数据
    this.isFirstEnter = false;

  },

  beforeRouteEnter: (to, from, next) => {
    to.meta.isBack = false
    if (from.name == 'previewPlan' || from.name == 'confirmPlan') {
      to.meta.isBack = true
    }
    next();
  },

  watch: {
    money(value) { //计算预留金额

      if (value.split(".").length > 1) {
        if (value.split(".")[1].length > 2) {
          this.$toast({message: '金额只支持小数点带两位', position: 'bottom'});
          this.money = this.money.split(".")[0];
          return;
        }

      }
      if (value >= 600) {
        this.totalServiceCharge = (value * 0.0125).toFixed(2)
      } else {
        this.totalServiceCharge = ''
      }
    }
  },
  methods: {

    merchant(extra, merchantList) {
      this.extra = extra
      this.valExtra = JSON.parse(extra).merprovince + '-' + JSON.parse(extra).mercity

    },
    formatMonth(count) {
      var date = new Date(), day, yy, mm;
      day = new Date(date.getYear(), date.getMonth(), count);
      yy = date.getFullYear();
      mm = day.getMonth() + 1;
      return yy + '-' + mm;
    },

    authOnShow(val) {
      // this.$refs.channelAuth.onShow()
      if (val == 2) {
        // this.showDate('1')
        this.planDateTrueFalseBy = true
        // this.arr=[]
      } else {
        this.getPlanDate(2)
      }
    },
    onClickLeft() {

      // this.publicJs.back();
      this.$router.push({
        path: "/zero",
        query: {
          'phone': localStorage.getItem('phone'),
          'token': localStorage.getItem('token'),
          'brandId': localStorage.getItem('brandId'),
          'userId': localStorage.getItem('userId'),
          'ip': this.global.ip,
          'type': 'h5',
          'deviceId': localStorage.getItem('deviceId')
        }
      });


    },
    onConfirm(values) {
      this.value = values.map((item) => item.name).join('/');
      this.showArea = false;
    },

    //查询空卡通道
    _zeroChannel() {
      zeroChannel().then(res => {
        if (res.resp_code == '000000') {
          this.version = res.result[0].version
        } else if (res.resp_code == '999999') {
          this.start = res.resp_message
          this.$refs.Dialog.disopen()
        }
      })
    },

    goNext(name) {
      this.$router.push({name: name})
    },

    mGetDate(year, month) {
      //获取当月的天数
      var d = new Date(year, month, 0);
      this.timeDay = d.getDate();
      return d.getDate();
    },

    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var hour = date.getHours()
      var time = date.getTime()

      if (hour >= 0) {
        date = new Date(time + 24 * 60 * 60 * 1000)
      }
      var month = date.getMonth() + 1;
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }

      var strDate = date.getDate();
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      this.currentdate = strDate;
      this.year = date.getFullYear();
      this.month = month;
      this.currentMonth = month;
      this.day = strDate;
      this.hour = date.getHours()
      this.monthDay = this.month + "-" + this.day;
    },
    getDayDate() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      this.dayDate = year + seperator1 + month + seperator1 + strDate
    },
    dayRepaymentCountset(item, type) {
      //选择单日还款次数
      this.dayRepaymentCount = item.id;
      this.dayPayCountTrueFalseBy = false
    },
    calculationReservedAmount(type) {
      calculatereservedamount(this.item.userId, this.item.cardNo, this.money, '', this.version, this.dayRepaymentCount).then(res => {
        this.moneyTrueFalseBy = false
        if (res.resp_code == "000000") {
          this.totalServiceCharge = Number(res.totalServiceCharge).toFixed(2)
          this.reservedAmount = Number(res.reservedAmount).toFixed(2)
          this.allRepaymentCount = res.allRepaymentCount
        } else {
          this.totalServiceCharge = ''
          this.reservedAmount = ''
          this.$vux.toast.text(res.data.resp_message, 'bottom')
        }
      }).catch(err => {
        this.totalServiceCharge = ''
        this.reservedAmount = ''
      })
    },
    getAll(stime, etime) { //获取两日期之间日期列表函数
      //初始化日期列表，数组
      var diffdate = new Array();
      var i = 0;
      //开始日期小于等于结束日期,并循环
      while (stime <= etime) {
        diffdate[i] = stime;
        //获取开始日期时间戳
        var stime_ts = new Date(stime).getTime();
        //增加一天时间戳后的日期
        var next_date = stime_ts + 24 * 60 * 60 * 1000;
        //拼接年月日，这里的月份会返回（0-11），所以要+1
        var next_dates_y = new Date(next_date).getFullYear() + "-";
        var next_dates_m = new Date(next_date).getMonth() + 1 < 10 ? "0" + (new Date(next_date).getMonth() + 1) + "-" : new Date(next_date).getMonth() + 1 + "-";
        var next_dates_d = new Date(next_date).getDate() < 10 ? "0" + new Date(next_date).getDate() : new Date(next_date).getDate();
        stime = next_dates_y + next_dates_m + next_dates_d;
        //增加数组key
        i++;
      }
      this.dataArr = diffdate;
      if (this.dataArr.length > 0) {
        this.activeAutoDate = this.dataArr[0].split("-")[1] + '-' + this.dataArr[0].split("-")[2] + '~' + this.dataArr[this.dataArr.length - 1].split("-")[1] + '-' + this.dataArr[this.dataArr.length - 1].split("-")[2]
        var myDate;
        if (this.hour >= 11 ? this.dataArr[0] != this.dayDate : this.dataArr[0]) {
          myDate = new Date(Date.parse(this.dataArr[0]));
          this.dataArrOne = myDate.getDay()
        } else if (!this.hour >= 11 ? this.dataArr[0] != this.dayDate : this.dataArr[0] && this.dataArr.length > 1) {
          myDate = new Date(Date.parse(this.dataArr[1]));
          this.dataArrOne = myDate.getDay()
        }
      }
      this.arr = JSON.parse(JSON.stringify(diffdate))
      this.dateList = this.arr.join(',')
    },
    getPlanDate(item) {
      //获取日期
      this.dateshow = item;
      this.dataArr = [];
      var billDay = this.item.billDay;
      var repaymentDay = this.item.repaymentDay;
      if (this.item.billDay <= 9) {
        billDay = "0" + this.item.billDay;
      }
      if (this.item.repaymentDay <= 9) {
        repaymentDay = "0" + this.item.repaymentDay;
      }
      var startDay = this.year + "-" + this.item.billDaymonth + "-" + billDay;
      var endDay = this.year + "-" + this.item.repaymentDaymonth + "-" + repaymentDay;
      if (this.day <= 9) {
        // this.day =  '0'+this.day;
      }
      var day = this.year + "-" + this.month + "-" + this.day;
      if (this.item.billDaymonth == 12 && this.item.repaymentDaymonth == 1) {
        startDay = Number(this.year) - 1 + '-' + this.item.billDaymonth + '-' + billDay
        endDay = Number(this.year) + '-' + this.item.repaymentDaymonth + '-' + repaymentDay
      } else if (this.item.repaymentDaymonth < this.item.billDaymonth && (this.item.billDaymonth != 12 && this.item.repaymentDaymonth != 1)) {
        endDay = Number(this.year) + 1 + '-' + this.item.repaymentDaymonth + '-' + repaymentDay
      } else if ((this.item.repaymentDaymonth == this.item.billDaymonth) && (this.month > this.item.billDaymonth || this.month > this.item.repaymentDaymonth)) {
        startDay = Number(this.year) + 1 + '-' + this.item.billDaymonth + '-' + billDay
        endDay = Number(this.year) + 1 + '-' + this.item.repaymentDaymonth + '-' + repaymentDay
      }
      this.startDay = startDay
      this.endDay = endDay

      var oDate1 = new Date(startDay.replace(/-/g, "/"));
      var oDate2 = new Date(day.replace(/-/g, "/"));
      if (oDate1.getTime() > oDate2.getTime()) {
        this.getAll(startDay, endDay);
      } else {
        this.getAll(day, endDay);
      }

      if (item == 2) {
        // this.arr=[]
      } else {
        this.firstData = "";
        this.lastData = "";
        this.seldateSitcom = false;
        this.seldateSpace = true;
      }
    },
    aaa() {
    },

    intervalDateSel(e, event) { //间隔选择日期
      // alert("间隔")
      let i = this.arr.indexOf(e) // 用于判断是否选中
      if (i == -1) { // 没选中时，把id放入arr
        this.arr.push(e)
      } else { // 选中时，把id在arr 中删除
        this.arr.splice(i, 1)
      }
      this.dateList = this.arr.join(',')
    },

    continuityDateSel(id, event) { //连续选择日期

      if (!this.firstData) { // 第一次点击
        this.firstData = id
      } else {
        if (!this.lastData) { // 第二次点击
          if (this.firstData < id) {
            this.lastData = id
            this.getSelData() // 选对的时候执行
          } else {
            this.firstData = id // 开始
            this.lastData = '' // 结束
            // this.arr.push(id)
          }
        } else { // 第三次点击
          let i = this.arr.indexOf(id)
          if (this.arr.indexOf(id) >= 0) {
            this.arr.splice(i, 1)
          } else {
            this.firstData = id // 开始日期重置
            this.lastData = '' // 结束日期清空
          }

        }
      }
    },
    getSelData() { // 根据开始日期和结束日期 循环原始数据 得到之间的数据放入数组 并转成字符串
      if (!this.firstData || !this.lastData) {
        return
      }
      this.arr = []
      this.dataArr.forEach((date) => {
        if (date >= this.firstData && date <= this.lastData && (date.substring(8, 10) >= this.item.billDay || date.substring(8, 10) <= this.item.repaymentDay)) {
          this.arr.push(date)
          this.dateList = this.arr.join(',')
        }
      })
    },
    dateConfirm() { //日期选择
      //  this.calculationReservedAmount()
      if (this.arr.length == 0 || this.arr == '') {
        //  this.$notify({ type: "primary", message: "请先选择日期" });
        //   return
        this.planDateTrueFalseBy = false
      } else {
        if (this.firstData != "" && this.lastData == "" && this.arr.length == 0) {
          this.dateList = this.firstData
        } else {
          this.dateList = this.arr.join(',')
        }
        if (this.money >= 40 && this.arr.length != 0) {
          // this.calculationReservedAmount()
        }
        this.arr = this.arr.sort()
        if (this.arr.length > 0) {
          this.activeAutoDate = this.arr[0].split("-")[1] + '-' + this.arr[0].split("-")[2] + '~' + this.arr[this.arr.length - 1].split("-")[1] + '-' + this.arr[this.arr.length - 1].split("-")[2]
        }
        this.planDateTrueFalseBy = false
      }
    },
    showDateLength(date) {
      this.activeDateLength = date.length
    },
    hideDateLength() {
      this.activeDateLength = 10
    },

    selChannel(type) {
      if (this.money <= 0) {
        this.$toast({message: '还款金额需要大于0元', position: 'bottom'})
        return;
      }
      if (this.valExtra == '' || this.valExtra == '请选择消费地区') {
        this.$toast({message: '请选择消费地区', position: 'bottom'})
        return
      }
      this.createTask()

    },

    diycity() {

      this.$refs.verificationMethod.choseAdd()
      this.$refs.verificationMethod.getprovince()
    },

    createTask(item) {
      this.$store.commit('Loading')
      creditcardmanagerapplyorder(this.item.userId, this.item.cardNo, this.money, this.version, this.dayRepaymentCount, this.extra).then(res => {
        this.$store.commit('closeLoading')
        if (res.resp_code == '000000') {
          this.$router.push({
            name: 'previewPlan',
            params: {item: JSON.stringify(this.item), task: JSON.stringify(res.result)}
          });
        } else if (res.resp_code == "999994") {
          this.$dialog.alert({
            title: '温馨提示',
            message: res.resp_message
          })
        } else if (res.resp_code == "999996") {
          this.$router.push({name: "link", params: {url: JSON.stringify(res.result), title: JSON.stringify("权限认证")}});
        } else if (res.resp_code == '999995') {
          window.location.href = res.result
        } else if (res.resp_code == '999992') {
          this.authorityList = res
          this.$router.push({
            name: 'confirmPlan',
            params: {
              channelactive: JSON.stringify(item),
              authorityList: JSON.stringify(res),
              item: JSON.stringify(this.item)
            }
          })
        } else if (res.resp_code == '999991') {
          let data = res.result
          let url = data.ipAddress + data.getSmsUrlNew + '?bankCard=' + data.bankCard + '&bankName=' + data.bankName + '&channelTag=' + data.channelTag + '&expiredTime=' + data.expiredTime + '&idCard=' + data.idCard + '&phone=' + data.phone + '&securityCode=' + data.securityCode + '&userName=' + data.userName + '&rate=' + data.rate + '&extraFee=' + data.extraFee + '&dbankCard=' + data.dbankCard + '&dbankName=' + data.bankName + '&dphone=' + data.dphone
          this.$router.push({name: 'link', params: {url: JSON.stringify(url), title: JSON.stringify("权限认证")}})
        } else if (res.resp_code == "999989") {
          window.location.href = "https://mc.mingchetech.com/public_link/channelAuth/index.html#/channel?parameters=" + JSON.stringify(res.parameters) + '&token=' + localStorage.getItem('token') + '&ip=' + this.global.ip
        }
      })
    },


    isuserable(item, type, event) {
      this.$router.push({name: type, params: {item: JSON.stringify(item), type: 2}})
    },
    // 日历
    // 获取某年某月总共多少天
    getDateLen(year, month) {
      let actualMonth = month - 1;
      let timeDistance = +new Date(year, month) - +new Date(year, actualMonth);
      return timeDistance / (1000 * 60 * 60 * 24);
    },
    // 获取某月1号是周几
    getFirstDateWeek(year, month) {
      return new Date(year, month - 1, 1).getDay()
    },
    // 上月 年、月
    preMonth(year, month) {
      if (month == 1) {
        return {
          year: --year,
          month: 12
        }
      } else {
        return {
          year: year,
          month: --month
        }
      }
    },
    // 下月 年、月
    nextMonth(year, month) {
      if (month == 12) {
        return {
          year: ++year,
          month: 1
        }
      } else {
        return {
          year: year,
          month: ++month
        }
      }
    },
    // 获取当月数据，返回数组
    getCurrentArr() {
      let currentMonthDateLen = this.getDateLen(this.currentYear, this.currentMonth) // 获取当月天数
      let currentMonthDateArr = [] // 定义空数组
      if (currentMonthDateLen > 0) {
        for (let i = 1; i <= currentMonthDateLen; i++) {
          if (i <= 9) {
            i = '0' + i
          }
          currentMonthDateArr.push({
            month: 'current', // 只是为了增加标识，区分上下月
            date: i,
            day: this.currentYear + '-' + this.currentMonth + '-' + i
          })
        }
      }
      this.currentMonthDateLen = currentMonthDateLen
      return currentMonthDateArr
    },
    // 获取当月中，上月多余数据，返回数组
    getPreArr() {
      let preMonthDateLen = this.getFirstDateWeek(this.currentYear, this.currentMonth) // 当月1号是周几 == 上月残余天数）
      let preMonthDateArr = [] // 定义空数组
      if (preMonthDateLen > 0) {
        let {year, month} = this.preMonth(this.currentYear, this.currentMonth) // 获取上月 年、月
        var day = this.currentYear + '-' + (this.currentMonth - 1)
        if ((this.currentMonth - 1) <= 0) {
          day = (this.currentYear - 1) + '-' + '12'
        }
        let date = this.getDateLen(year, month) // 获取上月天数
        if (date <= 9) {
          date = '0' + date
        }
        for (let i = 0; i < preMonthDateLen; i++) {

          preMonthDateArr.unshift({ // 尾部追加
            month: 'pre', // 只是为了增加标识，区分当、下月
            date: date,
            day: day + '-' + date
          })
          date--
        }
      }
      this.preMonthDateLen = preMonthDateLen
      return preMonthDateArr
    },
    // 获取当月中，下月多余数据，返回数组
    getNextArr() {
      let nextMonthDateLen = 42 - this.preMonthDateLen - this.currentMonthDateLen // 下月多余天数
      let nextMonthDateArr = [] // 定义空数组
      if (nextMonthDateLen > 0) {
        var day = this.currentYear + '-' + (this.currentMonth + 1)
        if ((this.currentMonth + 1) > 12) {
          day = (this.currentYear + 1) + '-' + '1'
        }
        for (let i = 1; i <= nextMonthDateLen; i++) {
          if (i <= 9) {
            i = '0' + i
          }
          nextMonthDateArr.push({
            month: 'next',// 只是为了增加标识，区分当、上月
            date: i,
            day: day + '-' + i
          })
        }
      }
      return nextMonthDateArr
    },
    // 整合当月所有数据
    getAllArr() {
      // alert(2)
      let preArr = this.getPreArr()
      let currentArr = this.getCurrentArr()
      let nextArr = this.getNextArr()
      let allArr = [...preArr, ...currentArr, ...nextArr]

      this.allArr = allArr
      let sendObj = {
        currentYear: this.currentYear,
        currentMonth: this.currentMonth,
        allArr: allArr
      }
    },
    // 点击 上月
    gotoPreMonth() {
      let {year, month} = this.preMonth(this.currentYear, this.currentMonth)
      this.currentYear = year
      if (month <= 9) {
        month = '0' + month
      }
      this.currentMonth = month
      this.getAllArr()
    },
    // 点击 下月
    gotoNextMonth() {
      let {year, month} = this.nextMonth(this.currentYear, this.currentMonth)
      this.currentYear = year
      if (month <= 9) {
        month = '0' + month
      }
      this.currentMonth = month
      this.getAllArr()
    }
  }
};
</script>


<style scoped>
/* 银行卡 */
.card_box {
  padding: 10px 15px;
}

.card_item {
  /* height: 158px; */

  background: linear-gradient(270deg, #FE4557 0%, #FD6D5C 100%);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  margin-bottom: 10px;
  padding: 15px;
  font-size: 14px;
  color: #fff;
}

.card_item_top {
  /* padding: 0px 0 10px 0; */
  /* line-height: 45px; */
}

.card_bank {
  padding-top: 5px;
}

.card_type {
  font-size: 12px;
  padding-top: 5px;
}

.card_right {
  text-align: right;
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

.card_bank_tips {
  font-size: 12px;
}

.card_bottom {
  padding-top: 10px;
}

.date_auto {
  height: 32px;
  background: rgba(255, 150, 48, .1);
  border-radius: 3px;
  color: #8C8C8C;
  font-size: 12px;
  line-height: 32px;
  margin-top: 10px;
  padding: 0 10px;

}

/* 银行卡 */
/* 制定计划 */
.make_plan_box {
  width: 100%;
  /* height: 504px; */
  background: rgba(255, 255, 255, 1);
  border-radius: 12px;
  padding: 0 15px 15px 15px;
}

.make_plan_item {
  /* height: 80px; */
  width: 100%;

}

.make_plan_dec {
  font-size: 12px;
  color: #2b2b2b;
  height: 45px;
  line-height: 45px;
  padding-left: 10px;
}

.make_plan_input {
  height: 45px;
  width: 100%;
  font-size: 15px;
  outline: none;
  border: none;
}

.reserved_amount_tips {
  padding: 5px;
  width: 100%;
  background: rgba(255, 150, 48, .1);
  border-radius: 3px;
  /* opacity:0.1; */
  font-size: 10px;
}

.make_plan_input_date {
  font-size: 15px;
  padding-left: 15px;
}

.day_plan_count {
  padding-left: 10px;
}

.day_plan_count_item {
  font-size: 12px;
  padding-top: 8px;
  margin-right: 10px;
  color: #fff;
}

.make_plan_model {
  font-size: 14px;
  padding: 10px;
}

.day_plan_count_item > div {
  height: 23px;
  width: 64px;
  background: #d8d8d8;
  border-radius: 3px;
  text-align: center;
  line-height: 24px;
  margin: 0 auto;
}

/* .day_plan_count_active {
  background: #35A7FD !important;
} */
.make_isNotPoint {
  font-size: 10px;
  padding: 10px 5px 5px 10px;
}

.make_plan_right {
  text-align: right;
}

.make_isNotPoint_tips {
  font-size: 10px;
  padding-left: 10px;
}

.make_plan_btn {
  width: 100%;
  height: 49px;
  background: rgba(236, 236, 236, 1);
  line-height: 49px;
  text-align: center;
  color: #000000;
  font-size: 16px;
  margin-top: 20px;
  border-radius: 22px;
}

.make_plan_item_cell {
  font-size: 12px;
  padding: 0;
  padding: 10px 15px 10px 10px;
}

/* 制定计划 */
/* 日期选择器 */
.plan_date_title {
  width: 100%;
  background: #FBF9FE;
  font-size: 17px;
  padding: 8px 14px;
  display: flex;
  justify-content: space-between;
}

.plan_date_title .left, .right {
  line-height: 44px;
}

.plan_date_title .left {
  color: #999;
}

.plan_date_title .right {
  color: #1577FF;
}

.plan_date_title .cont {
  text-align: center;
}

.plan_date_title .cont span {
  color: #999;
  font-size: 12px;
  display: inline-block;
}

.date_box {
  display: flex;
  flex-wrap: wrap;
  font-size: 13px;
  padding: 10px 10px 5px 10px;
}

.date_item {
  padding: 0 4px;
  height: 18px;
  line-height: 16px;
  border-radius: 9px;
  color: rgba(37, 116, 234, 1);
  border: 1px solid rgba(37, 116, 234, 1);
  margin: 4px;
}

.date_model {
  text-align: center;
  font-size: 13px;
  color: #666;
  /* line-height: 20px; */
}

.date_model img {
  height: 12px;
  width: 12px;
  /* margin-bottom: 5px; */
}

/* 日期 */
/* 通道弹框 */
.channel_box {
  /* padding:20px 13px 0 13px; */
  font-size: 12px;
}

.channel_title_box {
  padding: 8px 20px;
}

.channel_title {
  font-size: 16px;
  line-height: 40px;
  font-weight: 600;
}

.channel_cont {
  /* padding:10px 0; */
}

.sitcom_list {
  padding: 5px 10px;
  display: flex;
  flex-wrap: wrap;
}

.sitcom_item {
  text-align: center;
  font-size: 14px;
  margin: 4px 2px;
  line-height: 16px;
  border-radius: 5px;
  flex: 0 0 13.1%;
}

.channel_cont_item {
  line-height: 28px;
  padding: 0 20px;
  font-size: 13px;
  color: #666;
}

.channel_btn_box {
  padding: 10px 20px;
}

.channel_btn {
  text-align: center;
  font-size: 16px;
  height: 40px;
  line-height: 40px;
  width: 130px;
  border-radius: 20px;
  border: 1px solid rgba(60, 132, 242, 1);
}

.channel_btn.channel {
  color: rgba(60, 132, 242, 1);
}

.channel_btn.confirm {
  background: rgba(60, 132, 242, 1);
  color: #fff;
}

.channel_btn.confirm.one {
  width: 100%;
}

/* 选择次数 */
.day_pay_count {
  text-align: center;
  font-size: 20px;
  padding: 10px 15px;
}

.day_pay_count_list {
  color: #666;
  margin-bottom: 10px;
  border-radius: 10px;
  background: #F8F8F8;
  border-radius: 10px;
}

.day_pay_count_item {
  border-bottom: 1px solid #999;
  height: 50px;

  line-height: 50px;
}

.day_pay_count_item:last-child {
  border: none;
}

.day_pay_count_cancel {
  color: #999;
  height: 56px;
  background: #fff;
  line-height: 56px;
  border-radius: 15px;
}

>>> .day_pay_count.van-popup {
  background: none;
}

.payCountActive {
  color: #000;
}

/* 日历 */
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 100px 0;
  box-sizing: border-box;
}

.calendar {
  width: 100%;
}

.calendar .tit {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: #2A2A2A;
  padding: 10px 0;
}

.calendar .tit .current {
  margin: 0 10px;
  color: #999;
}

.calendar .content {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  padding-left: 13px;
}

.calendar .content div {
  width: 50px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  flex-shrink: 0;
  font-size: 13px;
  color: #000;
}

.calendar .content .gray span {
  color: #999;
}

.calendar .content div span {
  display: inline-block;
  height: 37px;
  width: 37px;
  line-height: 37px;
  border-radius: 50%;
}

.calendar .content div .bill {
  background: #00A4FF;
  font-size: 10px;
}

.calendar .content div .repment {
  background: #FF9300;
  font-size: 10px;
}

.calendar .content div span.activeDay {
  background: #FF3735 !important;
  color: #fff !important;
}

.next {
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-left: 8px solid #000;
}

.pre {
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-right: 8px solid #000;
}

.pre_bg {
  height: 244px;
  width: 210px;
  background: url("../../assets/zero/pre_bg.png") center no-repeat;
  background-size: 100% 100%;
  padding: 90px 15px 0 15px;
}

.pre_tips {
  color: #fff;
  font-size: 13px;
  line-height: 19px;
}

.pre_btn {
  height: 25px;
  width: 120px;
  margin: 10px auto;
  font-size: 12px;
  background: #fff;
  color: #ff772c;
  border-radius: 20px;
  text-align: center;
  line-height: 25px;
}

.dayR >>> .van-icon {
  line-height: 24px;
}
</style>
