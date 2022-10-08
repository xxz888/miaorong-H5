<template>
  <div>
    <van-nav-bar class="pre_nav " style="background: none;" :border='false' title="我的推荐人" left-arrow
                 @click-left="onClickLeft"/>
    <div class="">
      <div class="pre_bg_t"></div>
      <div class="pre_cont">
        <img class="user_icon" src="../../assets/zero/user_icon.png"
             alt="">
        <div class="title" v-if="prepreUserPhone!='' &&  prepreUserPhone!=null">直接推荐人：{{
            prepreUserPhone |dataHidden
          }}
        </div>
        <div class="title" v-else>直接推荐人：暂无</div>
        <div class="phone" v-if="prepreUserPhone!='' &&  prepreUserPhone!=null">
          <span>手机:{{ prepreUserPhone }}</span>
          <a :href="'tel:'+prepreUserPhone" class="user_right">
            <img src="../../assets/zero/phone_iocn.png" alt="">
          </a>
        </div>
        <div class="tips">
          直接推荐人是使用喵融生活联盟生活的直接推荐人，他可以为您提供喵融生活联盟生活功能使用说明，推广引导等服务，让您可以快速学会喵融生活联盟生活的使用，并在您有推广意向时，能够引导您快速获利。
        </div>
      </div>
      <div class="pre_bg_b"></div>
      <!-- <a  v-if="prepreUserPhone!='' &&  prepreUserPhone!=null" :href="'tel:'+prepreUserPhone" class="user_right">
        <div  :class="brandId==468?'axb_supper':'supper'"  >联系上级</div>
      </a> -->
    </div>

  </div>
</template>

<script>
import {NavBar, Row, Col, Icon} from 'vant';
import {preUserQuery} from "@/api/user";

export default {
  data() {
    return {
      brandId: localStorage.getItem('brandId'),
      phone: localStorage.getItem('phone'),
      prepreUserPhone: "",

    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon,
  },
  computed: {},
  created() {
    this._preUserQuery()
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    _preUserQuery() {
      preUserQuery(this.brandId, this.phone).then(res => {
        if (res.resp_code == "000000") {
          this.prepreUserPhone = res.result.preUserPhone
        }
      });
    },
    goList(item, event) {
      event.cancelBubble = true;
      repaymentsupportbank(item.version).then(res => {
        if (res.resp_code == '000000') {
          this.bankList = res.result
          this.zhiciTrueFalseBy = true
        }
      })
    }
  }
};
</script>
<style scoped>
.pre_bg_t {
  height: 150px;
  width: 100%;
  background: url("../../assets/zero/pre_bg_t.png") center no-repeat;
  background-size: 100% 100%;
}

.pre_bg_b {
  height: 195px;
  width: 100%;
  position: fixed;
  bottom: 0;
  background: url("../../assets/zero/pre_bg_b.png") center no-repeat;
  background-size: 100% 100%;
}
.pre_cont {
  width: 95%;
  padding: 10px 15px;
  background: #fff;
  margin: -80px auto 0 auto;
  text-align: center;
  border-radius: 10px;

}

.user_icon {
  height: 78px;
  width: 78px;
}

.title {
  font-size: 13px;
  color: #333;
  font-weight: 500;
  padding: 10px 30px;
}

.phone {
  text-align: right;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #EFF1F5;
  padding: 0 15px;
  font-size: 14px;
}

.phone span {
  vertical-align: middle;
  display: inline-block;
  text-align: left;
  width: 93%;
}

.phone img {
  height: 19px;
  width: 18px;
  vertical-align: middle;
}

.tips {
  font-size: 12px;
  color: #999;
  padding: 10px 15px 0 15px;
  text-align: left;
}

.pre_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.pre_nav >>> .van-icon {
  color: #FFFFFF !important;
}

</style>
