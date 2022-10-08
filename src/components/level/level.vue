<template>
  <div>
    <!-- 收货地址三级联动选项 start-->
    <section class="address" :class="{toggHeight:istoggHeight}">
      <section class="city_title">
        <div class="area_box">
          <div class="area">请选择要提升的等级</div>
        </div>
      </section>
      <ul class="proJuli">
        <li class="addList" v-for="(v,k) in diffs" @click="select(v)" :key="k">
          {{ v.diffName }}
        </li>
      </ul>
    </section>
    <div class="layout" :class="{layoutBg:islayout}" @click="close()"></div>
    <cardconfirm ref="diff" but='1' @disconfirm='commit()' :src='require("@/assets/alert/alert.png")'
                 :zi="handleToast()"/>
  </div>
</template>

<script>
import cardconfirm from '@/components/confirm/alert'

export default {
  props: {
    diffs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      islayout: false,
      istoggHeight: false,
      selectDiff: {}
    }
  },
  components: {
    cardconfirm
  },
  methods: {
    select(config) {
      this.selectDiff = config
      this.$refs.diff.disopen()
    },
    handleToast(){
      return '确定要更改下级的VIP等级为' + this.selectDiff.diffName + '吗？'
    },
    commit(){
      this.$parent.changeLevel(this.selectDiff.diffLevel)
      this.close()
    },
    open() {
      this.islayout = true
      this.istoggHeight = true
    },
    close() {
      this.istoggHeight = false
      this.islayout = false
    }
  }
}
</script>
<style>
.address {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 121;
  background: #fff;
  width: 100%;
  height: 0;
  overflow: hidden;
  transition: height .5s;
}

.toggHeight {
  height: 30%;
}

.layout {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 120;
  opacity: 0;
  transition: all .5s;
  background: rgb(53, 58, 60);
  visibility: hidden;
}

.layoutBg {
  opacity: .7;
  visibility: visible;
}

.area {
  font-size: 16px;
  height: 28px;
  line-height: 28px;
  color: #262e31;
  text-align: center;
}

.addList {
  height: 42px;
  text-align: center;
  font-size: 15px;
  line-height: 42px;
  color: #262e31;
}

/* 修改的格式 */
.address ul {
  height: calc(100% - 80px);
  overflow: auto;
}

.address ul li {
  list-style: none;
}

.address ul .active span::after {
  content: '';
  /* background-image: url('../../assets/gou_img.png'); */
  width: 30px;
  height: 10px;
  background-repeat: no-repeat;
  background-size: 10px 26px;
  background-position: left 15px center;
  display: inline-block;
}

.city_title {
  height: 40px;
  border-bottom: 1px solid #8a96a3;
}
</style>
