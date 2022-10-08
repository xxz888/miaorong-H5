import request from '@/utils/request'

export function getProvince(params){
  return request({
    url: '/paymentgateway/app/province/list',
    method: 'post',
    params
  })
}

export function getCity(params){
  return request({
    url: '/paymentgateway/app/city/list',
    method: 'post',
    params
  })
}


