<template>
  <div id="app">
    <loading v-show="requestLoading"></loading>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive">
        <!-- 这里是会被缓存的视图组件，比如 page1,page2 -->
      </router-view>
    </keep-alive>

    <router-view v-if="!$route.meta.keepAlive">
      <!-- 这里是不被缓存的视图组件，比如 page3 -->
    </router-view>

  </div>
</template>
<script>
import {mapState} from 'vuex'
import loading from '@/components/loading/loading.vue'
export default {
  computed:{
    ...mapState({
      requestLoading:state => state.user.loading
    }),
  },
  components: {
    loading,
  }
}
</script>
<style>
@import 'styles/reset.css';
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center; */
  /* color: #2c3e50; */
}


</style>
