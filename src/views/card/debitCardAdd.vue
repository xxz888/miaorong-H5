<template>
  <div>
    <van-nav-bar title="添加信用卡" left-text="返回" left-arrow @click-left="onClickLeft"/>
    <div class="warpper">
      <div class="upcreditcard_title">信息加密处理，仅用于银行验证，请验证您本人的银行卡</div>
      <div class="card_box">
        <div class="card_item">
          <van-field v-if="userList.realnameStatus==1" placeholder="持卡人" v-model="userList.realname" label="持卡人"
                     readonly/>
          <van-field v-if="userList.realnameStatus!=1" v-model="realname" label="持卡人" readonly/>
          <van-field v-model="item.cardNo" type="digit" label="卡号" placeholder="请输入您的信用卡号" clearable minlength="10"
                     required>
            <van-icon name="scan" slot="right-icon" @click="scanCard()"/>
            <!-- <van-icon name="../../assets/addcard/camera.png"
                      slot="right-icon" @click="scanCard()"/> -->
          </van-field>
          <van-field v-model="item.phone" type="digit" label="手机号" placeholder="信用卡银行预留手机号" clearable maxlength="11"
                     required>
            <van-icon name="question" slot="right-icon" @click="phoneTrueFalseBy=true"/>
          </van-field>
          <van-field placeholder="请输入信用卡额度" v-model="balance" label="额度"/>
        </div>
      </div>
      <div class="card_box">
        <div class="card_item">
          <van-field v-model="item.expiredTime" type="digit" label="有效期" maxlength="4" placeholder="请输入(如09/22输入0922)"
                     clearable required/>
          <van-field v-model="item.securityCode" type="digit" label="安全码" maxlength="3" placeholder="请输入(卡背面CVN2后3位)"
                     clearable required>
            <van-icon name="question" slot="right-icon" @click="codeTrueFalseBy=true"/>
          </van-field>

          <van-field v-model="item.billDay" label="账单日" readonly="readonly" placeholder="请选择账单日"
                     @click.native="billDayTrueFalseBy=true" required/>
          <van-field v-model="item.repaymentDay" label="还款日" readonly="readonly" placeholder="请选择还款日"
                     @click.native="repaymentDayTrueFalseBy=true" required/>
          <!-- <van-field v-model="item.creditBlance"  label="信用额度"   maxlength="7" placeholder="请输入信用卡额度"    clearable required /> -->
        </div>
      </div>
      <input name="bankFile" type="file" accept="image/*" style="display:none" @change="getFile($event,0)" id="idCard"/>
      <!-- </van-cell-group> -->
      <div class="color_999  upcreditcard_tips">
        <p class="theme"> 注：</p>
        <div class="theme ">1.同一张卡每天只能绑定五次，如有失败请第二天尝试</div>
        <div class="theme ">2.暂不支持借贷合一卡制定还款计划</div>
      </div>
      <div class=" upcreditcard_btn_box">
        <van-button @click.native="update()" class=" upcreditcard_btn" round>确认添加</van-button>
      </div>
    </div>
    <van-popup v-model="billDayTrueFalseBy" position="bottom" :style="{ height: '40%' }">
      <van-picker
        show-toolbar
        title="选择账单日"
        :columns="columns"
        :default-index="item.billDay-1"
        @cancel="billDayTrueFalseBy=false"
        @confirm="billDayConfirm"/>
    </van-popup>
    <van-popup v-model="repaymentDayTrueFalseBy" position="bottom" :style="{ height: '40%' }">
      <van-picker
        show-toolbar
        title="选择还款日"
        :columns="columns"
        :default-index="item.repaymentDay-1"
        @cancel="repaymentDayTrueFalseBy=false"
        @confirm="repaymentDayConfirm"/>
    </van-popup>
    <van-popup v-model="codeTrueFalseBy" round>
      <div class="box">
        <div class="title">什么是CVN2后3位？</div>
        <div class="bg"></div>
        <div class="tips">
          卡背面CVN2后3位指的是您的信用卡背面，签名条处一串数字的后3位
        </div>
        <div class="btn" @click="codeTrueFalseBy=false">我知道了</div>
      </div>
    </van-popup>
    <van-popup v-model="phoneTrueFalseBy" round>
      <div class="box">
        <div class="title">手机号说明</div>
        <div class="tips">
          手机号为办卡时预留手机号、网银签约手机号或者短信通知手机号，没有预留手机号、手机号忘记或者停用，请联系银行客服更新处理哦。
        </div>
        <div class="btn" @click="phoneTrueFalseBy=false">我知道了</div>
      </div>
    </van-popup>

    <guide step='3' @next="tian=false" v-show="tian"/>
  </div>
</template>

<script>
import guide from '@/components/guide/guide'
import {NavBar, Cell, CellGroup, Field, Picker, Popup, Button, Icon} from 'vant';
import {userInfoQuery} from "@/api/user";
import {bankcardtype, addBank, bankCardOcr} from '@/api/card/card'
import lrz from 'lrz'

export default {
  data() {
    return {
      token: localStorage.getItem('token'),
      cardNo: "",
      brandId: localStorage.getItem('brandId'),
      userId: localStorage.getItem('userId'),
      item: {
        cardNo: '',
        phone: "",
        securityCode: "",
        expiredTime: "",
        billDay: '',
        repaymentDay: '',
        creditBlance: ""
      },
      realname: "未实名",
      userList: {
        realnameStatus: "",
        realname: "",
        idcard: ""
      },
      balance: '',
      billDayTrueFalseBy: false,
      repaymentDayTrueFalseBy: false,
      columns: [],
      codeTrueFalseBy: false,
      phoneTrueFalseBy: false,
      tian: true,
      empowerToken: null
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [Button.name]: Button,
    [Icon.name]: Icon,
    guide
  },
  created() {
    if(this.$route.query.empowerToken){
      this.empowerToken = this.$route.query.empowerToken
    }else {
      this.empowerToken = null
    }
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let d = new Date(year, month, 0);
    this.columns = []
    for (let i = 1; i <= d.getDate(); i++) {
      this.columns.push(i)
    }
    this.getUserInfo()
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    getUserInfo() {
      let tokenTemp = this.token
      if(this.empowerToken){
        tokenTemp = this.empowerToken
      }
      userInfoQuery(tokenTemp).then(res => {
        if (res.resp_code == "000000") {
          this.userList = res.result
        }
      })
    },
    billDayConfirm(value, index) {
      this.item.billDay = value
      this.billDayTrueFalseBy = false
    },
    repaymentDayConfirm(value, index) {
      this.item.repaymentDay = value
      this.repaymentDayTrueFalseBy = false
    },
    // 掉起相机
    scanCard() {
      document.getElementById('idCard').click()
    },
    //扫描银行卡
    getFile(e, type) {
      // type 0：信用卡   1：储蓄卡
      this.imgUrl = window.URL.createObjectURL(e.target.files[0])
      var file = e.target.files[0]
      var name = e.target.files[0].name;
      //方法一：压缩formData图片文件上传
      lrz(file, {width: 1024, fieldName: 'bankFile'}).then(rst => {
        rst.formData.append('brandId', this.brandId)
        bankCardOcr(rst.formData).then(res => {
          if (res.resp_code == '000000') {
            this.item.cardNo = res.result.cardNum
          }
        })
      })
    },
    update() {
      if (this.userList.realnameStatus != 1) {
        this.$notify({type: "warning", message: "请先实名吆"});
        return
      }
      if (this.item.phone.length != 11) {
        this.$notify({type: "warning", message: "请输入正确的手机号"});
        return
      }
      if (this.item.billDay == 0 || this.item.repaymentDay == 0) {
        this.$notify({type: "warning", message: "请选择正确的账单日和还款日"});
        return
      }
      if (this.item.billDay == this.item.repaymentDay) {
        this.$notify({type: "warning", message: "账单日还款日不能为同一天"});
        return
      }
      if (this.item.securityCode.length != 3 || this.item.expiredTime.length != 4) {
        this.$notify({type: "warning", message: "请输入3位的安全码和四位的有效期"});
        return
      }
      this.add()
    },
    add() {
      let tokenTemp = this.token
      if(this.empowerToken){
        tokenTemp = this.empowerToken
      }
      let cardBalance = 0
      if(this.balance) cardBalance = this.balance
      addBank(tokenTemp, this.userList.realname, this.item.cardNo, this.userList.idcard, this.item.phone, 0, this.item.expiredTime, this.item.securityCode, this.item.billDay, this.item.repaymentDay, cardBalance).then(res => {
        if (res.resp_code == "000000") {
          this.$notify({type: "primary", message: res.resp_message});
          window.history.go(-1)
        }
      })
    }
  }
};
</script>
<style scoped>
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
  padding: 0 15px;
}

.upcreditcard_tips div {
  padding-left: 20px;
}

.upcreditcard_btn_box {
  margin: 20px auto;
  width: 100%;
  text-align: center;
}

.upcreditcard_btn {
  /* height:40px; */
  width: 80%;
  color: #fff;
  background: #30AEFB;
}

.card_box {
  width: 100%;
  padding: 10px 10px 0 10px;
}

.card_item {
  width: 100%;
  padding: 5px;
  border-radius: 12px;
  background: #fff;
}

.box {
  text-align: center;
  padding: 30px 39px;
  width: 320px;
}

.box .title {
  font-size: 17px;
}

.box .bg {
  background: url('../../assets/addcard/security_code.png') center no-repeat;
  background-size: 100% 100%;
  height: 123px;
  width: 194px;
  margin: 20px auto 0 auto;
}

.box .tips {
  text-align: left;
  color: #666;
  font-size: 13px;
  margin: 10px 0 30px 0;
}

.box .btn {
  width: 138px;
  height: 33px;
  background: #F71111;
  border-radius: 16px;
  font-size: 14px;
  color: #fff;
  line-height: 33px;
  margin: 0 auto;
}

.van-field >>> .van-cell__value {
  flex: 5;
}

.van-field >>> .van-field__label {
  width: 50px;
}


</style>
