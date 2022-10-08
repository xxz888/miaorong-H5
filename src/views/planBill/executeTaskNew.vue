<template>
  <div>
    <van-nav-bar :title="!task.id?'计划预览':'计划详情'" left-arrow @click-left="onClickLeft"/>
    <div class="warpper">
      <div class="submit_plan_box">
        <div class="card_item_sub">
          <div class="card_item_top ">
            <van-row type="flex" class="card_item_top" justify="space-between">
              <van-col span='3'>
                <div class="card_icon_box">
                  <img
                    class="card_icon"
                    :src="require('../../assets/bankIcon/BANK_'+item.logimg+'.png')"/>
                </div>
              </van-col>
              <van-col span="20" class="card_bank">
                <div class="  van-ellipsis">
                  {{ item.bankName }} &nbsp;
                  <span v-if='item.cardNo'>({{ item.cardNo |cardNoEnd }})</span>
                  <span v-else>({{ item.creditCardNumber |cardNoEnd }})</span>
                </div>
                <div class="card_type ">
                  账单日 每月{{ card.billDay }}日｜还款日 每月{{ card.repaymentDay }}日
                </div>
              </van-col>
            </van-row>
          </div>
        </div>
        <div class="submit_plan_dec_box">
          <van-row type="flex">
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">还款总次数：</span>
              <span class="submit_plan_dec_cont">{{ Number(task.taskCount) }}次</span>
            </van-col>
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">已还次数：</span>
              <span class="submit_plan_dec_cont">{{ task.completedCount }}次</span>
            </van-col>
          </van-row>
          <van-row type="flex">
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">还款总金额：</span>
              <span class="submit_plan_dec_cont">{{ Number(task.taskAmount) |toFixed }}元</span>
            </van-col>
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">已还金额：</span>
              <span class="submit_plan_dec_cont">{{ Number(task.repaymentedAmount) |toFixed }}元</span>
            </van-col>
          </van-row>
          <van-row type="flex">
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">预计手续费：</span>
              <span class="submit_plan_dec_cont">{{ Number(task.totalServiceCharge) |toFixed }}元</span>
            </van-col>
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">已扣手续费：</span>
              <span class="submit_plan_dec_cont">{{ task.usedServiceCharge |toFixed }}元</span>
            </van-col>
          </van-row>
          <van-row type="flex">
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">预计返现：</span>
              <span class="submit_plan_dec_cont">{{ Number(task.cashBacking) |toFixed }}元</span>
            </van-col>
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">已经返现：</span>
              <span class="submit_plan_dec_cont">{{ task.cashBacked |toFixed }}元</span>
            </van-col>
          </van-row>
        </div>
        <ul class="plan_list" v-if="!task.id">
          <li class="plan_title">
            <ul class="plan_item_box">
              <li class="plan_item_item time">时间</li>
              <li class="plan_item_item type">类型</li>
              <li class="plan_item_item amount">金额</li>
            </ul>
          </li>
          <li class="plan_item" v-for="item in task.balancePlanItemList" :key="item.key">
            <div class="repayment_status" v-if="item.type==2">
              <div></div>
            </div>
            <ul class="plan_item_box">
              <li class="plan_item_item time tiem">
                {{ item.executeTime }}
              </li>
              <li class="plan_item_item type">
                {{ item.description }}
              </li>
              <li class="plan_item_item amount">
                <span v-if="item.type==2">+</span><span v-else>-</span>{{ Number(item.amount)  | toFixed }}
              </li>
            </ul>
          </li>
        </ul>
        <ul class="plan_list" v-else>
          <li class="plan_title">
            <ul class="plan_item_box">
              <li class="plan_item_item time">时间</li>
              <li class="plan_item_item type">类型</li>
              <li class="plan_item_item amount">金额</li>
              <li class="plan_item_item consumeType">状态</li>
            </ul>
          </li>
          <li class="plan_item" v-for="item in task.balancePlanItemList" @click="taskDetail(item,$event)"
              :key="item.key">
            <div class="repayment_status" v-if="item.type==2">
              <div></div>
            </div>
            <ul class="plan_item_box">
              <li class="plan_item_item time tiem">
                {{ item.executeTime }}
              </li>
              <li class="plan_item_item type">
                {{ item.description }}
              </li>
              <li class="plan_item_item amount">
                <span v-if="item.type==2">+</span><span v-else>-</span>{{ Number(item.amount)  | toFixed }}
              </li>
              <li>
              <li class="plan_item_item  consumeType  " :class="'plan_task_'+taskStatusType(item).split('-')[1]">
                {{ taskStatusType(item).split('-')[0] }}
              </li>
            </ul>
          </li>
        </ul>
        <div class="executeplan_btn " v-if='!task.id||(task.status!=5 && task.status!=6 && task.status!=3 ) '>
          <div v-if='!task.id' @click="isuserable()" class="confirmplan_btn two theme_btn">启动计划</div>
          <div v-else-if="task.status!=5 && task.status!=6 && task.status!=3" @click="endplanMod()"
               class="confirmplan_btn two theme_btn">终止计划
          </div>
        </div>
      </div>
    </div>

    <div class="task_detail_box" v-if="taskDetailTrueFalseBy">
      <div class="task_detail">
        <div class="task_detail_title">
          <span>{{ taskDetailItem.type| taskDetailTypeNew }}</span>明细
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
                <span v-if="taskDetailItem.type==2">扣款金额：</span>
                <span v-else>还款金额：</span>
                <span class="task_detail_item_right">{{ taskDetailItem.amount }}</span>
              </van-col>
            </van-row>
            <van-row type="flex" class="task_detail_item">
              <van-col span="14">
                <div>计划手续费：<span class="task_detail_item_right">{{ taskDetailItem.serviceCharge }}</span></div>
              </van-col>
              <van-col span="14">
                <div>计划费率：<span class="task_detail_item_right">{{ handleRate() }}</span></div>
              </van-col>
            </van-row>
            <van-row type="flex" class="task_detail_item">
              <van-col span="14">
                <div>计划类型：<span class="task_detail_item_right">{{ taskDetailItem.description }} </span></div>
              </van-col>
              <van-col span="14">
                <div>计划状态：
                  <span class="plan_task_success" v-if="taskDetailItem.status==2 ">执行中</span>
                  <span class="plan_task_await" v-if="taskDetailItem.status==1">待执行</span>
                  <span class="plan_task_success" v-if="taskDetailItem.status==3 ">已成功</span>
                  <span class="plan_task_await" v-if="taskDetailItem.status==5 ">已取消</span>
                  <span class="plan_task_error" v-if="taskDetailItem.status==4 ">已失败</span>
                </div>
              </van-col>
            </van-row>
          </div>
          <div class="task_detail_cont_top">
            <van-row type="flex" class="task_detail_item">
              <van-col>
                <div v-if="taskDetailItem.status==4">失败原因：
                  <span v-if="taskDetailItem.message" class="plan_task_error">{{ taskDetailItem.message }}</span>
                  <span v-else class="plan_task_error">{{ task.message }}</span>
                </div>
                <div v-else>计划描述：{{ taskDetailItem.city }}</div>
              </van-col>
            </van-row>
            <van-row type="flex" class="task_detail_item">
              <van-col>
                <div>计划执行时间：{{ taskDetailItem.executeTime }}</div>
              </van-col>
            </van-row>
          </div>
        </div>
        <div class="task_detail_close_box" @click="taskDetailTrueFalseBy=false">
          <div class="task_detail_close"></div>
        </div>
      </div>

    </div>
    <van-popup position="bottom" :style="{ height: '45%' }" v-model="show">
      <van-picker show-toolbar title="落地商户" @cancel="showPicker = false" :columns="columns"
                  @confirm="consumeTypeConfirm" @change="onChange" :default-index="defConsumeType"/>
    </van-popup>
    <is-password ref="isPassword" v-on:confirmPlan="confirmPlan"></is-password>
    <confirmorcancel ref="causeMessage" src='../../assets/alert.png'
                     but='3' :zi='start'/>
  </div>
</template>

<script>
import {NavBar, Row, Col, Icon, Popup, Picker} from 'vant';
import confirmorcancel from '@/components/confirm/alert'
import {cardQuery} from "@/api/card/card";
import isPassword from "@/components/isPassword/isPassword"
import {balanceSaveEmptyCard, stopOrder, buildChannel} from "@/api/plan/plan";
import {causeMessage} from "@/api/zero";
import listener from "@/api/vueListener"
import {empowerTokenListener} from "@/api/vueListener";

export default {
  data() {
    return {
      userId: localStorage.getItem('userId'),
      planId: '',
      item: {},
      task: {},//查询出来通道
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
      extra: '',//选择的省市
      show: false,
      columns: [],
      columnsActive: {},
      defConsumeType: 0,//默认
      start: '',
      taskDetailTrueFalseBy: false,
      taskDetailItem: {},
      card: {},
      empowerToken: null
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Row.name]: Row,
    [Col.name]: Col,
    isPassword,
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    confirmorcancel
  },
  computed: {
    totalRepaymentAmount() { //已还金额
      let sum = 0
      this.task.balancePlanItemList.forEach(item => {
        if (item.type == 2 && item.status == 3) {
          sum += item.amount
        }
      })
      return sum
    }
  },
  created() {
    if (this.$route.query.empowerToken) {
      this.empowerToken = this.$route.query.empowerToken
    } else {
      this.empowerToken = null
    }
    this.item = JSON.parse(this.$route.params.item)
    this.task = JSON.parse(this.$route.params.task)
    this.extra = this.$route.params.extra
    listener.$on('backFromBindCard', data => {
      if (data == 1) {
        listener.$emit('backFromBindCard', 0)
        this.confirmPlan()
      }
    })
    this._cardQuery()
  },
  methods: {
    executeDateTime(item) {
      var date = item, arr = item.split(' ')
      date = arr[0].split('-')[1] + '-' + arr[0].split('-')[2] + ' ' + arr[1].split(':')[0] + ':' + arr[1].split(':')[1]
      return date
    },
    taskStatusType(item) {  //子任务状态
      var status = ''
      if (item.status == 1) {
        status = '待执行-await'
      } else if (item.status == 2) {
        status = '执行中-await'
      } else if (item.status == 3) {
        status = '已成功-success'
      } else if (item.status == 4) {
        status = '已失败-error'
      } else if (item.status == 5) {
        status = '已取消-await'
      }
      return status
    },
    onClickLeft() {   //返回按钮
      this.publicJs.back();
    },
    consumeTypeSplit(type) {
      var consumeType = type.consumeType
      if (type.consumeType.split('(').length > 1) {
        // consumeType=type.consumeType.split('(')[0]
        if (type.consumeType.split('(')[0] == "") {
          consumeType = type.consumeType.split('(')[1].split(')')[0]
        } else {
          consumeType = type.consumeType
        }
      } else if (type.consumeType.split('-').length > 1) {
        consumeType = type.consumeType.split('-')[0]
      } else if (type.consumeType.split('|').length > 1) {
        consumeType = type.consumeType.split('|')[1]
      }
      return consumeType
    },
    showConsumeType(items) {
      this.columnsActive = items
      this.merchantList.forEach((type, index) => {
        if (type.value == items.consumeType) {
          this.defConsumeType = index
          return
        }
      });
      this.show = true
    },
    onChange(picker, values) {
      this.columnsActive.consumeType = values.value
    },
    consumeTypeConfirm(val, key) {
      this.columnsActive.consumeType = val.value
      this.show = false
    },
    isPassword() {
      let yanzheng = this.global.dontPayPawBrandid.indexOf(Number(this.task.brandId))
      if (yanzheng == -1) {
        this.confirmPlan()
      } else {
        this.$refs.isPassword.onshow()
      }
    },
    _causeMessage(item) { //查看子选择失败原因
      causeMessage(item.id).then(res => {
        if (res.resp_code == '000000') {
          this.start = res.resp_message
          this.$refs.causeMessage.disopen()
        } else {
          this.start = res.resp_message
          this.$refs.causeMessage.disopen()
        }
      }).catch(err => {

      })
    },
    handleRate(){
      return this.task.rate*100+'%'
    },
    isuserable() { //验证用户是否需要绑卡
      var executeTime = this.task.balancePlanItemList[this.task.balancePlanItemList.length-1].executeTime
      var curTime =  new Date()
      var day = curTime.getDate()
      if(day > this.task.repaymentDay){
        curTime.setMonth(curTime.getMonth()+1)
      }
      var year = curTime.getFullYear()
      var month = curTime.getMonth()+1
      month = month<10 ? '0'+month : ''+month
      var day = this.task.repaymentDay < 10 ? '0'+this.task.repaymentDay : '' + this.task.repaymentDay
      if(executeTime.slice(0, 10) > year+'-'+month+'-'+day){
        this.$dialog.confirm({
          title: '温馨提示',
          message: '还款计划的最后执行时间超过了银行卡的还款日，确定要继续吗？',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.verifyBindCard();
        }).catch(() => {})
      }else{
        this.verifyBindCard();
      }
    },
    verifyBindCard(){
      this.$store.commit('Loading')
      buildChannel({
        userId: this.userId,
        creditCardNumber: this.task.creditCardNumber,
        empowerToken: this.empowerToken
      }).then(res => {
        this.$store.commit('closeLoading')
        if (res.resp_code == '000000') {
          this.confirmPlan()
        } else if (res.resp_code == '999992') {
          sessionStorage.setItem('params', JSON.stringify({
            userId: this.userId,
            creditCardNumber: this.item.cardNo,
            empowerToken: this.empowerToken
          }))
          sessionStorage.setItem('card', JSON.stringify(this.item))
          this.$router.push('/TiedCard')
        }
      }).catch(err => {
        this.$store.commit('closeLoading')
        this.$toast({message: '计划启动失败', position: 'bottom'})
      })
    },
    confirmPlan() {//执行计划
      this.$store.commit('Loading')
      balanceSaveEmptyCard({
        userId: this.userId,
        creditCardNumber: this.task.creditCardNumber,
        empowerToken: this.empowerToken
      }).then(res => {
        this.$store.commit('closeLoading')
        if (res.resp_code == "000000") {
          if (this.empowerToken)
            listener.$emit('empowerToken', this.empowerToken)
          this.$toast({message: '计划启动成功', position: 'bottom'})
          history.go(-2)
        }
      }).catch(err => {
        this.$store.commit('closeLoading')
        this.$toast({message: '计划启动失败', position: 'bottom'})
      })
    },
    taskDetail(item, event) { //账单详情
      event.cancelBubble = true;
      this.taskDetailTrueFalseBy = true
      this.taskDetailItem = item
    },
    endplanMod() {//终止计划
      this.$store.commit('Loading')
      stopOrder({planId: this.task.id, empowerToken: this.empowerToken}).then(res => {
        this.$store.commit('closeLoading')
        if (res.resp_code == '000000') {
          if (this.empowerToken)
            listener.$emit('empowerToken', this.empowerToken)
          this.$toast({message: '计划取消成功', position: 'bottom'})
          history.go(-1)
        }
      }).catch(err => {
        this.$store.commit('closeLoading')
        this.$toast({message: '计划取消失败', position: 'bottom'})
      })
    },
    _cardQuery() { //当前银行卡
      cardQuery({token: this.empowerToken}).then(res => {
        if (res.resp_code == '000000') {
          res.result.forEach(item => {
            if (item.cardNo == this.task.creditCardNumber) {
              this.card = item
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
  /* z-index: -2; */
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
  line-height: 15px;
  display: inline-block;
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
  flex: 2;
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

.Double_btn .end_btn {
  width: 45%;
  margin: 0px 7px;
  display: inline-block;

}

.Double_btn .restart_btn {
  width: 45%;
  margin: 0px 7px;
  display: inline-block;
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

.tiem {
  line-height: 28px;
}


</style>
