<template>
  <div>
    <!-- 验证码鉴权 -->
    <van-popup v-model="verificationCodeTrueFalseBy" round :style="{ width:'82%'}">
      <div class="verification_close" @click="verificationCodeTrueFalseBy=false">
        <img src="../../assets/verification_colse_icon.png" alt="">
      </div>
      <div class="verification_box">
        <span class="verification_title color_333">
          温馨提示
          <div class="theme_bg"></div>
        </span>
        <div class="verification_tips theme_color"
             v-if="authorityList.result.phone!='' && authorityList.result.phone!=undefined">
          验证码已发送到：{{ authorityList.result.phone | dataHidden }}请注意查收
        </div>
        <div class="verification_input van-hairline--bottom">
          <van-field class="make_plan_input" v-model="smsCode" placeholder="请输入获取验证码" clearable type="number"
                     maxlength="6"/>
        </div>
        <div class="verification_btn theme-linear-bg" @click="confirm()" v-if="noconfirm">
          确定验证码
          <img class="verification_btn_icon" src="../../assets/verification_btn_icon.png" alt="">
        </div>
        <div class="verification_btn theme-linear-bg" v-else>
          加载中。。。
          <img class="verification_btn_icon" src="../../assets/verification_btn_icon.png" alt="">
        </div>

      </div>
    </van-popup>
    <van-overlay :show="loadingTrueFalseBy" z-index="200000">
      <van-loading size="24px">加载中...</van-loading>
    </van-overlay>
  </div>
</template>
<script>
import {NavBar, Row, Col, Popup, Image, Field, Overlay, Loading} from "vant";
import request from '@/utils/request'
import qs from 'qs'

export default {
  props: {
    authorityList: Object,//需要验证返回的接口参数
    channelactive: {}, //当前选择的通道，验证成功之后重新调起通道
    orderCode: {
      type: String,
      default: ''
    }, //获取验证码之后获取到的，需要用来确认验证的时候用
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      brandId: localStorage.getItem("brandId"),
      userId: localStorage.getItem("userId"),
      verificationCodeTrueFalseBy: false, //验证码遮罩
      smsCode: "",
      noconfirm: true, // 控制不要点击验证码过快
      loadingTrueFalseBy: false
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [Row.name]: Row,
    [Col.name]: Col,
    [Popup.name]: Popup,
    [Image.name]: Image,
    [Field.name]: Field,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading
  },
  methods: {
    confirm() {
      if (this.smsCode == '') {
        this.$notify({message: '请先输入验证码', duration: 1000});
        return
      }
      this.loadingTrueFalseBy = true
      request({
        url: this.authorityList.result.ipAddress + this.authorityList.result.confirmSmsUrl,
        method: 'post',
        data: qs.stringify({
          bankCard: this.authorityList.result.bankCard,
          bankName: this.authorityList.result.bankName,
          channelTag: this.authorityList.result.channelTag,
          expiredTime: this.authorityList.result.expiredTime,
          idCard: this.authorityList.result.idCard,
          phone: this.authorityList.result.phone,
          securityCode: this.authorityList.result.securityCode,
          userName: this.authorityList.result.userName,
          smsCode: this.smsCode,
          orderNo: this.orderCode
        })
      }).then(response => {
        this.loadingTrueFalseBy = false
        if (response.resp_code == '000000') {
          this.verificationCodeTrueFalseBy = false
          this.noconfirm = false
          if (this.type = 'planDetail') {
          } else {
            this.$emit("createTask", this.channelactive);
          }
        } else if (response.resp_code == '666666') {
          this.verificationCodeTrueFalseBy = false
          this.noconfirm = false
          this.$dialog.alert({
            title: '温馨提示',
            message: res.resp_message
          }).then(() => {
          });
        } else {
          this.noconfirm = true
        }
      })
    },
    show() {
    }
  }
};
</script>
<style scoped>
.verification_box {
  padding: 30px 26px;
  text-align: center;
  position: relative;
}

.verification_title {
  display: inline-block;
  font-size: 24px;
  font-weight: 400;
  height: 30px;
  position: relative;
}

.verification_title > div {
  width: 100%;
  height: 7px;
  /* text-align: center; */
  position: absolute;
  bottom: 2px;
  left: 0;
  right: 0;
  margin: 0 auto;
  opacity: .6;

}

.verification_tips {
  line-height: 40px;
  font-size: 13px;
}

.verification_input {
  margin-bottom: 20px;
}

.verification_btn {
  width: 100%;
  height: 44px;
  /* background:linear-gradient(180deg,rgba(135,213,255,1) 0%,rgba(53,167,253,1) 100%); */
  box-shadow: 0px 1px 2px 0px rgba(53, 167, 253, 0.44);
  border-radius: 25px;
  padding-left: 24px;
  line-height: 44px;
  color: #fff;
  font-size: 16px;
  text-align: left;
  position: relative;
}

.verification_btn_icon {
  height: 34px;
  width: 34px;
  position: absolute;
  right: 8px;
  top: 5px;
}

.verification_close {
  position: absolute;
  right: 0;
  top: 0;
  width: 50px;
  height: 50px;
  text-align: right;
  z-index: 2000;
}

.verification_close > img {
  width: 39px;
  height: 37px;

}
</style>
