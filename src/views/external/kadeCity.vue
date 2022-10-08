<template>
  <div>
    <van-nav-bar title="卡德城市" left-arrow @click-left="onClickLeft"/>
    <div class="china">
      <chaina/>
    </div>
    <div>
      <th>卡德中国</th>
      <th>拟设立机构区域</th>
      <th>已设立机构区域</th>
      <div class="bg">
        <table border="1" cellspacing="0" cellpadding="0">
          <tbody>
          <tr>
            <td>{{ region.province }}</td>
            <td>{{ region.city }}</td>
            <td>{{ region.districts }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import '@/assets/kade/gongzhong.less'
import {NavBar, Icon} from 'vant'
import chaina from '@/components/external/chaina';

export default {
  data() {
    return {
      isLoading: false,
      region: []
    }
  },
  created() {
    this.region = JSON.parse(this.$route.params.City)
  },
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    chaina
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    }
  }
}
</script>
<style scoped>
th {
  font-size: 15px;
  padding: 7px 12px;

}

.bg {
  background-color: #fff;
  height: calc(100vh - 300px);
  overflow-x: scroll;
  padding: 10px;
  font-size: 14px;
}

table {
  width: 100%;
  border: 0.5px solid #aaa;
  border-collapse: collapse;
}

table tbody tr td:nth-child(2) {
  width: 40%;
}

table tbody tr td:nth-child(3) {
  width: 40%;
}

table, table thead th, table tr td {
  border: 1px solid #aaa;
  padding: 5px;
  font-weight: 500;
  text-align: left;


}
</style>
