<!-- 客服 -->
<template>
  <div class="kf_block">
    <van-nav-bar class="contact_nav  " style="background: none;" :border='false' title="联系我们" left-arrow
                 @click-left="onClickLeft"/>
    <div class="main ">
      <div class="contact_top theme">
        <div class="img"><img width="100%" src="../../assets/logo.png" alt=""></div>
        <a :href="'tel:'+prepreUserPhone">
          <div class="top_flex">
            <p>{{ prepreUserPhone |dataHidden }}</p>
            <span class="pr_bg theme">联系上级</span>
          </div>
          <div class="text">我是您的推荐人，可以为您提供推
            广市场和功能使用等服务
          </div>
        </a>
      </div>
      <!-- <div v-if="geMeiqia" style="margin-top: -44px" class="item" @click="meiqia">
        <div class="item_left">
          <img src="../../assets/contact/kf_btn_online_icon.png" alt="">
          <span>在线客服</span>
        </div>
        <div class="item_right">
          <img src="../../assets/contact/right.png" alt="">
        </div>
      </div> -->
      <!-- <div class="item" @click="gonext('feedback')">
        <div class="item_left">
          <img src="../../assets/contact/kf_btn_tousu_icon.png" alt="">
          <span>投诉建议</span>
        </div>
        <div class="item_right">
          <img src="../../assets/contact/right.png" alt="">
        </div>
      </div> -->
      <div class="item" @click="tel()">
        <div class="item_left">
          <img src="../../assets/contact/phone_btn_online_icon.png" alt="">
          <span>电话客服 </span>
        </div>
        <div class="item_right">
          <img src="../../assets/contact/right.png" alt="">
        </div>
      </div>
      <div class="item" @click="copyShaneUrl()">
        <div class="item_left">
          <img src="../../assets/contact/wx.png" alt="">
          <span>微信客服</span>
        </div>
        <div class="item_right">
          <img src="../../assets/contact/right.png" alt="">
        </div>
      </div>
      <!-- <div class="item" @click="feedback()">
        <div class="item_left">
          <img src="../../assets/contact/FAQ.png" alt="">
          <span>常见问题</span>
        </div>
        <div class="item_right">
          <img src="../../assets/contact/right.png" alt="">
        </div>
      </div> -->
    </div>

      <!-- <cardconfirm ref="cardconfirm" but='1' @disconfirm='tel()' :src='require("@/assets/alert/alert.png")'
                 :zi='"是否拨打"+servicePhone'/> -->
  </div>
</template>

<script>
import {NavBar, Dialog} from 'vant'
import {brandQuery} from '@/api/showBrand'
import {preUserQuery} from "@/api/user";
import cardconfirm from '@/components/confirm/alert'

export default {
  data() {
    return {
      brandId: this.global.brandId,
      phone: "",
      weixinBox: false,
      brandList: {
        brandWeiXin: ''
      },
      brandPhone: '',
      prepreUserPhone: "",
      geMeiqia: window.eventBus.geMeiqia, //是否有美洽
      servicePhone:'4008628826'
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Dialog.Component.name]: Dialog.Component,
  },
  created() {
    this.getBrand()
    this._preUserQuery()
  },
  methods: {
    telAction() {
          this.$refs.cardconfirm.disopen()
      
    },
    onClickLeft() {
      window.history.back()
      return
    },
    _preUserQuery() {
      preUserQuery(this.global.brandId, localStorage.getItem('phone')).then(res => {
        if (res.resp_code == "000000") {
          this.prepreUserPhone = res.result.preUserPhone
        }
      })
    },
    tel() {
      let a = document.createElement('a')
      a.setAttribute('href', 'tel:' + this.servicePhone)
      a.click()
      a.remove()
    },
    toWeixin() {
      this.weixinBox = true
    },
    getBrand() {
      brandQuery(this.global.brandId).then(res => {
        if (res.resp_code == "000000") {
          this.brandList = res.result
          this.brandPhone = res.result.brandPhone
        } else {
          this.$toast({message: res.data.resp_message, position: 'bottom'})
        }
      })
    },
    tocopy() {
      let ipt = document.querySelector('.header input')
      ipt.select();
      document.execCommand('Copy');
      this.$toast({message: '已成功复制到粘贴板', position: 'bottom'})
    },
    gonext(item) {
      this.$router.push({name: item})
    },
    copyShaneUrl() {
      var input = document.createElement("input");     // 直接构建input
      input.value = this.brandList.brandWeiXin;   // 设置内容
      document.body.appendChild(input);        // 添加临时实例
      input.select();      // 选择实例内容
      document.execCommand("Copy");     // 执行复制
      document.body.removeChild(input);  // 删除临时实例
      this.$toast({message: '已成功复制到粘贴板', position: 'bottom'})
    },
    feedback() {
      window.open('https://mp.weixin.qq.com/s/AqOXs-jlj8TPBTzGrXXIAw')
    },
    toTip() {
      this.$toast({message: '暂无在线客服', position: 'bottom'})
    },
    meiqia() {
      _MEIQIA('init')
      _MEIQIA('showPanel')
    },
  }
}
</script>
<style scoped>
.kf_block {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.main {
  width: 100%;
  /*padding-top: 56px;*/
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #FFFFFF;
  flex: 1;
}

.item {
  width: 346px;
  height: 56px;
  border-radius: 3px;
  /*background: #FFFFFF;*/
  margin-bottom: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;
  color: #232323;
  font-size: 14px;
  border-bottom: 1px solid #EDEDF0;
}

.item_left {
  display: flex;
  align-items: center;
}

.item_left img {
  width: 24px;
  margin-right: 20px;
}

.item_left p {
  width: 21px;
  height: 21px;
  /* background: url('../../assets/contact/kf_btn_wt_icon.png') no-repeat; */
  background-size: 100%;
  color: #FFFFFF;
  text-align: center;
  line-height: 21px;
  margin-right: 20px;

}

.item_right {
  display: flex;
  align-items: center;
}

.item_right img {
  width: 8px;
  margin-left: 20px;
}

.weixin {
  width: 200px;
  height: 100px;
  background: #FFFFFF;
  border-radius: 10px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between
}

.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  flex-direction: column;
}

.header span {
  font-size: 14px;
  margin-bottom: 5px;
}

.header input {
  border: 0;
  outline: none;
  background: none;
  text-align: center;
}

.btm {
  height: 40px;
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.contact_top {
  width: 100%;
  height: 220px;
  background: url("../../assets/contact/kf_top_bg.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #30AEFB;
}

.contact_top .img {
  width: 68px;
  height: 68px;
  overflow: hidden;
  margin-right: 15px;
}

.contact_top .text {
  width: 225px;
  text-align: left;
  height: 35px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #fff;
  line-height: 18px;
  letter-spacing: 1px;
}

.top_flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;

}

.top_flex p {
  height: 25px;
  font-size: 18px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #fff;
  line-height: 25px;
}

.top_flex span {
  height: 19px;
  /* background:rgba(255,255,255,1); */
  border-radius: 10px;
  font-size: 11px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  /* color: #333; */
  line-height: 19px;
  padding: 0 10px;
  vertical-align: center;
}

.pr_bg {
  background: #fff;
}

.contact_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.contact_nav >>> .van-icon {
  color: #FFFFFF !important;
}
</style>
