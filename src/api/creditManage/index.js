import request from '@/utils/request'
import qs from 'qs'

// 获取我的授信额度
export function userQuotaQuery() {
  return request({
    url: '/creditcardmanager/app/get/quota',
    method: 'post'
  })
}

// 获取下级用户信用额度
export function userSonQuotaQuery(userSonPhone, isAccredit, isLost) {
  return request({
    url: '/creditcardmanager/app/get/user/son',
    method: 'post',
    data: qs.stringify({
      'userSonPhone': userSonPhone,//筛选的手机号
      'isAccredit': isAccredit,//筛选授信用户,0:全部,1:已授信,2:未授信
      'isLost': isLost,//筛选丢失信用额度的用户,0:全部,1:已丢失,2:未丢失
    })
  })
}

// 对下级用户授信
export function userSonAuthorizationQuota(sonUserId, authQuota, smsCode) {
  return request({
    url: '/creditcardmanager/app/authorization/quota',
    method: 'post',
    data: qs.stringify({
      'sonUserId': sonUserId,//下级用户id
      'authQuota': authQuota,//授权的信用额度
      'smsCode': smsCode,//短信验证码
    })
  })
}

// 获取用户弥补金额统计
export function userQuotaSumQuery() {
  return request({
    url: '/creditcardmanager/app/query/user/quota/info',
    method: 'post'
  })
}

// 弥补欠款
export function excludingDebt(userId, amount, payPassword) {
  return request({
    url: '/creditcardmanager/app/excluding/debt',
    method: 'post',
    data: qs.stringify({
      'userId': userId,//需要被扣除余额的用户id,如果不填则扣除自己的
      'amount': amount,//弥补金额
      'payPassword': payPassword,//用户支付密码
    })
  })
}


