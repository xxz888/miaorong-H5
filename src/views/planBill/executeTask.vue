<template>
  <div>
    <van-nav-bar :title="type==2?'计划详情':'空卡详情'" left-arrow @click-left="onClickLeft"/>
    <!-- @click-right=" bind ? opBind():'' "  :right-text='bind ? "多通道设置" : "" ' -->
    <div class="warpper">
      <div class="submit_plan_box" v-if="maintaskList.newResult!=undefined">
        <div class="card_item_sub">
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
              <van-col span="20" class="card_bank">
                <div class="  van-ellipsis">
                  {{ item.bankName }} &nbsp;
                  <span class="">({{ item.creditCardNumber |cardNoEnd }})</span>
                </div>
                <div class="card_type ">
                  账单日 每月{{ detail.billDay }}日｜还款日 每月{{ detail.repaymentDay }}日
                </div>
              </van-col>
            </van-row>
          </div>
        </div>
        <div class="submit_plan_dec_box">
          <van-row type="flex">
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">还款总次数：</span>
              <span class="submit_plan_dec_cont">{{ detail.totalAmount[0].taskCount }}次</span>
            </van-col>
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">已还次数：</span>
              <span class="submit_plan_dec_cont"> <span
                class="">{{ detail.totalAmount[0].repaymentedSuccessCount }}</span>次</span>
            </van-col>
          </van-row>
          <van-row type="flex">
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">还款总金额：</span>
              <span class="submit_plan_dec_cont">{{ Number(detail.totalAmount[0].taskAmount) |toFixed }}元</span>
            </van-col>
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">已还金额：</span>
              <span class="submit_plan_dec_cont">{{ Number(detail.totalAmount[0].repaymentedAmount) |toFixed }}元</span>
            </van-col>
          </van-row>
          <van-row type="flex" class="submit_plan_dec  ">
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">预计手续费：</span>
              <span class="submit_plan_dec_cont">{{ Number(detail.totalAmount[0].totalServiceCharge) |toFixed }}元</span>
            </van-col>
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">已扣手续费：</span>
              <span class="submit_plan_dec_cont">{{ Number(detail.totalAmount[0].usedCharge) |toFixed }}元</span>
            </van-col>
          </van-row>
        </div>
        <ul class="plan_list">
          <li class="plan_title">
            <ul class="plan_item_box">
              <li class="plan_item_item">时间</li>
              <li class="plan_item_item type">类型</li>
              <li class="plan_item_item amount">金额</li>
              <li class="plan_item_item consumeType">状态</li>
            </ul>
          </li>
          <li class="plan_item" v-for="item in detail.totalOrder" @click="taskDetail(item,$event)" :key="item.key">
            <div class="repayment_status" v-if="item.type==11">
              <div></div>
            </div>
            <ul class="plan_item_box">
              <li class="plan_item_item time">
                <span v-if="type==2">  {{ executeDateTime(item.executeDateTime) }} </span>
                <span v-if="type==3">  {{ executeDateTimeZero(item.executeDateTime) }} </span>
              </li>
              <li class="plan_item_item type">
                {{ item.type |taskDetailType }}
              </li>
              <li class="plan_item_item amount">
                <span v-if="item.type=='10'">-{{ Number(item.realAmount)  | toFixed }}</span>
                <span v-else>
                  <span v-if="item.taskStatus==1 && item.orderStatus==1">
                    +{{Number(item.realAmount) | toFixed }}
                  </span>
                  <span v-else>+{{ Number(item.amount)  | toFixed }} </span>
                </span>
              </li>
              <li class="plan_item_item  consumeType  " :class="'plan_task_'+taskStatusType(item).split('-')[1]">
                {{ taskStatusType(item).split('-')[0] }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="executeplan_btn " v-if="String(deltaskStatus).indexOf('0')>-1 && item.isCanDelete==1 && type==2 ">
        <div @click="delplan($event)" class="confirmplan_btn two theme_btn">终止计划</div>
      </div>
      <div class="task_detail_box" v-if="taskDetailTrueFalseBy">
        <div class="task_detail">
          <div class="task_detail_title">
            <span>{{ taskDetailItem.type| taskDetailType }}</span>明细
          </div>
          <div class="task_detail_cont">
            <div class="task_detail_cont_top">
              <van-row type="flex" class="task_detail_item">
                <van-col v-if="taskDetailItem.orderCode!=0">
                  <div>订单号：
                    <span>{{ taskDetailItem.orderCode }}</span>
                  </div>
                </van-col>
              </van-row>
              <van-row type="flex" class="task_detail_item">
                <van-col span="14">
                  <div>计划金额：<span class="task_detail_item_right">{{ taskDetailItem.amount }}</span></div>
                </van-col>
                <van-col span="14">
                  <span v-if="taskDetailItem.type==10">扣款金额：</span>
                  <span v-else>还款金额：</span>
                  <span class="task_detail_item_right">{{ taskDetailItem.realAmount }}</span>
                </van-col>
              </van-row>
              <van-row type="flex" class="task_detail_item">
                <van-col span="14">
                  <div>计划手续费：<span class="task_detail_item_right">{{ taskDetailItem.totalServiceCharge }}</span></div>
                </van-col>
                <van-col span="14">
                  <div>计划费率：<span class="task_detail_item_right">0.85%</span></div>
                </van-col>
              </van-row>
              <van-row type="flex" class="task_detail_item">
                <van-col span="14">
                  <div>计划类型：<span class="task_detail_item_right">{{ taskDetailItem.type |taskDetailType }} </span></div>
                </van-col>
                <van-col span="14">
                  <div>计划状态：
                    <span class="plan_task_success"
                          v-if="taskDetailItem.taskStatus==1 && taskDetailItem.orderStatus==1">已成功</span>
                    <span class="plan_task_await" v-if="taskDetailItem.taskStatus==0">待执行</span>
                    <span class="plan_task_await" v-if="taskDetailItem.taskStatus==1 && taskDetailItem.orderStatus==4">执行中</span>
                    <span class="plan_task_error" v-if="taskDetailItem.taskStatus==2 || taskDetailItem.taskStatus==4">已失败</span>
                  </div>
                </van-col>
              </van-row>
            </div>
            <div class="task_detail_cont_top">
              <van-row type="flex" class="task_detail_item">
                <van-col>
                  <div v-if="taskDetailItem.taskStatus==4 || taskDetailItem.taskStatus==2">
                    失败原因：{{ taskDetailItem.returnMessage }}
                  </div>
                  <div v-else>计划描述：{{ taskDetailItem.description }}</div>
                </van-col>
              </van-row>
              <van-row type="flex" class="task_detail_item">
                <van-col>
                  <div>计划执行时间：{{ taskDetailItem.executeDateTime }}</div>
                </van-col>
              </van-row>
            </div>
          </div>
          <div class="task_detail_close_box" @click="taskDetailTrueFalseBy=false">
            <div class="task_detail_close"></div>
          </div>
        </div>
      </div>
      <van-empty description="暂无数据" v-if="maintaskList.newResult==undefined || maintaskList.newResult.length==0" />
    </div>
    <diyconfirm ref="confirm" src='../../assets/alert.png' but='1'
                zi='点“确定”删除后将不再执行“待执行”计划,如需执行请重新安排' @disconfirm='delplanone'/>
    <verification ref="verificationMethod" :authorityList="authorityList" :type="type"
                  :orderCode="orderCode"></verification>
    <confirmorcancel ref="Dialog" src='../../assets/alert2.png' but='2'
                     :zi='start' @smsConfirm='smsConfirm' @getCode='getCode()' :message='message' @topClose='topClose'/>
  </div>
</template>
<script>
import {NavBar, Row, Col, PullRefresh, Empty, Button} from "vant";
import {repaymentOrderDetailQuery} from "@/api/bill"
import confirmorcancel from '@/components/confirm/alert'
import diyconfirm from '@/components/confirm/alert'
import verification from "@/components/verification/verification"
import {cardQuery} from '@/api/card/card'
import request from '@/utils/request'
import {creditcardCreatetime, cardIsuserable, repaymenttaskdelete, isChannelBind} from "@/api/plan/plan";
import qs from 'qs'

export default {
  data() {
    return {
      bind: false,
      card: {},
      item: {},
      task: {},
      count: 0,
      isLoading: false,
      size: 20,
      maintaskList: {
        newResult: {},
        repaymentBill: {
          autoRepayment: 0,
          bankName: "",
          brandId: "",
          channelName: "大额还款Y4",
          consumedAmount: 200,
          couponId: "",
          createTime: "",
          creditCardNumber: "",
          executeDates: "",
          id: 478748,
          isCanDelete: 1,
          isClosed: 0,
          lastExecuteDateTime: "",
          oldTaskAmount: 200,
          orderCode: "",
          phone: "",
          rate: 0.009,
          repaymentedAmount: 200,
          repaymentedCount: 1,
          repaymentedSuccessCount: 1,
          reservedAmount: 229,
          selectCity: "",
          serviceCharge: 1,
          startDate: null,
          taskAmount: 200,
          taskConsumeAmount: 200,
          taskCount: 1,
          taskStatus: 1,
          totalServiceCharge: 2.83,
          type: 0,
          usedCharge: 2.83,
          userId: "",
          userName: "",
          version: "",
        },
        result: {},
      },
      percent: 50,
      rangeNumber: "",
      taskDetailTrueFalseBy: false,
      taskDetailItem: {},
      totalServiceChargeTrueFalseBy: false,
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
      channelactive: {},
      type: "planDetail",
      orderCode: "",//验证码获取之后返回
      dateTime: "",//当前时间
      deltaskStatus: [],
      delplanid: [],
      detail: {
        billDay: "",
        repaymentDay: "",
        totalAmount: [{
          consumedAmount: 0,
          repaymentedAmount: 0,
          repaymentedCount: 0,
          repaymentedSuccessCount: 0,
          totalServiceCharge: 0,
          usedCharge: 0,
        },
        ],
        totalOrder: [],
      },
      getSmsUrl: '',
      confirmSmsUrl: '',
      channelTags: '',
      message: '获取验证码',
      start: '为保障用户还款时的多元化场景，更有利于养卡提额，建立一个还款多元化消费、多通道介入机制和即时切换机制，请您确认是否体验此功能',
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [Row.name]: Row,
    [Col.name]: Col,
    [PullRefresh.name]: PullRefresh,
    verification,
    // nodata,
    [Empty.name]: Empty,
    [Button.name]: Button,
    diyconfirm,
    confirmorcancel
  },
  created() {
    this.item = JSON.parse(this.$route.params.item);
    this.type = JSON.parse(this.$route.params.type);
    this._cardQuery()
    this._repaymentOrderDetailQuery()
  },
  methods: {
    onClickLeft() {
      window.history.back()
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
    executeDateTime(item) {
      var date = item, arr = item.split(' ')
      date = arr[0].split('-')[1] + '-' + arr[0].split('-')[2] + ' ' + arr[1].split(':')[0] + ':' + arr[1].split(':')[1]
      return date
    },
    executeDateTimeZero(item) {
      var date = item, arr = item.split(' ')
      date = arr[0].split('-')[1] + '-' + arr[0].split('-')[2]
      return date
    },
    taskStatusType(item) {
      var status = ''
      if (item.taskStatus == 1 && item.orderStatus == 1) {
        status = '已成功-success'
      } else if (item.taskStatus == 0) {
        status = '待执行-await'
      } else if (item.taskStatus == 1 && item.orderStatus == 4) {
        status = '执行中-await'
      } else if (item.taskStatus == 1 || item.orderStatus == 5) {
        status = '待完成-await'
      } else if (item.taskStatus == 2 || item.taskStatus == 4) {
        status = '已失败-error'
      } else if (item.taskStatus == 2 || item.taskStatus == 5) {
        status = '待完成-await'
      }
      return status
    },
    onClickRight() {
      this.$router.push({
        name: 'taskBill',
        params: {item: JSON.stringify(this.item)}
      });
    },
    _repaymentOrderDetailQuery() {
      repaymentOrderDetailQuery(this.item.brandId, this.item.userId, this.type, this.item.creditCardNumber, this.item.createTime).then(res => {
        if (res.resp_code == "000000") {
          this.detail = res.result.content
          this.deltaskStatus = []
          res.result.content.totalOrder.forEach((item, index) => {
            this.deltaskStatus.push(item.taskStatus)
            if (item.taskStatus == 0 && item.type == 11 && this.item.isCanDelete == 1) {
              this.delplanid.push(item.taskId);
            }
          })
        }
      })
    },
    gettaskbil() {
      cardIsuserable(this.item.userId, this.item.brandId, this.item.creditCardNumber, this.item.version).then(res => {
        if (res.resp_code == '999992') {
          this.authorityList = res
          this.$dialog.confirm({
            title: '温馨提示',
            message: res.resp_message
          }).then(() => {
            request({
              url: res.result.getSmsUrl,
              method: 'post',
              data: qs.stringify({
                bankCard: res.result.bankCard,
                bankName: res.result.bankName,
                channelTag: res.result.channelTag,
                expiredTime: res.result.expiredTime,
                idCard: res.result.idCard,
                phone: res.result.phone,
                securityCode: res.result.securityCode,
                userName: res.result.userName,
                rate: res.result.rate,
                extraFee: res.result.extraFee,
                dbankCard: res.result.dbankCard,
                dbankName: res.result.dbankName,
                dphone: res.result.dphone,
              }),
            }).then(response => {
              if (response.resp_code == '000000') {
                this.$refs.verificationMethod.verificationCodeTrueFalseBy = true
              } else if (response.resp_code == '999995') {
                this.$refs.verificationMethod.verificationCodeTrueFalseBy = true
                this.orderCode = res.result
              } else if (response.resp_code == '666666') {
                this.$dialog.alert({
                  title: '温馨提示',
                  message: response.resp_message
                })
              } else if (response.resp_code == '999991') {
                var odiv = document.createElement("div");
                odiv.innerHTML = response.result
                document.body.appendChild(odiv);
                if (document.getElementById('pay_form') == null) {
                  document.getElementById('gatewayform').submit()
                } else {
                  document.getElementById('pay_form').submit()
                }
              } else if (response.resp_code == '999996') {
                this.$router.push({
                  name: 'link',
                  params: {url: JSON.stringify(response.result), title: JSON.stringify("权限认证")}
                })
              } else if (response.resp_code == '999997') {
                window.location.href = res.result
              }
            })
          })
        } else if (res.resp_code == "999994") {
          this.$dialog.alert({
            title: '温馨提示',
            message: res.resp_message
          })
        } else if (res.resp_code == '999995') {
          window.location.href = res.result
        } else if (res.resp_code == "999996") {
          this.$vux.alert.show({
            title: '温馨提示',
            content: "您好系统检测到您的银行卡需要授权验证，不进行验证将导致计划执行失败，请尽快去验证！",
            onHide() {
              this.$router.push({
                name: "link",
                params: {
                  url: JSON.stringify(res.data.result),
                  title: JSON.stringify("权限认证")
                }
              });
            }
          })
        } else if (res.resp_code == "999989") {
          window.location.href = "https://mc.mingchetech.com/public_link/channelAuth/index.html#/channel?parameters=" + JSON.stringify(res.data.parameters) + '&token=' + localStorage.getItem('token') + '&ip=' + this.global.ip
          // window.open("http://localhost:8081/#/channel?parameters="+JSON.stringify(res.data.parameters)+'&token='+localStorage.getItem('token')+'&ip='+this.global.ip)
        }
      })
    },

    _channelBind() { //是否绑定多通道
      isChannelBind(this.card.cardNo, this.card.idcard, this.card.phone, this.card.userName, this.card.userName, this.card.expiredTime, this.card.securityCode, this.card.cardNo, this.card.phone, this.card.userName, this.card.phone).then(res => {
        if (res.result == null || res.result == undefined || res.resp_message == '通道都已绑定!') {
          this.bind = false
        } else {
          this.bind = true
          this.getSmsUrl = res.result.getSmsUrl
          this.confirmSmsUrl = res.result.confirmSmsUrl
          this.channelTags = res.result.channelTag
        }
      })
    },
    _cardQuery() { //当前银行卡
      cardQuery(this.item.userId).then(res => {
        if (res.resp_code == '000000') {
          res.result.forEach(item => {
            if (item.cardNo == this.item.creditCardNumber) {
              this.card = item
              this._channelBind()
            }
          })
        }
      })
    },
    opBind() {
      this.$refs.Dialog.disopen()
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
          bankCard: this.card.cardNo,
          idCard: this.card.idcard,
          phone: this.card.phone,
          userName: this.card.userName,
          bankName: this.card.bankName,
          expiredTime: this.card.expiredTime,
          securityCode: this.card.securityCode,
          channelTag: this.channelTags,
          smsCode: sms,
        })
      }).then(res => {
        if (res.resp_code == '000000') {
          this._channelBind()
          this.$toast({message: res.resp_message, position: 'bottom'})
          this.$refs.Dialog.close()
        }
      }, err => {
        this.$toast({message: res.resp_message, position: 'bottom'})
      })
    },
    getCode() {      //绑定多通道验证码
      request({
        url: this.getSmsUrl,
        method: 'post',
        data: qs.stringify({
          bankCard: this.card.cardNo,
          idCard: this.card.idcard,
          phone: this.card.phone,
          userName: this.card.userName,
          bankName: this.card.bankName,
          expiredTime: this.card.expiredTime,
          securityCode: this.card.securityCode,
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
    topClose() {  //点击 x 关闭弹窗
      this.$refs.Dialog.close()
    },
    delplan(event) {   //终止计划
      this.$refs.confirm.disopen()
    },
    delplanone() {
      repaymenttaskdelete(String(this.delplanid)).then(res => {
        if (res.resp_code == "000000") {
          this.$notify({type: "primary", message: res.resp_message});
          this.onClickLeft()
        }
      })
    },
    taskDetail(item, event) { //账单详情
      event.cancelBubble = true;
      this.taskDetailTrueFalseBy = true
      this.taskDetailItem = item
    },
    totalServiceChargeTips() {
      this.totalServiceChargeTrueFalseBy = true
    },
    serviceCharge() {
      this.$dialog.alert({
        title: '温馨提示',
        message: '预留金额不足，将导致还款任务失败'
      })
    },
    onRefresh() {
      setTimeout(() => {
        this.$toast("刷新成功");
        this.isLoading = false;
        this.count++;
      }, 500);
    }
  }
};
</script>
<style scoped>

/* 新计划详情 */
.submit_plan_box {
  width: 100%;
  padding: 10px 10px 54px 10px;
}

.submit_plan_card_box {
  /* height: 50px; */
  width: 100%;
  background: #fff;
  font-size: 13px;
  /* line-height: 50px; */
  padding: 5px 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  position: relative;

}

.submit_plan_card_icon_box {
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  position: relative;
  margin-right: 10px;
}

.submit_plan_card_icon {
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

.submit_plan_card_name {
  font-family: PingFang SC;
  font-weight: 500;
  display: inline-block;
  line-height: 50px;
}

.submit_plan_card_no {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 50px;
  color: #999;
}

.submit_plan_dec_box {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  font-size: 13px;
  padding: 15px 10px 0 10px;
}

.submit_plan_dec {
  text-align: left;
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

.submit_plan_close {
  width: 75px;
  height: 22px;
  background: rgba(60, 132, 242, 1);
  box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  font-size: 12px;
  color: #fff;
  line-height: 22px;
  text-align: center;
  position: absolute;
  right: 15px;
  top: 0;
  bottom: 0;
  margin: auto 0;
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
  text-align: left;
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
  flex: 1;
}

.plan_item_item.time {
  font-size: 12px;
}

.plan_item_item.type {
  text-align: center;
}

.plan_item_item.consumeType {
  text-align: center;
  position: relative;
}

.plan_item_item.amount {
  text-align: center;
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
  height: 44px;
  line-height: 44px;
}

.confirmplan_btn.one {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 0px 0px rgba(204, 204, 204, 1);
}

.confirmplan_btn.two {
  color: rgba(255, 255, 255, 1);
}

/* 新计划详情 */


/* 计划详情 */
.plan_detail_box {
  padding: 0 15px;
}

.plan_detail {
  width: 100%;
  /* height:488px; */
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.08);
  border-radius: 13px;
  padding: 0 13px 10px 10px;
  margin-top: 10px;
}

.plan_title {
  height: 45px;
  line-height: 45px;
  font-size: 14px;
}

.plan_icon {
  vertical-align: sub;
  height: 18px;
  width: 18px;
}

.plan_detail_content {
  font-size: 14px;
  padding: 8px 0;
}

.plan_detail_content .detail_item {
  line-height: 33px;
}

.plan_detail_content .detail_left {
  color: #616161;
}

.plan_detail_content .detail_right {
  color: #121212;
}

.detail_circle {
  height: 40px;
}

.plan_list_item {
  overflow: hidden;
}

.plan_list_item .left {
  float: left;
  width: 55px;
}

.plan_list_item .right {
  float: left;
  width: 100%;
  height: 100%;
}

.plan_task_icon {
  height: 49px;
  width: 49px;
}

.plan_task_time {
  font-size: 10px;
  color: #8d8d8d;
}

.plan_task_right {
  text-align: right;
  font-size: 18px;
}

.plan_right {
  text-align: right;
}

.plan_task_center {
  text-align: center;
}

.plan_task_right .yuan {
  font-size: 10px;
}

.plan_task_consume {
  font-size: 14px;
}

.plan_task_consume_type {
  color: #616161;
  font-size: 16px;
}

.plan_task_success {
  /* font-size:14px; */
  color: #87dc5b;
}

.plan_task_await {
  /* font-size:14px; */
  color: #ffc107;
}

.plan_task_error {
  /* font-size:14px; */
  color: #ff5722;
}

.detail_right_tips {
  font-size: 10px;
}

div.progressContainer {
  height: 5px;
  width: 96%;
  border-radius: 5px;
  background-color: #ddd;
  margin-left: 2%;
}

div.progress {
  background-color: #9ae076;
  border-radius: 5px;
  height: 5px;
  line-height: 5px;
}

.progressContainer_det {
  color: #8d8d8d;
  font-size: 10px;
  /* position:absolute;
	      left:40%;  */
}

.progressContainer_det span {
  font-size: 10px;
  color: #121212;
}

.task_detail_box {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;
}

.task_detail {
  width: 80%;
  /* height:748px; */
  background: rgba(255, 255, 255, 1);
  border-radius: 16px;
  position: absolute;
  top: 122px;
  left: 0;
  right: 0;
  margin: auto;
}

.task_detail_title {
  background: url('../../assets/task_detail_title.png') center no-repeat;
  background-size: 100% 100%;
  font-size: 17px;
  height: 51px;
  line-height: 51px;
  text-align: center;
}

.task_detail_cont {
  padding: 5px 15px;

}

.task_detail_close_box {
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  bottom: -75px;
  text-align: center;
  height: 45px;
  width: 45px;
}

.task_detail_close {
  background: url('../../assets/delete_icon.png') center no-repeat;
  background-size: 100% 100%;
  height: 30px;
  width: 30px;
  margin: 0 auto;
}

.task_detail_cont_top {
  font-size: 12px;
  color: #616161;
}

.task_detail_item {
  line-height: 34px;
}

.task_detail_cont_bottom {
  font-size: 12px;
}

.task_detail_item_right {
  color: #333;
}

.detail_item_type {
  padding: 6px 0;
}

.to_top {
  background: url("../../assets/toTop.png") center no-repeat;
  background-size: 100% 100%;
  height: 50px;
  width: 50px;
  position: fixed;
  right: 15px;
  bottom: 50px;
}

.detail_doubt_icon {
  height: 15px;
  width: 15px;
  display: inline-block;
  background: url("../../assets/doubt_icon.png") center no-repeat;
  background-size: 100% 100%;
  vertical-align: text-top;
}

.plan_task_right .plan_task_btn {
  display: inline-block;
  font-size: 12px;
  width: 45px;
  height: 20px;
  border-radius: 22px;
  text-align: center;
  line-height: 20px;
}

.plan_task_right .plan_task_btn.detail {
  color: rgba(53, 167, 253, 1);
  border: 1px solid rgba(53, 167, 253, 1);
}

.plan_task_right .plan_task_btn.del {
  color: rgba(153, 153, 153, 1);
  border: 1px solid rgba(153, 153, 153, 1);
}

.totalservicecharge_mask {
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 300;
}

/* 取消计划 */
.plan_detail_dec {
  padding: 10px 18px;
  font-size: 14px;
  background: #fff;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.08);
  border-radius: 13px;
  margin-top: 15px;

}

.plan_detail_status {
  line-height: 30px;
}

.plan_detail_status .status {
  text-align: right;
}

.plan_detail_del {
  line-height: 30px;
  height: 30px;
  position: relative;
}

.plan_detail_del > div {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 70px;
  height: 20px;
  background: rgba(255, 255, 255, 1);
  border-radius: 13px;
  border: 1px solid rgba(151, 151, 151, 1);
  font-size: 12px;
  text-align: center;
  line-height: 20px;
}


.plan_description {
  color: #f44336;
  font-size: 12px;
}

.plan_taskStatus {
  font-size: 13px;
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

.taskStatus4 {
  color: #ff5722;
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

.confirmplan_btn.two {
  color: rgba(255, 255, 255, 1);
  width: 100%;
  height: 100%;
  border-radius: 25px;
  line-height: 49px;
}


</style>
