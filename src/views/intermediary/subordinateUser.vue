<template>
  <div>
    <van-nav-bar class="agent_nav theme_bg" style="background: none;" left-arrow :border='false' title="中介模式"
                 @click-left="onClickLeft"/>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div>
        <div class="agent_cont">
          <van-sticky :offset-top="46">
            <div class="agent_search">
              <van-search v-model="form.fullname" show-action background="none" placeholder="请输入姓名" @search="onSearch">
                <template #action>
                  <div class="agent_search_btn" @click="onSearch">搜索</div>
                </template>
              </van-search>
            </div>
          </van-sticky>
          <div>
            <van-list v-model="isupLoading" :finished="finished" finished-text="" @load="onLoad">
              <ul class="agent_list" v-if="userList.length > 0">
                <li class="agent_item" v-for="(item,index) in userList" :key="index">
                  <div class="left">
                    <!-- <img width="100%" v-if="item.logo" :src="item.logo" alt=""> -->
                    <img width="100%" src="../../assets/logoff.png" alt="">
                  </div>
                  <div class="cont">
                    <div class="title">{{ showItem(item) }}</div>
                  </div>
                  <div class="right">
                    <div class="submit theme-linear-bg" @click="repayment(item)">进入</div>
                  </div>
                </li>
              </ul>
              <van-empty description="暂无数据"  v-else/>
            </van-list>
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
import {belowEmpowerList,empowerToken} from "@/api/user";
import {NavBar, Icon, Sticky, Search, PullRefresh, List, Empty, Col} from 'vant';

export default {
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Sticky.name]: Sticky,
    [Search.name]: Search,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Empty.name]: Empty,
    [Col.name]: Col
  },
  data() {
    return {
      isLoading: false,
      text: '',
      form: {
        page: 1,
        size: 20,
        fullname: ''
      },
      finished: false,
      isupLoading: false,
      userList: [],
      token: localStorage.getItem('token'),
      levelList: []
    }
  },
  created() {
    this.isupLoading = true
    this.getBelowEmpowerList()
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    getBelowEmpowerList() {
      belowEmpowerList(this.form).then(res => {
        this.isupLoading = false
        if (res.resp_code == '000000') {
          this.userList.push(...res.result.content)
          if (res.result.content.length < this.form.size) {
            this.finished = true;
          }
        }
      })
    },
    showItem(item) {
      return item.fullname.substring(0, 1) + '*' + item.fullname.substring(item.fullname.length - 1) + '('
        + item.phone.substring(0, 3) + '****' + item.phone.substring(7) + ')'
    },
    //立即还款
    repayment(item) {
      empowerToken({userId: item.id}).then(res => {
        if(res.resp_code == '000000'){
          this.$router.push({name:'creditcard', query: {empowerToken: res.result}})
        }
      })
    },
    // 下拉刷新
    onRefresh() {
      let time = setTimeout(() => {
        this.form.page = 1
        this.userList = []
        this.getBelowEmpowerList()
        clearTimeout(time)
      }, 1000);
    },
    //搜索
    onSearch() {
      this.form.page = 1
      this.userList = []
      this.getBelowEmpowerList()
    },
    onLoad() {
      this.form.page++
      this.isupLoading = true
      this.getBelowEmpowerList()
    }
  }
}
</script>
<style scoped>
.add_btn {
  color: #fff;
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 14px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}

.agent_cont {
  padding: 0 20px;
  margin-top: 60px;
  color: #BFBFBF;
}

.add_btn span {
  padding-left: 5px;
}

.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.agent_nav >>> .van-icon {
  color: #FFFFFF !important;
}

.agent_search {
  background: #fff;
  margin: 10px 0;
  border-radius: 10px;
}

.agent_search >>> .van-search {
  padding: 0;
}

.agent_search >>> .van-search__content {
  background: #fff;
  border-radius: 10px;
}

.agent_search_btn {
  color: #2574EA;
}

.user_empty >>> .van-empty__image img {
  height: auto;
  margin-top: 50px;
}

.agent_item {
  padding: 10px 15px;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 10px;
  font-size: 20px;
  display: flex;
  /* justify-content: space-between; */
}

.agent_item .cont {
  flex: 2;
  line-height: 40px;
  padding-left: 10px;
  font-size: 14px;
}

.agent_item .right {
  flex: 1;
}

.agent_item .left {
  width: 50px;

}

.agent_item .left > img {
  width: 40px;
}

.agent_item .right {
  text-align: right;
}

.agent_item .tips {
  color: #999;
  font-size: 12px;
  line-height: 30px;
}

.agent_item .phone {
  color: #666;
}

.submit {
  width: 70px;
  padding: 5px 10px;
  color: #FFFFFF;
  font-size: 12px;
  text-align: center;
  border-radius: 50px;
  margin: 7px auto 0px 35px;
  position: relative;
}

.card_right {
  text-align: right;
  position: absolute;
  right: 25px;
}

</style>
