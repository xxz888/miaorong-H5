import axios from 'axios'
import Vue from 'vue'
import store from '../store/index'
import {Notify, Dialog} from 'vant';

Vue.use(Notify, Dialog);
// 创建axios实例
import {router} from '../router';

function getUrlParam(name) { //截取url参数
  var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
  if (reg.test(location.href)) return unescape(RegExp.$2.replace(/\+/g, " "));
}

// let ip = 'http://192.168.1.102/v1.0'
// let ip = 'http://api.dingdingxiaoer.cn/v1.0'
// let ip = 'http://cader.dingdingxiaoer.cn/v1.0'
let ip = 'http://serve.carcsu.com/v1.0'

export function getIp(){
  return ip
}
// 创建axios 实例
const service = axios.create({
  baseURL: ip,
  timeout: 10000 // 请求超时时间
})

const platform = Math.ceil(navigator.platform.length / 3)
let str = '';
let num = 0;

// if (returnCitySN) {
//   const arr = returnCitySN["cip"].split('.')
// arr.forEach((item, i) => {
//   if (i != arr.length - 1) {
//     str += item + navigator.platform.substring(num, num + platform)
//     num += platform
//   } else {
//     str += item
//   }
// })

// }else{
//   str = '123'
// }

service.interceptors.request.use(
  config => {
    store.commit('Loading')
    // 这里可以自定义一些config 配置
    if (localStorage.getItem('token') != null) {
      config.headers['authToken'] = localStorage.getItem('token') // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    
    // let deviceId = localStorage.getItem('kd_webapp_deviceId') || str
    // if (!deviceId) {
    //   deviceId = ''
    // }
    config.headers['deviceId'] = 'ios'
    return config
  },
  error => {
    store.commit('closeLoading')
    //  这里处理一些请求出错的情况
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  response => {
    store.commit('closeLoading')
    const res = response.data
    if (res.resp_code == '000005') {
      Dialog.alert({
        title: "温馨提示",
        message: res.resp_message,
        confirmButtonText: "立即重登"
      }).then(() => {
        if (localStorage.getItem('loginT')) {
          localStorage.clear()
          sessionStorage.clear()


          router.push({name: 'login'});
        } else {
          try {
            window.android.skipToAct(0, 'com.ceq.app.FragPerformance_Login_KDSJ', '')//在线收款
          } catch (e) {
            window.webkit.messageHandlers.iosWebKit.postMessage('gologin');
          }
        }
      });
    } else if(res.resp_code == '000000') {
      return res
    }else{
      Notify({
        message: res.resp_message,
        duration: 1000,
        background: '#1989fa'
      })
      return res
    }
  },
  error => {
    store.commit('closeLoading')
    if (error.message.indexOf('timeout') > -1) {
      Notify('请求超时，请检查网络是否正常');
    }
    if (error && error.response) {
      switch (error.response.status) {
        case 404:
          error.message = '请求出错(404)'
          Notify('请求出现了404！请稍后重试！');
          break;
        case 401:
          Dialog.alert({
            title: "温馨提示",
            message: '您的登录已过期，可以取消继续留在该页面，或者重新登录'
          }).then(() => {
            router.push({name: 'login'});
          });
          break;
        default:
          error.message = `连接出错(${error.response.status})!`;
          Notify('网络丢失了吆！请稍后重试！');
      }
    }
    Notify('网络丢失了吆！请稍后重试！');
    return Promise.reject(error)
  }
)
export default service

