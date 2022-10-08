<!-- 更换通道 -->
<template>
  <div>
    <van-nav-bar class="channel_nav theme_bg" title="选择刷卡通道" left-arrow fixed :border='false'
                 @click-left="onClickLeft"/>
    <div class="warpper"></div>
    <div class="online_channel">
      <div class="top">
        <div>信用卡刷卡</div>
        <div class="amount">{{ Number(money) |toFixed }}元</div>
      </div>
      <div class="channel">
        <div class="title">选择刷卡通道</div>
        <ul>
          <li class="channel_item" v-for="(item,i) in channelList" :key="i" @click="toOnline(item)">
            <div class="name">
              <img src="../../assets/online/pay_yinlian.png" alt="">
              <span>{{ item.alias }}</span>
              <span class="limit theme" @click="limit($event,item)">查看限额</span>
            </div>
            <div class="tips">
              <div>单笔限额：{{ item.limitMin |shortMoney }}元 - {{ item.limitMax |shortMoney }}元</div>
              <div>单日限额：{{ item.dayMax |shortMoney }}元</div>
            </div>
            <div class="tips">
              <div>
                交易时间：{{ item.startTime.slice(0, 5) }} - {{ item.endTime.slice(0, 5) }}
              </div>
              <div>交易费率{{ (item.costRate * 100)|toFixed }}% + {{ item.costFee }}元/笔</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {NavBar, Tag} from 'vant'
import {newFacadeTopup} from '@/api/online'

export default {
  data() {
    return {
      channelList: [],
      money: 0,
      card: {},
      brandId: this.global.brandId,
      phone: '',
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Tag.name]: Tag,
  },
  created() {
    this.phone = localStorage.getItem('phone')
    this.card = JSON.parse(sessionStorage.getItem('card'))
    this.money = sessionStorage.getItem('money')
    this.channelList = JSON.parse(sessionStorage.getItem('selChannel'))
  },
  methods: {
    onClickLeft() {
      window.history.back()
      return
      this.$router.push({name: 'online'})
    },
    toOnline(channel) {
      sessionStorage.setItem('channel', JSON.stringify(channel))
      this.$router.push({ name: 'confirmAtion' })
    },
    limit(event, item) {
      event.cancelBubble = true;
      this.$router.push({name: 'limit', params: {item: JSON.stringify(item)}})
    }
  }
}

</script>
<style scoped>
.online_channel .top {
  background: url("../../assets/online/channel_top_bg.png") center no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 155px;
  position: relative;
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  color: #fff;
  padding: 50px 35px 0 35px;
}

.online_channel .amount {
  font-size: 24px;
}

.channel_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.channel_nav >>> .van-icon {
  color: #FFFFFF !important;
}

.channel {
  padding: 0 15px;
}

.channel .title {
  font-size: 12px;
  color: #666;
  padding: 10px;
  margin-top: -30px;
}

.channel_item {
  background: #fff;
  font-size: 16px;
  color: #121212;
  border-radius: 12px;
  margin-bottom: 10px;
  padding: 0 15px 10px 15px;
}

.channel_item .name {
  padding: 15px;
  position: relative;
}

.channel_item .name > img {
  height: 15px;
  width: 23px;
  vertical-align: middle;
  margin-right: 5px;
}

.channel_item .name .limit {
  position: absolute;
  right: -15px;
  top: 0;
  background: #FFF5E9;
  border-radius: 0px 12px 0px 12px;
  line-height: 24px;
  display: inline-block;
  padding: 0 10px;
  font-size: 12px;
}

.channel_item span {
  vertical-align: middle;
}

.channel_item .tips {
  font-size: 12px;
  color: #999;
  display: flex;
}

.channel_item .tips > div {
  flex: 1;
  text-align: left;
  line-height: 20px;
}

</style>
