import request from '@/utils/request'
import qs from 'qs'

/** 查询银行卡。支持不支持  post */
/**
 *  allAmount:0-没有任务
 *  successAmount：正在执行任务还款成功的金额
 *  undoAmount：正在执行任务待还款金额
 *   failedAmount:还款失败的金额
 *  */
export function cardQuery(params) {
  return request({
    url: '/creditcardmanager/app/get/creditcard/by/userid/new',
    method: 'post',
    params
  })
}

/**获取信用卡和默认卡  post */
export function userBankAndNature(userId, type, nature, isDefault) {
  return request({
    url: '/user/app/bank/query/byuseridandtype/andnature',
    method: 'post',
    data: qs.stringify({
      "userId": userId,
      "type": type, //信用卡：0   储蓄卡：2     支付宝：3
      "nature": nature,//信用卡：0   储蓄卡：2
      "isDefault": isDefault,//传 1 就会获取一张默认的卡
    })
  })
}


export function bankIconQuery() {
  return request({
    url: '/user/app/bank/get/bankpicture',
    method: 'get',
  })
}

/** 查询银行卡post */
// export function cardQuery(token) {
//   return request({
//     url: '/user/app/bank/query/userid/'+token,
//       method: 'get',
//   })
// }

/**  设置默认银行卡(token,POST)  */
export function cardDefault(token, cardno) {
  return request({
    url: '/user/app/bank/default/' + token,
    method: 'post',
    data: qs.stringify({
      "cardno": cardno,//贴牌id
    }),
  })
}


/**  删除银行卡(token,POST)  */
export function bankDel(token, cardno, type) {
  return request({
    url: '/user/app/bank/del/' + token,
    method: 'post',
    data: qs.stringify({
      "cardno": cardno,//贴牌id
      "type": type,//贴牌id
    }),
  })
}

/**  添加银行卡(token,POST)  */
export function addBank(token, realname, bankcard, idcard, mobile, type, expiretime, securitycode, billDay, repaymentDay, creditBlance, province, city) {
  return request({
    url: '/user/app/bank/add/' + token,
    method: 'post',
    data: qs.stringify({
      "realname": realname,//贴牌id
      "bankcard": bankcard,//贴牌id
      "idcard": idcard,//贴牌id
      "mobile": mobile,//贴牌id
      "type": type,////充值卡和到账卡  0，充值卡  2，到账卡 3支付宝
      "expiretime": expiretime,//有效期
      "securitycode": securitycode,//安全码
      "billDay": billDay,//账单日
      "repaymentDay": repaymentDay,//还款日
      "creditBlance": creditBlance,//信用额度
      'province': province,
      'city': city,
    }),
  })
}

// 完善储蓄卡信息
export function setBankInfo(userId, bankCardNumber, province, city) {
  return request({
    url: '/user/app/bank/set/bankinfo/province/city',
    method: 'post',
    data: qs.stringify({
      'userId': userId,
      'bankCardNumber': bankCardNumber,
      'province': province,
      'city': city,
    })
  })
}

/**  验证银行卡是贷记或借记(token,POST)  */
// export function bankcardtype(cardNumber,brandid) {
//   return request({
//     url: '/paymentchannel/app/auth/bankcardtype',
//     method: 'post',
//     data:qs.stringify({
//               "cardNumber":cardNumber,//贴牌id
//               "brandId":brandid,//贴牌id
//           }),
//   })
// }

/**  修改信用卡信息 (token,POST)  */
export function upcreditcard(userId, bankCardNumber, securityCode, expiredTime, billDay, repaymentDay, creditBlance) {
  return request({
    url: '/user/app/bank/set/bankinfo',
    method: 'post',
    data: qs.stringify({
      "userId": userId,//
      "bankCardNumber": bankCardNumber,//卡号
      "securityCode": securityCode,//安全码
      "expiredTime": expiredTime,//有效期
      "billDay": billDay,//账单日
      "repaymentDay": repaymentDay,//还款日
      "creditBlance": creditBlance,//信用额度
    }),
  })
}

/**  存数据(token,POST)  */
export function createOrupdate(brandId, token, phone, userId, planListCard, isNotPoint, channel, task, reservedFields1, reservedFields2) {
  return request({
    url: '/creditcardmanager/app/reimbursementtransferrecord/create/orupdate',
    method: 'post',
    data: qs.stringify({
      "brandId": brandId,//贴牌id
      "token": token,//贴牌id
      "phone": phone,//贴牌id
      "userId": userId,//贴牌id
      "planListCard": planListCard,//贴牌id
      "isNotPoint": isNotPoint,//贴牌id
      "channel": channel,//贴牌id
      "task": task,//贴牌id
      "reservedFields1": reservedFields1,//是否是自定义还款
      "reservedFields2": reservedFields2//是否是自定义还款
    }),
  })
}

// 查询支持银行
export function repaymentsupportbank(version) {
  return request({
    url: '/paymentchannel/app/topup/repaymentsupportbank/byversion',
    method: 'post',
    data: qs.stringify({
      "version": version,//生成任务返回的result
    }),
  })
}

// 查询某张银行卡所有可鉴权的通道
export function queryChannelByCard(creditCardNumber, repaymentType) {
  return request({
    url: '/creditcardmanager/app/get/usable/repayment/channel',
    method: 'post',
    data: qs.stringify({
      'creditCardNumber': creditCardNumber,
      'repaymentType': repaymentType, //  1.聚合还款；其他：普通还款，默认模式
    })
  })
}

// 查询品牌还款新模式配置
export function isnewmodelQuery(brandId) {
  return request({
    url: '/creditcardmanager/app/query/brandrepaymentmodeconfig/isnewmodel',
    method: 'post',
    data: qs.stringify({
      "brandId": brandId,
    }),
  })
}


/**  一键补单 (token,POST)  */
export function createConsumeTask(repaymentBillId) {
  return request({
    url: '/creditcardmanager/app/create/consume/task',
    method: 'post',
    data: qs.stringify({
      "repaymentBillId": repaymentBillId,//
    }),
  })
}

// 查询计划是否需要重启
export function plannedamount(repaymentBillId) {
  return request({
    url: '/creditcardmanager/app/judge/whethercanrestart',
    method: 'post',
    data: qs.stringify({
      "repaymentBillId": repaymentBillId,//任务批次id
    }),
  })
}

// 手动重启
export function restartRepaymenttask(repaymentBillId) {
  return request({
    url: '/creditcardmanager/app/manual/restart/repaymenttask',
    method: 'post',
    data: qs.stringify({
      "repaymentBillId": repaymentBillId,//任务批次id
    }),
  })
}

// OCR扫描银行卡
export function bankCardOcr(data) {
  return request({
    url: '/paymentchannel/app/auth/bankcardocr',
    method: 'post',
    data: data,
  })
}


// 新闻查询
export function newsQuery(brandId, title) {
  return request({
    url: '/user/app/news/getnewsby/brandidandclassification/andpage',
    method: 'post',
    data: qs.stringify({
      'brandId': brandId,
      'title': title,
      'page': 0,
      'size': 1,
    })
  })
}

export function withdrawConfigApi(){
  return request({
    url: '/paymentgateway/app/withdraw/config',
    method: 'post'
  })
}
