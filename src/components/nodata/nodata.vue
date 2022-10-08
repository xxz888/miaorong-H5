<template>
  <!-- <div class=""> -->
  <div class="nodata">
    <div class="nodata_img"></div>
    <div class="nodata_title color_999">暂无数据</div>
  </div>
  <!-- </div> -->
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>
<style scoped>
.nodata {
  width: 100%;
  /* position:fixed; */
  padding: 150px 0;
  text-align: center;
  background: #fff;
  height: 100%;
}

.nodata_img {
  width: 145px;
  height: 175px;
  
  background: url("../../assets/data_nodata.png") center no-repeat;
  background-size: 100% 100%;
  margin: 0 auto;
}

.nodata_title {
  font-size: 14px;
}
</style>
