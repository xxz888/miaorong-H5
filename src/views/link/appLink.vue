<template>
  <div class="">
    <van-nav-bar :title="title" left-arrow @click-left="onClickLeft" @click-right="onClickRight">
      <template #right v-if="type==1">
        <van-icon name="weapp-nav" size="18"/>
      </template>
    </van-nav-bar>
    <div
      style="width:100%;height:100%;-webkit-overflow-scrolling:touch;overflow-y:scroll;position:fixed;padding-top: 46px;">
      <iframe width="100%" height="100%" v-if="html" frameborder="0" :src="url"></iframe>
      <img v-else :src="url" class="img" alt="">
    </div>
    <van-dialog v-model="copyTrueFalseBy" :title="html?'链接地址':'图片'" show-cancel-button
                :confirmButtonText="html?'复制':'保存图片'" @confirm="html?copyShaneUrl(url):saveImage(url)">
      <div class="header">
        <div v-if="html">{{ url }}</div>
        <img v-else class="saveimg" :src="url" alt="">
      </div>
    </van-dialog>
  </div>
</template>

<script>
import {NavBar, Icon, Dialog} from 'vant';

export default {
  data() {
    return {
      url: "",
      title: "",
      type: "0",
      copyTrueFalseBy: false,
      html: true
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Dialog.Component.name]: Dialog.Component,

  },
  created() {
    this.url = JSON.parse(this.$route.params.url)
    this.title = JSON.parse(this.$route.params.title)
    this.type = JSON.parse(this.$route.params.type)

    if (this.url.substring(8, 24) == 'mp.weixin.qq.com') {
      location.href = this.url
    }
    if (this.url.split('.png').length > 1 || this.url.split('.jpg').length > 1 || this.url.split('.jpeg').length > 1) {
      this.html = false
    }
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    onClickRight() {
      if (this.type == 1) {
        this.copyTrueFalseBy = true
      }
    },
    copyShaneUrl(shareLink, type) {
      var input = document.createElement("input");     // 直接构建input
      input.value = shareLink;   // 设置内容
      document.body.appendChild(input);        // 添加临时实例
      input.select();      // 选择实例内容
      document.execCommand("Copy");     // 执行复制
      document.body.removeChild(input);  // 删除临时实例
      var title = "地址已复制，可进行分享"
      if (type == 1) {
        title = "图片地址已复制，可进行打开，或者长按保存图片"
      }
      this.$toast({message: title, position: 'bottom'})
    },
    saveImage(img) {
      var u = navigator.userAgent,
        app = navigator.appVersion;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isIOS) {
        this.copyShaneUrl(this.url, 1)
      } else {
        this.copyShaneUrl(this.url, 1)
      }
    },
    saveFile(data, filename) {
      const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
      save_link.href = data;
      save_link.download = filename;
      const event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      save_link.dispatchEvent(event);
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.img {
  max-width: 100%;
}

.header {
  padding: 10px;
  text-align: center;
}

.saveimg {
  height: 150px;
  max-width: 100%;
  margin: 0 auto;

}

</style>
