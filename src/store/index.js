import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user: user,
  },
  getters,

})


// const store = new Vuex.Store({})
// store.registerModule('vux', { // 名字自己定义
//     state: {
//         channelAuthDialog: false,
//     },
//     mutations: {
//         UPDATE_CHANNELAUTHDIALOG(state, channelAuthDialog) {
//             state.channelAuthDialog = channelAuthDialog
//         }
//     },
//     modules: {
//         user: user,
//     },
//     getters
// })


export default store;
