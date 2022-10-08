<template>
  <div class="new">
    <!-- 头部导航 -->
    <van-nav-bar left-arrow fixed :border='false' @click-left="onClickLeft" title="资讯" />
    <div class="warpper_top"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div>
        <ul class="news_list">
          <li class="news_item" v-for="(item,index) in newsList" :key="index" @click="next(item)">
            <div class="title">{{ item.title }}</div>
            <p class="color_666 van-ellipsis">{{ item.remark }}</p>
            <div class="img_box">
              <img class="img" :src="item.lowSource" alt="">
            </div>
            <span class="color_999">{{ item.createTime }}</span>
          </li>
        </ul>
      </div>
    </van-pull-refresh>
    <div class="tabbar_p"></div>
  </div>
</template>

<script>
import {
  NavBar,
  PullRefresh
} from 'vant';
import {
  newsQuery
} from '@/api/showBrand'

export default {
  data() {
    return {
      isLoading: false,
      newsList: []
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
  },
  created() {
    this._newsQuery()
  },
  methods: {
    onClickLeft() {
      this.publicJs.back()
    },
    // 获取资讯
    _newsQuery(type) {
      newsQuery(this.global.brandId, '资讯').then(res => {
        if (res.resp_code == '000000') {
          this.newsList = res.result.content
        }
      })
    },
    next(item) {
      this.$router.push({
        name: 'appLink',
        params: {url: JSON.stringify(item.content), title: JSON.stringify(item.title), type: "1"}
      });
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this._newsQuery()
        this.$toast('刷新成功');
        this.isLoading = false;
      }, 1000);
    }
  }
};

</script>
<style scoped>
.tabbar_p {
  height: 50px;
  width: 100%;
}

.news_list {
  padding: 10px;
}

.news_item {
  background: #fff;
  background: #FFFFFF;
  border-radius: 12px;
  padding: 10px;
  font-size: 11px;
  margin-bottom: 10px;
}

.news_item .title {
  font-size: 16px;
  color: #333;
  padding-bottom: 5px;
}

.img_box {
  padding: 10px;
}

.news_item .img {
  max-width: 100%;
  border-radius: 8px;

}

</style>
