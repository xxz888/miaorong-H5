import request from '@/utils/request'
import qs from 'qs'

// 登录

/** 用户密码登陆 post */
export function userLogin(phone, password, brand_id) {
  return request({
    url: '/user/app/login',
    method: 'post',
    data: qs.stringify({
      "phone": phone,//手机号
      "password": password,//密码
      "brand_id": brand_id,//贴牌id
    }),
  })
}

/** 用户密码修改 post */
export function updatepassword(phone, vericode, password, brand_id) {
  return request({
    url: "user/app/password/update",
    method: 'post',
    data: qs.stringify({
      "phone": phone,//手机号
      "password": password,//新密码
      "vericode": vericode,//验证码
      "brandId": brand_id,//品牌Id
    }),
  })
}

/** 修改用户密码验证码 post */
export function userSms(phone, brand_id) {
  return request({
    url: "notice/app/sms/send",
    method: 'get',
    params: {
      "brand_id": brand_id,//品牌Id
      "phone": phone,//接收验证码的手机号
    },
  })
}


/** 发送短信验证码 post */
export function smsSend(brand_id, phone) {
  return request({
    url: '/notice/app/sms/send',
    method: 'get',
    params: {
      "brand_id": brand_id,//品牌Id
      "phone": phone,//接收验证码的手机号
    },
  })
}

/** 用户手机号登陆 post */
export function smsLogin(brandId, phone, vericode) {
  return request({
    url: '/user/app/smslogin',
    method: 'post',
    data: qs.stringify({
      "brandId": brandId,//品牌Id
      "phone": phone,//接收验证码的手机号,
      "vericode": vericode,//用户接收的验证码
    }),
  })
}

export function authPhone(phone){
  return request({
    url: '/user/app/phone/select',
    method: 'post',
    data:qs.stringify({
      phone
    })
  })
}

/** 用户手机号注册 post */
export function register(brandId, phone, vericode, preUserPhone, password) {
  return request({
    url: '/user/app/smslogin',
    method: 'post',
    data: qs.stringify({
      brandId,//品牌Id
      phone,//接收验证码的手机号,
      vericode,//用户接收的验证码
      preUserPhone,
      password
    }),
  })
}

/** 支付密码更改 post */
export function paypassUpdate(phone, vericode, paypass) {
  return request({
    url: '/user/app/paypass/update/',
    method: 'post',
    data: qs.stringify({
      "phone": phone,//手机号
      "vericode": vericode,//验证码
      "paypass": paypass,//验证码
    }),
  })
}
