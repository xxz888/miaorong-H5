<template>
  <div>
    <van-nav-bar title="修改信用卡" left-text="返回" left-arrow @click-left="onClickLeft"/>
    <div class="warpper">
      <div class="upcreditcard_title">修改信用卡基本信息</div>
      <van-cell-group class="msg">
        <van-field v-model="item.userName" label="持卡人" disabled/>
        <van-field v-model="cardNo" label="银行卡号" disabled/>
        <van-field v-model="item.phone" label="手机号" disabled/>
        <van-field v-model="item.creditBlance" label="额度"/>
      </van-cell-group>
      <van-cell-group class="msg2">

        <van-field v-model="item.securityCode" label="安全码" maxlength="3" placeholder="请输入(卡背面CVN2后三位数字)" type="number"
                   clearable required/>
        <van-field v-model="item.expiredTime" label="有效期" maxlength="4" placeholder="请输入(如09/22输入0922)" type="number"
                   clearable required/>
        <van-field v-model="item.billDay" label="账单日" readonly="readonly" placeholder="请选择账单日"
                   @click.native="billDayTrueFalseBy=true" required/>
        <van-field v-model="item.repaymentDay" label="还款日" readonly="readonly" placeholder="请选择还款日"
                   @click.native="repaymentDayTrueFalseBy=true" required/>
        <!-- <van-field v-model="item.creditBlance"  label="信用额度"   maxlength="7" placeholder="请输入信用卡额度"   type="number"  clearable required /> -->
      </van-cell-group>
      <div class="theme  upcreditcard_tips">
        注：
        <p>1.同一张卡每天只能绑定五次，如果有失败请第二天尝试</p>
        <p>2.暂不支持借贷合一卡制定还款计划</p>
      </div>
      <div class=" upcreditcard_btn_box">
        <van-button @click.native="update()" type="primary" class=" upcreditcard_btn  " round>确认修改</van-button>
      </div>
    </div>
    <van-popup v-model="billDayTrueFalseBy" position="bottom" :style="{ height: '40%' }">
      <van-picker show-toolbar title="选择账单日" :columns="columns" :default-index="item.billDay-1"
                  @cancel="billDayTrueFalseBy=false" @confirm="billDayConfirm"/>
    </van-popup>
    <van-popup v-model="repaymentDayTrueFalseBy" position="bottom" :style="{ height: '40%' }">
      <van-picker show-toolbar title="选择还款日" :columns="columns" :default-index="item.repaymentDay-1"
                  @cancel="repaymentDayTrueFalseBy=false" @confirm="repaymentDayConfirm"/>
    </van-popup>
  </div>
</template>

<script>
import {NavBar, Cell, CellGroup, Field, Picker, Popup, Button} from 'vant';
import {userLogin} from "@/api/user";
import {upcreditcard} from '@/api/card/card'

export default {
  data() {
    return {
      cardNo: "",
      userId: localStorage.getItem('userId'),
      item: {
        cardNo: 0,
        securityCode: 0,
        expiredTime: 0,
        billDay: '',
        repaymentDay: '',
        creditBlance: ""
      },
      billDayTrueFalseBy: false,
      repaymentDayTrueFalseBy: false,
      columns: [],
      type: ''
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [Button.name]: Button
  },
  created() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var d = new Date(year, month, 0);
    this.columns = []
    for (let i = 1; i <= d.getDate(); i++) {
      this.columns.push(i)
    }
    this.item = JSON.parse(this.$route.params.item)
    this.type = this.$route.params.type
    this.cardNo = this.item.cardNo.substring(0, 4) + '****  ****  ****' + this.item.cardNo.substring(this.item.cardNo.length - 4, this.item.cardNo.length)
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    billDayConfirm(value, index) {
      // this.$toast(`当前值：${value}, 当前索引：${index}`);
      this.item.billDay = value
      this.billDayTrueFalseBy = false
    },
    repaymentDayConfirm(value, index) {
      // this.$toast(`当前值：${value}, 当前索引：${index}`);
      this.item.repaymentDay = value
      this.repaymentDayTrueFalseBy = false
    },
    update() {
      if (this.item.billDay == 0 || this.item.repaymentDay == 0) {
        this.$notify({type: "warning", message: "请选择正确的账单日和还款日"});
        return
      }
      if (this.item.securityCode.length != 3 || this.item.expiredTime.length != 4) {
        this.$notify({type: "warning", message: "请输入3位的安全码和四位的有效期"});
        return
      }
      upcreditcard(this.userId, this.item.cardNo, this.item.securityCode, this.item.expiredTime, this.item.billDay, this.item.repaymentDay, this.item.creditBlance).then(res => {
        if (res.resp_code == "000000") {
          switch (this.type) {
            case 1:  //余额还款进来的
              this.$router.push({name: 'madePlan', params: {item: JSON.stringify(res.result)}})
              break;
            case 2:  //空卡还款进来的
              this.$router.push({name: 'zeroPlan', params: {item: JSON.stringify(res.result)}})
              break;
            default:
              window.history.go(-1)
              break;
          }
          this.$notify({type: "primary", message: res.resp_message});
        }
      })
    }
  }
};
</script>
<style scoped>
.msg {
  margin: 10px;
  border-radius: 10px;
  overflow: hidden;
}

.msg2 {
  margin: 10px;
}

.upcreditcard_title {
  height: 40px;
  background: rgba(254, 161, 51, .3);
  line-height: 40px;
  width: 100%;
  color: #F5552A;
  font-size: 12px;
  padding: 0 15px;
}

.upcreditcard_tips {
  font-size: 10px;
  line-height: 22px;
  padding: 0 10px;
  font-weight: 900;
}

.upcreditcard_tips p {
  padding-left: 20px;
  font-weight: 500;
}

.upcreditcard_btn_box {
  margin: 20px auto;
  width: 100%;
  text-align: center;
}

.upcreditcard_btn {
  /* height:40px; */
  width: 80%;
}

</style>
