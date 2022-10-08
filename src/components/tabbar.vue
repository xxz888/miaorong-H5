<!-- tabbar 导航栏 -->
<template>
  <div>
    <van-tabbar v-model="active" :safe-area-inset-bottom="true" :route="true">
      <div class="flex" :style="'width:100%' ">
        <van-tabbar-item name="home" :to="'/home'" replace>
          <span>首页</span>
          <img slot="icon" slot-scope="props" :src="props.active ? iconHome.active : iconHome.normal">
        </van-tabbar-item>
        <!-- <van-tabbar-item name="share" :to="'/person'"
          replace>
          <span>分享</span>
          <img slot="icon" slot-scope="props" :src="props.active ? iconShare.active : iconShare.normal">
        </van-tabbar-item> -->
        <van-tabbar-item name="news" :to="'/profitHome'" replace>
          <span>收益</span>
          <img slot="icon" slot-scope="props" :src="props.active ? iconNews.active : iconNews.normal">
        </van-tabbar-item>


        
        <!-- <van-tabbar-item name="share" :to="'/share'"
          replace>
          <span>推广</span>
          <img slot="icon" slot-scope="props" :src="props.active ? iconShare.active : iconShare.normal">
        </van-tabbar-item> -->
        <van-tabbar-item name="my" :to="'/my'" replace>
          <span>我的</span>
          <img slot="icon" slot-scope="props" :src="props.active ? iconMy.active : iconMy.normal">
        </van-tabbar-item>
      </div>
    </van-tabbar>
  </div>
</template>

<script>
import {
  Tabbar,
  TabbarItem
} from 'vant'

export default {
  data() {
    return {
      active: 'home',
      iconHome: {
        normal: require('@/assets/tabbar/home_normal.png'),
        active: require('@/assets/tabbar/home_active.png')
      },
      iconNews: {
        normal: require('@/assets/tabbar/news_normal.png'),
        active: require('@/assets/tabbar/news_active.png')
      },
      // iconShare: {
      //   normal: require('@/assets/tabbar/share_normal.png'),
      //   active: require('@/assets/tabbar/share_active.png')
      // },
      iconMy: {
        normal: require('@/assets/tabbar/my_normal.png'),
        active: require('@/assets/tabbar/my_active.png')
      },
    };
  },
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
  }
}

</script>
<style scoped>
.van-tabbar--fixed {
  position: fixed !important;
}

.van-tabbar-item--active {
  color: #30AEFB;
}

.flex {
  display: flex;
  justify-content: space-evenly;
}
</style>
