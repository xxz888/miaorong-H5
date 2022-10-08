<template>
  <div>
    <!-- <van-nav-bar title="设置还款计划"  left-arrow @click-left="onClickLeft"  @click-right="temporaryplan"  right-text="重选地区"   /> -->
    <van-nav-bar title="设置还款计划" left-arrow @click-left="onClickLeft"/>
    <div class="warpper">
      <div class="submit_plan_box">
        <div class="card_item_sub">
          <div class="card_item_top ">
            <van-row type="flex" class="card_item_top" justify="space-between">
              <van-col span="4">
                <div class="card_icon_box">
                  <img
                    class="card_icon"
                    :src="require('../../assets/bankIcon/BANK_'+item.logimg+'.png')"
                  />
                </div>
              </van-col>
              <van-col span="20" class="card_bank">
                <div class="  van-ellipsis">
                  {{ item.bankName }} &nbsp;
                  <span class="">({{ item.cardNo |cardNoEnd }})</span>
                </div>
                <div class="card_type ">
                  账单日 每月{{ item.billDay }}日｜还款日 每月{{ item.repaymentDay }}日
                </div>
              </van-col>
            </van-row>
          </div>
        </div>
        <div class="submit_plan_dec_box">
          <van-row type="flex">
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">还款总次数：</span>
              <span class="submit_plan_dec_cont">{{ task.repaymentCount }}次</span>
            </van-col>
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">已还次数：</span>
              <span class="submit_plan_dec_cont"> <span class="">0</span>次</span>
            </van-col>
          </van-row>
          <van-row type="flex">
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">还款总金额：</span>
              <span class="submit_plan_dec_cont">{{ Number(task.amount) |toFixed }}元</span>
            </van-col>
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">已还金额：</span>
              <span class="submit_plan_dec_cont">0.00元</span>
            </van-col>
          </van-row>
          <van-row type="flex" class="submit_plan_dec  ">
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">预计手续费：</span>
              <span class="submit_plan_dec_cont">{{ Number(task.totalServiceCharge) |toFixed }}元</span>
            </van-col>
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">已扣手续费：</span>
              <span class="submit_plan_dec_cont">0.00元</span>
            </van-col>
          </van-row>
        </div>
        <ul class="plan_list" v-if="merchantTrueFalseBy">
          <li class="plan_title">
            <ul class="plan_item_box">
              <li class="plan_item_item time">时间</li>
              <li class="plan_item_item type">类型</li>
              <li class="plan_item_item amount">金额</li>
            </ul>
          </li>
          <li class="plan_item" v-for="item in task.result" :key="item.key">
            <div class="repayment_status">
              <div></div>
            </div>
            <ul class="plan_item_box" v-for="items in item.consumeTaskVOs" :key="items.key">
              <li class="plan_item_item time">
                {{ items.executeDateTime }}
              </li>
              <li class="plan_item_item type">
                消费
              </li>
              <li class="plan_item_item amount">
                -{{ Number(items.realAmount) }}
              </li>
            </ul>
            <ul class="plan_item_box">
              <li class="plan_item_item time">
                {{ item.executeDateTime }}
              </li>
              <li class="plan_item_item type">
                还款
              </li>
              <li class="plan_item_item amount">
                +{{ Number(item.amount) }}
              </li>
              <li v-if="consumeType">
                <div class="consume_icon"></div>
              </li>
            </ul>
          </li>
        </ul>
        <div class="executeplan_btn ">
          <div v-if="!merchantTrueFalseBy" @click="temporaryplan()" class="confirmplan_btn two theme_btn">启动计划</div>
          <div v-if="merchantTrueFalseBy" @click="confirmPlan()" class="confirmplan_btn two theme_btn">启动计划</div>
        </div>

      </div>
    </div>
    <van-popup position="bottom" :style="{ height: '45%' }" v-model="show">
      <van-picker show-toolbar title="落地商户" @cancel="showPicker = false" :columns="columns"
                  @confirm="consumeTypeConfirm" @change="onChange" :default-index="defConsumeType"/>
    </van-popup>
    <city ref="verificationMethod" :card="item" :extraList="task" v-on:merchant="merchant"></city>
    <is-password ref="isPassword" v-on:confirmPlan="confirmPlan"></is-password>
    <confirmorcancel ref="Dialog" src='../../assets/alert2.png' but='2'
                     :zi='start' @smsConfirm='smsConfirm' @getCode='getCode' :message='message' @topClose='topClose'/>

  </div>
</template>

<script>
import {NavBar, Row, Col, Icon, Popup, Picker} from 'vant';
import city from "@/components/city/city"
import confirmorcancel from '@/components/confirm/alert'
import isPassword from "@/components/isPassword/isPassword"
import {creditcardTask, creditcardSaveTask, isChannelBind} from "@/api/plan/plan";
import request from '@/utils/request'
import qs from 'qs'

export default {
  data() {
    return {
      item: {},
      task: {
        allConsumeAmount: 0,
        allRepaymentAmount: "0",
        allServiceCharge: 0,
        amount: "0",
        bankName: "",
        brandId: "",
        channelName: "",
        consumeCount: 0,
        couponId: null,
        creditCardNumber: "",
        dayRepaymentCount: "",
        executeDate: [],
        executeDates: "",
        extra: '',
        isHideResult: 0,
        rate: 0.0058,
        repaymentCount: 0,
        reservedAmount: "",
        resp_code: "000000",
        resp_message: "请求成功",
        result: [],
        serviceCharge: 0,
        totalServiceCharge: 0,
        userId: "",
        version: "",
      },//查询出来通道
      channelactive: [],//当前选中的通道
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
      merchantList: [],//商户
      merchantTrueFalseBy: false, //
      consumeType: false,//是否可选商户
      extra: {},//选择的省市
      show: false,
      columns: [],
      columnsActive: {},
      defConsumeType: 0,//默认
      message: '获取验证码',
      num: 60,

      start: '为保障用户还款时的多元化场景，更有利于养卡提额，建立一个还款多元化消费、多通道介入机制和即时切换机制，请您确认是否体验此功能',
      getSmsUrl: '',
      confirmSmsUrl: '',
      channelTags: '',
      district: {}
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [Row.name]: Row,
    [Col.name]: Col,
    city,
    isPassword,
    //  planBillTips,//账单提示
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    confirmorcancel
  },
  created() {
    this.item = JSON.parse(this.$route.params.item)
    this.task = JSON.parse(this.$route.params.task)
    this.district = JSON.parse(this.$route.params.extra)
    this.getmerchantNameList()
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    createTask(item) {
      this.$store.commit('Loading')
      creditcardTask(item.userId, item.brandId, item.creditCardNumber, item.amount, item.reservedAmount, String(item.executeDate), item.version, localStorage.getItem('isNotPoint'), item.dayRepaymentCount).then(res => {
        this.$store.commit('closeLoading')
        if (res.resp_code == '000000') {
          if (this.merchantList.length > 0) {
            res.result.forEach(item => {
              item.consumeTaskVOs.forEach(items => {
                var id = Math.floor(Math.random() * this.merchantList.length);
                items.consumeType = this.merchantList[id].value
              })
            });
            this.merchantList.forEach(type => {
              var text = {text: type.merchant_display_name, id: type.id, value: type.value}
              this.columns.push(text)
            });
          }
          this.task = res
        } else if (res.resp_code == '999994') {
          this.$notify({type: "warning", message: res.resp_message});
        }
      })
    },
    smsConfirm(sms) {        //确认绑定多通道
      if (sms == '' || sms == null) {
        this.$toast({message: '请输入验证码', position: 'bottom'})
        return
      }
      request({
        url: this.confirmSmsUrl.substring(6),
        method: 'post',
        data: qs.stringify({
          bankCard: this.item.cardNo,
          idCard: this.item.idcard,
          phone: this.item.phone,
          userName: this.item.userName,
          bankName: this.item.bankName,
          expiredTime: this.item.expiredTime,
          securityCode: this.item.securityCode,
          channelTag: this.channelTags,
          smsCode: sms,
        })
      }).then(res => {
        if (res.resp_code == '000000') {
          this.$toast({message: res.resp_message, position: 'bottom'})
          this.$refs.Dialog.close()
          this.$router.push({
            path: "/creditcard",
            query: {
              'phone': localStorage.getItem('phone'),
              'token': localStorage.getItem('token'),
              'brandId': localStorage.getItem('brandId'),
              'userId': localStorage.getItem('userId'),
              'ip': this.global.ip,
              'type': 'h5',
              'deviceId': localStorage.getItem('deviceId')
            }
          })
        }
      }, err => {
        this.$toast({message: res.resp_message, position: 'bottom'})
      })
    },
    getCode() {        //绑定多通道验证码
      request({
        url: this.getSmsUrl,//'paymentgateway/verification/getsmscode',
        method: 'post',
        data: qs.stringify({
          bankCard: this.item.cardNo,
          idCard: this.item.idcard,
          phone: this.item.phone,
          userName: this.item.userName,
          bankName: this.item.bankName,
          expiredTime: this.item.expiredTime,
          securityCode: this.item.securityCode,
          channelTag: this.channelTags,
        })
      }).then(res => {
        if (res.resp_code == '000000') {
          let timer = setInterval(() => {
            this.message = '(' + this.num + ')秒'
            this.num--
            if (this.num == 0) {
              clearInterval(timer)
              this.num = 60
              this.message = '获取验证码'
            }
          }, 1000)
          this.$toast({message: '验证码发送成功,请注意查收', position: 'bottom'})
        }
      })
    },
    topClose() {  //点击 x 跳转到信用卡列表
      this.$router.push({
        path: "/creditcard",
        query: {
          'phone': localStorage.getItem('phone'),
          'token': localStorage.getItem('token'),
          'brandId': localStorage.getItem('brandId'),
          'userId': localStorage.getItem('userId'),
          'ip': this.global.ip,
          'type': 'h5',
          'deviceId': localStorage.getItem('deviceId')
        }
      })
    },
    onChange(picker, values) {
      this.columnsActive.consumeType = values.value
    },
    consumeTypeConfirm(val, key) {
      this.columnsActive.consumeType = val.value
      this.show = false
    },
    merchant(extra, merchantList) {
      this.merchantTrueFalseBy = true
      this.merchantList = JSON.parse(merchantList)
      this.createTask(this.task)
      this.extra = JSON.parse(extra)
    },
    temporaryplan() {
      // this.$refs.verificationMethod.choseAdd()
      this.$refs.verificationMethod.firstSelPro()
    },
    //  showPlanBill(){
    //    this.$refs.planBillTips.planBillTipsTrueFalseBy=true
    //  },
    isPassword() {
      let yanzheng = this.global.dontPayPawBrandid.indexOf(Number(this.task.brandId))
      if (yanzheng == -1) {
        this.confirmPlan()
      } else {
        this.$refs.isPassword.onshow()
      }
    },
    confirmPlan() {   //提交计划
      var province = this.extra.merprovince + '-' + this.extra.mercity + '-' + this.extra.merarea;
      var json = JSON.stringify(this.task.result);
      var version = this.task.version.split("-")[0]
      // return
      if (version == 4 || version == 8 || version == 43 || version == 58 || version == 59 || version == 54 || version == 55 || version == 61 || version == 65 || version == 50 || version == 75 || version == 84) {
        province = this.extra.merprovince + '-' + this.extra.mercity + '[' + this.extra.merarea + ']'
      } else if (version == 32 || version == 39 || version == 46 || version == 47 || version == 52 || version == 62 || version == 66 || version == 69 || version == 71 || version == 73 || version == 74 || version == 76 || version == 80 || version == 81 || version == 82 || version == 83 || version == 86 || version == 89) {
        province = this.extra.merprovince + '-' + this.extra.mercity
      } else if (version == 5 || version == 37 || version == 44 || version == 70 || version == 85 || version == 87) {
        province = this.extra.merprovince + '-' + this.extra.mercity + '(' + this.extra.merarea + ')'
      } else if (version == 7 || version == 38) {
        province = ""
      } else {
        province = this.extra.merprovince + '-' + this.extra.mercity + '-' + this.extra.provinceId.split(',')[0] + '-' + this.extra.cityCode.split(',')[0]
      }

      this.$store.commit('Loading')
      creditcardSaveTask(json, this.task.amount, this.task.reservedAmount, this.task.version, province, '', JSON.stringify(this.extra), this.task.couponId, this.item.cardNo).then(res => {
        this.$store.commit('closeLoading')
        if (res.resp_code == "000000") {
          this.$router.push({
            path: "/creditcard",
            query: {
              'phone': localStorage.getItem('phone'),
              'token': localStorage.getItem('token'),
              'brandId': localStorage.getItem('brandId'),
              'userId': localStorage.getItem('userId'),
              'ip': this.global.ip,
              'type': 'h5',
              'deviceId': localStorage.getItem('deviceId')
            }
          })
        } else if (res.resp_code == '999992') {
          this.$router.push({
            name: 'confirmPlan',
            params: {
              channelactive: JSON.stringify(version),
              authorityList: JSON.stringify(res),
              item: JSON.stringify(this.item),
              task: JSON.stringify(this.task),
              province: province,
              extra: this.extra,
              isold: 1
            }
          })
        }
      })
    }
  }
};
</script>
<style scoped>
.submit_plan_box {
  width: 100%;
  padding: 10px 10px 70px 10px;
}

.submit_plan_card_box {
  height: 50px;
  width: 100%;
  background: #fff;
  font-size: 13px;
  line-height: 50px;
  padding: 0 15px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.submit_plan_card_icon {
  height: 21px;
  width: 21px;
  border-radius: 50%;
  margin-right: 5px;
  vertical-align: sub;
}

.submit_plan_card_name {
  font-family: PingFang SC;
  font-weight: 500;
  display: inline-block;
  padding-right: 10px;
}

.submit_plan_card_no {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 400;
}

.card_item_sub {
  background: linear-gradient(270deg, #FE4557 0%, #FD6D5C 100%);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  /* margin-bottom: 10px; */
  padding: 15px;
  font-size: 14px;
  color: #fff;
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

.submit_plan_dec_box {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  font-size: 13px;
  padding: 25px 10px 10px 10px;
  margin-top: 10px;
  position: relative;
}

.submit_plan_dec {
  line-height: 28px;
  /* text-align: center; */
}

.submit_plan_dec_b {
  padding: 10px 0;
}

.submit_plan_dec_title {
  padding-bottom: 5px;
}

.submit_plan_dec_cont {
  font-size: 15px;
  font-weight: 300;
}

.submit_plan_city_box {
  font-size: 14px;
  padding: 0 10px;
  line-height: 38px;
}

.submit_plan_city_left img {
  width: 12px;
  height: 12px;
  margin-right: 5px;
}

.submit_plan_city_left span {
  height: 14px;
  line-height: 14px;
}

/* 计划列表 */
.plan_right {
  text-align: right;
  color: #666;
}

.plan_dec_box {
  font-size: 14px;
  margin: 15px 0 10px 0;
}

.plan_dec_box span:nth-child(1) {
  height: 14px;
  width: 2px;
  margin-right: 5px;
  display: inline-block;
  vertical-align: middle;
}

.plan_dec_box span:nth-child(2) {
  vertical-align: middle;
}

.plan_list {
  width: 100%;
  height: auto;
  background: rgba(255, 255, 255, 1);
  border-radius: 12px;
  font-size: 12px;
  padding: 10px 13px;
  margin-top: 12px;
  color: #666;
}

.plan_title {
  font-size: 13px;
  font-weight: 500;
  color: #121212;
}

.plan_item {
  border-left: 1px dashed #C2C2C2;
  position: relative;
}

.plan_item_box {
  display: flex;
  line-height: 28px;
  padding-left: 8px;
  /* padding-right: 6px; */
}

.repayment_status {
  width: 8px;
  height: 8px;
  background: rgba(173, 205, 255, 1);
  position: absolute;
  border-radius: 50%;
  left: -4px;
  bottom: 10px
}

.repayment_status > div {
  display: inline-block;
  width: 4px;
  height: 4px;
  background: rgba(60, 132, 242, 1);
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  border-radius: 50%;
}

.plan_item_item {
  /* flex: 1; */
}

.plan_item_item.type {
  text-align: center;
  width: 120px;
}

.plan_item_item.consumeType {
  text-align: left;
  position: relative;

}

.plan_item_item.amount {
  text-align: left;
  width: 100px;
}

.plan_item_item.time {
  width: 160px;
}

.plan_items_amount_box {
  line-height: 24px;
}

.consume_icon {
  width: 12px;
}

.plan_item_amount img {
  height: 16px;
  width: 16px;
  vertical-align: middle;
  margin-right: 8px;
}

.plan_item_amount span {
  vertical-align: middle;
}

.plan_item_time img {
  height: 11px;
  width: 11px;
  vertical-align: middle;
  margin-right: 8px;
}

.plan_item_time span {
  font-size: 12px;
  vertical-align: middle;
}

.plan_items_consumeType {
  line-height: 30px;
  padding-bottom: 5px;
  font-size: 13px;
}

.plan_task_box {
  line-height: 40px;
  font-size: 14px;
}

.consumeTaskVOs_item_select {
  width: 100%;
  height: 30px;
  line-height: 30px;
  border: none;
  outline: none;
}

.executeplan_btn {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  border-radius: 0;
  font-size: 16px;
  text-align: center;
  height: 65px;
  padding: 8px 30px;
  /* line-height: 55px; */
  background: #F5F5F5;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.5);
}

.confirmplan_btn.one {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 0px 0px rgba(204, 204, 204, 1);
}

.confirmplan_btn.two {
  color: rgba(255, 255, 255, 1);
  width: 100%;
  height: 100%;
  border-radius: 25px;
  line-height: 49px;
}

</style>
