const phonestart = value => {
  return value.substring(0, 3)
}

export {phonestart}


let toFixed = value => {
  if (value == null) {
    return 0.00
  } else {
    return value.toFixed(2)
  }

}
export {toFixed}

// 时间戳
const time = value => {

  var date = new Date(value);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;

}
export {time}
let cardNoEnd = value => {
  return value.substring(value.length - 4, value.length)
}
export {cardNoEnd}

let carNoStart = value => {
  return value.substring(0, 4)
}
export {carNoStart}


let userName = value => {
  return value.substring(0, 1)
}
export {userName}

let taskplanexecuteDates = value => {
  return value.split('-')[1]
}
export {taskplanexecuteDates}


let lastExecuteDateTime = value => {
  return value.split(' ')[0]
}
export {lastExecuteDateTime}

let date = value => {

  return value.split(" ")[0].split("-")[1] + '-' + value.split(" ")[0].split("-")[2]
}
export {date}

let description = value => {
  if (value == 1) {

    return value = '手续费'

  } else if (value == 2) {

    return value = '消费'

  } else if (value == 3) {

    return value = '还款'

  } else if (value == 4) {

    return value = '消费'
  }
}
export {description}


let postdate = value => {
  return value.substring(value.length - 8, value.length - 3)
}
export {postdate}
// 通道类型说明
let channelParamsRemark = value => {
  if (value == 'D0') {
    return '2小时内到账（不限日期，快速到账）'
  }
  if (value == 'D1') {
    return '明天到账（不限日期，快速到账）'
  }
  if (value == 'T0') {
    return '工作日内2小时内到账（节假日不结算）'
  }
  if (value == 'T1') {
    return '下个工作日到（节假日不结算）'
  }
}
export {channelParamsRemark}
// 金额缩写，超过10000缩写成1万
let shortMoney = value => {
  if (value > 9999) {
    return value / 10000 + '万'
  } else {
    return value
  }
}
export {shortMoney}

// 数据隐藏
let dataHidden = value => {
  if (value) {
    let str1 = value.substring(0, 3)
    let str2 = value.substring(value.length - 4)
    return str1 + ' **** ' + str2
  } else {
    return ''
  }
}
export {dataHidden}


let balanceTaskStatus = value => { //余额交易状态

  switch (value) {
    case 1:
      return value = '执行中'

    case 2:
      return value = '执行中'

    case 3:
      return value = '已完成'

    case 4:
      return value = '已失败'

    case 5:
      return value = '取消中'

    case 6:
      return value = '已取消'

    case 7:
      return value = '已失败'

    case 8:
      return value = '已失败'
  }
}
export {balanceTaskStatus}

//0 待执行，1 已成功，2 执行中，3 已关闭 4已失败
let plantaskstatus = value => {
  if (value == 0) {
    return value = "执行中"
  }
  if (value == 1) {
    return value = "已失败"
  }
  if (value == 2) {
    return value = "执行中"
  }
  if (value == 3) {
    return value = "已完成"
  }
  if (value == 4) {
    return value = "已失败"
  }
}
export {plantaskstatus}

let zerotaskstatus = value => {
  switch (value) {
    case 1:
      return value = '待审核'

    case 2:
      return value = '审核通过'

    case 3:
      return value = '运行中'

    case 4:
      return value = '暂停中'

    case 5:
      return value = '暂停中'

    case 6:
      return value = '已完成'

    case 7:
      return value = '退还手续费中'

    case 8:
      return value = '已取消'
  }
}
export {zerotaskstatus}

let taskDetailType = value => {

  if (value == 10) {
    return value = "消费"
  }
  if (value == 11) {
    return value = "还款"
  }
}
export {taskDetailType}

let isAutoConsume = value => {
  if (value == 1) {
    return '有'
  }
  if (value == 0) {
    return '暂无'
  }
}
export {isAutoConsume}

let status = value => {
  if (value == 0) {
    return value = "待完成"
  }
  if (value == 1) {
    return value = "已成功"
  }
  if (value == 2) {
    return value = "已失败"
  }
  if (value == 3) {
    return value = "待结算"
  }
  if (value == 4) {
    return value = "待结算"
  }
}
export {status}
