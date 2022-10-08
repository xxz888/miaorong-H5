<template>
  <div>
    <van-nav-bar title="推广二维码" left-arrow fixed @click-left="onClickLeft"/>
    <div class="zhanwei"></div>
    <div class="shareImg">
      <img :src="canvasImg" alt="" @click="dol()" v-if="!showImg">
      <img class="beijing" src="../../assets/share/sharePage.png" alt="" v-if="showImg">
      <div id="qrcode" style="width: 200px;height: 240px;background-color: white;margin-top:20px;" v-if="showImg"></div>
      <img v-show="false" class="canvaslogo" src="../../assets/logo.png"/>
      <img v-show="false" class="toplogo" src="../../assets/logo_t.png"/>
    </div>
  </div>
</template>

<script>
import {
  NavBar
} from 'vant';
import {
  brandQuery
} from '@/api/showBrand'
import QRCode from 'qrcodejs2'

export default {
  name: "sharePage",
  data() {
    return {
      showImg: true,
      regUrl: '',
      canvasImg: '',
      firstCanvas: true,
      phone: '',
      cfg: this.global.configType
    }
  },
  components: {
    [NavBar.name]: NavBar,
  },
  created() {
    this.phone = localStorage.getItem("phone")
    this.getBrand()
    debugger
  },
  beforeRouteEnter(to, from, next) {
    sessionStorage.setItem('routerFrom', from.name)
    next();
  },
  methods: {
    onClickLeft() {
      window.history.back()
      return
    },
    dol() {
      let link = document.createElement("a");
      link.download = "推广二维码.png";
      link.href = this.canvasImg;
      link.click();
    },
    // 获取品牌数据
    getBrand() {
      brandQuery(this.global.brandId).then(res => {
          if (res.resp_code == '000000') {
            this.regUrl = res.result.shareMainAddress + '?phone=' + this.phone + '&brand_id='
              + this.global.brandId + '&ip=' + this.global.ip
            this.getCanvas()
          } else {
            this.$toast({
              message: resp_message,
              position: 'bottom'
            })
          }
        })
    },
    getPixelRatio(context) {
      let backingStore = context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;
      return (window.devicePixelRatio || 1) / backingStore;
    },
    getCanvas() {
      if (this.showImg == true) {
        this.$store.commit('Loading')
        this.$nextTick(() => {
          let style = document.querySelector('.shareImg').style
          let width = document.querySelector('.shareImg').clientWidth
          let qrcode = new QRCode('qrcode', {
            width: 200,
            height: 240,
            text: this.regUrl,
          })
          let bili = width / 750
          let height = bili * 1334
          let num = 1000
          let oneLogin = localStorage.getItem('onLogin')
          if (oneLogin) {
            num = 100
          }
          setTimeout(() => {
            this.$store.commit('closeLoading')
            let img = document.querySelector('.beijing')
            let imgCode = document.querySelector('#qrcode img')
            let c = document.createElement('canvas')
            let cvs = c.getContext('2d')
            let ratio = this.getPixelRatio(cvs);
            c.width = width * ratio;
            c.height = height * ratio
            //兼容小米8 如果src 属性为null 重新赋予属性
            if (document.querySelector("#qrcode img").getAttribute("src") == null) {
              document.querySelector("#qrcode img").style.visibility = 'visible';
              document.querySelector("#qrcode canvas").style.visibility = 'hidden';
              let canvas = document.querySelector("#qrcode canvas");
              let dataURL = canvas.toDataURL("image/png");
              document.querySelector("#qrcode img").setAttribute("src", dataURL);
            }

            cvs.fillStyle = "#FFF";
            cvs.fillRect(0, 0, c.width, c.height);
            let codeTemp = 6 // 二维码外部边缘宽度
            let x = 256 * bili + codeTemp - 2//二维码的起始位置
            let y = 970 * bili + codeTemp - 24

            let imgCodeWidth = 240 * bili - codeTemp * 2 //二维码的宽
            let imgCodeHeight = 240 * bili - codeTemp * 2 //二维码的高度
            cvs.drawImage(img, 0, 0, parseInt(c.width), parseInt(c.height))
            cvs.drawImage(imgCode, x * ratio, y * ratio, parseInt(imgCodeWidth) * ratio, parseInt(
              imgCodeHeight) * ratio)
            let logoSrc = document.querySelector('.canvaslogo'); // 二维码图片logo
            let logoW = parseInt(imgCodeWidth) / 4
            let logoH = parseInt(imgCodeHeight) / 4
            let logoX = x + imgCodeWidth / 2 - logoW / 2
            let logoY = y + imgCodeHeight / 2 - logoH / 2
            cvs.drawImage(logoSrc, logoX * ratio, logoY * ratio, logoW * ratio, logoH * ratio);

            let topX = 316 * bili * ratio
            let topY = 80 * bili * ratio
            let topW = 118 * bili * ratio
            let topH = 117 * bili * ratio
            let topSrc = document.querySelector('.toplogo'); // 顶部图片logo
            cvs.drawImage(topSrc, topX, topY, topW, topH);

            let textX = c.width / 2 // 文案起始高度位置
            let nameT = 1240 * bili * ratio
            cvs.fillStyle = '#fff'; // 文字填充颜色
            cvs.textAlign = 'center'
            cvs.font = 14 * ratio + 'px bold sans-serif';
            cvs.fillText('推荐人:' + this.phone.substr(0, 3) + "****" + this.phone.substr(7), textX, nameT - 30);

            let url = c.toDataURL('image/png');
            this.showImg = false
            this.$nextTick(() => {
              this.canvasImg = url
            })
            if (this.firstCanvas === true) {
              this.firstCanvas = false
              cvs.clearRect(0, 0, c.width, c.height); // 清除画布
              this.showImg = true
              this.getCanvas() // 二次绘图
            }
          }, num)
        })

      }
    }
  }
}

</script>

<style scoped>
#app {
  overflow: hidden;
}

.toplogo {
  display: none;
}

.shareImg img {
  width: 100%;
  height: 100vh;
  padding: 45px 0px 0px 0px;
  overflow: hidden;
}


</style>
