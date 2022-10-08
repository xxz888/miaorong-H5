import {router} from "@/router"
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  easing: 'ease',  // 动画方式
  speed: 500,  // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.4 // 初始化时的最小百分比
})

router.beforeEach((to, from, next) => {
  // NProgress.start();
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (to.meta.requireAuth) {
    if (sessionStorage.getItem("userid") != null) {
      next()
    } else {
      next({
        path: '/login',
      })
    }
  } else {
    next()
  }
});
router.afterEach(() => {
  // 在即将进入新的页面组件前，关闭掉进度条
  // NProgress.done()
})
