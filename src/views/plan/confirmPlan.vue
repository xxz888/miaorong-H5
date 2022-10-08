<template>
  <div>
    <van-nav-bar title="还款确认" left-arrow @click-left="onClickLeft"/>
    <div class="warpper">
      <div class="upcreditcard_title">信息加密处理，仅用于银行验证，请验证您本人的银行卡</div>
      <div class="card_box">
        <div class="card_item">
          <van-field v-model="authorityList.result.userName" label="持卡人" readonly="readonly"/>
          <van-field v-model="cardNo" label="卡号" placeholder="请输入信用卡号" clearable minlength="10"
                     readonly="readonly"></van-field>
          <van-field v-model="authorityList.result.securityCode" label="安全码" maxlength="3" readonly="readonly"
                     placeholder="请输入(卡背面CVN2后三位数字)" clearable>
            <!-- <van-icon name="question" slot="right-icon"  @click="codeTrueFalseBy=true" /> -->
          </van-field>
          <van-field v-model="authorityList.result.expiredTime" label="有效期" maxlength="4" readonly="readonly"
                     placeholder="请输入(如09/22输入0922)" clearable/>
          <van-field v-model="authorityList.result.phone" label="手机号" placeholder="请输入银行卡预留手机号" readonly="readonly"
                     clearable maxlength="11">
            <!-- <van-icon name="question" slot="right-icon"  @click="phoneTrueFalseBy=true"    /> -->
          </van-field>
          <van-field v-model="smsCode" center type="digit" clearable label="短信验证码" placeholder="请输入短信验证码">
            <template #button>
              <van-button size="small" plain type="danger" @click="message == '获取验证码' ? getCode() : ''">
                {{ message }}
              </van-button>
            </template>
          </van-field>
        </div>
      </div>

      <div class=" upcreditcard_btn_box">
        <van-button @click.native="confirm()" type="primary" class=" upcreditcard_btn  " round>确认</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import {NavBar, Cell, CellGroup, Field, Picker, Popup, Button, Icon} from 'vant';
import confirmorcancel from '@/components/confirm/alert'
import {creditcardSaveTask, isChannelBind, balanceSaveEmptyCard, buildChannel} from "@/api/plan/plan";
import request from '@/utils/request'
import qs from 'qs'

export default {
  data() {
    return {
      token: localStorage.getItem('token'),
      cardNo: "",
      brandId: localStorage.getItem('brandId'),
      userId: localStorage.getItem('userId'),
      phoneTrueFalseBy: false,
      codeTrueFalseBy: false,
      smsCode: "",
      num: 60,
      message: '获取验证码',
      orderCode: "",
      num2: 60,
      message2: '获取验证码',
      channelactive: {},
      authorityList: {
        result: {
          bankCard: "",
          userName: "",
          phone: "",
          securityCode: "",
          expiredTime: "",
        }
      },
      task: {},
      extra: '',
      start: '为保障用户还款时的多元化场景，更有利于养卡提额，建立一个还款多元化消费、多通道介入机制和即时切换机制，请您确认是否体验此功能',
      getSmsUrl: '',
      confirmSmsUrl: '',
      channelTags: '',
      isold: ''
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [Button.name]: Button,
    [Icon.name]: Icon
  },
  created() {
    this.authorityList = JSON.parse(this.$route.params.authorityList)
    this.item = JSON.parse(this.$route.params.item)
    this.task = JSON.parse(this.$route.params.task)
    this.province = this.$route.params.province
    this.extra = this.$route.params.extra
    this.isold = this.$route.params.isold
    this.cardNo = this.authorityList.result.bankCard.substring(0, 4) + '****  ****  ****' + this.authorityList.result.bankCard.substring(this.authorityList.result.bankCard.length - 4, this.authorityList.result.bankCard.length)
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    getUserInfo() {
      userInfoQuery(this.token).then(res => {
        if (res.resp_code == "000000") {
          this.userList = res.result
        }
      })
    },
    // 获取验证码
    getCode() {
      request({
        url: this.authorityList.result.getSmsUrl,
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
          rate: this.authorityList.result.rate,
          extraFee: this.authorityList.result.extraFee,
          dbankCard: this.authorityList.result.dbankCard,
          dbankName: this.authorityList.result.dbankName,
          dphone: this.authorityList.result.dphone,
          userId: this.item.userId
        }),
      }).then(response => {
        if (response.resp_code == '000000') {
          let timer = setInterval(() => {
            this.message = '(' + this.num + ')秒'
            this.num--
            if (this.num == 0) {
              clearInterval(timer)
              this.num = 60
              this.message = '获取验证码'
            }
          }, 1000)
          this.$toast({message: '验证码发送成功', position: 'bottom'})
        } else if (response.resp_code == '999995') {
          let timer = setInterval(() => {
            this.message = '(' + this.num + ')秒'
            this.num--
            if (this.num == 0) {
              clearInterval(timer)
              this.num = 60
              this.message = '获取验证码'
            }
          }, 1000)
          this.$toast({message: '验证码发送成功', position: 'bottom'})
          this.orderCode = res.result
        } else if (response.resp_code == '666666') {
          this.createTask(this.authorityList)
        } else if (response.resp_code == '999991') {
          var odiv = document.createElement("div");
          odiv.innerHTML = response.result
          document.body.appendChild(odiv);
          if (document.getElementById('pay_form') == null) {
            document.getElementById('gatewayform').submit()
          } else {
            document.getElementById('pay_form').submit()
          }
        }
      })
    },
    confirm() {
      if (this.smsCode == '') {
        this.$notify({message: '请先输入验证码', duration: 1000});
        return
      }
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
          orderNo: this.orderCode,
          userId: this.item.userId
        }),
      }).then(response => {
        this.$store.commit('closeLoading')
        if (response.resp_code == '000000') {
          this.createTask()
        } else {
          this.createTask()
        }
      })
    },
    createTask() {
      if (this.isold == 1) {
        this.$store.commit('Loading')
        creditcardSaveTask(JSON.stringify(this.task.result), this.task.amount, this.task.reservedAmount, this.task.version, this.province, '', JSON.stringify(this.extra), this.task.couponId, this.item.cardNo).then(res => {
          this.$store.commit('closeLoading')
          if (res.resp_code == "000000") {
            this.$router.push({
              path: "/creditcard",
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
          } else if (res.resp_code == '999992') {
            this.$router.push({
              name: 'confirmPlan',
              params: {
                channelactive: JSON.stringify(version),
                authorityList: JSON.stringify(res),
                item: JSON.stringify(this.item),
                task: JSON.stringify(this.task),
                province: province,
                extra: this.extra,
                isold: 1
              }
            })
          }
        })
      } else if (this.isold == 2) {
        this.$store.commit('Loading')
        buildChannel(this.item.userId, this.task.creditCardNumber).then(res => {
          this.$store.commit('closeLoading')
          if (res.resp_code == '000000') {
            let extra = JSON.parse(this.extra).merprovince + '-' + JSON.parse(this.extra).mercity + '-' + JSON.parse(this.extra).provinceId.split(',')[0] + '-' + JSON.parse(this.extra).cityCode.split(',')[0]
            balanceSaveEmptyCard(this.item.userId, this.task.creditCardNumber, extra).then(res => {
              this.$store.commit('closeLoading')
              if (res.resp_code == '000000') {
                this.$router.push({
                  path: "/creditcard",
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
              }
            })
          } else if (res.resp_code == "999994") {
            this.$dialog.alert({
              title: '温馨提示',
              message: res.resp_message
            })
          } else if (res.resp_code == "999996") {
            this.$router.push({
              name: "link",
              params: {url: JSON.stringify(res.result), title: JSON.stringify("权限认证")}
            });
          } else if (res.resp_code == '999995') {
            window.location.href = res.result
          } else if (res.resp_code == '999992') {
            this.authorityList = res
            // this.$router.push({name:'confirmPlan',params:{authorityList: JSON.stringify(res),item: JSON.stringify(this.item),task: JSON.stringify(this.task),extra:this.extra}})
            this.$router.go(-1)
          }
        })
      }
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
          bankCard: this.item.cardNo,
          idCard: this.item.idcard,
          phone: this.item.phone,
          userName: this.item.userName,
          bankName: this.item.bankName,
          expiredTime: this.item.expiredTime,
          securityCode: this.item.securityCode,
          channelTag: this.channelTags,
          smsCode: sms,
        })
      }).then(res => {
        if (res.resp_code == '000000') {
          this.$toast({message: res.resp_message, position: 'bottom'})
          this.$refs.Dialog.close()
          this.$router.push({
            path: "/creditcard",
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
        }
      }, err => {
        this.$toast({message: res.resp_message, position: 'bottom'})
      })
    },
    getCode2() {        //绑定多通道验证码
      request({
        url: this.getSmsUrl,//'paymentgateway/verification/getsmscode',
        method: 'post',
        data: qs.stringify({
          bankCard: this.item.cardNo,
          idCard: this.item.idcard,
          phone: this.item.phone,
          userName: this.item.userName,
          bankName: this.item.bankName,
          expiredTime: this.item.expiredTime,
          securityCode: this.item.securityCode,
          channelTag: this.channelTags,
        })
      }).then(res => {
        if (res.resp_code == '000000') {
          let timer = setInterval(() => {
            this.message2 = '(' + this.num + ')秒'
            this.num2--
            if (this.num == 0) {
              clearInterval(timer)
              this.num2 = 60
              this.message2 = '获取验证码'
            }
          }, 1000)
          this.$toast({message: '验证码发送成功,请注意查收', position: 'bottom'})
        }
      })
    },
    topClose() {  //点击 x 跳转到信用卡列表
      this.$router.push({
        path: "/creditcard",
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


</style>
