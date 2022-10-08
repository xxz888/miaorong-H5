<template>
  <div>
    <van-nav-bar title="信用卡" left-arrow @click-left="onClickLeft">
      <template #right>
        <van-icon name="weapp-nav" size="18"/>
      </template>
    </van-nav-bar>
    <div class="warpper">
      <van-row type="flex" justify="space-between" class="color_999 add_card ">
        <ul class="card_rate">
          <li>
            <span class="theme_color">·</span>费率：0.85（每1万元85元手续费）
          </li>
          <li>
            <span class="theme_color">·</span>每还款一笔，立返当前金额千分之1的现金
          </li>
        </ul>
      </van-row>
      <nocard></nocard>
    </div>
  </div>
</template>
<script>
import {
  NavBar,
  Tab,
  Tabs,
  PullRefresh,
  Row,
  Col,
  Icon,
  SwipeCell,
  Button,
  Popup,
} from "vant"
import nocard from "@/components/nodata/nodata";

export default {
  data() {
    return {
      active: 0,
      isLoading: false,
      count: 0,
      user_id: localStorage.getItem("userId"),
      token: localStorage.getItem("token"),
      cardList: [],
      currentdate: "", //当天日期
      year: "",
      timeDay: "", //当月天数
      uppermonth: "", //上月月份
      month: "", //当月月份
      nextmonth: "", //下月月份
      day: "", //当天
      monthDay: "",
      bankIconList: [],
      type: "h5",
      helpTrueFalseBy: false,
      hphone: {}
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
    nocard,
    [Popup.name]: Popup
  },
  mounted() {
    window.nativeInitParams = this.nativeInitParams
  },
  methods: {
    nativeInitParams(item) {
      var obj = item, type = 'h5'
      var path = "/creditcard"
      if (obj.pageName == '空卡还款') {
        path = "/zero"
      } else if (obj.pageName == '交易记录') {
        path = "/bill"
        type = 'app'
      }
      this.$router.push({path: path,
        query: {
          'phone': obj.phone,
          'token': obj.token,
          'brandId': obj.brandId,
          'userId': obj.userId,
          'ip': obj.ip,
          'type': type,
          'deviceId': obj.deviceId,
          'billtype': '2'
        }
      });
    },
    getUrlParam(name) {
      //截取url参数
      var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
      if (reg.test(location.href))
        return unescape(RegExp.$2.replace(/\+/g, " "));
    },
    onClickLeft() {
      try {
        window.android.invokeMethod(7, ["true"]);
      } catch (e) {
        window.webkit.messageHandlers.iosWebKit.postMessage('goroothome');
      }
    }
  }
};
</script>
<style scoped>
.card_box {
  padding: 10px 15px 50px 15px;
}

.card_item {
  /* height: 158px; */
  background: rgba(255, 255, 255, 1);
  /* box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.3); */
  border-radius: 12px;
  margin-bottom: 10px;
  padding: 10px 15px;
  font-size: 14px;
}

.card_right {
  text-align: right;
}

.card_icon_box {
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  position: relative;
  margin-right: 10px;
}

.card_icon {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background: #fff;
  margin-top: 2px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}

.card_bank_name {
  padding-top: 5px;
}

.card_type {
  font-size: 12px;
}

.card_creditBlance {
  font-size: 17px;
}

.card_bank_tips {
  font-size: 12px;
}

.card_cont {
  font-size: 13px;
  padding: 10px 0;
}

/* .card_cont span {
  font-size: 16px;
  color: #ff1d3b;
} */
.card_taskStatus1 {
  color: #35a7fd !important;
}

.card_taskStatus2 {
  color: #51c854 !important;
}

.card_taskStatus0 {
  color: #ffc107 !important;
}

.card_bottom {
  line-height: 25px;
}

.card_arrow_text {
  vertical-align: middle;
}

.card_arrow_icon {
  vertical-align: middle;
}

.card_del {
  height: 100%;
}

.card_item_top_box {
  padding-bottom: 10px;
}

.bank_date {
  font-size: 26px;
  font-weight: 500;
  line-height: 36px;
}

.bank_btn_box {
  position: relative;
}

.bank_btn {
  height: 27px;
  line-height: 27px;
  font-size: 13px;
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
}

.circle_box {
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
}

/* #addcard {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  position: fixed;
  background: url("../../assets/help.png") center no-repeat;
  background-size: 100% 100%;
  right: 5px;
  bottom: 60px;
  z-index: 500;
  text-align: center;
  font-size: 14px;
  color: #fff;
  padding: 10px 0;
} */
.plan_detail_box {
  line-height: 40px;
  position: relative;
}

.plan_detail {
  font-size: 14px;
}

.add_card {
  font-size: 13px;
  padding: 10px 10px 0 15px;
}

.card_rate {
  background: #fff;
  width: 100%;
  padding: 10px 15px;
  border-radius: 10px;
  line-height: 20px;
}

.card_rate li > span {
  font-weight: 500;
  font-size: 14px;
  padding-right: 5px;

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

.plan_status.two {
  color: #30AEFB;
}

.plan_status.one {
  color: #35CC20;
}

>>> .help.van-popup--right {
  top: 100px !important;
  right: 10px;
  border-radius: 10px;
}

.help_box {
  font-size: 14px;
  padding: 10px 15px;

}

.help_item {
  padding: 10px 0;
}

.help_item img {
  height: 20px;
  width: 20px;
  vertical-align: middle;
  margin-right: 10px;
}

.help_item span {
  vertical-align: middle;
}

</style>
