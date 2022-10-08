<template>
  <div>
    <van-nav-bar class="agent_nav theme_bg" style="background: none;" :border='false' title="信用管理" left-arrow
                 @click-left="onClickLeft">
      <template #right>
        <div class="agent_right_tip theme" @click="link('信用规则')">信用规则</div>
      </template>
    </van-nav-bar>
    <div class="warpper_top"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div>
        <div class="agent_top_bg theme_bg"></div>
        <div class="credit_cont">
          <div class="credit_top">
            <div class="credit_top_bg">
              <div>{{ quota.useableQuota | toFixed }}</div>
              <span>可信用额度</span>
            </div>
          </div>
          <div class="credit_sum_amount">
            <div><span>·</span>总信用额(元)</div>
            <span>{{ quota.totalQuota | toFixed }}</span>
          </div>
          <div class="credit_btn" :class="quota.selfQuota>=1000 ?'active':'' "
               @click="quota.selfQuota>=1000?next('creditList'):toToast()">
            授信管理
          </div>
        </div>
        <ul class="credit_son_box">
          <li class="credit_son_item">
            <div class="left">
              <div>自身信用(元)</div>
              <span>{{ quota.selfQuota | toFixed }}</span>
            </div>
            <div class="right">
              <div>丢失信用(元)</div>
              <span class="theme">{{ quota.lostSelfQuota | toFixed }}</span>
            </div>
          </li>
          <li class="credit_son_item">
            <div class="left">
              <div>被授信额(元)</div>
              <span>{{ quota.superiorQuota | toFixed }}</span>
            </div>
            <div class="right">
              <div>丢失授信(元)</div>
              <span class="theme">{{ quota.lostSuperiorQuota | toFixed }}</span>
            </div>
          </li>
          <li class="credit_son_item">
            <div class="left">
              <div>授信总额(元)</div>
              <span>{{ quota.subordinateQuota | toFixed }}</span>
            </div>
            <div class="right" @click="next('creditLose',0)">
              <div>他人丢失(元)</div>
              <span class="theme">{{ quota.lostSubordinateQuota | toFixed }}</span>
              <van-icon class="credit_son_right_icon" name="arrow"/>
            </div>
          </li>
        </ul>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import {
  NavBar,
  PullRefresh,
  Empty,
  Icon
} from 'vant';
import {newsQuery} from '@/api/showBrand'
import {
  userQuotaQuery
} from "@/api/creditManage";

export default {
  data() {
    return {
      brandId: localStorage.getItem('brandId'),
      userId: localStorage.getItem('userId'),
      phone: localStorage.getItem('phone'),
      isLoading: false,
      fuwuList: [],
      quota: {
        lostSelfQuota: 0,
        lostSubordinateQuota: 0,
        lostSuperiorQuota: 0,
        selfQuota: 0,
        subordinateQuota: 0,
        superiorQuota: 0,
        totalQuota: 0,
        useableQuota: 0,
      }
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [Empty.name]: Empty,
    [Icon.name]: Icon
  },
  created() {
    this._newsQuery()
    this._userQuotaQuery()
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    _newsQuery() {
      newsQuery(this.global.brandId, '功能跳转').then(res => {
        if (res.resp_code == '000000') {
          this.fuwuList = res.result.content
        }
      })
    },
    _userQuotaQuery() {
      userQuotaQuery(this.userId).then(res => {
        if (res.resp_code == "000000") {
          this.quota = res.result
        }
      });
    },
    toToast() {
      this.$toast({
        message: '您的额度低于1000,不能给其他人授信',
        position: 'bottom'
      })
    },
    next(name, type) {
      if (type == undefined) {
        this.$router.push({name: name});
      } else {
        this.$router.push({name: name, params: {type: JSON.stringify(type)}})
      }

    },
    link(item) {
      let num = 0
      this.fuwuList.map((key) => {
        if (key.title == item) {
          var url = key.content
          this.$router.push({
            name: 'appLink',
            params: {
              url: JSON.stringify(url),
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
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this._userQuotaQuery()
        this.isLoading = false;
      }, 1000);
    },
  }
}
</script>
<style scoped>
.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.agent_nav >>> .van-icon {
  color: #FFFFFF !important;
}

.agent_right_tip {
  font-size: 13px;
  background: #FFFFFF;
  border-radius: 10px 0px 0px 10px;
  padding: 2px 2px 2px 8px;
  margin-right: -16px;
}

.agent_top_bg {
  height: 140px;
  border-radius: 0 0 25px 25px;
  width: 100%;
  font-size: 17px;
  display: flex;
  color: #fff;
  padding: 27px 30px;
  box-shadow: 0px 3px 15px 0px rgba(0, 0, 0, 0.09);
}

.credit_cont {
  padding: 0 10px;
  margin-top: -100px;
  position: relative;
}

.credit_top {
  padding: 40px 15px;
  background: #fff;
  border-radius: 12px;

}

.credit_top_bg {
  background: url("../../assets/credit/credit_top_bg.png") center no-repeat;
  background-size: 100% 100%;
  height: 140px;
  width: 140px;
  margin: 0 auto;
  text-align: center;
  font-size: 18px;
  color: #333;
  position: relative;
  padding-top: 50px;
}

.credit_top_bg span {
  font-size: 11px;
  color: #999;
}

.credit_sum_amount {
  font-size: 11px;
  color: #999;
  text-align: right;
  position: absolute;
  right: 30px;
  top: 20px;
}

.credit_sum_amount div > span {
  color: #30AEFB;
}

.credit_btn {
  height: 35px;
  width: 113px;
  line-height: 35px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  border-radius: 20px;
  background: #999;
  position: absolute;
  bottom: -15px;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 1000;
}

.credit_btn.active {
  background: #30AEFB;
}

.credit_son_box {
  padding: 40px 10px 10px 10px;
  font-size: 13px;
}

.credit_son_item {
  width: 100%;
  background: #fff;
  border-radius: 12px;
  padding: 10px 15px;
  display: flex;
  margin-bottom: 10px;
}

.credit_son_item div {
  flex: 1;
  text-align: center;
  color: #333;
}

.credit_son_item span {
  color: #999;
  font-size: 12px;
}

.credit_son_item .right {
  position: relative;
}

.credit_son_right_icon {
  color: #999;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto 0;
  font-size: 16px;
  height: 16px;
}


</style>
