<template>
  <div>
    <van-dialog v-model="show" title="温馨提示" show-cancel-button>
      <p class="txt">您还未实名</p>
    </van-dialog>
  </div>
</template>
<script>
import {Dialog} from 'vant';

export default {
  data() {
    return {
      show: true
    }
  },
  components: {
    [Dialog.Component.name]: Dialog.Component,
  }
}
</script>
<style scoped>
.txt {
  text-align: center;
}
</style>
