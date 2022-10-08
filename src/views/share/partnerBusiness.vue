<template>
  <div>
    <van-nav-bar title="推广物料" left-arrow fixed @click-left="onClickLeft"/>
    <div class="zhanwei"></div>
    <div class="partner_cont">
      <div class="partner_item van-hairline--bottom" v-for="(item,i) in fuwuList" :key="i" @click="link(item)">
        <h6>{{ item.title }}</h6>
        <span class="theme_bg">#全部会员可见</span>
        <!-- <span class="theme_bg" v-for="(itm,j) in gradeList" :key="j" v-if="itm.grade == item.onOff  && item.onOff != 0">#{{itm.name}}用户及以上可见</span> -->
        <img :src="item.lowSource" alt="">
        <div>
          <span>{{ item.createTime }}</span>
          <span>阅读：{{ item.previewNumber }}</span>
        </div>
      </div>
      <van-empty v-if="fuwuList.length == 0" image="error" description="暂无数据"/>
    </div>
  </div>
</template>

<script>
import {NavBar, PullRefresh, Dialog, Empty} from 'vant';
import {newsQuery} from '@/api/showBrand'

export default {
  data() {
    return {
      title: '推广物料',
      brandId: this.global.brandId,
      fuwuList: [],
      isLoading: false,
      gradeList: [],
      grade: 0, // 当前个人等级
      token: '',
      show: false,
      item: {},
      cfg: this.global.configType,
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [Dialog.Component.name]: Dialog.Component,
    [Empty.name]: Empty,
  },
  created() {
    this.token = localStorage.getItem('token')
    this.getNewsList()
  },
  beforeRouteEnter(to, from, next) {
    sessionStorage.setItem('routerFrom', from.name)
    next();
  },
  methods: {
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        // this.$toast('刷新成功');
        this.getNewsList()
        this.isLoading = false;
      }, 1000);
    },
    onClickLeft() {
      window.history.back()
      return
    },
    // 获取平台新闻分类数据
    getNewsList() {
      newsQuery(this.brandId, this.title).then(res => {
        if (res.resp_code == '000000') {
          this.fuwuList = res.result.content
        } else {
          this.$toast({message: res.resp_message, position: 'bottom'})
        }
      })
    },
    link(item) {
      this.$router.push({
        name: 'appLink',
        params: {url: JSON.stringify(item.content), title: JSON.stringify(item.title), type: '8'}
      })
    },
    gonext() {
      this.$router.push({name: this.cfg.up})
    },
  }
}

</script>
<style scoped>
.zhanwei {
  height: 50px;
}

.partner_cont {
  height: 92vh;
  background: #FFF;
  padding: 20px;
  overflow: scroll;
}

.partner_item {
  height: 120px;
  /* background: #F3F5F7; */
  text-align: left;
  margin-bottom: 10px;
  box-sizing: border-box;
  position: relative;
  /* padding-top: 20px;
  padding-left: 10px; */
  font-size: 12px;
}

.partner_item img {
  width: 120px;
  height: 70px;
  float: right;
  position: absolute;
  top: 10px;
  right: 10px;
  margin: 0 auto;
}

.partner_item h6 {
  font-size: 14px;
  width: 60%;
  height: 50px;
  /*margin-bottom: 30px;*/
}

.partner_item > span {
  border-radius: 6px;
  color: #FFFFFF;
  padding: 0 10px;
  margin: 30px 0;
}

.partner_item div {
  margin-top: 15px;
}

.partner_item div span {
  margin-right: 50px;

}

.dialog_wrap {
  display: flex;
  text-align: left;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.dialog_wrap img {
  width: 45px;
}

.dialog_wrap h6 {
  font-size: 16px;
  margin: 20px 0;
}

.dialog_wrap p {
  font-size: 13px;
  color: #666666;
}
</style>
