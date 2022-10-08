import request from '@/utils/request'
import qs from 'qs'

// 推广收益
export function userShareProfitQuery() {
  return request({
    url: '/user/app/query/direct/user/award/history/sum',
    method: 'post',
  })
}

// 获取推广用户列表
export function userDirectQuery(level, status, condition, size) {
  return request({
    url: '/user/app/query/direct/user/info',
    method: 'post',
    data: qs.stringify({
      "level": level,//查询层级,1:直推,2:间推,3:二级间推
      "status": status,//状态筛选条件,0:全部,1:已注册,2:已实名,3:已激活,4:已认证
      "condition": condition,//手机号或姓名 筛选条件
      "size": size,
    }),
  })
}

// 推广收益
export function profitSumQuery(queryType, queryDate) {
  return request({
    url: '/transactionclear/app/query/profit/sum',
    method: 'post',
    data: qs.stringify({
      "queryType": queryType,//查询类型,1:快捷,2:余额还款,3:空卡还款,6:花呗 ,9:推广业绩
      "queryDate": queryDate,//查询月份,如2020年9月为:202009
    }),
  })
}

// 获取推广用户列表
export function userDirectDetailQuery(data) {
  return request({
    url: '/user/app/turnover/user',
    method: 'post',
    data
  })
}

// 获取提现/弥补/达标 记录
export function orderDetailQuery(queryType, size) {
  return request({
    url: '/transactionclear/app/query/order/detail',
    method: 'post',
    data: qs.stringify({
      "queryType": queryType,//查询类型,4:达标7:弥补,8:提现
      "size": size,//
    }),
  })
}


// 团长补贴接口（拼团补贴，达标补贴，超团补贴）
export function userSubsidy(queryType, page, size) {
  return request({
    url: '/transactionclear/app/query/user/subsidy',
    method: 'post',
    data: qs.stringify({
      "queryType": queryType,//查询类型2拼团补贴，3达标补贴，4超团补贴
      page,
      "size": size,//
    }),
  })
}

// vip返佣接口
export function awardHistory(page, size) {
  return request({
    url: '/user/app/query/award/history',
    method: 'post',
    data: qs.stringify({
      page,
      size,//
    }),
  })
}

// 超团分润接口
export function awardRecord(page, size) {
  return request({
    url: '/transactionclear/app/team/management/award/record',
    method: 'post',
    data: qs.stringify({
      page,
      size,//
    }),
  })
}

export function active(){
  return request({
    url: '/user/app/query/activate/award/config',
    method: 'post',
    data: qs.stringify({})
  })
}

export function userTurnoverTotal(data){
  return request({
    url: '/user/app/turnover/total',
    method: 'post',
    data
  })
}

export function withdrawOrderList(params){
  return request({
    url: '/paymentgateway/app/withdraw/order/list',
    method: 'post',
    params
  })
}

