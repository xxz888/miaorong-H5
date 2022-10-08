import request from '@/utils/request'
import qs from 'qs'


/**
 * 查询空卡通道
 */
export function zeroChannel(){
  return request({
    url:'/creditcardmanager/app/empty/card/get/channel/all',
    method:'post',
  })
}

/**  验证用户是否需要绑卡接口 (token,POST)  */
export function creditcardmanagerverify(userId,creditCardNumber, version) {
    return request({
      url: '/creditcardmanager/app/empty/card/verify/card',
      method: 'post',
      data: qs.stringify({
        "userId": userId,//
        "creditCardNumber":creditCardNumber,
        "version": version,// 还款金额
      }),
    })
  }
  
  /**  计算预留金额接口 (token,POST)  */
  export function calculatereservedamount(userId,creditCardNumber,amount,executeDate, version,dayRepaymentCounts) {
    return request({
      url: '/creditcardmanager/app/empty/card/calculate/reservedamount',
      method: 'post',
      data: qs.stringify({
        "userId": userId,//
        "creditCardNumber":creditCardNumber,
        "amount": amount,// 还款金额
        "executeDate":executeDate,
        "version": version,// 还款金额
        "dayRepaymentCounts":dayRepaymentCounts,//单日还款笔数
      }),
    })
  }
  
  /** 查看失败原因 post */
export function causeMessage(planItemId) {
  return request({
      url:'/creditcardmanager/app/empty/card/plan/error/message',
      method: 'post',
      data: qs.stringify({
        planItemId
      }),
  })
}
  
   /**  查看订单接口 (token,POST)  */
   export function checkOrder(hasWaitingEmptyOrder) {
    return request({
      url: '/creditcardmanager/app/empty/card/plan/get',
      method: 'post',
      data: qs.stringify({
        "planId":hasWaitingEmptyOrder
      }),
    })
  }
  
  /**  预览订单接口 (token,POST)  */
  export function creditcardmanagerapplyorder(userId,creditCardNumber,taskAmount,version,dayRepaymentCounts,city) {
    return request({
      url: 'creditcardmanager/app/empty/card/plan/apply',
      method: 'post',
      data: qs.stringify({
         userId,//
         creditCardNumber,
         taskAmount,// 还款金额
         version,// 还款金额
         dayRepaymentCounts,//单日还款笔数
         city
      }),
    })
  }
  
  /**  重启订单接口 (token,POST)  */
  export function reRunOrder(userId,planId) {
    return request({
      url: 'creditcardmanager/app/empty/card/plan/reRun',
      method: 'post',
      data: qs.stringify({
        userId,
        planId
      }),
    })
  }

  /** 暂停订单接口 (token,POST)  */
  export function stopOrder(userId,planId) {
    return request({
      url: 'creditcardmanager/app/empty/card/plan/stop',
      method: 'post',
      data: qs.stringify({
        userId,
        planId
      }),
    })
  }


  