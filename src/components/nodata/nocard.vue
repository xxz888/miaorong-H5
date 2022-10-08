<template>
  <div class="">
    <div class="nodata">
      <div class="nodata_img"></div>
      <div class="nodata_title color_999">暂无银行卡</div>
      <x-button class="selectcard_nodata_add" style="border-radius:99px" @click.native="gonext('addcard')">添加银行卡
      </x-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    gonext(item) {
      this.$router.push({name: item, params: {type: JSON.stringify('储蓄卡')}})
    }
  }
}
</script>
<style scoped>
.nodata {
  width: 100%;
  position: fixed;
  padding: 360px 0;
  text-align: center;
  background: #fff;
}

.nodata_img {
  width: 290px;
  height: 310px;
  background: url("../../assets/data_nodata.png") center no-repeat;
  background-size: 100% 100%;
  margin: 0 auto;
}

.nodata_title {
  font-size: 28px;
}

.selectcard_nodata_add {
  margin-top: 40px;
  width: 240px;
  font-size: 24px;

}
</style>
