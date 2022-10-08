<template>
  <div>
    <van-nav-bar title="收益规则" left-arrow fixed @click-left="onClickLeft"/>
    <div class="zhanwei"></div>
    <div class="partner_cont"></div>
  </div>
</template>

<script>
import {NavBar, PullRefresh, Dialog, Empty} from 'vant';
import {newsQuery} from '@/api/showBrand'

export default {
  data() {
    return {
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
    this.getNewsList()
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
  }
}

</script>
<style scoped>
.zhanwei {
  height: 50px;
}

.partner_cont {
  height: 12000px;
  width: 100vw;
  background: url('../../assets/share/regulation.jpg');
  background-size: 100% 100%;
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
