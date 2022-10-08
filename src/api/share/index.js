import request from '@/utils/request'
import qs from 'qs'

// 获取平台假交易量注册量
export function getBrandFalseDate(brandId){
    return request({
        url: '/user/app/PlatformData/user/query',
        method: 'post',
        data: qs.stringify({
            'brandId':brandId,
        })
    })
}
