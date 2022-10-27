<template>
  <div class="my">
    <div class="my_header theme_bg ">我的</div>
    <div class="warpper_top"></div>







    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      loading-text="加载中..."
    >
      <div>
        <div class="top_bg theme_bg">

        </div>




        
        <div class="my_cell_box1">
            <div class="my_top">
            <div class="logo">
              <input
                type="file"
                accept="*"
                @change="handleFile"
                class="hiddenInput"
              />
              <img
                class="appLogo"
                src="../../assets/agent/img_icon.png"
                alt=""
                @click="uploadHeadImg"
              />

      
            </div>
            <div class="user">
              <div class="name">{{ user.fullname }}</div>
              <!-- <div class="phone">{{ user.phone | dataHidden }}</div> -->
              <div class="id mt-10">ID:{{ userId }}</div>
            </div>
            <div class="more" @click="next('/user', '8')">
              <div class="own">
                <span>个人资料</span>
                <van-icon class="icon_icon" size="16" name="arrow" />
              </div>
            </div>
          </div>
          <div style="background: #fff" class="flex jc-sa my_cell_list ">
            
            <div class="flex2 fcc" @click="next('/sharePage', '8')">
              <img class="img80" src="../../assets/组 17872@2x.png" alt="" />
              <span class="imgTitle">推广二维码</span>
            </div>

            <div class="flex2 fcc" @click="next('/myCard', '8')">
              <img class="img80" src="../../assets/组 17907@2x.png" alt="" />
              <span class="imgTitle">银行卡管理</span>
            </div>

            <div class="flex2 fcc" @click="tel" v-if="prepreUserPhone!=''">
              <img class="img80" src="../../assets/组 17870@2x.png" alt="" />
              <span class="imgTitle">我的推荐人</span>
            </div>
          </div>
        </div>

         <div class="my_cell_box ">
          <ul class="my_cell_list1">
            <li
              class="my_cell_item van-hairline--bottom"
              @click="next('/bill','1')"
            >
              <div class="left">
                <span>交易记录</span>
              </div>
              <div class="icon">
                <van-icon class="icon_icon" size="16" name="arrow" />
              </div>
            </li>
            <li class="my_cell_item van-hairline--bottom" @click="empower()">
              <div class="left">
                <span>{{
                  user.empower ? "关闭中介授权" : "开启中介授权"
                }}</span>
              </div>
              <div class="icon">
                <van-icon class="icon_icon" size="16" name="arrow" />
              </div>
            </li>

     

            <li
              class="my_cell_item van-hairline--bottom"
               @click="meiqia()"
            >
              <div class="left">
                <span>联系我们</span>
              </div>
              <div class="icon">
                <van-icon class="icon_icon" size="16" name="arrow" />
              </div>
            </li>
            <!-- @click="next('/about','8')" -->
            <!-- <li class="my_cell_item van-hairline--bottom">
              <div class="left">
                <span>关于我们</span>
              </div>
              <div class="icon">
                <van-icon class="icon_icon" size="16" name="arrow" />
              </div>
            </li> -->
            <li class="my_cell_item" @click="next('/set', '8')">
              <div class="left">
                <span>设置</span>
              </div>
              <div class="icon">
                <van-icon class="icon_icon" size="16" name="arrow" />
              </div>
            </li>
          </ul>
             </div>
          <!-- <van-swipe
            class="my_branner"
            v-for="(image, index) in bannerListDef"
            :key="index"
            :autoplay="3000"
            indicator-color="white"
          >
            <van-swipe-item>
              <img :src="image.imgurl" />
            </van-swipe-item>
          </van-swipe> -->
        </div>
    
    </van-pull-refresh>




















    <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div>
        <div class="top_bg theme_bg">
          <div class="my_top">
            <div class="logo">
              <input type='file' accept="*" @change="handleFile" class="hiddenInput"/>
                   <img class='appLogo'  src="../../assets/logo.png" alt=""
                   @click="uploadHeadImg"/>
       
            </div>
            <div class="user">
              <div class="name">{{ user.nickname }} <span>{{ userGrade }}</span></div>
              <div class="phone">{{ user.phone | dataHidden }}</div>
              <div class="id">ID:{{ userId }}</div>
            </div>
            <div class="more" @click="next('/user','8')">
              <div class="own">
                <span>个人资料</span>
                <van-icon class="icon_icon" size="16" name="arrow"/>
              </div>
            </div>
          </div>
        </div>
        <div class="my_cell_box">
          <ul class="my_cell_list">
         
            <li class="my_cell_item van-hairline--bottom" @click="next('/myCard','8')">
              <div class="left">
                <img src="../../assets/my/card_icon.png" alt="">
                <span>银行卡管理</span>
              </div>
              <div class="icon">
                <van-icon class="icon_icon" size="16" name="arrow"/>
              </div>
            </li>
            <li class="my_cell_item van-hairline--bottom" @click="next('/bill','1')">
              <div class="left">
                <img src="../../assets/my/transaction_icon.png" alt="">
                <span>交易记录</span>
              </div>
              <div class="icon">
                <van-icon class="icon_icon" size="16" name="arrow"/>
              </div>
            </li>
            <li class="my_cell_item" @click="_preUserQuery()">
              <div class="left">
                <img src="../../assets/my/pre_icon.png" alt="">
                <span>我的推荐人</span>
              </div>
              <div class="icon">
                <van-icon class="icon_icon" size="16" name="arrow"/>
              </div>
            </li>
            <li class="my_cell_item" @click="empower()">
              <div class="left">
                <img src="../../assets/my/about_icon.png" alt="">
                <span>{{ user.empower ? '关闭中介授权' : '开启中介授权' }}</span>
              </div>
              <div class="icon">
                <van-icon class="icon_icon" size="16" name="arrow"/>
              </div>
            </li>
          </ul>
          <ul class="my_cell_list">
        
            <li class="my_cell_item " @click="next('/set','8')">
              <div class="left">
                <img src="../../assets/my/setting_icon.png" alt="">
                <span>设置</span>
              </div>
              <div class="icon">
                <van-icon class="icon_icon" size="16" name="arrow"/>
              </div>
            </li>
          </ul>
          <van-swipe class="my_branner" v-for="(image, index) in bannerListDef" :key="index" :autoplay="3000"
                     indicator-color="white">
            <van-swipe-item>
              <img :src="image.imgurl"/>
            </van-swipe-item>
          </van-swipe>
        </div>

      </div>
    </van-pull-refresh> -->
    <div class="tabbar_p"></div>
    <tabbar></tabbar>
    <cardconfirm ref="cardconfirm" but='1' @disconfirm='tel()' :src='require("@/assets/alert/alert.png")'
                 :zi='"是否拨打"+prepreUserPhone'/>
    <cardconfirm ref="intermediary" but='1' @disconfirm='empowerCommit()' :src='require("@/assets/alert/alert.png")'
                 :zi="user.empower ? '关闭中介授权后，您的推荐人将不能操作您的信用卡、还款计划、还款交易记录，确定要关闭吗？' : '开启中介授权后，您的推荐人将可以操作您的信用卡、还款计划、还款交易记录，确定要开启吗？'"/>
  </div>
</template>

<script>
import {
  PullRefresh,
  NoticeBar,
  Swipe,
  SwipeItem,
  Icon
} from 'vant';
import cardconfirm from '@/components/confirm/alert'
import tabbar from '@/components/tabbar'
import {
  getBanner,
  newsQuery
} from '@/api/showBrand'
import {userBankAndNature} from '@/api/online'
import {
  setUserHead, empowerUpdate,
  getUserHead, userGradeQuery, userInfoQuery, preUserQuery
} from '@/api/user'

export default {
  data() {
    return {
      token: localStorage.getItem('token'),
      phone: localStorage.getItem('phone'),
      userId: localStorage.getItem('userId'),
      userName: localStorage.getItem('userName'),
      isLoading: false,
      bannerListDef: [],
      userAvatar: '',
      userGrade: "",
      user: {
        realname: "",
        phone: "2323",
        userid: "",
      },
      prepreUserPhone: ''
    };
  },
  components: {
    [PullRefresh.name]: PullRefresh,
    [NoticeBar.name]: NoticeBar,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Icon.name]: Icon,
    tabbar,
    cardconfirm
  },
  created() {
    this._userInfoQuery()
    this._userGradeQuery()
    this.getBanners(1)
    this.getUserHeader()
  },
  methods: {
    _userGradeQuery() {
      userGradeQuery().then(res => {
        if (res.resp_code == '000000') {
          this.userGrade = res.result
        }
      })
    },
    _userInfoQuery() {
      userInfoQuery(this.token).then(res => {
        if (res.resp_code == '000000') {
          this.user = res.result
        }
      })
    },
    // 获取用户头像
    getUserHeader() {
      getUserHead(this.phone, this.global.brandId).then(res => {
        if (res.resp_code == '000000') {
          this.userAvatar = res.result
        }
      })
    },
    // 更改头像
    // 打开图片上传
    uploadHeadImg() {
      this.$el.querySelector('.hiddenInput').click()
    },
    // 将头像显示
    handleFile: e => {
      let $target = e.target || e.srcElement
      let file = $target.files[0]
      let formData = new FormData()
      formData.append('image', file)
      formData.append('phone', this.phone)
      formData.append('brandId', this.global.brandId)
      setUserHead(formData).then(res => {
        if (res.resp_code == '000000') {
          this.getUserHeader()
        }
      })
    },
      meiqia() {
      this.$router.push({name: 'contact',})
    },
    next(path, type) {
      if (type == 8) {
        if (path == '/myCard') {
          if (this.user.realnameStatus != '1') {
            this.$dialog.confirm({
              title: '温馨提示',
              message: '您的账号未实名，为了保证正常使用功能请进行实名！',
              confirmButtonText: '去实名',
              cancelButtonText: '暂不实名'
            }).then(() => {
              this.$router.push({name: "faceRecognitionDetail"});
            })
          } else {
            this.$router.push({
              name: 'myCard',
              params: {active: JSON.stringify(0), type: JSON.stringify(0), title: JSON.stringify('我的银行卡')}
            })
          }
        } else {
          this.$router.push({path: path});
          localStorage.setItem('brandId', this.global.brandId)
        }
      } else if (type == 1) {
        this.$router.push({
          path: path,
          query: {
            'phone': this.phone,
            'token': this.token,
            'brandId': this.global.brandId,
            'userId': this.userId,
            'ip': this.global.ip,
            'type': 'h5',
            'deviceId': localStorage.getItem('kd_webapp_deviceId'),
            'billtype': "2"
          }
        });
      }
    },
    // roter(path){

    //   this.$router.push({path: path, query: {'phone':this.phone,'token':this.token,'brandId':this.global.brandId,'userId':this.userId,'ip':this.global.ip,'type':'h5','deviceId':localStorage.getItem('kd_webapp_deviceId'),'billtype':"2" }});
    // },

    _preUserQuery() {
      preUserQuery('100', this.phone).then(res => {
        if (res.resp_code == "000000") {
          this.prepreUserPhone = res.result.preUserPhone
          this.$refs.cardconfirm.disopen()
        }
      })
    },
    empower() {
      userBankAndNature(this.userId, 2, 2, 1).then(res => {
        if (res.resp_code == '000000') {
          if (!res.result || res.result.length == 0) {
            this.$toast('您还未设置默认储蓄卡，请先设置默认的储蓄卡！');
          } else {
            this.$refs.intermediary.disopen()
          }
        }
      })
    },
    empowerCommit() {
      empowerUpdate({empower: !this.user.empower}).then(res => {
        this.$toast(res.resp_message);
        this.user.empower = !this.user.empower
      })
    },
    tel() {
      let a = document.createElement('a')
      a.setAttribute('href', 'tel:' + this.prepreUserPhone)
      a.click()
      a.remove()
    },
    // 获取轮播图
    getBanners(type) {
      getBanner(this.global.brandId, type).then(res => {
        if (res.resp_code == '000000') {
          this.bannerListDef = res.result
        }
      })
    },
    about() {
      window.open('https://mp.weixin.qq.com/s/DCBZ1MS4jNYyv7MLvFeIfw')
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this.isLoading = false;
      }, 1000);
    }
  }
}
</script>
<style scoped>
.my{
  background: #F9F9F9;
  min-height: 100vh;
}
.my_header {
  width: 100%;
  text-align: center;
  height: 46px;
  line-height: 46px;
  position: fixed;
  z-index: 999;
  color: #fff;
  font-size: 17px;
}

.tabbar_p {
  height: 50px;
  width: 100%;
}

.top_bg {
  width: 100%;
  height: 145px;
  border-radius: 0 0 20px 20px;
}

.my_cell_box {
  width: 100%;
  position: relative;
  padding: 10px 10px;
  margin-top: -40px;

}
.my_cell_box1 {
  width: 100%;
  position: relative;
  padding: 10px 10px;
  margin-top: -140px;

}
.my_cell_list {
  background: #fff;
  border-radius: 0 0 15px 15px;
  /* padding: 10px; */
  margin-bottom: 10px;
  padding-bottom: 20px;
}

.my_cell_list1 {
  margin-top: 20px;
  background: #fff;
  border-radius: 12px;
  /* padding: 10px; */
  margin-bottom: 10px;
}

.my_cell_item {
  height: 50px;
  display: flex;
  font-size: 14px;
  color: #5D5D5D;
  line-height: 44px;
  padding: 0 15px;
  margin: 10px 0px;
}

.my_cell_item .left {
  flex: 1;
}

.my_cell_item .left > img {
  width: 20px;
  vertical-align: middle;
  margin-right: 7px;
}

.my_cell_item .left span {
  vertical-align: middle;
}

.my_cell_item .icon {
  width: 20px;
  position: relative;
}

.my_cell_item .icon_icon {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto 0;
  height: 16px;
  color: #999;
}

.my_branner img {
  max-width: 100%;
  border-radius: 5px;
}

.my_top {
  display: flex;
  font-size: 14px;
  padding: 20px;
  background: #fff;
  border-radius: 15px 15px 0 0 ;
}

.my_top .logo > img {
  height: 55px;
  width: 55px;
}

.my_top .logo {
  width: 70px;
}

.my_top .user {
  flex: 1;
}

.my_top .user .name {
  font-size: 17px;
}

.my_top .user .name > span {
  display: inline-block;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 11px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 0 8px;
}

.my_top .user .phone {
  font-size: 14px;
  line-height: 28px;
}

.my_top .user .id {
  font-size: 11px;
}

.my_top .more {
  width: 100px;
  text-align: right;
  font-size: 11px;
  position: relative;
}

.my_top .more .own .icon_icon {
  vertical-align: middle;
}

.my_top .more .own > span {
  vertical-align: middle;
}

.my_top .more .own {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto 0;
  height: 12px;
}

.hiddenInput {
  display: none;
}
.img80 {
  width: 25px;
  height: 25px;
}
.imgTitle {
  margin-top: 10px;
  font-size: 13px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 19px;
  color: #313131;
  opacity: 1;
}
</style>
