import request from '@/utils/request'
import qs from 'qs'

/**  查询多通道 (POST)  */
export function isChannelBind(bankCard,idCard,phone,userName,bankName,expiredTime,securityCode,dbankCard,dphone,dbankName,loginPhone) {
  return request({
    url: '/paymentgateway/isChannelBind',
    method: 'post',
    data: qs.stringify({
      bankCard,
      idCard,
      phone,
      userName,
      bankName,
      expiredTime,
      securityCode,
      dbankCard,
      dphone,
      dbankName,
      loginPhone
    }),
  })
}

/** 查询通道是否绑定 */
export function buildChannel(params){
  return request({
    url:'/creditcardmanager/app/balance/verify/band/card',
    method: 'post',
    params
})
}

  /** 暂停订单接口 (token,POST)  */
  export function stopOrder(params) {
    return request({
      url: '/creditcardmanager/app/balance/plan/stop',
      method: 'post',
      params
    })
  }

/**  还款模式 (token,POST)  */
export function iscustombrandconfig(userId) {
  return request({
    url: '/user/app/get/cardmanager/iscustom/brand/config',
    method: 'post',
    data: qs.stringify({
      "userId": userId,//
    }),
  })
}

/**  保存空卡任务接口 (token,POST)  */
export function saveEmptyCard(userId,creditCardNumber){
  return request({
    url:'creditcardmanager/app/empty/card/plan/save',
    method:'post',
    data:qs.stringify({
      userId,
      creditCardNumber
    })
  })
}
/**  保存任务接口 (token,POST)  */
export function balanceSaveEmptyCard(params){
  return request({
    url:'/creditcardmanager/app/balance/plan/save',
    method:'post',
    params
  })
}
/**  查询通道 (token,POST)  */
export function creditcardChannel(userId, brandId,creditCardNumber,amount, reservedAmount,executeDate,dayRepaymentCount) {
  return request({
    url: '/creditcardmanager/app/chooes/repayment/channel',
    method: 'post',
    data: qs.stringify({
      "userId": userId,//
      "brandId": brandId,//
      "creditCardNumber":creditCardNumber,
      "amount": amount,// 还款金额
      "reservedAmount": reservedAmount,//预留金额
      "executeDate":executeDate,//执行任务的日期
      "dayRepaymentCount":dayRepaymentCount,//单日还款笔数
    }),
  })
}
// 判断是否为公测用户
export function isBetaUser(){
  return request({
    url:'/creditcardmanager/app/verify/beta/user',
    method:'post'
  })
}



/**  生成任务接口 (token,POST)  */
export function creditcardTask(userId, brandId,creditCardNumber,amount, reservedAmount,executeDate,version,isNotPoint,dayRepaymentCount) {
  return request({
    url: '/creditcardmanager/app/create/repayment/task',
    method: 'post',
    data: qs.stringify({
      "userId": userId,//
      "brandId": brandId,//
      "creditCardNumber":creditCardNumber,
      "amount": amount,// 还款金额
      "reservedAmount": reservedAmount,//预留金额
      "executeDate":executeDate,//执行任务的日期
      "version":version,
      "isNotPoint":isNotPoint,//小数点
      "dayRepaymentCount":dayRepaymentCount,//单日还款笔数
    }),
  })
}

/**  生成任务接口 (token,POST)  */
export function creditcardTaskNew(params) {
  return request({
    url: '/creditcardmanager/app/create/repayment/task/new',
    method: 'post',
    params
  })
}
/**  保存任务接口 (token,POST)  */
export function creditcardSaveTask(taskJSON, amount,reservedAmount, version,city,isCustom,extra,couponId,creditCardNumber) {
  return request({
    url: '/creditcardmanager/app/save/all/task',
    method: 'post',
    data: qs.stringify({
      "taskJSON": taskJSON,//生成任务返回的result
      "amount": amount,// 还款金额
      "reservedAmount": reservedAmount,//预留金额
      "version":version,//版本
      "city": city,//
      "isCustom":isCustom,
      "extra":extra,
      'couponId':couponId, // 优惠券ID
      creditCardNumber
    }),
  })
}
// 自定义还款验证信用卡是否支持和授权
/**   任务管理任务卡验证 (token,POST)  */
export function cardIsuserable(userId, brandId, creditCardNumber, version,repaymentType) {
  return request({
    url: '/creditcardmanager/app/verify/card/isuserable',
    method: 'post',
    data: qs.stringify({
      "userId": userId,//
      "brandId": brandId,//
      "creditCardNumber": creditCardNumber,//卡号
      "version": version,//版本
      'repaymentType':repaymentType, // 1.聚合还款；其他：普通还款，默认模式
    }),
  })
}
// 自定义还款生成计划
export function customSaveTask(userId,creditCardNumber,taskJSON, province,city) {
  return request({
    url: '/creditcardmanager/app/create/custom/task',
    method: 'post',
    data: qs.stringify({
      "userId": userId,//生成任务返回的result
      "creditCardNumber":creditCardNumber,
      "taskJSON": taskJSON,//生成任务返回的result
      "province": province,// 省
      "city": city,//市

    }),
  })
}


/**  根据userId和信用卡号根据月份分组查询每月还款成功的金额 (token,POST)  */
export function creditcardPlanList(userId, creditCardNumber,size) {
  return request({
    url: '/creditcardmanager/app/get/repaymentbill/by/creditcard/groupby/month',
    method: 'post',
    data: qs.stringify({
      "userId": userId,//生成任务返回的result
      "creditCardNumber": creditCardNumber,// 还款金额
      "size":size,//版本
    }),
  })
}
/**  根据userId和信用卡号根据月份分组查询每月还款成功的金额 (token,POST)  */
export function creditcardPlanListTwo(userId, creditCardNumber,size) {
  return request({
    url: '/creditcardmanager/app/get/repaymentbill/by/userid',
    method: 'post',
    data: qs.stringify({
      "userId": userId,//生成任务返回的result
      "creditCardNumber": creditCardNumber,// 还款金额
      "size":size,//版本
    }),
  })
}
/**  根据创建时间查询出指定账单 (token,POST)  */
export function creditcardCreatetime(userId, creditCardNumber,createTime) {
  return request({
    url: '/creditcardmanager/app/get/repaymentbill/by/createtime',
    method: 'post',
    data: qs.stringify({
      "userId": userId,//生成任务返回的result
      "creditCardNumber": creditCardNumber,// 还款金额
      "createTime":createTime,//版本
    }),
  })
}

/**  关闭自动生成任务接口: (token,POST)  */
export function repaymentbillautorepayment(repaymentbillId) {
  return request({
    url: '/creditcardmanager/app/update/repaymentbill/autorepayment',
    method: 'post',
    data: qs.stringify({
      "repaymentbillId": repaymentbillId,//生成任务返回的result
    }),
  })
}

/** 查询用户消费和还款总金额 ( POST)*/
export function allamountByUserid(userId, creditCardNumber, version) {
  return request({
    url: '/creditcardmanager/app/find/allamount/by/userid',
    method: 'post',
    data: qs.stringify({
      "userId": userId,//
      "creditCardNumber": creditCardNumber,//
      "version": version,//

    }),
  })
}


/** 删除待执行任务 ( POST)*/
export function repaymenttaskdelete(repaymentTaskId,isCloseAutoConsume) {
  return request({
    url: '/creditcardmanager/app/delete/repaymenttask/by/repaymenttaskid',
    method: 'post',
    data: qs.stringify({
      "repaymentTaskId": repaymentTaskId,//
      'isCloseAutoConsume':1, // 关闭自动补消费任务，0：不做处理，1：关闭自动补消费
    }),
  })
}

/** 查询用户消费任务接口 ( POST)*/
export function repaymenttaskid(repaymentTaskId) {
  return request({
    url: '/creditcardmanager/app/query/consumetask/by/repaymenttaskid',
    method: 'post',
    data: qs.stringify({
      "repaymentTaskId": repaymentTaskId,//
    }),
  })
}

/** 查询显示时间 ( POST)*/
export function thinkTime() {
  return request({
    url: '/creditcardmanager/app/plan/today/run',
    method: 'post'
  })
}

/** 获取计划执行需要的天数 ( POST)*/
export function budgetDay(userId,creditCardNumber,amount,reservedAmount,version,dayRepaymentCount) {
  return request({
    url: '/creditcardmanager/app/balance/plan/budget/day',
    method: 'post',
    data:qs.stringify({
      userId,             // 用户id
      creditCardNumber,   // 信用卡号
      amount,             // 还款金额
      reservedAmount,     // 预留金额
      'brandId':'100',    // 品牌id
      version,            // 通道的标识
      dayRepaymentCount   // 每天的还款次数
    })
  })
}

export function getMinBalanceApi(){
  return request({
    url: '/creditcardmanager/app/limit/min',
    method: 'post',
    data: qs.stringify({})
  })
}
