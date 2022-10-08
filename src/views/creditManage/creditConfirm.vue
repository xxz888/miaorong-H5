<template>
  <div>
    <van-nav-bar :border='false' :title="title" left-arrow @click-left="onClickLeft"></van-nav-bar>
    <div class="warpper_top"></div>
    <div class="credit_confirm_cont">
      <ul>
        <li class="confirm_item van-hairline--bottom">
          <van-field v-model="item.firstUserName" readonly label="被授信人姓名" placeholder="被授信人姓名"/>
        </li>
        <li class="confirm_item van-hairline--bottom">
          <van-field v-model="item.firstUserId" readonly type="text" label="被授信人ID" placeholder="被授信人ID"/>
        </li>
        <li class="confirm_item van-hairline--bottom" v-if="type!=2">
          <p v-if="item.superiorQuota>amount" class="tips theme">输入的授信金额大于可用授信额度，请重新输入</p>
          <p v-else class="tips">可用授信额 <span class="tips_color">{{ amount |toFixed }}(元)</span></p>
          <van-field v-model="item.superiorQuota" type="tel" clearable label="授信金额(元)" placeholder="请输入授信金额"/>
        </li>
        <li class="confirm_item van-hairline--bottom">
          <van-field v-model="smsCode" center clearable label="短信验证码" placeholder="请输入6位数验证码">
            <template #button>
              <div class="tips_color" @click="message=='发送验证码'?getCode():''">{{ message }}</div>
            </template>
          </van-field>
        </li>
      </ul>
      <div class="confirm_dec">
        若被授信人空卡还款消费失败，导致授信人信用额度丢失，且被授信人无能力或拒绝弥补丢失信用额度时，授信人需承担信用额度丢失责任，并弥补该部分金额，授信额度为600-6000。
      </div>
      <div class="theme-linear-bg confirm_btn" @click="confirm(item)">
        {{ title }}
      </div>
    </div>
  </div>
</template>

<script>
import {
  NavBar, Field
} from 'vant';
import {
  userQuotaQuery, userSonAuthorizationQuota
} from "@/api/creditManage";

export default {
  data() {
    return {
      brandId: localStorage.getItem('brandId'),
      userId: localStorage.getItem('userId'),
      phone: localStorage.getItem('phone'),
      item: {},
      smsCode: "",
      type: 0,
      title: "确认授信",
      num: 60,
      message: '发送验证码',
      amount: 0,

    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Field.name]: Field
  },
  created() {
    this.item = JSON.parse(this.$route.params.item)
    if (this.item.superiorQuota == 0) {
      this.item.superiorQuota = ''
    }
    this.title = JSON.parse(this.$route.params.title)
    this.type = JSON.parse(this.$route.params.type)
    this._userQuotaQuery()
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    _userQuotaQuery() {
      userQuotaQuery(this.userId).then(res => {
        if (res.resp_code == "000000") {
          this.amount = res.result.selfQuota
        }
      });
    },
    time() {
      let timer = setInterval(() => {
        this.message = '(' + this.num + ')秒'
        this.num--
        if (this.num == 0) {
          clearInterval(timer)
          this.num = 60
          this.message = '发送验证码'
        }
      }, 1000)
    },
    // 获取验证码
    getCode() {
      smsSend(this.brandId, this.phone).then(res => {
        if (res.resp_code == "000000") {
          this.time()
          this.$toast({message: res.resp_message, position: 'bottom'})
        }
      })
    },
    confirm(item) {
      if (item.superiorQuota == 0 || item.superiorQuota == '') {
        this.$toast({message: '授信金额不能为0', position: 'bottom'})
        return
      }
      if (item.superiorQuot > this.amount) {
        this.$toast({message: '授信金额不能大于可授信额度', position: 'bottom'})
        return
      }
      if (this.smsCode == '') {
        this.$toast({message: '请输入验证码', position: 'bottom'})
        return
      }
      let reg = new RegExp(/^[0-9]*$/);
      if (!reg.test(this.smsCode)) {
        this.$toast({message: '验证码为纯数字', position: 'bottom'})
        return
      }
      if (item.superiorQuota == '' || this.type == 2) {
        item.superiorQuota = 0
      }
      userSonAuthorizationQuota(item.firstUserId, item.superiorQuota, this.smsCode).then(res => {
        if (res.resp_code == "000000") {
          this.$toast({message: '授信成功', position: 'bottom'})
          this.onClickLeft()
        }
      })
    }
  }
};

</script>
<style scoped>
.credit_confirm_cont {
  border-radius: 12px;
  margin: 10px;
  background: #fff;
  padding: 10px 15px;
  font-size: 15px;
}

.confirm_item {
  padding: 8px 0;
}

.confirm_dec {
  font-size: 13px;
  color: #999;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 10px;
  margin: 20px 0;
}

.tips_color {
  color: #2574EA;
}

.tips {
  padding-left: 15px;
  font-size: 12px;
  color: #666;
}

.credit_confirm_cont >>> .van-field__control {
  color: #666;
}

.confirm_btn {
  height: 45px;
  line-height: 45px;
  border-radius: 22px;
  width: 100%;
  color: #fff;
  text-align: center;
  margin: 20px 0;
}

</style>
