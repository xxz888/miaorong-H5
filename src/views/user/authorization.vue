<!-- 授权 -->
<template>
  <div>
    <van-nav-bar class="online_nav theme_bg" title="授权" left-arrow fixed :border='false' @click-left="onClickLeft"/>
    <div class="warpper_top"></div>
    <div class="main ignore">
      <div class="content">
      </div>
      <div class="biao">
        <h4 class="tit">您正在使用身份验证服务</h4>
        <ul class="tip">
          <li>人脸及身份信息</li>
          <li>视频图像信息</li>
          <li>操作行为信息</li>
        </ul>
      </div>
      <div class="tongyi ">
        <label class="cha"> <input class="che" type="checkbox" v-model="acitve"> 勾选后，点击按钮即您同意</label><span
        class="agreement" @click.stop="$router.push({name:'agreement'})">《用户信息授权协议》</span>并确认授权
      </div>
      <div class="submit make_plan_btn theme_btn color_fff" @click="submit">同意授权并继续</div>
    </div>
  </div>
</template>

<script>
import {NavBar} from 'vant';
import {updateRealnameImage} from '@/api/user'
import lrz from 'lrz'

export default {
  data() {
    return {
      imgz: '', // 身份证正面照片
      imgf: '', // 身份证反面照片
      imgs: '', // 身份证手持照片
      phone: '',
      token: localStorage.getItem('token'),
      brandId: '',
      userId: '',
      ip: '',
      modelShow: false,
      acitve: false
    };
  },
  components: {
    [NavBar.name]: NavBar,
  },
  created() {
    if (!localStorage.getItem('token')) {
      this.$dialog.alert({
          title: "温馨提示",
          message: '您还为登录请登录',
          confirmButtonText: "立即登录"
        }
      ).then(() => {
        this.$router.push({name: 'login'})
      })
    }
  },
  methods: {
    onClickLeft() {
      let did = localStorage.getItem('did')
      localStorage.clear();
      if (did) {
        localStorage.setItem('did', did)
      }
      this.publicJs.back();
    },
    submit() {
      if (this.acitve) {
        this.$router.push({name: "faceRecognitionDetail"});
      } else {
        this.$toast({message: '请同意协议后继续', position: 'bottom'})
      }
    }
  }
}

</script>
<style scoped>
.che {
  position: absolute;
  left: -5px;
  top: 0px;
}

.cha {
  position: relative;
  padding-left: 10px;
}

.main {
  background: #FFFFFF;
  overflow: hidden;
  height: 100vh;
}

.tit {
  font-size: 18px;
}

.biao {
  padding: 20px;
  color: rgb(101, 101, 101);
  background-color: rgb(221, 221, 221);
}

.tip li {
  margin: 10px 0px 0px 10px;
}

.agreement {
  color: rgb(240, 131, 0);
}

.tongyi {

  padding: 10px 0px 0px 10px;
  font-size: 12px;
  color: rgb(101, 101, 101);
  vertical-align: middle;
}


.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.item:nth-of-type(1)::after {
  content: '上传身份信息';
  position: absolute;
  bottom: -25px;
  width: 84px;
  font-size: 12px;
  color: rgba(55, 168, 253, 1);
  text-align: center;
}

.item:nth-of-type(3)::after {
  content: '上传信用卡';
  position: absolute;
  bottom: -25px;
  width: 84px;
  font-size: 12px;
  text-align: center;
}

.item:nth-of-type(5)::after {
  content: '上传储蓄卡';
  position: absolute;
  bottom: -25px;
  width: 84px;
  font-size: 12px;
  text-align: center;
}

.item_box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 14px;
  font-size: 12px;
}

.content {
  width: 92.8%;
  margin: 0 auto;
  padding: 16px 13px 4px;
  box-sizing: border-box;
  background: rgba(249, 249, 249, 1);
  margin-bottom: 14px;
  border-radius: 5px;
}

.content h6 {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 13px;
  text-align: left;
}

.idCardImg {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 18px;
}

.idCardImg > div {
  width: 155px;
  height: 100px;
}

.idcard label {
  width: 155px;
  height: 100px;
  display: inline-block;
  background-size: 155px 100px !important;
}

/* .idcardz_bg{
    background: url('../../assets/faceRecognition/idcardz.png') no-repeat;
    background-size: 100%;
}
.idcardf_bg{
    background: url('../../assets/faceRecognition/idcardf.png') no-repeat;
    background-size: 100%;
}
.idcardl_bg{
    background: url('../../assets/faceRecognition/idcardl.png') no-repeat;
    background-size: 100%;
}
.idcards_bg{
    background: url('../../assets/faceRecognition/idcards.png') no-repeat;
    background-size: 100%;
} */
.idcard img {
  width: 160px;
  height: 100px;
}

/* .tishi{
    width: 348px;
    height: 20px;
    background: url('../../assets/faceRecognition/tishi.png') center no-repeat;
    background-size: 100%;
    margin: 0 auto 10px;
} */
ul {
  padding: 0 30px;
  font-size: 12px;
  color: #737373;
  margin-bottom: 10px;
}

ul li {
  list-style: square;
}

.submit {
  width: 300px;
  height: 45px;
  border-radius: 20px;
  color: #FFFFFF;
  font-size: 16px;
  text-align: center;
  line-height: 45px;
  margin: 0 auto;
  margin-top: 50px;
}

.online_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.online_nav >>> .van-nav-bar__arrow {
  color: #fff;
}

</style>
