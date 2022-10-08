import store from '@/store/index'

(function (a, b, c, d, e, j, s) {
  a[d] = a[d] || function () {
    (a[d].a = a[d].a || []).push(arguments)
  };
  j = b.createElement(c),
    s = b.getElementsByTagName(c)[0];
  j.async = true;
  j.charset = 'UTF-8';
  j.src = 'https://static.meiqia.com/widget/loader.js';
  s.parentNode.insertBefore(j, s);
})(window, document, 'script', '_MEIQIA');
_MEIQIA('entId', '4e8f68376b2631a96dc3e47b52ac080d');
let phone = sessionStorage.getItem('phone')
let userName = sessionStorage.getItem('userName')
_MEIQIA('metadata', {name: userName + ' __ ' + phone})
_MEIQIA('withoutBtn');
_MEIQIA('manualInit');
// 获取未读消息
_MEIQIA('getUnreadMsg', readMessage);

function readMessage(msg) {
  var num = store.state.user.unread
  if (msg === 'hasBeenRead') {
    num = 0;
    store.commit('Unread', num)
  } else if (typeof (msg) === 'object') {
    num += msg.length
    store.commit('Unread', num)
  }
}








