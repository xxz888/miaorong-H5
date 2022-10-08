<template>
  <div class="share">
    <van-nav-bar title="推广分享"></van-nav-bar>
    <div class="warpper_top"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div>
        <div class="top">
          <div class="bg"></div>
          <ul class="top_list">
            <li class="top_item">
              <img src="../../assets/share/share_brand_icon.png"
                   alt="">
              <p>平台稳定运维</p>
              <p><span class="theme">{{ falsebrand.anniversary }}</span>周年</p>
            </li>
            <li class="top_item">
              <img src="../../assets/share/share_register_icon.png"
                   alt="">
              <p>累计注册人</p>
              <p><span class="theme">{{ number(falsebrand.registerNumber) }}</span>人</p>
            </li>
            <li class="top_item">
              <img src="../../assets/share/share_transactionicon.png"
                   alt="">
              <p>日均交易量</p>
              <p><span class="theme">{{ number(falsebrand.tradingVolume) }}</span>元</p>
            </li>
          </ul>
        </div>
        <div class="cont">
          <ul class="menu_list van-hairline--bottom">
            <li class="menu_item" @click="next('/library','8')">
              <img src="../../assets/share/share_material_icon.png"
                   alt="">
              <div>分享素材</div>
            </li>
            <li class="menu_item" @click="next('/sharePage','8')">
              <img src="../../assets/share/share_spread_icon.png"
                   alt="">
              <div>推广二维码</div>
            </li>
            <li class="menu_item" @click="$router.push('/regulation')">
              <img src="../../assets/share/share_profit_icon.png"
                   alt="">
              <div>收益规则</div>
            </li>
          </ul>
          <div class="cell_box">
            <ul class="cell_list">
              <li class="cell_item van-hairline--bottom" @click="next('/partnerBusiness','8')">
                <div class="left">
                  <img src="../../assets/share/spread_icon.png" alt="">
                  <span>推广物料</span>
                </div>
                <div class="icon">
                  <van-icon class="icon_icon" size="16" name="arrow"/>
                </div>
              </li>
              <li class="cell_item van-hairline--bottom" @click="next('/wechat','8')">
                <div class="left">
                  <img src="../../assets/share/wechat_icon.png" alt="">
                  <span>官方社群微信号<span>提供推广培训及引导</span></span>
                </div>
                <div class="icon">
                  <van-icon class="icon_icon" size="16" name="arrow"/>
                </div>
              </li>
              <li class="cell_item van-hairline--bottom" @click="link('特训营')">
                <div class="left">
                  <img src="../../assets/share/share_training_icon.png"
                       alt="">
                  <span>新代理育龙特训营</span>
                </div>
                <div class="icon">
                  <van-icon class="icon_icon" size="16" name="arrow"/>
                </div>
              </li>
              <li class="cell_item van-hairline--bottom" @click="$router.push({name:'kadeChina'})">
                <div class="left">
                  <img src="../../assets/share/join_icon.png" alt="">
                  <span>喵融生活联盟生活</span>
                </div>
                <div class="icon">
                  <van-icon class="icon_icon" size="16" name="arrow"/>
                </div>
              </li>
              <li class="cell_item van-hairline--bottom" @click="next('/videoTudorial','8')">
                <div class="left">
                  <img src="../../assets/share/explain_icon.png"
                       alt="">
                  <span>机构政策</span>
                </div>
                <div class="icon">
                  <van-icon class="icon_icon" size="16" name="arrow"/>
                </div>
              </li>
              <li class="cell_item van-hairline--bottom" @click="link('平台介绍')">
                <div class="left">
                  <img src="../../assets/share/introduce_icon.png"
                       alt="">
                  <span>平台介绍</span>
                </div>
                <div class="icon">
                  <van-icon class="icon_icon" size="16" name="arrow"/>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </van-pull-refresh>
    <div class="tabbar_p"></div>
    <tabbar></tabbar>
  </div>
</template>

<script>
import {
  NavBar,
  PullRefresh,
  Icon
} from 'vant';
import tabbar from '@/components/tabbar'
import {
  newsQuery
} from '@/api/showBrand'
import {
  getBrandFalseDate
} from '@/api/share'

export default {
  data() {
    return {
      isLoading: false,
      fuwuList: [],
      falsebrand: {
        registerNumber: "500000",
        tradingVolume: "100000000",
        anniversary: "3"
      }
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [Icon.name]: Icon,
    tabbar
  },
  created() {
    this._getBrandFalseDate()
    this._newsQuery()
  },
  methods: {
    _newsQuery(type) {
      newsQuery(this.global.brandId, '功能跳转').then(res => {
        if (res.resp_code == '000000') {
          this.fuwuList = res.result.content
        }
      })
    },
    _getBrandFalseDate() {
      getBrandFalseDate(this.global.brandId).then(res => {
        if (res.resp_code == '000000') {
          this.falsebrand = res.result.content[0]
        }
      })
    },
    number(value, index) {
      value = Number(value)
      if (value >= 0 && value < 1000) {
        value = value + "元";
      } else if (value >= 1000 && value < 10000) {
        value = value / 1000 + "千";
      } else if (value >= 10000 && value < 10000000) {
        value = value / 10000 + "万";
      } else if (value >= 10000000) {
        value = value / 100000000 + "亿";
      }
      return value;
    },
    link(item) {
      let num = 0
      this.fuwuList.map((key) => {
        if (key.title == item) {
          this.$router.push({
            name: 'appLink',
            params: {
              url: JSON.stringify(key.content),
              title: JSON.stringify(key.title),
              type: "2"
            }
          });
          return
        } else {
          num++
        }
      })
      if (num == this.fuwuList.length) {
        this.$toast({
          message: '敬请期待',
          position: 'bottom'
        })
      }
    },
    next(path, type) {
      if (type == 8) {
        this.$router.push({path: path});
      } else if (type == 1) {
        this.$router.push({path: path,
          query: {
            'phone': this.phone,
            'token': this.token,
            'brandId': this.global.brandId,
            'userId': this.userId,
            'ip': this.global.ip,
            'type': 'h5',
            'deviceId': localStorage.getItem('kd_webapp_deviceId')
          }
        });
      }
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this._getBrandFalseDate()
        this._newsQuery()
        this.$toast('刷新成功');
        this.isLoading = false;
      }, 1000);
    }
  }
}
</script>
<style scoped>
.tabbar_p {
  height: 50px;
  width: 100%;
}

.top {
  margin-bottom: 10px;
}

.top .bg {
  background: url("../../assets/share/top_bg.png") center no-repeat;
  background-size: 100% 100%;
  height: 160px;
  width: 100%;
}

.top_list {
  background: #fff;
  padding: 10px 0;
  display: flex;
  text-align: center;
  font-size: 11px;

}

.top_item {
  flex: 1;
  color: #999;
}

.top_item img {
  height: 25px;
  width: 25px;
}

.cont {
  background: #fff;
  color: #666;
  font-size: 12px;
}

.menu_list {
  padding: 10px 0;
  display: flex;
}

.menu_item {
  flex: 1;
  text-align: center;
}

.menu_item img {
  height: 40px;
  width: 40px;
}

.menu_item div {
  font-size: 13px;
  color: #333;
}

.cell_box {
  padding: 5px 10px 0 10px;
}

.cell_item {
  height: 44px;
  line-height: 44px;
  display: flex;
  padding: 0 5px;
}

.cell_item .left {
  flex: 1;
}

.cell_item .left img {
  height: 20px;
  width: 20px;
  vertical-align: middle;
  margin-right: 7px;
}

.cell_item .left span {
  vertical-align: middle;
}

.cell_item .left span > span {
  font-size: 11px;
  color: #999;
  padding-left: 7px;
  vertical-align: middle;
}

.cell_item .icon {
  width: 30px;
  position: relative;
}

.cell_item .icon_icon {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto 0;
  height: 16px;
  color: #999;
}

</style>
