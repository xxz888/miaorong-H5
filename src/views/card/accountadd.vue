<template>
  <div>
    <van-nav-bar class="agent_nav theme_bg" style="background: none;" left-arrow :border='false' title="添加支付宝"
                 @click-left="onClickLeft" />
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div>
        <div class="agent_cont">
          <div class="card_box">
            <div class="card_item">
              <van-field v-model="name" label="姓名" placeholder="请输入姓名"/>
              <van-field v-model="idCard" label="身份证号" type="number" placeholder="请输入身份证号"/>
              <van-field v-model="cardNo" label="支付宝帐号" type="number" placeholder="请输入支付宝账户号"/>
              <van-field v-model="phone" label="手机号" type="number" placeholder="请输入手机号" clearable maxlength="11"/>
            </div>
          </div>
          <div class="upcreditcard_btn_box">
            <van-button @click.native="addUser()" type="primary" class="upcreditcard_btn " round>确定添加</van-button>
          </div>
        </div>
      </div>
    </van-pull-refresh>
    <van-popup v-model="showPicker2" position="bottom">
      <van-area :area-list="areaList" :columns-num="2" @cancel="showPicker2 = false" @confirm="onConfirm2"/>
    </van-popup>
  </div>
</template>
<script>
import {namebyothers} from '@/api/intermediary/index'
import {userInfoQuery} from "@/api/user";
import {addBank} from '@/api/card/card'
import areaList from '@/components/area'
import {NavBar, Icon, Field, PullRefresh, Popup, Area, Button} from 'vant';

export default {
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Field.name]: Field,
    [PullRefresh.name]: PullRefresh,
    [Popup.name]: Popup,
    [Area.name]: Area,
    [Button.name]: Button
  },
  data() {
    return {
      isLoading: false,
      userList: [],
      token: localStorage.getItem('token'),
      idCard: '',
      cardNo: '',
      address: '',
      phone: '',
      showPicker2: false,
      province: '',
      city: '',
      areaList: areaList,
      name: ''
    }
  },
  async created() {
    this.userList = await userInfoQuery(this.token)

  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    _namebyothers() {
      namebyothers(this.userList.result.idcard, this.text).then(res => {
        this.levelList = res.result
        this.isLoading = false
        this.finished = true
      })
    },
    // 添加支付宝账户
    addUser() {
      addBank(this.token, this.name, this.cardNo, this.idCard, this.phone.replace(/\s/g, ""), 3, "", "", "", "", "", this.province, this.city).then(res => {
        if (res.resp_code == "000000") {
          this.publicJs.back()
          this.$notify({type: "primary", message: res.resp_message});
        }
      })
    },
    // 选择开户行省市
    onConfirm2(value) {
      this.address = value[0].name + '-' + value[1].name
      this.province = value[0].name
      this.city = value[1].name
      this.showPicker2 = false
    },

    // 下拉刷新
    onRefresh() {
      let time = setTimeout(() => {
        this._namebyothers()
        clearTimeout(time)
      }, 1000);
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

.card_box, .card_item, .agent_cont {
  border-radius: 10px;
}

.upcreditcard_btn_box {
  margin: 20px auto;
  width: 100%;
  text-align: center;
}

.upcreditcard_btn {
  /* height:40px; */
  background: #30AEFB;
  border: none;
  width: 80%;
}

.warn {
  display: flex;
  margin: 20px 0px 0px 0px;
  padding: 0px 50px;
  font-size: 10px;
}

.warn div {
  flex: 1;
}

.warn img {
  width: 20px;
}

.warn p {
  display: inline-block;
  margin-left: 5px;
  color: #333;
}

.warn span {
  display: block;
}


</style>
