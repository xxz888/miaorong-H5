import request from "@/utils/request";
import qs from 'qs'

export function namebyothers(idCard,userName) {
  return request({
    url: '/user/app/bank/intermediary/query/namebyothers',
    method: 'post',
    data:qs.stringify({
      idCard,
      userName
    })

  })
}
