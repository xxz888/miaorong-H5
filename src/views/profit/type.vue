<template>
  <div style="background: #fff;">
    <van-nav-bar class="agent_nav theme_bg" style="background: none;" :border='false' :title="handleTitle()" left-arrow
                 @click-left="onClickLeft" />
    <div class="warpper_top"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div>
        <div class="profit_type_top theme_bg">
          <ul>
            <li class="item">
              <div class="left">
                <div class="title">当日收益（元）</div>
                <div class="profit_amount">{{ totalData.todayTotal |toFixed }}</div>
              </div>
              <div class="right">
                <div class="title">当月收益（元）</div>
                <div class="profit_amount">{{ totalData.monthTotal |toFixed }}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="profit_share_cont">
          <!-- <div class="profit_type_top">
            <div class="profit_type_top_bg">
              <van-dropdown-menu class="date_sel menu" active-color="#30AEFB" background="none">
                <van-dropdown-item v-model="yaer" :options="yearList" @change="dateChange"/>
                <van-dropdown-item v-model="month" :options="monthList" @change="dateChange"/>
              </van-dropdown-menu>
            </div>
          </div> -->
          <div class="cash_box">
            <div class="cash_title">
              <div class="type">时间</div>
              <div class="amount">{{ type == 777 ? '类型' : '用户' }}</div>
              <div class="theme">金额(元)</div>
            </div>
            <van-list v-model="isupLoading" :finished="finished" finished-text="" @load="onLoad">
              <ul class="cash_list" v-if="profit.length>0">
                <li class="cash_item van-hairline--bottom" v-for="item in profit" :key="item.id">
                  <div class="type">{{ item.createTime }}</div>
                  <div class="amount">{{  type == 777 ? item.typeName :showData(item) }}</div>
                  <div class="theme">+{{ item.amount }}</div>
                </li>
              </ul>
              <van-empty  v-else description="暂无记录"
                        >
              </van-empty>
            </van-list>
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
import {
  NavBar,
  PullRefresh,
  Icon,
  List,
  Empty,
  DropdownMenu,
  DropdownItem
} from 'vant'
import {
  userDirectDetailQuery,
  userTurnoverTotal
} from "@/api/profit"

export default {
  data() {
    return {
      brandId: localStorage.getItem('brandId'),
      userId: localStorage.getItem('userId'),
      phone: localStorage.getItem('phone'),
      isLoading: false,
      form: {
        types: [],
        page: 0,
        size: 20
      },
      fuwuList: [],
      queryType: 1, //1:快捷,2:余额还款,3:空卡还款,6:花呗
      title: "刷卡",
      yearList: [],
      yaer: '',
      month: "",
      monthList: [
        {
          text: "01月",
          value: '01'
        }, {
          text: "02月",
          value: '02'
        }, {
          text: "03月",
          value: '03'
        },
        {
          text: "04月",
          value: '04'
        }, {
          text: "05月",
          value: '05'
        }, {
          text: "06月",
          value: '06'
        },
        {
          text: "07月",
          value: '07'
        }, {
          text: "08月",
          value: '08'
        }, {
          text: "09月",
          value: '09'
        },
        {
          text: "10月",
          value: '10'
        }, {
          text: "11月",
          value: '11'
        }, {
          text: "12月",
          value: '12'
        }
      ],
      totalData: {},
      profit: [],
      isupLoading: false,
      finished: false
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [Icon.name]: Icon,
    [List.name]: List,
    [Empty.name]: Empty,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
  },
  created() {
    this.type = this.$route.params.type
    switch (this.type) {
      case 2:
        this.form.types = [2]
        break
      case 12:
        this.form.types = [12]
        break
     case 333:
        this.form.types = [3,13]
        break
     case 444:
        this.form.types = [1,11]
        break
     case 555:
      this.form.types = [51, 52, 53, 54, 55, 56]
      break
    case 666:
      this.form.types = [61, 62, 63, 64, 65, 66]
      break
    case 777:
      this.form.types = [71, 72, 73, 74, 75, 76, 81, 82, 83, 84, 85, 86]
      break
      
      default:
    }
    this.getData()
    this.total()
    // this._profitSumQuery()
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    // getData() {
    //   var d = new Date(),
    //     nowYear = d.getFullYear(),
    //     curmonth = d.getMonth() + 1;
    //   this.yaer = nowYear
    //   if (curmonth < 10) {
    //     curmonth = '0' + (curmonth)
    //   }
    //   this.month = curmonth
    //   this.yearList = [{
    //     text: nowYear + '年',
    //     value: nowYear
    //   },
    //     {
    //       text: nowYear - 1 + '年',
    //       value: nowYear - 1
    //     },
    //     {
    //       text: nowYear - 2 + '年',
    //       value: nowYear - 2
    //     }
    //   ]
    // },

        getData() {
      var d = new Date(), nowYear = d.getFullYear(), month = d.getMonth() + 1;
      this.yaer = nowYear
      if (month < 10) {
        month = '0' + (month)
      }
      this.month = month
      this.yearList = [
        {text: nowYear + '年', value: nowYear},
        {text: nowYear - 1 + '年', value: nowYear - 1},
        {text: nowYear - 2 + '年', value: nowYear - 2}
      ]
    },



    dateChange() {
      this._profitSumQuery()
    },
    total(){
      userTurnoverTotal(this.form).then(res => {
        if (res.resp_code == '000000') {
          this.totalData = res.result
        }
      })
    },
    _profitSumQuery() {
      userDirectDetailQuery(this.form).then(res => {
        if (res.resp_code == '000000') {
          this.isupLoading = false;
          this.profit.push(...res.result.content)

          if (this.type == 777) {
            for (const iterator of this.profit) {
              iterator.typeName = (iterator.type < 80 && iterator.type > 70)  ? '刷卡' : (iterator.type < 90 && iterator.type > 80) ? '余额还款' : ''
            }
          }
         

  
          
          
          if (res.result.last) {
            this.finished = true;
          }
        }
      })
    },
    handleTitle() {
      switch (this.type) {
        case 2:
          return '刷卡分润'
        case 12:
          return '还款分润'
        case 333:
          return '平级管理奖'
        case 444:
          return '自用返现'
       case 555:
          return '绑卡收益'
       case 666:
          return '激活收益'
       case 777:
          return '笔数收益'
        default:
          return ''
      }
    },
    showData(data){
      return data.sourceName.substring(0,1)+'*'+data.sourceName.substring(data.sourceName.length-1) +
        '（'+data.sourcePhone.substring(0,3)+'****'+data.sourcePhone.substring(data.sourcePhone.length-4)+'）'
    },
    onLoad() {  //上啦加载
      setTimeout(() => {
        this.form.page += 1
        this._profitSumQuery()
      }, 500);
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        // this._userQuotaQuery()
        this.isLoading = false;
      }, 1000);
    }
  }
}
</script>
<style scoped>
>>> .van-popup {
  width: 94.7%;
  left: 10px;
  border-radius: 0px 0px 5px 5px;
}

.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.agent_nav >>> .van-icon {
  color: #FFFFFF !important;
}

.profit_type_top_bg {
  background: #fff;
  padding: 3px;
  border-radius: 10px;
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.09);
}

.profit_type_top_bg >>> .van-dropdown-menu__bar {
  box-shadow: none;
}

.profit_type_top {
  width: 100%;
  padding: 10px 0 25px 0;
  font-size: 15px;
  color: #fff;
  border-radius: 0 0 20px 20px;
}

.profit_type_top .item {
  display: flex;
  padding-bottom: 20px;
}

.profit_type_top .item > div {
  flex: 1;
  text-align: center;
}

.profit_type_top .item .title {
  font-size: 13px;
  line-height: 30px;
  font-weight: 300;

}

.profit_type_top .item .amount {
  font-size: 32px;
}

.profit_type_top .item .profit_amount {
  font-size: 20px;
}

.profit_type_top .item .right {
  position: relative;
}

.profit_share_cont {
  padding: 0 10px;
  margin-top: -30px;
}

.profit_type_date {
  font-size: 14px;
  color: #333;
}

.profit_type_date .item {
  display: flex;
  line-height: 44px;
  text-align: center;
}

.profit_type_date .item .right {
  width: 40px;
  color: #666;
  font-size: 15px;
  line-height: 44px;
}

.profit_type_date .item div {
  flex: 1;
}

.active {
  color: #30AEFB;
}

.profit_type_date .type {
  font-size: 12px;
  color: #666;
}

.cash_box {
  margin-top: -20px;
  padding: 0 10px;
}


.cash_title {
  width: 100%;
  height: 50px;
  background: #FFFFFF;
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.09);
  border-radius: 10px;
  display: flex;
  text-align: center;
  line-height: 50px;
  font-size: 13px;
  color: #666;
}

.type {
  width: 120px;
}

.amount {
  flex: 2;
}

.theme{
  flex: 1;
}

.cash_list {
  padding-top: 10px
}

.cash_item {
  height: 44px;
  font-size: 12px;

  line-height: 44px;
  display: flex;
  text-align: center;

  background: #fff;
  color: #333;
}

</style>
