<template>
  <div>
    <van-nav-bar :title="title" left-arrow @click-left="onClickLeft"></van-nav-bar>
    <div class="warpper">
      <van-tabs v-model="active" animated title-active-color="#30AEFB"         color="#30AEFB"      
   background="none" sticky line-width="22px"
                @change="tabSwitch">
        <van-tab title="信用卡">
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height="45">
            <div class="my_card_box">
              <div v-for="(item,index) in cardList" :key="index">
                <div class="my_card_item" v-if="active==0 && item.nature.indexOf('贷')>=0" @click="selCard($event,item)">
                  <div class="my_my_card_item_top ">
                    <van-row type="flex" justify="space-between">
                      <van-col span="4">
                        <img class="my_card_icon"
                             :src="require('../../assets/bankIcon/BANK_'+item.logimg+'.png')">
                      </van-col>
                      <van-col span="10">
                        <div class=" my_card_bank_name van-ellipsis ">
                          {{ item.bankName }}<span> ({{ item.userName |userName }}**)</span></div>
                        <div class=" my_card_bank_tips">充值卡</div>
                      </van-col>
                      <van-col span="10" class="my_card_right"></van-col>
                    </van-row>
                  </div>
                  <div class="my_card_cont van-hairline--bottom">
                    {{ item.cardNo | carNoStart }} **** **** **** {{ item.cardNo | cardNoEnd }}
                  </div>
                  <div class="my_card_bottom">
                    <van-row type="flex" justify="space-between">
                      <van-col span="15">
                        <div class=" ">{{ item.cardType }}</div>
                      </van-col>
                      <van-col span="9" class="my_card_right">
                        <div class="my_card_bank_edit ">
                          <div @click="isuserable(item,'updateCard',$event)">
                            <van-icon name="edit" class="card_arrow_icon "/>
                            <span class="my_card_arrow_text ">修改</span>
                          </div>
                          <div @click="carddel(item,$event)">
                            <van-icon name="delete" class="card_arrow_icon "/>
                            <span class="my_card_arrow_text ">删除</span>
                          </div>
                        </div>
                      </van-col>
                    </van-row>
                  </div>
                  <div class="my_card_item_mask_box" :style="'background:'+ item.background">
                    <div class="my_card_item_mask"></div>
                  </div>
                </div>
              </div>
              <nocard v-if="cardList.length==0"></nocard>
            </div>
          </van-pull-refresh>

        </van-tab>
        <van-tab title="储蓄卡">
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height="98">
            <div class="my_card_box">
              <div v-for="(item,index) in cardList" :key="index">
                <div class="my_card_item" v-if="active==1 && item.nature.indexOf('借')>=0"
                     @click="selCard($event,item)">
                  <div class="my_my_card_item_top ">
                    <van-row type="flex" justify="space-between">
                      <van-col span="4">
                        <img class="my_card_icon"
                             :src="require('../../assets/bankIcon/BANK_'+item.logimg+'.png')">
                      </van-col>
                      <van-col span="10">
                        <div class=" my_card_bank_name van-ellipsis ">
                          {{ item.bankName }}<span> ({{ item.userName |userName }}**)</span></div>
                        <div class=" my_card_bank_tips">提现卡</div>
                      </van-col>
                      <van-col span="10" class="my_card_right">
                        <div class="isdef isDef" v-if="item.idDef == '1'">默认卡</div>
                        <div class="isdef setDef" v-else @click="defaults(item,$event)">设为默认卡</div>
                      </van-col>
                    </van-row>
                  </div>
                  <div class="my_card_cont van-hairline--bottom">
                    {{ item.cardNo | carNoStart }} **** **** **** {{ item.cardNo | cardNoEnd }}
                  </div>
                  <div class="my_card_bottom">
                    <van-row type="flex" justify="space-between">
                      <van-col span="15">
                        <div class=" ">{{ item.cardType }}</div>
                      </van-col>
                      <van-col span="9" class="my_card_right">
                        <div class="my_card_bank_edit ">
                          <div @click="isuserable(item,'setProvince',$event)">
                            <van-icon name="edit" class="card_arrow_icon "/>
                            <span class="my_card_arrow_text ">修改</span>
                          </div>
                          <div @click="carddel(item,$event)">
                            <van-icon name="delete" class="card_arrow_icon "/>
                            <span class="my_card_arrow_text ">删除</span>
                          </div>
                        </div>
                      </van-col>
                    </van-row>
                  </div>
                  <div class="my_card_item_mask_box" :style="'background:'+ item.background">
                    <div class="my_card_item_mask"></div>
                  </div>
                </div>
              </div>
              <nocard v-if="cardList.length==0"></nocard>
            </div>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
      <div class="tabbar_p"></div>
    </div>
    <div class="add_btn theme-linear-bg" @click="addCard()">
      <van-icon name="add-o"/>
      <span>{{ active == 0 ? '添加信用卡' : '添加储蓄卡' }}</span>
    </div>
  </div>
</template>
<script>
import {NavBar, Tab, Tabs, PullRefresh, Row, Col, Icon, SwipeCell, Button} from "vant";
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
      title: "我的银行卡",
      cardType: 0,
      txt: ''
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
    nocard
  },
  created() {
    this.title = JSON.parse(this.$route.params.title)
    this.cardType = JSON.parse(this.$route.params.type)
    this.active = JSON.parse(this.$route.params.active)
    this.getbankIcon()
    if (this.active == 0) {
      this.getcard()
    } else {
      this.getDebitCard()
    }
  },
  methods: {
    onClickLeft() {
      history.go(-1)
    },

    tabSwitch(name, titile) {
      this.active = name
      if (name == 0) {
        this.getcard()
      } else {
        this.getDebitCard()
      }
    },
    addCard() {
      if (this.active == 0) {
        this.$router.push({name: "debitCardAdd"});
      } else {
        this.$router.push({name: "depositCardAdd"});
      }

    },
    getbankIcon() {
      bankIconQuery().then(icon => {
        if (icon.resp_code == "000000") {
          this.bankIconList = icon.result
        }
      })
    },
    getcard() {
      //查询信用卡
      cardQuery(this.user_id).then(res => {
        this.cardList = []
        if (res.resp_code == "000000") {
          res.result.forEach(item => {
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
            this.cardList.push(item)
          })
        }
      })
    },
    getDebitCard() {
      userBankAndNature(this.user_id, 2, 2, 0).then(res => {
        this.cardList = []
        if (res.resp_code == "000000") {
          res.result.forEach(item => {
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
        }
      })
    },
    selCard(event, item) {
      event.cancelBubble = true;
      if (this.cardType == 1 && this.active == 1) {
        this.defaults(item, event)
      } else if (this.cardType == 2) {
        this.defaults(item, event)
      }
    },
    isuserable(item, type, event) {
      event.cancelBubble = true
      this.$router.push({
        name: type,
        params: {item: JSON.stringify(item), type: 3}
      })
    },
    carddel(item, event) {
      event.cancelBubble = true;
      //删除银行卡
      this.$dialog.confirm({
        title: '温馨提示',
        message: "确定要删除银行卡吗？",
      }).then(() => {
        bankDel(this.token, item.cardNo, item.type).then(res => {
          if (res.resp_code == "000000") {
            this.$notify({type: "primary", message: res.resp_message});
            if (this.active == 0) {
              this.getcard()
            } else {
              this.getDebitCard()
            }
          }
        })
      })
    },
    defaults(item, event) {
      event.cancelBubble = true;
      var cardTypeDef = 0
      if (this.active == 1) {
        cardTypeDef = 2
      }
      bankcardIsdefault(this.user_id, item.cardNo, cardTypeDef).then(res => {
        if (res.resp_code == '000000') {
          if (this.cardType == 0) {
            if (this.active == 0) {
              this.getcard()
            } else {
              this.getDebitCard()
            }
          } else {
            this.onClickLeft()
          }
        }
      })
    },
    onRefresh() {
      setTimeout(() => {
        this.$toast("刷新成功");
        this.isLoading = false;
        if (this.active == 0) {
          this.getcard()
        } else {
          this.getDebitCard()
        }
      }, 300);
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
  color: #fff;
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

}

.my_card_item_mask {
  border-radius: 10px;
  background: #30AEFB;
  background-size: 100% 100%;
  height: 100%;
  width: 100%;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 0;

}

.my_my_card_item_top {
  padding: 0px 0 10px 0;
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
  background: #fff;
}

.my_card_bank_name {
  font-size: 16px;
}

.my_card_bank_name > span {
  font-size: 14px;
}

.my_card_bank_tips {
  font-size: 12px;
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


</style>
