import Vue from 'vue'
import Router from 'vue-router'

const Coupons = r => require.ensure([], () => r(require('@/page/coupons')), 'coupons') // 领券中心
const CouponDetail = r => require.ensure([], () => r(require('@/page/couponDetail')), 'coupon_detail') // 优惠券详情
const CouponShow = r => require.ensure([], () => r(require('@/page/couponShow')), 'coupon_show') // 优惠券使用
const BindWechat = r => require.ensure([], () => r(require('@/page/bindWechat')), 'bind_wechat') // 微信授权
const MyCoupons = r => require.ensure([], () => r(require('@/page/myCoupons')), 'my_coupons') // 我的优惠券

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/coupons'
    },

    {
      path: '/coupons',
      name: 'coupons',
      component: Coupons,
      meta: {
        auth: 0,
        title: '领券中心'
      }
    },

    {
      path: '/coupon_detail/:pcId',
      name: 'coupon_detail',
      component: CouponDetail,
      meta: {
        auth: 0,
        title: '优惠券详情'
      }
    },

    {
      path: '/coupon_show/:code?',
      name: 'coupon_show',
      component: CouponShow,
      meta: {
        auth: 1,
        title: '使用优惠券'
      }
    },

    {
      path: '/bind_wechat/:code',
      name: 'bind_wechat',
      component: BindWechat,
      meta: {
        auth: 0,
        title: '微信授权'
      }
    },

    {
      path: '/my_coupons',
      name: 'my_coupons',
      component: MyCoupons,
      meta: {
        auth: 1,
        title: '我的优惠券'
      }
    }
  ]
})
