<template>
  <div>
    <!-- 收货地址三级联动选项 start-->
    <section class="address" :class="{toggHeight:istoggHeight}">
      <section class="city_title">
        <div class="area_box">
          <div class="area">
            {{ showProvince ? '请选择省份' : '请选择城市' }}
          </div>
        </div>
      </section>
      <ul v-if="showProvince" class="proJuli">
        <li class="addList" v-for="(v,k) in provinceList" @click="cityGet(v)" :key="k"
            :class="{active : v.selected}"><span>{{ v.cityName }}</span></li>
      </ul>
      <ul v-else class="citJuli">
        <li class="addList" v-for="(v,k) in showCityList" @click="getCityId(v)" :key="k"
            :class="{active : v.selected}"><span>{{ v.cityName }}</span></li>
      </ul>
    </section>
    <!-- 收货地址三级联动选项 end-->
    <div class="layout" :class="{layoutBg:islayout}" @click="closeAdd()"></div>
  </div>
</template>
<script>
import { getProvince, getCity } from "@/api/city/city";

export default {
  props: {
    channel: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      islayout: false,
      istoggHeight: false,
      showProvince: true,
      provinceList: [],
      showCityList: [],
      province: {}
    }
  },
  methods: {
    getprovince() {
      getProvince({ channelTag: this.channel }).then(res => {
        this.showProvince = true
        if (res.resp_code == "000000") {
          this.provinceList = res.result;
        } else {
          this.closeAdd()
          this.$parent.merchantTrueFalseBy = true
        }
      })
    },
    cityGet(pro) {
      this.province = pro
      getCity({ parent: pro.id, channelTag: this.channel }).then(res => {
        if (res.resp_code == "000000") {
          this.showCityList = res.result;
          this.showProvince = false
        } else {
          this.closeAdd()
          this.$parent.merchantTrueFalseBy = true
        }
      })
    },
    getCityId(ci) {
      this.$parent.provinceName = this.province.cityName
      this.$parent.cityName = ci.cityName
      this.$parent.provinceCode = this.province.id
      this.$parent.cityCode = ci.id
      this.closeAdd()
    },
    choseAdd() { // 选择地址弹层，打开弹层
      this.getprovince()
      this.islayout = true
      this.istoggHeight = true
    },
    closeAdd() { // 关闭弹层
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
  height: 60%;
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
  display: inline-block;
  font-size: 16px;
  height: 22px;
  line-height: 22px;
  color: #262e31;
  margin: 10px auto;
  max-width: calc(100% - 60%);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.addList {
  margin-left: 10px;
  font-size: 15px;
  line-height: 33px;
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

.address .city_title .accolor {
  color: #d2a24e;
  border-bottom: 1px solid #d2a24e;
}

.address ul .active {
  color: #d2a24e;
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
