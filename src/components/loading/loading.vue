<template>
  <div class="loading">
    <van-loading class="loading_icon" color="#FFC400"/>
    <span class="loading_title" style="color:#30AEFB">正在加载<span class="dot"></span></span>
  </div>
</template>

<script>
import {Loading} from 'vant';

export default {
  data() {
    return {}
  },
  components: {
    [Loading.name]: Loading,
  }
}
</script>
<style scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100000000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.loading_icon {

}

.loading_title {
  color: #fff;
  font-size: 15px;
  margin-top: 10px;
}

.dot {
  display: inline-block;
  height: 1em;
  line-height: 1;
  vertical-align: -.25em;
  overflow: hidden;
}

.dot::before {
  display: block;
  content: "...\A..\A.\A";
  white-space: pre-wrap;
  animation: dot 2s infinite step-start both;
}

@keyframes dot {
  33% {
    transform: translateY(-3em);
  }
  55% {
    transform: translateY(-2em);
  }
  77% {
    transform: translateY(-1em);
  }
}

</style>
