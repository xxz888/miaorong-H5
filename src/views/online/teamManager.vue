<!-- 消息 -->
<template>
  <div>
    <van-nav-bar
      class="agent_nav theme_bg"
      style="background: none"
      :border="false"
      title="团队管理"
      left-arrow
      @click-left="onClickLeft"
    >
    </van-nav-bar>

    <div class="tabs">
      <van-tabs
        v-model="active"
        color="#30AEFB"
        line-width="20%"
        line-height="2px"
        @change="tab"
        title-active-color="#30AEFB"
      >
        <van-tab title="当月交易"></van-tab>
        <van-tab title="上月交易"></van-tab>
      </van-tabs>

      <div class="profit_share_cont" @click="gonext(L1.level)">
        <div class="themeTitle">{{'直推'+'('+L1Count+')'}}</div>
        <div class="user">
          <div class="left">
            <div class="userTitle">在线收款</div>
            <div>
              笔数:<span class="theme1">{{
                type == 0 ? L1.curFastCount : L1.preFastCount
              }}</span>
            </div>
            <div>
              金额:<span class="theme1">{{
                (type == 0 ? L1.curFastTotal : L1.preFastTotal) | toFixed
              }}</span>
            </div>
          </div>
          <div class="left">
            <div class="userTitle">智能还款</div>
            <div>
              笔数:<span class="theme1">{{
                type == 0 ? L1.curBalanceCount : L1.preBalanceCount
              }}</span>
            </div>
            <div>
              金额:<span class="theme1">{{
                (type == 0 ? L1.curBalanceTotal : L1.preBalanceTotal) | toFixed
              }}</span>
            </div>
          </div>
          <!-- <div class="right">
            <div class="userTitle">空卡还款</div>
            <div>
              笔数:<span class="theme1">{{
                type == 0 ? L1.curEmptyCount : L1.preEmptyCount
              }}</span>
            </div>
            <div>
              金额:<span class="theme1">{{
                (type == 0 ? L1.curEmptyTotal : L1.preEmptyTotal) | toFixed
              }}</span>
            </div>
            <van-icon class="right_right" name="arrow" />
          </div> -->
          <!--  -->
        </div>
      </div>

      <div class="profit_share_cont" @click="gonext(L2.level)">
        <div class="themeTitle">{{'间推'+'('+L2Count+')'}}</div>
        <div class="user">
          <div class="left">
            <div class="userTitle">在线收款</div>
            <div>
              笔数:<span class="theme1">{{
                type == 0 ? L2.curFastCount : L2.preFastCount
              }}</span>
            </div>
            <div>
              金额:<span class="theme1">{{
                (type == 0 ? L2.curFastTotal : L2.preFastTotal) | toFixed
              }}</span>
            </div>
          </div>
          <div class="left">
            <div class="userTitle">智能还款</div>
            <div>
              笔数:<span class="theme1">{{
                type == 0 ? L2.curBalanceCount : L2.preBalanceCount
              }}</span>
            </div>
            <div>
              金额:<span class="theme1">{{
                (type == 0 ? L2.curBalanceTotal : L2.preBalanceTotal) | toFixed
              }}</span>
            </div>
          </div>
          <!-- <div class="right">
            <div class="userTitle">空卡还款</div>
            <div>
              笔数:<span class="theme1">{{
                type == 0 ? L2.curEmptyCount : L2.preEmptyCount
              }}</span>
            </div>
            <div>
              金额:<span class="theme1">{{
                (type == 0 ? L2.curEmptyTotal : L2.preEmptyTotal) | toFixed
              }}</span>
            </div>
            <van-icon class="right_right" name="arrow" />
          </div> -->
          <!--  -->
        </div>
      </div>

      <div class="profit_share_cont" @click="gonext(L3.level)">
        <div class="themeTitle">{{'三代及以下'+'('+L3Count+')'}}</div>

        <div class="user">
          <div class="left">
            <div class="userTitle">在线收款</div>
            <div>
              笔数:<span class="theme1">{{
                type == 0 ? L3.curFastCount : L3.preFastCount
              }}</span>
            </div>
            <div>
              金额:<span class="theme1">{{
                (type == 0 ? L3.curFastTotal : L3.preFastTotal) | toFixed
              }}</span>
            </div>
          </div>
          <div class="left">
            <div class="userTitle">智能还款</div>
            <div>
              笔数:<span class="theme1">{{
                type == 0 ? L3.curBalanceCount : L3.preBalanceCount
              }}</span>
            </div>
            <div>
              金额:<span class="theme1">{{
                (type == 0 ? L3.curBalanceTotal : L3.preBalanceTotal) | toFixed
              }}</span>
            </div>
          </div>
          <!-- <div class="right">
            <div class="userTitle">空卡还款</div>
            <div>
              笔数:<span class="theme1">{{
                type == 0 ? L3.curEmptyCount : L3.preEmptyCount
              }}</span>
            </div>
            <div>
              金额:<span class="theme1">{{
                (type == 0 ? L3.curEmptyTotal : L3.preEmptyTotal) | toFixed
              }}</span>
            </div>
            <van-icon class="right_right" name="arrow" />
          </div> -->
          <!--  -->
        </div>
      </div>

      <div class="profit_share_cont">
                <div class="themeTitle">{{'总计'+'('+(L1Count+L2Count+L3Count)+')'}}</div>

        <div class="user">
          <div class="left">
            <div class="userTitle">在线收款</div>
            <div>
              笔数:<span class="theme1">{{
                type == 0
                  ? L1.curFastCount + L2.curFastCount + L3.curFastCount
                  : L1.preFastCount + L2.preFastCount + L3.preFastCount
              }}</span>
            </div>
            <div>
              金额:<span class="theme1">{{
                (type == 0
                  ? L1.curFastTotal + L2.curFastTotal + L3.curFastTotal
                  : L1.preFastTotal + L2.preFastTotal + L3.preFastTotal)
                  | toFixed
              }}</span>
            </div>
          </div>
          <div class="left">
            <div class="userTitle">智能还款</div>
            <div>
              笔数:<span class="theme1">{{
                type == 0
                  ? L1.curBalanceCount + L2.curBalanceCount + L3.curBalanceCount
                  : L1.preBalanceCount + L2.preBalanceCount + L3.preBalanceCount
              }}</span>
            </div>
            <div>
              金额:<span class="theme1">{{
                (type == 0
                  ? L1.curBalanceTotal + L2.curBalanceTotal + L3.curBalanceTotal
                  : L1.preBalanceTotal +
                    L2.preBalanceTotal +
                    L3.preBalanceTotal) | toFixed
              }}</span>
            </div>
          </div>
          <!-- <div class="right">
            <div class="userTitle">空卡还款</div>
            <div>
              笔数:<span class="theme1">{{
                type == 0
                  ? L1.curEmptyCount + L2.curEmptyCount + L3.curEmptyCount
                  : L1.preEmptyCount + L2.preEmptyCount + L3.preEmptyCount
              }}</span>
            </div>
            <div>
              金额:<span class="theme1">{{
                (type == 0
                  ? L1.curEmptyTotal + L2.curEmptyTotal + L3.curEmptyTotal
                  : L1.preEmptyTotal + L2.preEmptyTotal + L3.preEmptyTotal)
                  | toFixed
              }}</span>
            </div>
          </div> -->
          <!--  -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NavBar, Tab, Tabs, List, Icon } from "vant";
import { getTeamManager ,getExtension} from "@/api/user";
import { getBrandNews } from "@/api/showBrand";

export default {
  data() {
    return {
      active: 0,
      loading: false,
      finished: false,
      list: [],
      userMessageList: [],
      brandMessageList: [],
      type: 0, // 类型 0当月交易，1上月交易
      token: "",
      sizebrand: 20,
      size: 20,
      totalElementsBrand: 0,
      totalElements: 0,
      L1: {},
      L2: {},
      L3: {},
      L1Count:0,
      L2Count:0,
      L3Count:0,
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [List.name]: List,
    [Icon.name]: Icon,
  },
  created() {
    this.token = localStorage.getItem("token");
    this.getTeamManager();
    this._getExtension();
  },
  methods: {
    onClickLeft() {
      window.history.back();
    },

    // 标签切换
    tab(item) {
      this.type = item;
    },
    _getExtension(){
        getExtension().then((res) => {
        if (res.resp_code == "000000") {
          this.L1Count = res.result.L1;
          this.L2Count = res.result.L2;
          this.L3Count = res.result.L3;
        } else {
          this.$toast({ message: res.resp_message, position: "bottom" });
        }
      });
    },
    getTeamManager() {
      getTeamManager().then((res) => {
        if (res.resp_code == "000000") {
          this.L1 = res.result.L1;
          this.L2 = res.result.L2;
          this.L3 = res.result.L3;
        } else {
          this.$toast({ message: res.resp_message, position: "bottom" });
        }
      });
    },
    // 跳转消息详情
    gonext(level) {
      this.$router.push({
        name: "teamManagerDetail",
        params: { level: level, type: this.type },
      });
    },
  },
};
</script>
<style scoped>
.tabs {
  padding-top: 45px;
  position: fixed;
  width: 100%;
}

.list {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 93px;
}

.item {
  width: 340px;
  background: #ffffff;
  border-radius: 8px;
  margin-bottom: 8px;
  padding: 10px 10px 5px;
  box-sizing: border-box;
  text-align: right;
  color: #aaaaaa;
  font-size: 12px;
}

.item h6 {
  text-align: left;
  color: #333333;
  font-size: 14px;
}

.item p {
  text-align: left;
  color: #666666;
  font-size: 13px;
  margin: 5px 0;
}
.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.agent_nav >>> .van-icon {
  color: #ffffff !important;
}

.profit_share_cont {
  padding: 0 5px;
  margin-top: 10px;
}

.user {
  background: #fff;
  border-radius: 10px;
  padding: 10px 5px;
  font-size: 13px;
  color: #333;
  display: flex;
}

.user .left,
.right {
  flex: 1;
  line-height: 24px;
  position: relative;
}

.right .right_right {
  font-size: 20px;
  color: #666;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto 0;
  height: 20px;
}
.userTitle {
  color: #30AEFB;
}
.themeTitle {
  padding: 5px;
  font-size: 15px;
  color: #333;
}
</style>
