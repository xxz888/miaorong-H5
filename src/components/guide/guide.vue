<template>
  <div class="guide" v-if="$store.state.user.guide">
    <div class="box">
      <img class="guide_skip" @click="quit()"
           src="../../assets/guide/guide_skip.png"/>
      <img :class="'operation'+step" @click="next"
           :src="'../../assets/guide/'+step+'.png'"/>
      <img :class="'step'+step"
           :src="'../../assets/guide/guide'+step+'.png'"/>
    </div>
  </div>
</template>
<script>
export default {
  props: ['step'],
  methods: {
    quit() {
      this.$store.commit('closeGuide')
    },
    next() {
      this.$emit('next')
    },
    modality(x = 20, y = 70, w = 100, h = 80) {
      var height = document.documentElement.clientHeight;
      var width = document.documentElement.clientWidth;

      //上面的遮罩
      var div1 = document.createElement('div');
      div1.style.left = '0px';
      div1.style.top = '0px';
      div1.style.position = 'absolute';
      div1.style.width = '100%';
      div1.style.height = y + 'px';
      div1.style.backgroundColor = 'rgba(100,100,100,0.3)'
      div1.style.zIndex = ' 5000'
      document.body.append(div1);

      //下面的遮罩
      var div2 = document.createElement('div')
      div2.style.left = '0px';
      div2.style.top = y + h + 'px';
      div2.style.position = 'absolute';
      div2.style.width = '100%';
      div2.style.height = height - y - h + 'px';
      div2.style.zIndex = '2000'
      div2.style.backgroundColor = 'rgba(100,100,100,0.3)'
      document.body.append(div2);

      //左边的遮罩
      var div3 = document.createElement('div')
      div3.style.left = '0px';
      div3.style.top = y + 'px';
      div3.style.position = 'absolute';
      div3.style.width = x + 'px';
      div3.style.height = h + 'px';
      div3.style.zIndex = '2000'
      div3.style.backgroundColor = 'rgba(100,100,100,0.3)'
      document.body.append(div3);

      //右边的遮罩
      var div4 = document.createElement('div')
      div4.style.left = x + w + 'px';
      div4.style.top = y + 'px';
      div4.style.position = 'absolute';
      div4.style.width = width - x - w + 'px';
      div4.style.height = h + 'px';
      div4.style.zIndex = '2000'
      div4.style.backgroundColor = 'rgba(100,100,100,0.3)'
      document.body.append(div4);
    }
  }
}
</script>
<style scoped>
.guide {
  position: fixed;
  background: rgba(0, 0, 0, 0.6);
  top: 0;
  left: 0;
  z-index: 5000;
  width: 100vw;
  height: 100vh;
}

body {
  overflow: hidden !important;
}

.box {
  position: relative;
}

.box img {
  position: absolute;
}

.guide_skip {
  width: 90px;
  right: 10px;
  top: 10px;
}

/* 点击进入信用卡刷卡 */
.step1 {
  width: 200px;
  top: 130px;
  left: 60px;
}

.operation1 {
  width: 23vw;
  margin: 18% 6%;
}

/* 添加信用卡按钮 */
.step2, .step10 {
  width: 200px;
  top: 520px;
  left: 70px;
}

.operation2, .operation10 {
  width: 30vw;
  margin: 131% 55%;
}

/* 添加信用卡 */
.step3 {
  width: 180px;
  top: 440px;
  left: 70px;
}

.operation3 {
  width: 95vw;
  margin: 25% 2%;
}

/* 输入刷卡金额 */
.step4 {
  width: 180px;
  top: 170px;
  left: 70px;
}

.operation4 {
  width: 80vw;
  margin: 30% 10%;
  display: inline-block;
}

/* 选择刷卡通道 */
.step5 {
  width: 180px;
  top: 450px;
  left: 70px;
}

.operation5 {
  width: 95vw;
  margin: 55% 2%;
  border-radius: 3px;
}

/* 绑定刷卡通道 */
.step6 {
  width: 180px;
  top: 350px;
  left: 70px;

}

.operation6 {
  width: 95vw;
  margin: 25% 2%;

}

/* 刷卡确认 */
.step7 {
  width: 180px;
  top: 400px;
  left: 70px;
}

.operation7 {
  width: 95vw;
  margin: 25% 2%;
}


</style>
