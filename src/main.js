import Vue from 'vue';
import App from './App.vue';
import 'amfe-flexible/index.js';
import {router} from './router';
import store from './store/index'
import publicJs from '@/js/public.js';
import axios from 'axios'
import vueAxios from 'vue-axios'
import '@/permission'; // 路由导航
import {Notify, Toast, Dialog} from 'vant';
import * as filters from './common/filters/filters';
import service from '@/js/service'
import global from './views/global/global'//引用文件
import VideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
Vue.use(VideoPlayer)


Vue.prototype.global = global//挂载到Vue实例上面
window.eventBus = new Vue();
Vue.use(vueAxios, axios)
Vue.use(Notify, Toast, Dialog);

Vue.prototype.publicJs = publicJs;
Vue.config.productionTip = false;

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')









