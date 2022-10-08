<template>
  <div>
    <van-nav-bar title="修改储蓄卡" left-text="返回" left-arrow @click-left="onClickLeft"/>
    <div class="warpper">
      <div class="deposit_upcreditcard_title">请添加本人储蓄卡作为结算卡，该卡作为后续刷卡、提现资金的结算 账号，户名必须与实名认证姓名一致</div>
      <div class="card_box">
        <div class="card_item">
          <div class="card_item_tips theme ">*建议：工商、农业、交通、招商、民生、华夏、平安等一类卡（不支持二类卡及地方性银行）</div>
          <van-field v-model="item.userName" label="账户姓名" readonly="readonly"/>
          <van-field v-model="item.cardNo" readonly="readonly" label="银行卡号" placeholder="请输入银行卡号" clearable
                     minlength="10" required/>
          <div class="card_no_tips">请核对卡号信息是否正确，若有误，请手动修改</div>
          <van-field readonly="readonly" is-link v-model="address" placeholder="请选择开户行所在省市" @click="showPicker2 = true"
                     label="开户省市"/>
          <van-field v-model="item.phone" readonly="readonly" label="手机号" placeholder="请输入银行卡预留手机号" clearable
                     maxlength="11" required>
            <van-icon name="question" slot="right-icon" @click="phoneTrueFalseBy=true"/>
          </van-field>
        </div>
      </div>
      <div class=" upcreditcard_btn_box">
        <van-button @click.native="add()" type="primary" class=" upcreditcard_btn " round>修改储蓄卡</van-button>
      </div>
    </div>
    <input name="bankFile" type="file" accept="image/*" style="display:none" @change="getFile($event,0)" id="idCard"/>
    <!-- 开户行省市 -->
    <van-popup v-model="showPicker2" position="bottom">
      <van-area :area-list="areaList" :columns-num="2" @cancel="showPicker2 = false" @confirm="onConfirm2"/>
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
  </div>
</template>

<script>
import {NavBar, Cell, CellGroup, Field, Picker, Popup, Button, Area, Icon} from 'vant';
import {setBankInfo} from '@/api/card/card'
import areaList from '@/components/area'
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
        province: "",
        city: "",
      },
      realname: "未实名",
      userList: {
        realnameStatus: "",
        realname: "",
        idcard: ""
      },
      address: '',
      areaList: areaList,
      showPicker2: false,
      province: '',
      city: '',
      phoneTrueFalseBy: false,
      imgUrl: "",
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
    [Area.name]: Area,
    [Icon.name]: Icon
  },
  created() {
    this.item = JSON.parse(this.$route.params.item)
    this.address = this.item.province + '-' + this.item.city
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    // 选择开户行省市
    onConfirm2(value) {
      this.address = value[0].name + '-' + value[1].name
      this.item.province = value[0].name
      this.item.city = value[1].name
      this.showPicker2 = false
    },
    add() {
      setBankInfo(this.item.userId, this.item.cardNo, this.item.province, this.item.city).then(res => {
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
.deposit_upcreditcard_title {
  background: #FFF3E5;
  width: 100%;
  color: #F5552A;
  font-size: 12px;
  padding: 8px 15px;
}

.upcreditcard_tips {
  font-size: 10px;
  line-height: 22px;
  padding: 0 10px;
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

.card_item_tips {
  font-size: 12px;
  padding: 10px;
}

.card_item_add {
  text-align: center;
  padding-bottom: 10px;
}

.card_item_add img {
  height: 120px;
  width: 191px;
  margin: 15px;
}

.card_item_add div {
  font-size: 13px;
  color: #333;
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
  background: url("../../assets/addcard/security_code.png") center no-repeat;
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

.card_no_tips {
  font-size: 12px;
  color: #2574EA;
  padding: 0 15px;
}

</style>
