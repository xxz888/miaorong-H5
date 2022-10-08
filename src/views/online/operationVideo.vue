<!-- 设置 -->
<template>
  <div>
    <van-nav-bar :title="'操作视频'" left-arrow fixed @click-left="onClickLeft"/>
    <div class="main">
      <van-cell-group>
        <van-cell v-for="(item,index) in videoList" :key="index" :title="item.title" is-link @click="toDetail(item)">
        </van-cell>
 
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import {NavBar, Cell, CellGroup, Dialog} from 'vant';
import {brandQuery} from '@/api/showBrand'
import Cookies from "js-cookie";
import {getVideoList} from "@/api/online";

export default {
  data() {
    return {
      version: '1.0.0',
      brandId: this.global.brandId,
      cfg: this.global.configType,
      videoList:[]
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Dialog.Component.name]: Dialog.Component,
  },
  created() {
    this.getVideoList()
  },
  methods: {
      toDetail(item){
              this.$router.push({name: 'operationVideoDetail',query:{item:item}});
      },



    onClickRight(){
      location.reload()
    },
    onClickLeft() {
      window.history.back()
      return
    },
    getVideoList() {
      getVideoList(this.brandId).then(res => {
        if (res.resp_code == '000000') {
          this.videoList = res.result;
        } else {
          this.$toast({message: res.resp_message, position: 'bottom'})
        }
      })
    },
    // 退出登录
    outLogin() {
      Dialog.confirm({
        title: '温馨提示',
        message: '确认要退出登录吗？'
      }).then(() => {
        let did = localStorage.getItem('did')
        localStorage.clear();
        sessionStorage.clear()
        if (did) {
          localStorage.setItem('did', did)
        }
      Cookies.remove('token');

            
        this.$router.push({name: 'login'})
      }).catch(() => {
      })
    },
  }
}

</script>
<style scoped>
.main {
  padding-top: 47px;
  text-align: left;
}

.submit {
  width: 300px;
  height: 45px;
  border-radius: 25px;
  margin: 30px auto 0;
  line-height: 45px;
  text-align: center;
  font-size: 16px;
  color: #FFFFFF;
  box-shadow: 2px 3px 3px 0 rgba(130, 130, 130, .1);
}
</style>
