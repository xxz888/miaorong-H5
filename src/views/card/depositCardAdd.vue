<template>
  <div>
    <!-- <van-nav-bar title="添加储蓄卡" left-text="返回" left-arrow @click-left="onClickLeft" right-text="客服"
                 @click-right="onClickRight"/> -->


                          <van-nav-bar title="添加储蓄卡"   left-arrow fixed :border='false'
                   @click-left="onClickLeft"/>
    <div class="warpper">
      <div class="deposit_upcreditcard_title">请添加本人储蓄卡作为结算卡，该卡作为后续刷卡、提现资金的结算 账号，户名必须与实名认证姓名一致</div>
      <div class="card_box">
        <div class="card_item">
          <div class="card_item_tips theme ">*建议：工商、农业、交通、招商、民生、华夏、平安等一类卡（不支持二类卡及地方性银行）</div>
          <div class="card_item_add">
            <img
              src="../../assets/addcard/addxinyongka.png"
              @click="scanCard()" alt="">
            <div>请点击拍摄储蓄卡正面</div>
          </div>
          <van-field v-if="userList.realnameStatus==1" v-model="userList.realname" label="账户姓名" readonly="readonly"/>
          <van-field v-if="userList.realnameStatus!=1" v-model="realname" label="账户姓名" readonly="readonly"/>
          <van-field v-model="item.cardNo" type="digit" label="银行卡号" placeholder="请输入银行卡号" clearable minlength="10"
                     required/>
          <div class="card_no_tips">请核对卡号信息是否正确，若有误，请手动修改</div>
          <van-field readonly="readonly" is-link v-model="address" placeholder="请选择开户行所在省市" @click="showPicker2 = true"
                     label="开户省市"/>
          <van-field v-model="item.phone" label="手机号" type="digit" placeholder="请输入银行卡预留手机号" clearable maxlength="11"
                     required>
            <van-icon name="question" slot="right-icon" @click="phoneTrueFalseBy=true"/>
          </van-field>
        </div>
      </div>
      <div class=" upcreditcard_btn_box">
        <van-button @click.native="add()"  class=" upcreditcard_btn " round>添加储蓄卡</van-button>
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
import {userInfoQuery} from "@/api/user";
import {bankcardtype, addBank, bankCardOcr} from '@/api/card/card'
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
        billDay: 1,
        repaymentDay: 1,
        creditBlance: ""
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
    [Button.name]: Button,
    [Area.name]: Area,
    [Icon.name]: Icon
  },
  computed: {},
  created() {
    this.imgUrl = ""
    this.getUserInfo()
    this.type = JSON.parse(this.$route.params.type)
    // this.cardNo=this.item.cardNo.substring(0,4)+ '****  ****  ****'+ this.item.cardNo.substring(this.item.cardNo.length - 4, this.item.cardNo.length)
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    onClickRight() {
      _MEIQIA('init')
      _MEIQIA('showPanel')
    },
    getUserInfo() {
      userInfoQuery(this.token).then(res => {
        if (res.resp_code == "000000") {
          this.userList = res.result
        }
      })
    },
    // 选择开户行省市
    onConfirm2(value) {
      this.address = value[0].name + '-' + value[1].name
      this.province = value[0].name
      this.city = value[1].name
      this.showPicker2 = false
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
        this.$store.commit('Loading')
        bankCardOcr(rst.formData).then(res => {
          this.$store.commit('closeLoading')
          if (res.resp_code == '000000') {
            if (res.result) {
              this.item.cardNo = res.result.cardNum
            } else {
              this.$toast({message: '银行卡识别失败，请手动输入'})
            }
          }
        })
      })
    },
    add() {
      addBank(this.token, this.userList.realname, this.item.cardNo, this.userList.idcard, this.item.phone.replace(/\s/g, ""), 0, "", "", "", "", "", this.province, this.city).then(res => {
        if (res.resp_code == "000000") {
          this.$notify({type: "primary", message: res.resp_message});
          if (this.type == 1) {
            this.$router.push({name: 'home'})
          } else {
            window.history.go(-1)
          }
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
