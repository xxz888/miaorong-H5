<!-- 新实名认证  right-text="客服" @click-right="onClickRight"-->
<template>
  <div>
    <van-nav-bar class="online_nav theme_bg" title="实名认证" left-arrow fixed :border='false' @click-left="onClickLeft" />
    <div class="warpper_top"></div>
    <div class="main ignore">
      <div class="content">
        <form id="uploadForm" accept-charset="utf-8" onsubmit="document.charset='utf-8';"
              enctype="multipart/form-data;charset=utf-8">
          <ul class="idcard">
            <li>
              <div class="idCardImg">
                <div class="idcard">
                  <label for="idcardz" class="idcardz_bg"
                         :style=" imgz ? 'background: url('+ imgz+') no-repeat;' : ''"></label>
                  <input name="faceFile" type="file" accept="image/*" style="display:none"
                         @change="chooseFile('1',$event)" id="idcardz"/>
                </div>
              </div>
              <h6>请点击拍摄身份证正面</h6>
            </li>
            <li>
              <div class="idCardImg">
                <div class="idcard">
                  <label for="idcardf" class="idcardf_bg"
                         :style=" imgf ? 'background: url('+ imgf+') no-repeat;' : ''"></label>
                  <input name="backFile" type="file" accept="image/*" style="display:none"
                         @change="chooseFile('2',$event)" id="idcardf"/>
                </div>
              </div>
              <h6>请点击拍摄身份证背面</h6>
            </li>
          </ul>
        </form>
        <form>
          <van-field label-width="60px" v-model="userMessage.name" placeholder="未获取到真实姓名" label="姓名" required/>
          <van-field id="shen" label-width="60px" maxlength="18" v-model="userMessage.number" placeholder="请扫描或者输入身份证号"
                     type="text" label="身份证号" required/>
        </form>
      </div>
      <div class="submit make_plan_btn theme_btn color_fff" @click="submit()">确定</div>
      <van-uploader id='ren' v-show="false" preview-size="80px" accept="image/*" :after-read="ren"></van-uploader>
    </div>
  </div>
</template>

<script>
import {NavBar, Uploader, Field, Form, NumberKeyboard} from 'vant';
import {userInfoQuery} from "@/api/user";
import {updateRealnameImage, humanFace, submitImage, getImg, submitAutonym, cardComparison} from '@/api/user'
import md5 from 'js-md5';
import lrz from 'lrz'

export default {
  data() {
    return {
      imgz: '', // 身份证正面照片
      imgf: '', // 身份证反面照片
      imgs: '', // 身份证手持照片
      userName: '',
      idCard: '',
      phone: '',
      token: localStorage.getItem('token'),
      brandId: '',
      userId: '',
      ip: '',
      modelShow: false,
      user: {},
      config: {  //压缩图片控制(自定义)
        width: 1024,
        height: 684,
        quality: 0.8
      },
      fileData: new FormData,
      img1: {"file": "", "urlinfo": "", "urlshow": false}, //身份证头像面
      img2: {"file": "", "urlinfo": "", "urlshow": false},//身份证国徽面
      img3: {"file": "", "urlinfo": "", "urlshow": false}, //手持身份证
      status: '',
      userList: '',
      userMessage: {},
      fileList: [],
      faceFile: '',
      backFile: '',
      headFile: '',
      show: false,
      imgbaser: '',
      NumberKeyboardShow: false,
      idcard: ''
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Uploader.name]: Uploader,
    [Field.name]: Field,
    [NumberKeyboard.name]: NumberKeyboard
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    onClickRight() {
      _MEIQIA('init')
      _MEIQIA('showPanel')
    },
    noFocus() {
      let scanTextbox = document.getElementById('shen')
      scanTextbox.setAttribute('readonly', 'readonly')
      this.NumberKeyboardShow = true
      setTimeout(() => {
        scanTextbox.removeAttribute('readonly');
      }, 200);
    },
    onInput(value) {
      this.userMessage.number = this.idcard
    },
    chooseFile(index, e) {
      var file = e.target.files[0];
      lrz(file, {width: 1024, fieldName: 'bankFile'}).then(rst => {
          if (Number(index) == 1) {
            this.imgz = window.URL.createObjectURL(e.target.files[0])
            this.headFile = rst.file
            this._updateRealnameImage(rst.formData)
          } else if (Number(index) == 2) {
            this.imgf = window.URL.createObjectURL(e.target.files[0])
            this.backFile = rst.file
            this._updateRealnameImage(rst.formData)
          }
        }).catch(err => {
        this.$toast({message: '上传失败，请重新上传', position: 'bottom'});
      }).always(() => {
        // 清空文件上传控件的值
        e.target.value = null
      })
    },
    submit() {
      if (!this.imgz) {
        this.$toast({message: '请检测身份证正面', position: 'bottom'});
        return
      }
      if (!this.imgf) {
        this.$toast({message: '请检测身份证反面', position: 'bottom'});
        return
      }
      if (!this.userMessage.name || !this.userMessage.number) {
        this.$toast({message: '请重新上传身份证', position: 'bottom'});
        return
      }
      // this.$dialog.alert({
      //   title: '温馨提示',
      //   message: '请上传或拍摄一张手持身份证正面照片'
      // }).then(() => {
      //   document.getElementById('ren').click()
      // })
      this._submitImage(null)
    },
    ren(data) {
      this.$store.commit('Loading')
      let formdata = new FormData()
      let appid = '3MCGC8J7zL0574u6'
      let date = new Date().getTime();
      let str = `${appid}&${date}&3MCGC8J7zL0574u6G5mkLt6N6SgmGERu`
      let sign = md5(str)
      let img = ''
      const blob = new Blob([data.file], {type: 'image/jpeg'})  //接口配置后端响应的类型为二进制流
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = e => { //转为besa64
        let result = this.result
        let img = new Image()
        img.src = result
        img.onload = async () => {
          let data1 = this.compress(img, 0.5)
          formdata.append('image', data1)
          formdata.append('appid', appid)
          formdata.append('timestamp', date)
          formdata.append('sign', sign)
          formdata.append('idcard', this.userMessage.number)
          formdata.append('name', this.userMessage.name)
          formdata.append('address', this.userMessage.address)
          await this._submitImage(blob)
          await cardComparison(formdata).then(res => {
            if (res.resp_code == '000000') {
              userInfoQuery(this.token).then(res => {
                this.$store.commit('closeLoading')
                if (res.resp_code == "000000") {
                  localStorage.setItem('realnameStatus', res.result.realnameStatus)
                                this.$router.push({name: 'home'})
                  //this.$router.push({name: "depositCardAdd", params: {type: 1}}); //绑卡页面
                }
              })
            } else {
              this.$store.commit('closeLoading')
            }
          })
        }
      }
    },
    _submitImage(file) {
      let form = new FormData()
      form.append('faceFile', file)
      form.append('backFile', this.backFile)
      form.append('headFile', this.headFile)
      submitImage(form).then(res => {
        this.$store.commit('Loading')
        let formdata = new FormData()
        formdata.append('idcard', this.userMessage.number)
        formdata.append('name', this.userMessage.name)
        formdata.append('image', '11')
        cardComparison(formdata).then(res => {
          if (res.resp_code == '000000') {
            userInfoQuery(this.token).then(res => {
              this.$store.commit('closeLoading')
              if (res.resp_code == "000000") {
                localStorage.setItem('realnameStatus', res.result.realnameStatus)
                              this.$router.push({name: 'home'})

                //this.$router.push({name: "depositCardAdd", params: {type: 1}}); //绑卡页面
              }
            })
          } else {
            this.$store.commit('closeLoading')
          }
        })
      })
    },
    changeFile(file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => { //转为besa64
        submitAutonym(this.userMessage.number, this.userMessage.name, this.result, this.userMessage.address).then(res => {
          this.$store.commit('closeLoading')
          if (res.resp_code == '000000') {
              this.$router.push({name: 'home'})
            //this.$router.push({name: "depositCardAdd", params: {type: 1}}); //绑卡页面
          }
        })
      }
    },
    // 压缩图片
    compress(img, size) {
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      let initSize = img.src.length
      let width = img.width
      let height = img.height
      canvas.width = width
      canvas.height = height
      // 铺底色
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, width, height)
      //进行最小压缩
      let ndata = canvas.toDataURL('image/jpeg', size)
      return ndata
    },
    _updateRealnameImage(rst) {  //天眼数聚识别身份证
      this.$store.commit('Loading')
      updateRealnameImage(rst).then(res => {
        this.$store.commit('closeLoading')
        if (res.resp_code == '000000') {
          if (res.result.data.info.name != null && res.result.data.info.name != '') {
            this.userMessage = res.result.data.info
          }
        }
      })
    }
  }
}
</script>
<style scoped>
.main {
  background: #FFFFFF;
  overflow: hidden;
  margin: 10px;
  border-radius: 15px;
  padding: 5px;
}

.idcard {
  color: #aaa;
  text-align: center;
}

.idcard li {
  margin: 30px;
}

/* .idcard >>>.van-uploader__upload-icon{
    font-size: 200px;
} */
/* .idcard >>>.van-uploader__upload{
   width: 230px;
   height: 130px;
   background-image: url('../../assets/idcardjust.png') ;
   background-size:100% 100%;

} */
.content {
  width: 95%;
  margin: 0 auto;
  padding: 16px 5px 4px;
  box-sizing: border-box;
  margin-bottom: 14px;
  border-radius: 5px;
}

.content h6 {
  font-size: 15px;
  font-weight: 500;
  padding-top: 13px;
}

.submit {
  width: 250px;
  height: 40px;
  border-radius: 20px;
  background: linear-gradient(to bottom, #72C3FF, #35A7FD);
  color: #FFFFFF;
  font-size: 16px;
  text-align: center;
  line-height: 40px;
  margin: 0 auto;
  margin-bottom: 20px;
}

.online_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.online_nav >>> .van-nav-bar__arrow {
  color: #fff;
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

.main {
  background: #FFFFFF;
  overflow: hidden;
}

.flow_box {
  display: flex;
  width: 348px;
  height: 76px;
  margin: 10px auto 26px;
  background: #F9F9F9;
  flex-direction: column;
  border-radius: 5px;
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

.item span {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(18, 18, 18, .1);
  color: #FFFFFF;
  text-align: center;
  line-height: 30px;
}

.fenge {
  width: 65px;
  height: 1px;
  background: rgba(18, 18, 18, .5)
}

.fenge.isdone {
  background: linear-gradient(to bottom, rgba(64, 172, 253, 1), rgba(87, 182, 254, .1));
}

.flow_box .isdone span {
  background: linear-gradient(to bottom, rgba(114, 195, 255, 1), rgba(53, 167, 253, 1));
}

.content {
  width: 92.8%;
  margin: 0 auto;
  padding: 16px 13px 4px;
  box-sizing: border-box;
  margin-bottom: 14px;
  border-radius: 5px;
}

.idCardImg {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 18px;
}

.idCardImg > div {
  width: 200px;
  height: 100px;
}

.idcard label {
  width: 200px;
  height: 120px;
  display: inline-block;
  background-size: 200px 120px !important;
}

.idcardz_bg {
  background: url("../../assets/addcard/KD_Accreditation1.png") no-repeat;
  background-size: 100%;
}

.idcardf_bg {
  background: url("../../assets/addcard/KD_Accreditation2.png") no-repeat;
  background-size: 100%;
}

.idcard img {
  width: 160px;
  height: 100px;
}

ul {
  padding: 0 30px;
  font-size: 12px;
  color: #737373;
  margin-bottom: 10px;
}

.online_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.online_nav >>> .van-nav-bar__text {
  color: #fff;
}

.online_nav >>> .van-nav-bar__arrow {
  color: #fff;
}


</style>
