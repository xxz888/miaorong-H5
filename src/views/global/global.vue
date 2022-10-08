<script>

function getUrlParam(name) { //截取url参数
  var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
  if (reg.test(location.href)) return unescape(RegExp.$2.replace(/\+/g, " "));
}

var ip = "cader.dingdingxiaoer.cn"

if (getUrlParam('ip') == undefined && localStorage.getItem('ip') == null) {
  ip = "cader.dingdingxiaoer.cn"
} else if (getUrlParam('ip') == undefined && localStorage.getItem('ip') != null) {
  ip = localStorage.getItem('ip')
} else {
  ip = getUrlParam('ip')
}
var paymentip = 'https://cader.dingdingxiaoer.cn'
var brandId = 100, brandName = "喵融生活联盟生活"
export default {
  ip,
  paymentip,
  brandId,
  brandName
}
</script>
