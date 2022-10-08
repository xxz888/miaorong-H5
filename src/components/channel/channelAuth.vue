<!-- 通道鉴权状态 -->
<template>
  <div>
    <div class="channelAuth" v-if="isDialog">
      <div class="content">
        <div class="header">尽可能开通全部通道</div>
        <div class="list">
          <div v-for="(item,i) in channelList" :key="i">
            <div class="item" v-if="item.version != '50' && item.version != '50-1' && item.version != '50-2'">
              <div class="itemLeft">
                <img src="../../assets/channelAuthYL.png" alt/>
                <span>{{ item.channelName }}</span>
              </div>
              <div class="itemRight">
                <span class="noAuth" v-if="item.isAuth == 0" @click="toAuth(item)">立即开通</span>
                <span class="auth" v-if="item.isAuth == 1">已开通</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="close" @click="onhide()">
        <img src="../../assets/delete_icon.png" alt/>
      </div>
    </div>
    <div class="channelBtm" ref="channelBtm" v-show="!isDialog">
      <div class="contentBtm">
        <div class="headerBtm">
          <div class="headerBtmLeft">
            <span></span>
            <p>还款通道</p>
          </div>
          <div class="headerBtmRight" @click="authT=!authT">
            <span> 请至少开通1条，最好全开通</span>
            <img v-if="authT" src="../../assets/bottom_icon.png">
            <img v-if="!authT" src="../../assets/top_icon.png">
          </div>
        </div>
        <div class="list" v-if="!authT">
          <div v-for="(item,i) in channelList" :key="i">
            <div class="item"
                 v-if="item.version != '50' && item.version != '50-1' && item.version != '50-2'"
                 :style="activeIndex===i?'background:rgba(0,0,0,0.05)':'background:#FFFFFF'">
              <div class="itemLeft">
                <img src="../../assets/channelAuthYL.png" alt/>
                <span>{{ item.channelName }}</span>
              </div>
              <div class="itemRight">
                <span class="noAuth" v-if="item.isAuth == 0" @click="toAuth(item,i)">立即开通</span>
                <span class="auth" v-if="item.isAuth == 1">已开通</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <verification ref="verificationMethod" :authorityList="verificationList" :channelactive="channelactive"
                  :orderCode="orderCode" :type="pageType"></verification>
  </div>
</template>

<script>
import verification from "@/components/verification/verification"
import {queryChannelByCard} from "@/api/card/card";
import {cardIsuserable} from "@/api/plan/plan";
import request from '@/utils/request'
import qs from 'qs'

export default {
  data() {
    return {
      isDialog: "",
      channelList: [],
      user_id: "",
      brand_id: "",
      vericodeMask: false, //确认验证码的弹框
      vericodeNumber: "", //验证码
      verificationList: {
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
      activeIndex: "",
      channelactive: [],//当前选中的通道
      orderCode: "",
      pageType: 'planDetail',
      authT: true

    };
  },
  props: {
    item: {},
    type: {
      type: Integer,
      default: 0
    }
  },
  components: {
    verification,
    // XInput,
    // XButton,
  },
  created() {
    this.user_id = localStorage.getItem("userId");
    this.brand_id = localStorage.getItem("brandId");
  },

  methods: {
    onShow() {
      queryChannelByCard(this.item.cardNo, 2).then(res => {
        if (res.resp_code == "000000") {
          this.channelList = [];
          res.result.map(item => {
            if (
              item.channelName.indexOf("空卡") == -1 &&
              item.version != "51-1"
            ) {
              this.channelList.push(item);
            }
          });
          this.isDialog = this.$store.state.user.channelAuthDialog;
          //   this.isDialog = true
        }
      });
    },
    onhide() {
      this.$store.commit("UPDATE_CHANNELAUTHDIALOG", false);
      this.$refs.channelBtm.setAttribute("class", "contentBtmAmt contentBtm");
      this.isDialog = false;
    },
    toAuth(item, i) {
      this.channelactive = item
      this.activeIndex = i;
      cardIsuserable(
        this.user_id,
        this.brand_id,
        this.item.cardNo,
        item.version,
        this.type
      ).then(res => {
        if (res.resp_code == "000000") {
          this.onShow();
          this.$notify({type: "primary", message: res.resp_message});
        } else if (res.resp_code == "999994") {
          this.$notify({type: "primary", message: res.resp_message});
          this.onShow();
        } else if (res.resp_code == "999996") {
          this.$vux.alert.show({
            title: "温馨提示",
            content: res.resp_message,
            onHide() {
              this.$router.push({
                name: "link",
                params: {
                  url: JSON.stringify(res.result),
                  title: JSON.stringify("权限认证")
                }
              });
            }
          });
        } else if (res.resp_code == "999992") {
          this.verificationList = res;
          this.$refs.verificationMethod.noconfirm = true
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
                  message: res.resp_message
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
              }
            })

          })
        } else if (res.resp_code == "999989") {
          window.location.href =
            "https://mc.mingchetech.com/public_link/channelAuth/index.html#/channel?parameters=" +
            JSON.stringify(res.parameters) +
            "&token=" +
            localStorage.getItem("token") +
            "&ip=" +
            this.global.ip;
          // window.open("http://localhost:8081/#/channel?parameters="+JSON.stringify(res.parameters)+'&token='+localStorage.getItem('token')+'&ip='+this.global.ip)
        } else if (res.resp_code == "999991") {
          let data = res.result
          let url = data.ipAddress + data.getSmsUrlNew + '?bankCard=' + data.bankCard + '&bankName=' + data.bankName + '&channelTag=' + data.channelTag + '&expiredTime=' + data.expiredTime + '&idCard=' + data.idCard + '&phone=' + data.phone + '&securityCode=' + data.securityCode + '&userName=' + data.userName + '&rate=' + data.rate + '&extraFee=' + data.extraFee + '&dbankCard=' + data.dbankCard + '&dbankName=' + data.bankName + '&dphone=' + data.dphone
          this.$router.push({name: 'link', params: {url: JSON.stringify(url), title: JSON.stringify("权限认证")}})
        } else if (res.resp_code == "999995") {
          window.location.href = res.result;
        } else {
          this.$notify({type: "primary", message: res.resp_message});
        }
      })
    }
  }
};
</script>
<style scoped>
.channelAuth {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.4);
}

@keyframes hideDom {
  0% {
    transform: translate3d(0px, -800px, 0) scale(0);
    transform-origin: 10px 0;
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
    transform-origin: 10px 0;
  }
}

.channelBtm {
  width: 100%;
  padding: 0 15px;

}

.content {
  width: 85%;
  height: 65%;
  border-radius: 8px;
  background: #ffffff;
  overflow: auto;
}

.contentBtm {
  background: #ffffff;
  border-radius: 12px;
}

.contentBtmAmt {
  animation: hideDom 0.3s;
}

.header {
  font-size: 18px;
  font-weight: 500;
  height: 30px;
  line-height: 30px;
  text-align: center;
}

.headerBtm {
  display: flex;
  padding: 0 20px;
  height: 40px;
  align-items: center;
  font-size: 14px;
  color: #999999;
  justify-content: space-between;
}

.headerBtmLeft {
  display: flex;
  align-items: center;
  color: #333333;
}

.headerBtmLeft span {
  width: 3px;
  height: 14px;
  background: #2568ff;
  margin-right: 8px;
}

.close {
  width: 34px;
  height: 34px;
  margin-top: 24px;
}

.close img {
  width: 100%;
}

.item {
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  height: 45px;
  align-items: center;
}

.itemLeft {
  display: flex;
  align-items: center;
  font-size: 16px;
}

.itemLeft img {
  width: 21px;
  height: 21px;
  margin-right: 6px;
}

.itemRight {
  display: flex;
}

.itemRight span {
  width: 70px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  border-radius: 25px;
  font-size: 12px;
}

.auth {
  border: 1px solid #999999;
  color: #999999;
}

.noAuth {
  background: #30AEFB;
  color: #ffffff;
}

.vericode_mask {
  width: 85%;
  background-color: #fff;
  border-radius: 10px;
  position: fixed;
  margin: auto;
  padding: 10px 20px;
  top: 43%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  z-index: 300;
}

.vericode_mask_box {
  background: rgba(0, 0, 0, 0.5);
  height: 100%;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}

.confirm_plan_box {
  background: #fff;
  padding: 30px 23px;
  margin: 10px 0;
}

.vericode {
  height: 40px;
  /* background:rgba(235,235,235,1); */
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
  border: 1px solid rgba(235, 235, 235, 1);
}

.vericode_text {
  font-size: 24px;
}

.vericode_icon {
  height: 30px;
  width: 30px;
  position: absolute;
  top: 160px;
  left: 0;
  right: 0;
  margin: 0 auto;
}

.headerBtmRight span {
  vertical-align: middle;

}

.headerBtmRight img {
  height: 6px;
  width: 8px;
  margin-left: 5px;
  vertical-align: middle;

}
</style>
