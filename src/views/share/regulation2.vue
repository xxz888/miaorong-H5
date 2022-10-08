<template>
  <div>
    <div class="partner_cont" :class="'tu_'+name">
      <img width="100%" :src="'../../assets/share/'+name+'.jpg'"
           style="visibility: hidden;">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: ''
    }
  },
  created() {
    this.name = this.$route.params.name
  },
  methods: {
    onClickLeft() {
      window.history.back()
    }
  }
}

</script>
<style scoped>
.zhanwei {
  height: 50px;
}

.partner_cont {
  width: 100vw;
  background-size: 100% 100% !important;
  padding-top: 50px;
  overflow: scroll;
}

.partner_item {
  height: 120px;
  /* background: #F3F5F7; */
  text-align: left;
  margin-bottom: 10px;
  box-sizing: border-box;
  position: relative;
  /* padding-top: 20px;
  padding-left: 10px; */
  font-size: 12px;
}

.partner_item img {
  width: 120px;
  height: 70px;
  float: right;
  position: absolute;
  top: 10px;
  right: 10px;
  margin: 0 auto;
}

.partner_item h6 {
  font-size: 14px;
  width: 60%;
  height: 50px;
  /*margin-bottom: 30px;*/
}

.partner_item > span {
  border-radius: 6px;
  color: #FFFFFF;
  padding: 0 10px;
  margin: 30px 0;
}

.partner_item div {
  margin-top: 15px;
}

.partner_item div span {
  margin-right: 50px;

}

.dialog_wrap {
  display: flex;
  text-align: left;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.dialog_wrap img {
  width: 45px;
}

.dialog_wrap h6 {
  font-size: 16px;
  margin: 20px 0;
}

.dialog_wrap p {
  font-size: 13px;
  color: #666666;
}

.tu_feilv {
  background: url('../../assets/share/feilv.jpg');

}

.tu_zijin {
  background: url('../../assets/share/zijin.jpg');

}

.tu_xinyong {
  background: url('../../assets/share/xinyong.jpg');

}

.tu_huankuan {
  background: url('../../assets/share/huankuan.jpg');

}

.tu_jieshao {
  background: url('../../assets/share/jieshao.jpg');

}

.tu_regulation {
  background: url('../../assets/share/regulation.jpg');

}
</style>
