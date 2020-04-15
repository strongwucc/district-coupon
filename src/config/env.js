/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */
let rootUrl = ''
let baseUrl = ''
let uploadUrl = 'http://yanshi.yklsq.etonepay.com'
// let appId = 'yt6eb45ebc33750e02'
let appId = 'wx68a832494fe9c1ef'
let baseRedirectUrl = 'http://' + window.location.host

if (process.env.NODE_ENV === 'development') {
  // rootUrl = 'http://district.test'
  rootUrl = 'http://square.square.yaliantong.com'
  baseUrl = rootUrl + '/api/'
  baseRedirectUrl = 'http://square.square.yaliantong.com/district-coupon'
  // appId = 'yt6eb45ebc33750e02'
  appId = 'wx68a832494fe9c1ef'
} else if (process.env.NODE_ENV === 'production') {
  rootUrl = 'http://' + window.location.host
  baseUrl = rootUrl + '/api/'
  baseRedirectUrl = 'http://' + window.location.host + '/district-coupon/'
  // rootUrl = 'http://ceshi7.sdykt.com.cn:1280'
  // baseUrl = rootUrl + '/api/'
  // baseRedirectUrl = 'http://ceshi6.sdykt.com.cn:1280/business-district'
  // appId = 'yt6eb45ebc33750e02'
  appId = 'wx68a832494fe9c1ef'
}

export {
  rootUrl,
  baseUrl,
  uploadUrl,
  appId,
  baseRedirectUrl
}
