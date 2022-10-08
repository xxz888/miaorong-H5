<template>
  <div>
    <!-- 还款计划账单提示 -->
    <van-overlay :show="planBillTipsTrueFalseBy" @click="planBillTipsTrueFalseBy=false"/>
    <div class="plan_bill_tips_box" v-if="planBillTipsTrueFalseBy">
      <div class="plan_bill_tips_title  ">
        账单详细
        <div class="theme_bg"></div>
      </div>
      <div class="plan_bill_tips_cont ">
        <ul class=" van-hairline--top ">
          <li class="van-hairline--bottom ">
            <van-row type="flex" justify="space-between" class="plan_bill_tips_item">
              <van-col class="plan_bill_tips_left" span="6">
                计划时间
              </van-col>
              <van-col class="plan_bill_tips_right theme_color">
                {{ task.executeDates }}
              </van-col>
            </van-row>
          </li>
          <li class="van-hairline--bottom ">
            <van-row type="flex" justify="space-between" class="plan_bill_tips_item">
              <van-col class="plan_bill_tips_left" span="6">
                通道名称
              </van-col>
              <van-col class="plan_bill_tips_right">
                {{ task.channelName }}
              </van-col>
            </van-row>
          </li>
          <li class="van-hairline--bottom ">
            <van-row type="flex" justify="space-between" class="plan_bill_tips_item">
              <van-col class="plan_bill_tips_left" span="6">
                还款金额
              </van-col>
              <van-col class="plan_bill_tips_right">
                {{ Number(task.allRepaymentAmount) |toFixed }}元
              </van-col>
            </van-row>
          </li>
          <li class="van-hairline--bottom ">
            <van-row type="flex" justify="space-between" class="plan_bill_tips_item">
              <van-col class="plan_bill_tips_left" span="6">
                预留金额
              </van-col>
              <van-col class="plan_bill_tips_right">
                {{ Number(task.reservedAmount) |toFixed }}元
              </van-col>
            </van-row>
          </li>
          <li class="van-hairline--bottom ">
            <van-row type="flex" justify="space-between" class="plan_bill_tips_item">
              <van-col class="plan_bill_tips_left" span="6">
                手续费
              </van-col>
              <van-col class="plan_bill_tips_right">
                {{ Number(task.allServiceCharge) |toFixed }}元
              </van-col>
            </van-row>
            <div v-if='task.afterUpGradeTotalCharge.resp_code=="000000"' class="theme_color allService_tips">
              (升级后省约{{
                Number(task.allServiceCharge) - Number(task.afterUpGradeTotalCharge.afterUpGradeTotalServiceCharge) |toFixed
              }}元,全年省{{
                (Number(task.allServiceCharge) - Number(task.afterUpGradeTotalCharge.afterUpGradeTotalServiceCharge)) * 12 |toFixed
              }}元)
            </div>
          </li>
          <li class="van-hairline--bottom ">
            <van-row type="flex" justify="space-between" class="plan_bill_tips_item">
              <van-col class="plan_bill_tips_left" span="12">
                消费笔数: {{ task.consumeCount }}笔
              </van-col>
              <van-col class="plan_bill_tips_right">
                还款笔数： {{ task.repaymentCount }}笔
              </van-col>
            </van-row>
          </li>
          <li class="van-hairline--bottom ">
            <van-row type="flex" justify="space-between" class="plan_bill_tips_item">
              <van-col class="plan_bill_tips_left" span="12">
                消费费率：{{ (Number(task.rate) * 100) |toFixed }}%
              </van-col>
              <van-col class="plan_bill_tips_right">
                还款手续费：{{ Number(task.serviceCharge) |toFixed }}/笔
              </van-col>
            </van-row>
          </li>
          <li class="van-hairline--bottom ">
            <van-row type="flex" justify="space-between" class="plan_bill_tips_item">
              <van-col class="plan_bill_tips_left" span="12">
                消费总金额
              </van-col>
              <van-col class="plan_bill_tips_right">
                {{ Number(task.allConsumeAmount) |toFixed }}元
              </van-col>
            </van-row>
          </li>
          <li class="van-hairline--bottom ">
            <van-row type="flex" justify="space-between" class="plan_bill_tips_item">
              <van-col class="plan_bill_tips_left" span="6">
                落地地区
              </van-col>
              <van-col class="plan_bill_tips_right van-ellipsis">
                {{ extra.merprovince }}-{{ extra.mercity }}
              </van-col>
            </van-row>
          </li>
        </ul>
        <div class="plan_bill_dec theme_color">*手续费已实际为准</div>
        <van-row type="flex" class="plan_bill_tips_btn">
          <van-col class="left" span="12" @click="planBillTipsTrueFalseBy=false">
            取消账单
          </van-col>
          <van-col class="right theme-linear-bg " span="12" @click.native="submitPlan()">
            确认账单
          </van-col>
        </van-row>
      </div>
      <div class="plan_bill_tips_bottom"></div>
    </div>
  </div>
</template>
<script>
import {
  NavBar,
  Row,
  Col,
  Popup,
  Image,
  Dialog,
  Overlay
} from "vant";

export default {
  props: {
    task: Object,
    extra: Object
  },
  data() {
    return {
      brandId: localStorage.getItem('brandId'),
      userId: localStorage.getItem('userId'),
      token: localStorage.getItem('token'),
      planBillTipsTrueFalseBy: false,//还款计划账单提示
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Row.name]: Row,
    [Col.name]: Col,
    [Popup.name]: Popup,
    [Image.name]: Image,
    [Dialog.name]: Dialog,
    [Overlay.name]: Overlay
  },
  methods: {
    submitPlan() {
      this.$emit("isPassword");
    }
  }
};
</script>
<style scoped>
.plan_bill_tips_box {
  /* height: 200px; */
  width: 90%;
  position: fixed;
  left: 0;
  right: 0;
  top: 50px;
  bottom: 0;
  z-index: 300;
  margin: auto;
}

.plan_bill_tips_box.van-popup {
  /* background-color:none !important; */
}

.plan_bill_tips_title {
  background: url("../../assets/plan_bill_tips_title_bg.png") center no-repeat;
  background-size: 100% 100%;
  height: 60px;
  /* display: inline-block; */
  font-size: 22px;
  font-weight: 400;
  line-height: 70px;
  position: relative;
  text-align: center;
}

.plan_bill_tips_bottom {
  background: url("../../assets/plan_bill_tips_bottom_bg.png") center no-repeat;
  background-size: 100% 100%;
  height: 16px;
}

.plan_bill_tips_cont {
  /* height: 300px; */
  width: 100%;
  background-color: #fff;
  padding: 0 16px;
}

.plan_bill_tips_title > div {
  width: 90px;
  height: 7px;
  /* text-align: center; */
  position: absolute;
  bottom: 13px;
  left: 0;
  right: 0;
  margin: auto;
  opacity: .6;
  border-radius: 20px;

}

.plan_bill_tips_right {
  text-align: right;
}

.plan_bill_tips_item {
  font-size: 14px;
  /* height: 40px; */
  line-height: 40px;
}

.plan_bill_dec {
  font-size: 13px;

}

.plan_bill_tips_btn {
  text-align: center;
  font-size: 16px;
  margin-top: 20px;
}

.plan_bill_tips_btn .left, .right {
  height: 42px;
  width: 120px;
  text-align: center;
  line-height: 42px;
  /* box-shadow:0px 1px 2px 0px rgba(0,0,12,0.44); */
  border-radius: 25px;
  color: #fff;
  margin: 0 auto;
}

.plan_bill_tips_btn .left {
  background-color: #ddd;
}

.allService_tips {
  line-height: 20px;
  font-size: 12px;
}
</style>
