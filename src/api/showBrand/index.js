import request from '@/utils/request'
import qs from 'qs'

// 获取轮播图
export function getBanner(brandId, type) {
  return request({
    url: '/user/app/slideshow/query/brandid',
    method: 'post',
    data: qs.stringify({
      'brand_id': brandId,
      'type': type
    })
  })
}

// 获得留言
export function getMessage(userid) {
  return request({
    url: '/user/app/jpush/MessagePush/Query',
    method: 'post',
    data: qs.stringify({
      userid
    })
  })
}

// 修改留言状态
export function updateMessage(id) {
  return request({
    url: '/user/app/jpush/MessagePush/update/App',
    method: 'post',
    data: qs.stringify({
      id
    })
  })
}

/** 获取平台消息 get */
export function getBrandNews(token, size) {
  return request({
    url: '/user/app/jpush/history/brand/' + token,
    method: 'get',
    params: {
      "size": size
    }
  })
}

// 新闻查询
export function newsQuery(brandId, classifiCation, title) {
  return request({
    url: '/user/app/news/getnewsby/brandidandclassification/andpage',
    method: 'post',
    data: qs.stringify({
      'brandId': brandId,
      'classifiCation': classifiCation,
      'page': 0,
      'size': 300,
      'title': title
    })
  })
}


/** 获取贴牌产品  get */
export function getProdBrand(brand_id) {
  return request({
    url: '/user/app/thirdlevel/prod/brand/' + brand_id,
    method: 'get',
    params: {
      "access_type": 0
    }
  })
}

// 获取品牌数据，客服电话
export function brandQuery(brandId) {
  return request({
    url: '/user/app/brand/query/id',
    method: 'get',
    params: {
      'brand_id': brandId,
    }
  })
}

//朋友圈文库查询
export function imagetextQuery1(brand_id, page, size) {
  return request({
    url: '/user/app/imagetext/query/brandid',
    method: 'post',
    data: qs.stringify({
      "brand_id": brand_id,
      page,
      size
    }),
  })
}

// 新闻分类查询
export function newsTypeQuery(brandId) {
  return request({
    url: '/user/app/newsclassification/getclassification/bybrandid',
    method: 'post',
    data: qs.stringify({
      "brandId": brandId,
    }),
  })
}

// 查询关于我们
export function aboutQuery() {
  return request({
    url: '/user/app/add/querycirclefriendslibrary/make/information',
    method: 'post',
  })
}

// 微信官方社群
export function wechatQuery() {
  return request({
    url: '/user/app/WeChatGroup/user/query',
    method: 'post',
  })
}



