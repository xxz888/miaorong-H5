<!-- 中央文案 -->
<template>
  <div>
    <van-nav-bar :title="'分享素材'" left-arrow fixed @click-left="onClickLeft"/>
    <div class="main" v-if="bannerList.length > 0">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
        <div>
          <div class="tips">图片中的二维码都是您本人的专属二维码，保存图片，复制文字即可分享至朋友圈，坚持每天分享朋友圈素材，有利于快速吸引潜在用户。</div>
          <div class="item" v-for="(item,i) in bannerList" :key="i">
            <div class="content">
              <p>{{ item.content }}</p>
              <div class="img" :class="item.img_url.length % 2 == 0 ? 'mgr':''" v-for="(img,j) in item.img_url"
                   :key="j+'itm'">
                <span v-if="img.indexOf('?')>-1">
                  <img :src="img+'&token='+token" alt="" @click="showImag(item,j)">
                </span>
                <span v-else>
                  <img :src="img" alt="" @click="showImag(item,j)">
                </span>
              </div>
            </div>
            <div class="time">
              <div>{{ item.create_time |time }}</div>
              <div @click="copyShaneUrl(item.content)">
                <van-icon name="weapp-nav" size="20"/>
              </div>
            </div>
          </div>
        </div>
      </van-pull-refresh>
    </div>
    <div class="main" v-else>
      <van-empty image="error" description="暂无数据"/>
    </div>
    <div class="page">
      <van-pagination v-model="currentPage" :total-items="totalElements" :items-per-page="20" force-ellipses
                      @change="getMessage(currentPage-1)"/>
    </div>
  </div>
</template>

<script>
import {imagetextQuery1,} from '@/api/showBrand'
import {NavBar, PullRefresh, ImagePreview, Empty, Icon, Pagination} from 'vant';

export default {
  data() {
    return {
      brandId: this.global.brandId,
      bannerList: [],
      isLoading: false,
      show: false,
      images: [],
      currentPage: 0,
      size: 20,
      totalElements: '',
      token: localStorage.getItem('token')
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [Empty.name]: Empty,
    [Icon.name]: Icon,
    [Pagination.name]: Pagination
  },
  created() {
    this.getMessage(0)
  },
  methods: {
    onClickLeft() {
      window.history.back()
      return
      this.$router.push({name: 'share'})
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        // this.$toast('刷新成功');
        this.getMessage(this.currentPage - 1)
        this.isLoading = false;
      }, 1000);
    },
    getMessage(currentPage) {
      imagetextQuery1(this.brandId, currentPage, this.size).then(res => {
        if (res.resp_code == "000000") {
          this.bannerList = res.result
          this.totalElements = res.totalElements
        } else {
          this.$toast({message: res.resp_message, position: 'bottom'})
        }
      })
    },
    showImag(item, i) {
      let images = []
      // this.show = true
      item.img_url.forEach(item => {
        if (item.indexOf('?') > -1) {
          item = item + '&token=' + this.token
        }
        images.push(item)
      });
      ImagePreview({images, startPosition: i})
    },
    copyShaneUrl(shareLink) {
      var input = document.createElement("input");     // 直接构建input
      input.value = shareLink;   // 设置内容
      document.body.appendChild(input);        // 添加临时实例
      input.select();      // 选择实例内容
      document.execCommand("Copy");     // 执行复制
      document.body.removeChild(input);  // 删除临时实例
      var title = "分享内容已复制，请打开图片进行长按保存"

      this.$toast({message: title, position: 'bottom'})
    },
  },

}

</script>
<style scoped>
.tips {
  font-size: 13px;
  color: #666;
  background: #fff;
  margin: 10px 0;
  width: 100%;
  padding: 10px 15px;
}

.main {
  padding: 47px 0px;
}

.item {
  /* display: flex; */
  width: 100%;
  background: #FFFFFF;
  padding: 5px 15px;
  box-sizing: border-box;
  font-size: 14px;
  border: 1px rgb(238, 237, 237) solid;
  border-left: none;
  border-top: none;
  border-right: none;
}

.item_right {
  text-align: left;
}

.content p {
  margin: 10px 0px 20px 0px;

}

.img {
  width: 100px;
  height: 100px;
  margin: 3px;
  display: inline-block;
  border-radius: 16px;
  overflow: hidden;
  border: solid 1px #e6e6e6;
}

.img img {
  width: 100%;
}

.item .time {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 12px;
  line-height: 30px;
  padding-right: 10px;
}

.page {
  position: fixed;
  background-color: #fff;
  width: 100%;
  bottom: 0px;
  right: 0px;
}

.mgr {
  margin-right: 20px;
}
</style>
