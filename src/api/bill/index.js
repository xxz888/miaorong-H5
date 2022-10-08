import request from '@/utils/request'
import qs from 'qs'

// 交易

/** 获取通道 post */
export function channelQuery(user_id) {
    return request({
        url: '/user/app/channel/query/all/brandid',
        method: 'post',
        data:qs.stringify({
            "user_id":user_id,//贴牌id
        }),
    })
}

/** 账单明细 post */
export function paymentQueryAll(token,status,type,size,channelType) {
    return request({
        url: '/transactionclear/app/payment/query/'+token,
        method: 'post',
        data:qs.stringify({
            "status":status,//密码
            "type":type,//密码
            "size":size,//密码
            'channelType':channelType
        }),
    })
}


export function bankIconQuery() {
    return request({
      url: '/user/app/bank/get/bankpicture',
      method: 'get',
    })
  }



/** 查询用户交易卡号  post */
export function repaymentOrderQuery(brandId,userId,year,month,orderType,size) {
    return request({
        url: '/creditcardmanager/app/add/queryrepayment/make/informationn',
        method: 'post',
        data:qs.stringify({
            "brandId":brandId,//品牌id
            "userId":userId,//用户id
            "year":year,//年
            "month":month,//月
            "orderType":orderType,//订单类型（2为还款记录、3为空卡记录）默认为2
            "size":size
        })
    })
}

/** 查询用户空卡交易 post */
export function cardRecords(data) {
    return request({
        url: 'creditcardmanager/app/empty/card/plan/list',
        method: 'post',
        data
    })
}

/** 查询用户新余额交易 post */
export function cardRecordsNew(data) {
    return request({
        url: '/creditcardmanager/app/balance/plan/list',
        method: 'post',
        data
    })
}

/** 获得plantype为1的计划详情 post */
export function getPlanNew(params) {
    return request({
        url: '/creditcardmanager/app/balance/plan/get',
        method: 'post',
        params
    })
}

/** 根据卡号查询用户订单明细  post */
export function repaymentOrderDetailQuery(brandId,userId,orderType,bankCard,startTime) {
    return request({
        url: '/creditcardmanager/app/add/queryeorderss/make/information',
        method: 'post',
        data:qs.stringify({
            "brandId":brandId,//品牌id
            "userId":userId,//用户id
            "orderType":orderType,//订单类型（2为还款记录、3为空卡记录）默认为2
            "bankCard":bankCard,
            "startTime":startTime
        })
    })
}

/** 快捷查询用户交易明细  post */
export function quickOrderQuery(params) {
    return request({
        url: '/paymentgateway/app/quick/order/list',
        method: 'post',
        params
    })
}
