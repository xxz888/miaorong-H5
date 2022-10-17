<!-- 余额提现 -->
<template>
  <div>
    <van-nav-bar
      title="提现"
      left-arrow
      fixed
      :border="false"
      @click-left="onClickLeft"
      class="agent_nav theme_bg"
    />
    <div class="main">
      <van-pull-refresh class="pull" v-model="isLoading" @refresh="onRefresh">
        <div class="caption">入账账户</div>
        <van-radio-group
          v-model="radio"
          checked-color="#1989fa"
          class="selectView"
        >
          <van-radio name="1">
            <!-- 支付宝 -->
            <div class="card">
              <div class="card_left">
                <span>
                  <img src="../../assets/zhifubao.png" alt="" />
                </span>
                <div class="card_left_cont">
                  <p v-if="zhifubaoAccList.length != 0" class="bankName">
                    {{ zhifubaoAccList[zhifubaoAccList.length - 1].aliNo }}
                  </p>
                  <p v-if="zhifubaoAccList.length == 0" class="bankName">
                    请添加支付宝账号
                  </p>
                </div>
              </div>

              <div class="card_right" @click="zhifubaoAlertShow = true">
                {{ zhifubaoAccList.length == 0 ? "添加" : "修改" }}
              </div>
            </div>
            <!-- <p class="cardTip">手续费: 1元/笔</p> -->
          </van-radio>
          <van-radio name="0">
            <!-- 银行 -->
            <div class="card" @click="gonext('card')">
              <div class="card_left">
                <span v-if="card.length != 0">
                  <img
                    v-if="card.nature.indexOf('支') >= 0"
                    src="../../assets/profit/zfb.png"
                    alt=""
                  />
                  <img
                    v-else
                    :src="
                      require('../../assets/bankIcon/BANK_' +
                        card.logimg +
                        '.png')
                    "
                    alt=""
                  />
                </span>
                <div v-if="card.length != 0" class="card_left_cont">
                  <p class="bankName">{{ card.bankName }}</p>
                  <span v-if="card.nature.indexOf('支') >= 0">
                    {{ card.cardNo | phonestart }}****{{
                      card.cardNo | cardNoEnd
                    }}
                  </span>
                  <span v-else
                    >{{ card.cardType }}&nbsp;&nbsp;|&nbsp;&nbsp;尾号{{
                      card.cardNo | cardNoEnd
                    }}</span
                  >
                </div>
              </div>
              <div v-if="card.length == 0" class="def_card">
                <img src="../../assets/logo.png" alt="" />
                <p>未设置默认提现卡</p>
              </div>
              <div class="card_right">修改</div>
            </div>
            <!-- <p class="cardTip">
              {{
                "手续费：0.1%(税费)+" +
                withdrawConfig.fee +
                "元/次，1000元以下免税费"
              }}
            </p> -->
          </van-radio>
        </van-radio-group>

        <div class="caption">提现金额</div>
        <div class="content">
          <div class="money">
            <van-field
              clearable
              v-model="money"
              label-width="30px"
              type="number"
              placeholder="请输入提现金额"
            >
              <span slot="label"
                ><img width="15px" src="../../assets/profit/amount.png"
              /></span>
            </van-field>
          </div>
          <h3 class="amount">
            可提现金额:{{ account.currentBalance | toFixed }}
          </h3>
        </div>
        <div class="withdraw_tips">
          <van-row style="margin-bottom: 6px">
            <van-col style="color: #df2a23" span="6">提现时间：</van-col>
            <van-col span="18"
              >工作日{{ withdrawConfig.startTime }} -
              {{ withdrawConfig.endTime }}</van-col
            >
          </van-row>
          <van-row style="margin-bottom: 6px">
            <van-col style="color: #df2a23" span="6">金额限制：</van-col>
            <van-col span="18"
              >单笔{{ withdrawConfig.singleMinLimit }} -
              {{ withdrawConfig.singleMaxLimit }}元</van-col
            >
          </van-row>
          <!-- <van-row style="margin-bottom: 6px">
            <van-col style="color: #df2a23" span="6">到账时间：</van-col>
            <van-col span="18"
              >{{ withdrawConfig.t1Amount }}元以下，即时到账，{{
                withdrawConfig.t1Amount
              }}元及以上，下个工作日12:00:00之前到账</van-col
            >
          </van-row> -->
          <!-- <van-row style="margin-bottom:6px">
            <van-col style="color:#df2a23" span="6">手续费：</van-col>
            <van-col span="18">0.1%（税费）+{{ withdrawConfig.fee }}元/次，1000元以下免税费</van-col>
          </van-row> -->
        </div>
        <div class="submit theme-linear-bg" @click="submit()">确认提现</div>
      </van-pull-refresh>
    </div>
    <van-popup v-model="show" position="bottom" :style="{ height: '65%' }">
      <van-password-input
        :value="paypass"
        info="支付密码为 6 位数字"
        :focused="showKeyboard"
        @focus="showKeyboard = true"
      />
      <van-number-keyboard
        :show="showKeyboard"
        @input="onInput"
        @delete="onDelete"
        @blur="showKeyboard = false"
      />
    </van-popup>
    <van-dialog
      v-model="defDialog"
      title=""
      show-cancel-button
      confirmButtonText="确定"
      confirmButtonColor="#FB933F"
      @confirm="gonext('card')"
    >
      <div class="pop_title">
        <img src="../../assets/logo.png" alt="" />
        <div>
          <h3>提醒</h3>
          <p>暂无默认银行卡，请前往添加</p>
        </div>
      </div>
    </van-dialog>

    <!--弹出框，赋予chargeBtn事件-->
    <van-dialog
      v-model="zhifubaoAlertShow"
      title="填写支付宝账号"
      show-cancel-button
      @confirm="zhifubaofinish()"
    >
      <!--输入框-->
      <van-field
        v-model="zhifubaoAcc"
        rows="1"
        autosize
        type="textarea"
        placeholder="只能添加实名信息为本人的支付宝账号"
      />
    </van-dialog>
  </div>
</template>

<script>
import {
  NavBar,
  PullRefresh,
  Icon,
  Field,
  PasswordInput,
  Popup,
  NumberKeyboard,
  Dialog,
  Row,
  Col,
  RadioGroup,
  Radio,
} from "vant";
import {
  userInfoQuery,
  getAccountQuery,
  bankDefault,
  paypassAuth,
  withdrawNew,
  getAliAccount,
  addAliAccount,
} from "@/api/user";
import {
  userBankAndNature,
  bankIconQuery,
  withdrawConfigApi,
} from "@/api/card/card";

export default {
  data() {
    return {
      card: [],
      userId: "",
      token: "",
      isLoading: false,
      money: "",
      withdrawFee: 0,
      account: {},
      balance: 0,
      show: false,
      paypass: "", // 支付密码
      showKeyboard: true,
      phone: "",
      brandId: this.global.brandId,
      defDialog: false,
      ail: {},
      withdrawConfig: {},
      zhifubaoAlertShow: false,
      zhifubaoAccList: [],
      zhifubaoAcc: "",
      radio: "1",
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [Icon.name]: Icon,
    [Col.name]: Col,
    [Row.name]: Row,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [PasswordInput.name]: PasswordInput,
    [NumberKeyboard.name]: NumberKeyboard,
    [Dialog.Component.name]: Dialog.Component,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
  },
  created() {
    this.ail = this.$route.params.item;
    this.userId = localStorage.getItem("userId");
    this.token = localStorage.getItem("token");
    this.phone = localStorage.getItem("phone");
    this.getWithdrawConfig();
    this.getCard();
    this.getUserInfo();
    this.getBalance();
    this.getAlipay();
  },
  methods: {
    zhifubaofinish() {
      if (this.zhifubaoAcc == "") {
        this.$toast({ message: "请填写支付宝账号", position: "bottom" });
        return;
      }
      addAliAccount(this.zhifubaoAcc).then((res) => {
        if (res.resp_code == "000000") {
          this.getAlipay();
        }
      });
    },
    onClickLeft() {
      window.history.back();
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false;
        this.getCard();
      }, 500);
    },
    // 页面跳转
    gonext(item) {
      this.$router.push({ name: "account" });
    },
    getWithdrawConfig() {
      withdrawConfigApi().then((res) => {
        if (res.resp_code == "000000") {
          this.withdrawConfig = res.result;
        }
      });
    },
    // 获取默认卡
    async getCard() {
      if (this.ail.nature) {
        this.card = this.ail;
      } else {
        let bank = await userBankAndNature(this.userId, 2, 2, 0);
        bankDefault(this.userId).then((res) => {
          if (res.resp_code == "000000") {
            bankIconQuery().then((res1) => {
              if (bank.result.includes(res.result)) {
                //判断储蓄卡里是否有默认卡 没有就选择储蓄卡的第一张
                this.card = res.result;
              } else {
                this.card = bank.result[0];
              }
              if (res1.resp_code == "000000") {
                res1.result.map((item) => {
                  if (this.card.bankName == item.bank_name) {
                    this.card.logimg = item.bank_acronym;
                  }
                });
              } else {
                this.$toast({ message: res1.resp_message, position: "bottom" });
              }
            });
          } else {
            this.defDialog = true;
            return;
            this.$toast({ message: res.resp_message, position: "bottom" });
          }
        });
      }
    },
    // 获取个人信息
    getUserInfo() {
      userInfoQuery(this.token).then((res) => {
        if (res.resp_code == "000000") {
          this.withdrawFee = res.result.withdrawFee;
        } else {
          this.$toast({ message: res.resp_message, position: "bottom" });
        }
      });
    },
    //获取支付宝账号
    getAlipay() {
      getAliAccount().then((res) => {
        if (res.resp_code == "000000") {
          this.zhifubaoAccList = res.result;
        } else {
        }
      });
    },
    // 获取账户资产
    getBalance() {
      getAccountQuery(this.token).then((res) => {
        if (res.resp_code == "000000") {
          this.account = res.result;
        } else {
          this.$toast({ message: res.resp_message, position: "bottom" });
        }
      });
    },
    // 确认提现
    submit() {
      if (
        this.money < this.withdrawConfig.singleMinLimit ||
        this.money > this.withdrawConfig.singleMaxLimit
      ) {
        this.$toast({
          message:
            "提现金额单笔在" +
            this.withdrawConfig.singleMinLimit +
            " - " +
            this.withdrawConfig.singleMaxLimit +
            "元之间",
          position: "bottom",
        });
        return;
      }
      if (this.money > this.account.currentBalance) {
        this.$toast({
          message: "提现金额不能大于可提现金额",
          position: "bottom",
        });
        return;
      }
      this.show = true;
      this.paypass = "";
      this.showKeyboard = true;
    },
    onInput(key) {
      this.paypass = (this.paypass + key).slice(0, 6);
      if (this.paypass.length == 6) {
        paypassAuth(this.token, this.paypass).then((res) => {
          if (res.resp_code == "000000") {
            withdrawNew({
              amount: this.money,
              type: this.radio,
              aliNo:
                this.radio == 0
                  ? ""
                  : this.zhifubaoAccList[this.zhifubaoAccList.length - 1].aliNo,
            }).then((res1) => {
              if (res1.resp_code == "000000") {
                this.$toast({ message: res1.resp_message, position: "bottom" });
                this.$router.push({ name: "home" });
              } else {
                this.$toast({ message: res1.resp_message, position: "bottom" });
              }
            });
          } else {
            this.$toast({ message: res.resp_message, position: "bottom" });
          }
        });
      }
    },
    onDelete() {
      this.paypass = this.paypass.slice(0, this.paypass.length - 1);
    },
  },
};
</script>
<style scoped>
.main {
  padding-top: 70px;
  text-align: left;
  font-size: 14px;
  background: #30AEFB;
}

.card {
  background: #ffffff;
  display: flex;
  width: 300px;
  padding: 10px 10px 15px 10px;
  box-sizing: border-box;
  border-radius: 10px;
  margin: 20px auto 0px auto;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  box-shadow: 2px 1px 5px 3px rgba(130, 130, 130, 0.2);
}

.bankName {
  margin: 5px 0px;
}

.card_right {
  color: #30AEFB;
}

.card_left {
  display: flex;
  justify-items: left;
  align-items: center;
  color: #121212;
}

.card_left img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.card_left span {
  color: #666666;
}

.def_card {
  width: 100%;
  display: flex;
  align-items: left;
}

.def_card img {
  width: 36px;
  height: 36px;
}

.def_card p {
  line-height: 36px;
  margin-left: 10px;
}

.content {
  border-radius: 10px;
  background: #ffffff;
  padding: 5px 0px 5px 0px;
  width: 330px;
  box-sizing: border-box;
  margin: 20px auto 0px auto;
  box-shadow: 2px 1px 5px 3px rgba(130, 130, 130, 0.2);
}

.content p {
  padding: 0 20px;
}

.money {
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid rgba(130, 130, 130, 0.1);
}

.money span {
  font-size: 24px;
}

.allMoney {
  color: #bbb;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.submit {
  width: 300px;
  height: 45px;
  color: #ffffff;
  line-height: 45px;
  font-size: 16px;
  margin: 20px auto;
  text-align: center;
  border-radius: 50px;
  box-shadow: 1px 3px 5px 0px rgba(130, 130, 130, 0.2);
}

.paypass {
  width: 100%;
}

.pop_title {
  display: flex;
  align-content: left;
  padding: 10px;
}

.pop_title img {
  width: 46px;
  height: 46px;
}

.pop_title p {
  color: #999999;
  margin-left: 10px;
}

.withdraw_tips {
  height: 98px;
  width: 80%;
  margin: 40px auto;
}

.tips {
  width: 80%;
  margin: 40px auto;
}

.tips li {
  list-style: disc;
}

.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.agent_nav >>> .van-icon {
  color: #ffffff !important;
}

.caption {
  font-size: 16px;
  border-left: 5px solid #1989fa;
  margin: 30px 0px 10px 25px;
  padding-left: 15px;
}

.pull {
  border-radius: 30px 30px 0px 0px;
  background-color: #ffff;
}

.warn {
  margin: 20px 0px 0px 0px;
  padding: 0px 40px;
  font-size: 10px;
}

.warn div {
  margin: 10px 0px;
}

.warn .dot {
  width: 12px;
  height: 12px;
  display: inline-block;
  background: #30AEFB;
  border-radius: 50%;
  margin: 0px 15px 5px 0px;
}

.warn p {
  display: inline-block;
  margin-left: 5px;
  color: #aaa;
}

.warn span {
  display: block;
}

.warn_tit {
  font-size: 15px;
  color: #000;
}

.amount {
  margin-top: 10px;
  margin-left: 20px;
}
.selectView {
  padding-left: 20px;
  padding-right: 20px;

  background: #ffffff;
  /* padding: 20px 0 0; */
  /* width: 100%; */
  /* box-sizing: border-box; */
}
.cardTip {
  color: red;
  font-size: 13px;
}
</style>
