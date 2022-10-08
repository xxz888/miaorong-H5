import request from '@/utils/request'
import qs from 'qs'

// 查询用户信息
export function agentUserQuery(userId){
    return request({
        url: '/transactionclear/app/standard/extension/user/query',
        method: 'post',
        data: qs.stringify({
            'userId':userId,
        })
    })
}
// 查询代理等级名称
export function agentGradeNameQuery(promotionLevelId){
    return request({
        url: '/transactionclear/app/standard/agent/name',
        method: 'post',
        data: qs.stringify({
            'promotionLevelId':promotionLevelId, //用户当前达标等级
        })
    })
}
// 查询当月补贴
export function agentUserWagesQuery(userId,promotionLevelId){
    return request({
        url: '/transactionclear/app/standard/wages/query',
        method: 'post',
        data: qs.stringify({
            'userId':userId,
            'promotionLevelId':promotionLevelId, //用户当前达标等级
        })
    })
}

// 查询用户的达标/激活下级数量
export function agentSonRecordQuery(userId){
    return request({
        url: '/transactionclear/app/standard/extension/user/record/all/query',
        method: 'post',
        data: qs.stringify({
            'userId':userId, //用户当前达标等级
        })
    })
}
//查询用户下级信息
export function agentSonQuery(preUserId,text,page,size){
    return request({
        url: '/transactionclear/app/standard/extension/user/all/query',
        method: 'post',
        data: qs.stringify({
            'preUserId':preUserId, //用户ID，必传
            'text':text, //11位手机号，或下级用户名
            'page':page,
            'rows':size,
        })
    })
}



