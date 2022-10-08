<!-- 新实名认证 -->
<template>
  <div>
    <van-nav-bar class="online_nav theme_bg" title="实名认证" left-arrow fixed :border='false' @click-left="onClickLeft"/>
    <div class="warpper_top"></div>
    <div class="main ignore">
      <div class="content">
        <form id="uploadForm" accept-charset="utf-8" onsubmit="document.charset='utf-8';"
              enctype="multipart/form-data;charset=utf-8">
          <h6>上传身份证照片</h6>
          <div class="idCardImg">
            <div class="idcard">
              <label for="idcardz" class="idcardz_bg"
                     :style=" imgz ? 'background: url('+ imgz+') no-repeat;' : ''"></label>
              <input name="faceFile" type="file" accept="image/*" style="display:none" @change="chooseFile('1',$event)"
                     capture="camera" id="idcardz"/>
            </div>
            <div class="idcard">
              <label for="idcardf" class="idcardf_bg"
                     :style=" imgf ? 'background: url('+ imgf+') no-repeat;' : ''"></label>
              <input name="backFile" type="file" accept="image/*" style="display:none" @change="chooseFile('2',$event)"
                     capture="camera" id="idcardf"/>
            </div>
          </div>
          <h6>上传上半身自拍照片</h6>
          <div class="idCardImg">
            <div class="idcard">
              <label class="idcardl_bg"></label>
            </div>
            <div class="idcard">
              <label for="idcards" class="idcards_bg"
                     :style=" imgs ? 'background: url('+ imgs+') no-repeat;' : ''"></label>
              <input name="handFile" type="file" accept="image/*" style="display:none" capture="camera"
                     @change="chooseFile('3',$event)" id="idcards"/>
            </div>
          </div>
          <input name="userId" :value="userId" style="display:none" type="text" id="userId"/>
        </form>
      </div>
      <div class="tishi"></div>
      <ul class="tip">
        <li>请保证您的年龄符合18-80周岁</li>
        <li>必须上传身份证的正反面</li>
        <li>上半身自拍照片需拍到持有人五官，请勿佩戴眼镜、帽子等遮罩物</li>
        <li>未达到示例标准、照片不清晰、经过编辑处理等非正常拍摄都不予通过</li>
      </ul>
      <div class="submit" @click="submit">提交</div>
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
    };
  },
  components: {
    [NavBar.name]: NavBar,
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    chooseFile(index, e) {
      var self = this
      var file = e.target.files[0];
      lrz(file, self.config).then(rst => {
          if (Number(index) == 1) {
            // debugger
            self.img1.urlinfo = rst.base64;
            self.img1.urlshow = true;
            if (file.size < 500000) {
              self.img1.file = file
            } else {
              self.img1.file = rst.file;
            }
            self.anew_one = true;
            self.imgz = window.URL.createObjectURL(e.target.files[0])
          } else if (Number(index) == 2) {
            self.img2.urlinfo = rst.base64;
            self.img2.urlshow = true;
            if (file.size < 500000) {
              self.img2.file = file
            } else {
              self.img2.file = rst.file;
            }
            self.anew_two = true;
            self.imgf = window.URL.createObjectURL(e.target.files[0])
          } else if (Number(index) == 3) {
            self.img3.urlinfo = rst.base64;
            self.img3.urlshow = true;
            if (file.size < 500000) {
              self.img3.file = file
            } else {
              self.img3.file = rst.file;
            }
            self.anew_two = true;
            self.imgs = window.URL.createObjectURL(e.target.files[0])
          }
        }).catch(err => {
          this.$toast({message: '上传失败，请重新上传', position: 'bottom'});
        }).always(() => {
          // 清空文件上传控件的值
          e.target.value = null
        })
    },
    getFilez(e) {
      this.imgz = window.URL.createObjectURL(e.target.files[0])
      let file = e.target.files[0]
      let name = e.target.files[0].name;
      lrz(file, {width: 300, quality: 0.2, fieldName: 'faceFile'}).then(rst => {
        file = rst.file
        this.fileData.append('faceFile', rst.file)
      })
    },
    getFilef(e) {
      this.imgf = window.URL.createObjectURL(e.target.files[0])
      let file = e.target.files[0]
      let name = e.target.files[0].name;
      lrz(file, {width: 300, quality: 0.2, fieldName: 'backFile'}).then(rst => {
        file = rst.file
        this.fileData.append('backFile', rst.file)
      })
    },
    getFiles(e) {
      this.imgs = window.URL.createObjectURL(e.target.files[0])
      let file = e.target.files[0]
      let name = e.target.files[0].name;
      lrz(file, {width: 300, quality: 0.1, fieldName: 'handFile'}).then(rst => {
        file = rst.file
        this.fileData.append('handFile', rst.file)
      })
    },
    reduceImg() {
      var file = $("#idcardz")[0].files[0];
      let value = ''
      //压缩formData图片文件上传
      lrz(file, {width: 1024, fieldName: 'faceFile'}).then(rst => {
        this.fileData = rst.formData
      })
    },
    submit() {
      if (this.imgz == '') {
        this.$toast({message: '身份证正面照片不能为空', position: 'bottom'})
        return
      }
      if (this.imgf == '') {
        this.$toast({message: '身份证反面照片不能为空', position: 'bottom'})
        return
      }
      if (this.imgs == '') {
        this.$toast({message: '上半身自拍照片不能为空', position: 'bottom'})
        return
      }
      this.$store.commit('Loading')
      let param = new FormData() // 创建form对象
      param.append('idCardTop', this.img1.file) // 通过append向form对象添加数据
      param.append('idCardBack', this.img2.file)
      param.append('imageFace', this.img3.file)
      param.append('token', this.token)
      updateRealnameImage(param).then(res => {
        this.$store.commit('closeLoading')
        if (res.resp_code == '000000') {
          this.$router.push({name: 'depositCardAdd'})
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

.idcardz_bg {
  background: url('../../assets/faceRecognition/idcardz.png') no-repeat;
  background-size: 100%;
}

.idcardf_bg {
  background: url('../../assets/faceRecognition/idcardf.png') no-repeat;
  background-size: 100%;
}

.idcardl_bg {
  background: url('../../assets/faceRecognition/idcardl.png') no-repeat;
  background-size: 100%;
}

.idcards_bg {
  background: url('../../assets/faceRecognition/idcards.png') no-repeat;
  background-size: 100%;
}

.idcard img {
  width: 160px;
  height: 100px;
}

.tishi {
  width: 348px;
  height: 20px;
  background: url('../../assets/faceRecognition/tishi.png') center no-repeat;
  background-size: 100%;
  margin: 0 auto 10px;
}

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
  width: 348px;
  height: 45px;
  border-radius: 10px;
  background: linear-gradient(to bottom, #72C3FF, #35A7FD);
  color: #FFFFFF;
  font-size: 18px;
  text-align: center;
  line-height: 45px;
  margin: 0 auto;
  margin-bottom: 20px;
}

.online_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.online_nav >>> .van-nav-bar__arrow {
  color: #fff;
}


</style>
