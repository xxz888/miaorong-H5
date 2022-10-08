<template>
  <div>
    <van-nav-bar :title="!task.id?'空卡计划预览':'空卡计划详情'" left-arrow @click-left="onClickLeft"/>
    <div class="warpper">
      <div class="submit_plan_box">
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
                  <span v-if='item.cardNo'>({{ item.cardNo |cardNoEnd }})</span>
                  <span v-else>({{ item.creditCardNumber |cardNoEnd }})</span>
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
              <span class="submit_plan_dec_title color_999">预计手续费：</span>
              <span class="submit_plan_dec_cont">{{ Number(task.totalServiceCharge) |toFixed }}元</span>
            </van-col>
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">还款总次数：</span>
              <span class="submit_plan_dec_cont">{{ task.taskCount }}次</span>
            </van-col>
          </van-row>
          <van-row type="flex">
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">还款总金额：</span>
              <span class="submit_plan_dec_cont">{{ Number(task.taskAmount) |toFixed }}元</span>
            </van-col>
            <van-col class="submit_plan_dec" span="12">
              <span class="submit_plan_dec_title color_999">已还金额：</span>
              <span class="submit_plan_dec_cont">{{ totalRepaymentAmount |toFixed }}元</span>
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
          <li class="plan_item" v-for="item in task.emptyCardPlanItemList" :key="item.key">
            <div class="repayment_status" v-if="item.type==3">
              <div></div>
            </div>
            <ul class="plan_item_box" v-if='item.type!=2'>
              <li class="plan_item_item time tiem">
                {{ item.executeTime }}
              </li>
              <li class="plan_item_item type">
                {{ item.type | description }}
              </li>
              <li class="plan_item_item amount">
                <span v-if="item.type==3">+</span><span v-else>-</span>{{ Number(item.amount)  | toFixed }}
              </li>
            </ul>
          </li>
        </ul>
        <ul class="plan_list" v-if="task.id">
          <li class="plan_title">
            <ul class="plan_item_box">
              <li class="plan_item_item time">时间</li>
              <li class="plan_item_item type">类型</li>
              <li class="plan_item_item amount">金额</li>
              <li class="plan_item_item consumeType">状态</li>
            </ul>
          </li>
          <li class="plan_item" v-for="item in task.emptyCardPlanItemList" @click="taskDetail(item,$event)"
              :key="item.key">
            <div class="repayment_status" v-if="item.type==3">
              <div></div>
            </div>
            <ul class="plan_item_box" v-if='item.type!=2'>
              <li class="plan_item_item time tiem">
                {{ item.executeTime }}
              </li>
              <li class="plan_item_item type">
                {{ item.type | description }}
              </li>
              <li class="plan_item_item amount">
                <span v-if="item.type==3">+</span><span v-else>-</span>{{ Number(item.amount)  | toFixed }}
              </li>
              <li>
              <li class="plan_item_item  consumeType  " :class="'plan_task_'+taskStatusType(item).split('-')[1]"
                  @click="item.status==4?_causeMessage(item):''">
                {{ taskStatusType(item).split('-')[0] }}
              </li>
            </ul>
          </li>
        </ul>
        <div class="executeplan_btn " v-if='!task.id||task.status==3 || task.status==1||task.status==5'>
          <div v-if="!task.id" @click="submit()" class="confirmplan_btn two theme_btn">启动计划</div>
          <div v-else-if="task.status==3 || task.status==1" @click="endplan()" class="confirmplan_btn two theme_btn">
            终止计划
          </div>
          <div v-else-if="task.status==5" @click="restartplan()" class="confirmplan_btn two theme_btn">重启计划</div>
        </div>
        <div class="executeplan_btn Double_btn " v-if='task.status==4'>
          <div v-if="task.status==4" @click="endplan()" class="confirmplan_btn two theme_btn end_btn">终止计划</div>
          <div v-if="task.status==4" @click="restartplan()" class="confirmplan_btn two theme_btn restart_btn ">重启计划
          </div>
        </div>
      </div>
    </div>
    <van-popup position="bottom" :style="{ height: '45%' }" v-model="show">
      <van-picker show-toolbar title="落地商户" @cancel="showPicker = false" :columns="columns"
                  @confirm="consumeTypeConfirm" @change="onChange" :default-index="defConsumeType"/>
    </van-popup>
    <!-- <city  ref="verificationMethod" :card="item"  :extraList="task"   v-on:merchant="merchant"   ></city> -->
    <is-password ref="isPassword" v-on:confirmPlan="confirmPlan"></is-password>
    <plan-bill-tips ref="planBillTips" :task="task" :extra="extra" v-on:isPassword="isPassword"></plan-bill-tips>
    <confirmorcancel ref="endPlan" src='../../assets/alert.png' but='1'
                     @disconfirm='endPlan' :zi='start'/>
    <confirmorcancel ref="causeMessage" src='../../assets/alert.png'
                     but='3' :zi='start'/>
    <confirmorcancel ref="Dialog" src='../../assets/alert.png' but='1'
                     @disconfirm='isuserable' :zi='start'/>
  </div>
</template>

<script>
import {NavBar, Row, Col, Icon, Popup, Picker} from 'vant';
import confirmorcancel from '@/components/confirm/alert'
import {creditcardmanagerverify} from "@/api/zero";
import isPassword from "@/components/isPassword/isPassword"
import planBillTips from "@/components/planBillTips/planBillTips"  //还款计划账单提示
import {saveEmptyCard} from "@/api/plan/plan";
import {stopOrder, reRunOrder, checkOrder, causeMessage} from "@/api/zero";

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
      extra: {},//选择的省市
      show: false,
      columns: [],
      columnsActive: {},
      defConsumeType: 0,//默认
      start: ''
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Row.name]: Row,
    [Col.name]: Col,
    isPassword,
    planBillTips,//账单提示
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    confirmorcancel,
    //  city
  },
  computed: {
    totalRepaymentAmount() { //已还金额
      let sum = 0
      this.task.emptyCardPlanItemList.forEach(item => {
        if (item.type == 3 && item.status == 3) {
          sum += item.amount
        }
      })
      return sum
    }
  },
  created() {
    this.item = JSON.parse(this.$route.params.item)
    this.task = JSON.parse(this.$route.params.task)
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
        status = '已延后-await'
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
    merchant(extra, merchantList) {
      this.merchantList = JSON.parse(merchantList)
      // this.createTask(this.task)
      this.extra = JSON.parse(extra)
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
    submit() {
      this.start = '空卡计划设置后，系统将首次扣除手续费' + this.task.totalServiceCharge + '元，同时在卡内多预留' + (this.task.emptyCardPlanItemList[1].amount + 5) + '元空间的余额，便于系统验卡。为避免逾期，请检查卡片是否有限额、超限、分期利息未扣除等异常状态。感谢您的支持与配合，祝您生活愉快！'
      this.$refs.Dialog.disopen()
    },
    isuserable() { //验证用户是否需要绑卡
      this.$store.commit('Loading')
      creditcardmanagerverify(this.userId, this.task.creditCardNumber, this.task.version).then(res => {
        this.$store.commit('closeLoading')
        if (res.resp_code == '000000') {
          this.confirmPlan()
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
            name: 'zeroConfirmPlan',
            params: {authorityList: JSON.stringify(res), item: JSON.stringify(this.task)}
          })
        }
      })
    },
    confirmPlan() {//执行计划
      this.$store.commit('Loading')
      saveEmptyCard(this.userId, this.task.creditCardNumber).then(res => {
        this.$store.commit('closeLoading')
        if (res.resp_code == "000000") {
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
          this.$toast({message: '计划启动成功', position: 'bottom'})
        }
      }).catch(err => {
        this.$toast({message: '计划启动失败', position: 'bottom'})
      })

    },
    taskDetail(item, event) { //账单详情
      event.cancelBubble = true;
      this.taskDetailTrueFalseBy = true
      this.taskDetailItem = item
    },
    endplan() {
      this.start = '点“确定”删除后将不再执行“待执行”计划,如需执行请重新安排'
      this.$refs.endPlan.disopen()
    },
    endPlan() {//终止计划
      this.$store.commit('Loading')
      stopOrder(this.userId, this.item.hasWaitingEmptyOrder || this.item.id).then(res => {
        this.$store.commit('closeLoading')
        if (res.resp_code == '000000') {
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
          })
          this.$toast({message: '计划取消成功', position: 'bottom'})
        }
      }).catch(err => {
        this.$toast({message: '计划取消失败', position: 'bottom'})
      })
    },
    restartplan() {//重启计划
      this.$store.commit('Loading')
      reRunOrder(this.userId, this.item.hasWaitingEmptyOrder || this.item.id).then(res => {
        this.$store.commit('closeLoading')
        if (res.resp_code == '000000') {
          this.$toast({message: res.resp_message, position: 'bottom'})
          checkOrder(this.item.hasWaitingEmptyOrder).then(res => {
            if (res.resp_code == '000000') {
              this.task = res.result
            }
          })
        } else {
          this.$toast({message: res.resp_message, position: 'bottom'})
        }
      })
    }
  }
}
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


</style>
