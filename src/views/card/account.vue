<template>
  <div>
    <van-nav-bar :title="title" class="agent_nav theme_bg" left-arrow @click-left="onClickLeft"></van-nav-bar>
    <div class="warpper">
      <div class="my_card_box">
        <div class="my_card_item" v-for="(item,index) in cardList" :key="index" @click="selCard($event,item)">
          <div class="my_my_card_item_top ">
            <van-row type="flex" justify="space-between">
              <van-col span="4">
                <img v-if="item.nature.indexOf('支付宝')>=0" class="my_card_icon" src='../../assets/profit/zfb.png'>
                <img v-else class="my_card_icon" :src='"../../assets/bankIcon/BANK_"+item.logimg+".png"'>
              </van-col>
              <van-col span="10">
                <div class=" my_card_bank_name van-ellipsis ">{{ item.bankName }}</div>
                <div class=" my_card_bank_tips">尾号 {{ item.cardNo | cardNoEnd }} | 结算卡</div>
              </van-col>
              <van-col span="7" class="my_card_right">
              </van-col>
            </van-row>
          </div>
          <div class="my_card_item_mask_box">
            <div class="my_card_item_mask"></div>
          </div>
        </div>
        <nocard v-if="cardList.length==0"></nocard>
      </div>
      <van-overlay :show="show" @click="show=false">
        <div class="wrapper">
          <div class="block" @click.stop>
            <div class="addtitle">添加到账方式</div>
            <div @click="addCard(2)"><img src="../../assets/profit/card.png" alt="">添加银行卡</div>
            <div @click="addCard(3)"><img src="../../assets/profit/zfb.png" alt="">绑定支付宝</div>
          </div>
        </div>
      </van-overlay>
      <div class="tabbar_p"></div>
    </div>
    <div class="add_btn theme-linear-bg" @click="addCard(2)">
      <van-icon name="add-o"/>
      <span>添加账户</span>
    </div>
  </div>
</template>
<script>
import {NavBar, Tab, Tabs, PullRefresh, Row, Col, Icon, SwipeCell, Button, Overlay} from "vant";
import {cardQuery, bankDel, userBankAndNature, cardDefault, bankIconQuery} from "@/api/card/card";
import {bankcardIsdefault} from "@/api/online";
import nocard from '@/components/nodata/nodata';

export default {
  data() {
    return {
      active: 0,
      isLoading: false,
      count: 0,
      user_id: localStorage.getItem('userId'),
      token: localStorage.getItem('token'),
      cardList: [],
      currentdate: "",//当天日期
      year: "",
      timeDay: "",//当月天数
      uppermonth: "",//上月月份
      nextmonth: "",//下月月份
      day: "",//当天
      monthDay: "",
      bankIconList: [],
      type: "",
      title: "选择到账账户",
      cardType: 0,
      show: false
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [PullRefresh.name]: PullRefresh,
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [SwipeCell.name]: SwipeCell,
    [Button.name]: Button,
    [Overlay.name]: Overlay,
    nocard
  },
  created() {
    this.getbankIcon()
    this.getDebitCard()
  },
  methods: {
    onClickLeft() {
      history.go(-1)
    },
    addCard(type) {
      if (type == 2) {
        this.$router.push({name: "depositCardAdd"})
      } else {
        this.$router.push({name: "accountAdd"})
      }
    },
    getbankIcon() {
      bankIconQuery().then(icon => {
        if (icon.resp_code == "000000") {
          this.bankIconList = icon.result
        }
      })
    },

    async getDebitCard() {
      this.cardList = []
      let card = []
      let set = []
      let bank = await userBankAndNature(this.user_id, 2, 2, 0)
      // let zfc = await userBankAndNature(this.user_id, 3, 2, 0)
      // if (zfc.result) {
      //   card.push(...zfc.result)
      // }
      if (bank.result) {
        card.push(...bank.result)
      }
      card.forEach(item => {
        for (var j = 0; j < this.bankIconList.length; j++) {
          if (item.bankName == this.bankIconList[j].bank_name) {
            item.logimg = this.bankIconList[j].bank_acronym;
            item.background = this.bankIconList[j].background;
            break;
          } else {
            item.background = "#30AEFB"
            item.logimg = "default"
          }
        }
        this.$nextTick(() => {
          this.cardList.push(item)
        })
      })
    },
    selCard(event, item) {
      event.cancelBubble = true;
      this.defaults(item, event)
    },
    defaults(item, event) {
      event.cancelBubble = true;
      var cardTypeDef = 2
      if (item.nature.indexOf('支') >= 0) {
        cardTypeDef = 3
      }

      bankcardIsdefault(this.user_id, item.cardNo, cardTypeDef).then(res => {
        if (res.resp_code == '000000') {
          this.$router.push({name: 'withdraw', params: {item: item}});
        }
      })
    }
  }
};
</script>
<style scoped>
.my_card_box {
  padding: 10px 15px;
}

.my_card_item {
  margin-bottom: 10px;
  padding: 10px 15px;
  font-size: 14px;
  position: relative;
  z-index: 3;
}

.my_card_item_mask_box {
  position: absolute;
  height: 100%;
  width: 100%;
  position: absolute;
  right: 0;
  top: 0;
  z-index: -1;
  border-radius: 12px;
  box-shadow: 0px 0px 10px 0px #aaa;
}

.my_card_item_mask {
  background: url("../../assets/card/card_mask.png") center no-repeat;
  background-size: 100% 100%;
  height: 100%;
  width: 100%;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 0;

}

.my_my_card_item_top {

}

.my_card_right {
  text-align: right;
  font-size: 12px;
  line-height: 30px;
}

.my_card_icon {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  margin-top: 5px;
  margin-left: 15px;
  background: #fff;
}

.my_card_bank_name {
  font-size: 20px;
}

.my_card_bank_name > span {
  font-size: 14px;
}

.my_card_bank_tips {
  font-size: 13px;
  color: #aaa;
}

.my_card_bank_tips {
  font-size: 13px;
}

.my_card_bank_edit {
  display: flex;
  font-size: 14px;
}

.my_card_bank_edit div {
  flex: 1;
}

.my_card_cont {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 18px;
}

.my_card_cont span {
  font-size: 16px;
  color: #FF1D3B;
}

.my_card_bottom {
  line-height: 25px;
  padding-top: 8px;
}

.my_card_arrow_text {
  vertical-align: middle;
  padding-left: 4px;
}

.card_arrow_icon {
  vertical-align: middle;
}

.card_del {
  height: 100%;
}

.add_card .right {
  text-align: right;
}

.add_card .right span, .van-icon {
  vertical-align: middle;
}

.add_card .right span {
  padding-left: 5px;
}

.add_btn {
  color: #fff;
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 14px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}

.add_btn span {
  padding-left: 5px;
}

.tabbar_p {
  height: 50px;
  width: 100%;
}

.warpper {
  height: 100vh;
  overflow: scroll;
  background-color: #fff;
}

.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.agent_nav >>> .van-icon {
  color: #FFFFFF !important;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 200px;
  height: 160px;
  background-color: #fff;
  border-radius: 10px;
  font-size: 15px;
  text-align: center;
}

.block img {
  width: 25px;
  vertical-align: middle;
  margin-right: 15px;
}

.block div {
  margin: 20px auto;
  width: 150px;
}

.addtitle {
  font-size: 18px;
  font-weight: 600;
}


</style>
