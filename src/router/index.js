import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
  // 还款
  {
    path: "/",
    name: "model",
    component: () => import("@/views/card/model"),
    redirect: '/login',
    meta: { title: '中转' }
  },
  {
    path: "/creditcard",
    name: "creditcard",
    component: () => import("@/views/card/card"),
    meta: { title: '银行卡管理' }
  },
  {
    path: "/debitCardAdd",
    name: "debitCardAdd",
    component: () => import("@/views/card/debitCardAdd"),
    meta: { title: '添加信用卡' }
  },
  {
    path: "/depositCardAdd",
    name: "depositCardAdd",
    component: () => import("@/views/card/depositCardAdd"),
    meta: { title: '添加储蓄卡' }
  },
  {
    path: "/updateCard/:item",
    name: "updateCard",
    component: () => import("@/views/card/updateCard"),
    meta: { title: '修改银行卡信息' }
  },
  {
    path: "/madePlan/:item",
    name: "madePlan",
    component: () => import("@/views/plan/madePlan"),
    meta: { title: '制定计划', keepAlive: true, isBack: false }
  },
  {
    path: "/submitPlan/:item/:task/:extra",
    name: "submitPlan",
    component: () => import("@/views/plan/submitPlan"),
    meta: { title: '设置计划' }
  },
  {
    path: "/confirmPlan/:authorityList/:item/:task/:extra",
    name: "confirmPlan",
    component: () => import("@/views/plan/confirmPlan"),
    meta: { title: '确认计划' }
  },
  {
    path: "/link/:url/:title",
    name: "link",
    component: () => import("@/views/link/link"),
    meta: { title: '链接' }
  },
  {
    path: '/bill', //交易
    name: 'bill',
    component: () => import('@/views/planBill/bill'),
    meta: { title: '账单' }
  },
  {
    path: '/quickDetail/:item',
    name: 'quickDetail',
    component: () => import('@/views/planBill/quickDetail'),
    meta: { title: '快捷详情' }
  },
  {
    path: '/executeTask/:item/:type',
    name: 'executeTask',
    component: () => import('@/views/planBill/executeTask'),
    meta: { title: '计划详情' }
  },
  {
    path: "/previewPlan/:item/:task",
    name: "previewPlan",
    component: () => import("@/views/plan/previewPlan"),
    meta: { title: '空卡计划预览' }
  },
  {
    path: "/executeTaskNew/:item/:task/:extra",
    name: "executeTaskNew",
    component: () => import("@/views/planBill/executeTaskNew"),
    meta: { title: '余额还款计划预览' }
  },
  {
    path: '/zeroConfirmPlan/:authorityList/:item',
    name: 'zeroConfirmPlan',
    component: () => import('@/views/zero/confirmPlan'),
    meta: { title: '确认计划' }
  },
  {
    path: "/zero",
    name: "zero",
    component: () => import("@/views/zero/card"),
    meta: { title: '银行卡管理' }
  },
  {
    path: "/zeroPlan/:item",
    name: "zeroPlan",
    component: () => import("@/views/zero/madePlan"),
    meta: { title: '制定计划', keepAlive: true, isBack: false }
  },
  {
    path: "/pre",
    name: "pre",
    component: () => import("@/views/zero/pre"),
    meta: { title: '我的推荐人' }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login"),
    meta: { title: '登录' }
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/register"),
    meta: { title: '注册' }
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/tabBar/home"),
    meta: { title: '首页' }
  },
  {
    path: "/news",
    name: "news",
    component: () => import("@/views/tabBar/news"),
    meta: { title: '资讯' }
  },
  {
    path: "/share",
    name: "share",
    component: () => import("@/views/tabBar/share"),
    meta: { title: '推广分享' }
  },
  {
    path: "/my",
    name: "my",
    component: () => import("@/views/tabBar/my"),
    meta: { title: '我的页面' }
  },
  {
    path: "/confirmAtion",
    name: "confirmAtion",
    component: () => import("@/views/plan/confirmation"),
    meta: { title: '支付确认' }
  }, {
    path: "/TiedCard",
    name: "TiedCard",
    component: () => import("@/views/plan/TiedCard"),
    meta: { title: '通道绑卡' }
  },
  {
    path: "/Payment/:url/:card/:cityCode/:provinceCode/:getSms",
    name: "PaymentVerification",
    component: () => import("@/views/plan/PaymentVerification"),
    meta: { title: '支付验证' }
  },
  {
    path: "/online",
    name: "online",
    component: () => import("@/views/online/online"),
    meta: { title: '信用卡收款', keepAlive: true, isBack: false }
  },
  {
    path: "/huabei",
    name: "huabei",
    component: () => import("@/views/online/huabei"),
    meta: { title: '花呗收款' }
  },
  {
    path: "/selectPassageway",
    name: "selectPassageway",
    component: () => import("@/views/online/selectPassageway"),
    meta: { title: '选择通道' }
  },
  {
    path: "/limit/:item",
    name: "limit",
    component: () => import("@/views/online/limit"),
    meta: { title: '通道限额' }
  },
  {
    path: "/message",
    name: "message",
    component: () => import("@/views/user/message"),
    meta: { title: '消息中心' }
  },
  {
    path: "/videoTudorial",
    name: "videoTudorial",
    component: () => import("@/views/user/videoTudorial"),
    meta: { title: '机构政策' }
  }, {
    path: "/library",
    name: "library",
    component: () => import("@/views/share/library"),
    meta: { title: '分享素材' }
  },
  {
    path: "/partnerBusiness",
    name: "partnerBusiness",
    component: () => import("@/views/share/partnerBusiness"),
    meta: { title: '推广物料' }
  },
  {
    path: "/regulation",
    name: "regulation",
    component: () => import("@/views/share/regulation"),
    meta: { title: '收益规则' }
  },
  {
    path: "/regulation2/:name",
    name: "regulation2",
    component: () => import("@/views/share/regulation2"),
    meta: { title: '资讯' }
  },
  {
    path: "/sharePage",
    name: "sharePage",
    component: () => import("@/views/share/sharePage"),
    meta: { title: '推广二维码' }
  }, {
    path: "/contact",
    name: "contact",
    component: () => import("@/views/user/contact"),
    meta: { title: '联系我们' }
  },
  {
    path: "/feedback",
    name: "feedback",
    component: () => import("@/views/user/feedback"),
    meta: { title: '投诉建议' }
  },
  {
    path: "/user",
    name: "user",
    component: () => import("@/views/user/user"),
    meta: { title: '个人信息' }
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/brand/about"),
    meta: { title: '关于我们' }
  },
  {
    path: "/wechat",
    name: "wechat",
    component: () => import("@/views/brand/wechat"),
    meta: { title: '官方社群微信号' }
  },
  {
    path: "/set",
    name: "set",
    component: () => import("@/views/user/set"),
    meta: { title: '设置' }
  },
  {
    path: "/password",
    name: "password",
    component: () => import("@/views/user/password"),
    meta: { title: '修改支付密码' }
  },
  {
    path: "/userpassword",
    name: "userpassword",
    component: () => import("@/views/user/userpassword"),
    meta: { title: '修改登录密码' }
  },
  {
    path: "/smsSend/:phone/:password",
    name: "smsSend",
    component: () => import("@/views/user/smsSend"),
    meta: { title: '短信发送' }
  },
  {
    path: "/myCard/:active/:type/:title",
    name: "myCard",
    component: () => import("@/views/card/myCard"),
    meta: { title: '我的银行卡' }
  },
  {
    path: "/setProvince/:item",
    name: "setProvince",
    component: () => import("@/views/card/setProvince"),
    meta: { title: '修改储蓄卡' }
  },
  {
    path: "/agent",
    name: "agent",
    component: () => import("@/views/agent/agent"),
    meta: { title: '超级团长' }
  },
  {
    path: "/memberCenter",
    name: "memberCenter",
    component: () => import("@/views/agent/memberCenter"),
    meta: { title: '会员中心' }
  },
  {
    path: "/credit",
    name: "credit",
    component: () => import("@/views/creditManage/credit"),
    meta: { title: '信用管理' }
  },
  {
    path: "/creditList",
    name: "creditList",
    component: () => import("@/views/creditManage/creditList"),
    meta: { title: '信用管理' }
  },
  {
    path: "/creditConfirm/:item/:type/:title",
    name: "creditConfirm",
    component: () => import("@/views/creditManage/creditConfirm"),
    meta: { title: '确认授信' }
  },
  {
    path: "/creditLose/:type",
    name: "creditLose",
    component: () => import("@/views/creditManage/creditLose"),
    meta: { title: '丢失信用' }
  },
  {
    path: "/profitHome",
    name: "profitHome",
    component: () => import("@/views/profit/home"),
    meta: { title: '收益中心' }
  },
  {
    path: "/profitShare",
    name: "profitShare",
    component: () => import("@/views/profit/share"),
    meta: { title: '推广收益' }
  },
  {
    path: "/profitProfit",
    name: "profitProfit",
    component: () => import("@/views/profit/profit"),
    meta: { title: '推广收益' }
  },
  {
    path: "/profitUser/",
    name: "profitUser",
    component: () => import("@/views/profit/user2"),
    meta: { title: '推广用户' }
  },
  {
    path: "/profitType/:type",
    name: "profitType",
    component: () => import("@/views/profit/type"),
    meta: { title: '分润' }
  },
  {
    path: "/profitTypeDetail/:type/:level/:title/:yaer/:month",
    name: "profitTypeDetail",
    component: () => import("@/views/profit/typeDetail"),
    meta: { title: '分润' }
  }, {
    path: "/profitRecord/:type",
    name: "profitRecord",
    component: () => import("@/views/profit/record"),
    meta: { title: '记录' }
  },
  {
    path: "/profitCashback/:type",
    name: "profitCashback",
    component: () => import("@/views/profit/cashback"),
    meta: { title: '返现记录' }
  },
  {
    path: "/withdraw/:item",
    name: "withdraw",
    component: () => import("@/views/user/withdraw"),
    meta: { title: '提现' }
  },
  {
    path: '/shouyiguize/:type',
    name: 'shouyiguize',
    component: () => import('@/views/profit/shouyiguize'),
    meta: { title: '收益规则' }
  },
  {
    path: "/faceRecognitionDetail",
    name: "faceRecognitionDetail",
    component: () => import("@/views/user/faceRecognitionDetail"),
    meta: { title: '实名认证' }
  },
  {
    path: "/authorization",
    name: "authorization",
    component: () => import("@/views/user/authorization"),
    meta: { title: '授权', keepAlive: true }
  },
  {
    path: "/agreement",
    name: "agreement",
    component: () => import("@/views/user/agreement"),
    meta: { title: '协议' }
  },
  // {
  //   path: "/faceRecognitionDetail",
  //   name: "faceRecognitionDetail",
  //   component: () => import("@/views/user/faceRecognitionDetail"),
  //   meta: {
  //     title: '实名认证',
  //   },
  // },
  {
    path: "/pull",
    name: "pull",
    component: () => import("@/views/user/pull"),
    meta: { title: '服务协议' }
  },
  {
    path: "/service",
    name: "service",
    component: () => import("@/views/tabBar/service"),
    meta: { title: '消息中心' }
  },
  {
    path: "/operationVideo",
    name: "operationVideo",
    component: () => import("@/views/online/operationVideo"),
    meta: {
      title: '操作视频',
    },
  },
  {
    path: "/operationVideoDetail",
    name: "operationVideoDetail",
    component: () => import("@/views/online/operationVideoDetail"),
    meta: {
      title: '操作视频',
    },
  },
  {
    path: "/leave",
    name: "leave",
    component: () => import("@/views/tabBar/leave"),
    meta: { title: '客服留言板' }
  },
  {
    path: "/person",
    name: "person",
    component: () => import("@/views/tabBar/person"),
    meta: { title: '分享' }
  },
  {
    path: '/kadeWorld',
    name: 'kadeWorld',
    component: () => import("@/views/external/kadeWorld"),
    meta: { title: '卡德国际' }
  },
  {
    path: "/appLink/:url/:title/:type",
    name: "appLink",
    component: () => import("@/views/link/appLink"),
    meta: { title: '链接' }
  },
  {
    path: "/subordinateUser",
    name: "subordinateUser",
    component: () => import("@/views/intermediary/subordinateUser"),
    meta: { title: '中介模式' }
  },
  {
    path: "/subordinateUserAdd",
    name: "subordinateUserAdd",
    component: () => import("@/views/intermediary/subordinateUserAdd"),
    meta: { title: '添加下级用户' }
  },
  {
    path: "/account",
    name: "account",
    component: () => import("@/views/card/account"),
    meta: { title: '选择提现账户' }
  },
  {
    path: "/accountAdd",
    name: "accountAdd",
    component: () => import("@/views/card/accountadd"),
    meta: { title: '添加支付宝账户' }
  },

  {
    path: "/teamManager",
    name: "teamManager",
    component: () => import("@/views/online/teamManager"),
    meta: {
      title: '团队管理',
    },
  },
  {
    path: "/teamManagerDetail",
    name: "teamManagerDetail",
    component: () => import("@/views/online/teamManagerDetail"),
    meta: {
      title: '团队管理详情',
    },
  },
];

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new Router({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return {x: 0, y: 0}
    }
  }
});

export {
  router,
};
