<template>
  <div>
    <van-nav-bar title="意见反馈" left-text="" left-arrow fixed right-text="提交" @click-left="back"
                 @click-right="onClickRight"/>
    <div class="feed">
      <h3>(必选) 你想反馈的问题类型</h3>
      <div class="top">
        <div @click="onClick('0')" class="top_item">
          <input class="rad" name="Fruit" type="radio" value="0" v-model="radio"/>
          <p>功能异常：功能故障或不可用</p>
        </div>
        <div @click="onClick('1')" class="top_item">
          <input class="rad" name="Fruit" type="radio" value="1" v-model="radio"/>
          <p>产品建议：用的不爽</p>
        </div>
        <div @click="onClick('2')" class="top_item">
          <input class="rad" name="Fruit" type="radio" value="2" v-model="radio"/>
          <p>其他</p>
        </div>
      </div>
      <h3>清补充详细问题和意见</h3>
      <textarea class="tar" type="text" placeholder="真诚为您服务，您的意见和建议将是我们努力的动力！"></textarea>
      <input class="ipt" placeholder="请留下手机号或者邮箱，方便我们给您答复" type="text">
    </div>
  </div>
</template>

<script>
import {NavBar} from 'vant'

export default {
  name: "feedback",
  components: {
    [NavBar.name]: NavBar,
  },
  data() {
    return {
      radio: 0
    }
  },
  methods: {
    back() {
      window.history.back()
    },
    onClick(key) {
      this.radio = key
    },
    onClickRight() {
      this.$toast({message: '已提交，谢谢您的反馈！', position: 'bottom'})
      window.history.back()
    }
  }
}
</script>

<style scoped>
.van-nav-bar__text {
  color: #FB933F;
}

.feed {
  padding-top: 50px;
  box-sizing: border-box;
  height: auto;
  text-align: left;
  text-indent: 20px;
  font-size: 14px;
}

h3 {
  margin: 8px 0;
}

.top {
  background: #FFF;
  height: 120px;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  justify-content: space-evenly;
}

.top_item {
  display: flex;
  text-indent: 6px;
  align-items: center;
}

.tar {
  width: 100%;
  height: 80px;
  border: 0;
  text-indent: 20px;
  line-height: 40px;
  color: #999;
  margin-bottom: 10px;
}

.ipt {
  width: 100%;
  border: 0;
  height: 40px;
  text-indent: 20px;
  color: #999;
}

</style>
