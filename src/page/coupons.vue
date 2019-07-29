<template>
  <div class="coupons-page">
    <!--<div class="banner"><img src="../assets/img/coupons/bg_lingquan@2x.png"/></div>-->
    <div ref="typesWrapper" class="types-wrapper">
      <div class="types-wrapper-content">
        <span class="item" :class="{active: cardType === ''}" @click.stop="setCardType('')">全部</span>
        <span class="item" :class="{active: cardType === 'CASH'}" @click.stop="setCardType('CASH')">代金券</span>
        <span class="item" :class="{active: cardType === 'FULL_REDUCTION'}" @click.stop="setCardType('FULL_REDUCTION')">满减券</span>
        <!--<span class="item" :class="{active: cardType === 'GIFT'}" @click.stop="setCardType('GIFT')">兑换券</span>-->
        <span class="item" :class="{active: cardType === 'DISCOUNT'}" @click.stop="setCardType('DISCOUNT')">折扣券</span>
      </div>
    </div>
    <div ref="couponsWrapper" class="coupons-wrapper">
      <ul class="coupons-wrapper-content">
        <li class="item" v-for="(coupon, couponIndex) in coupons" :key="couponIndex" @click.stop="showCouponDetail(coupon.id)">
          <div class="li_left">
            <div class="coupon_icon">
              <div class="title">
                <span class="currency" v-if="coupon.card_type !== 'DISCOUNT'">￥</span>
                <span class="number">
                  <template v-if="coupon.card_type === 'DISCOUNT'">{{((100 - coupon.discount) / 10)}}</template>
                  <template v-else>{{coupon.reduce_cost|formatMoney(0)}}</template>
                </span>
                <span class="zhe" v-if="coupon.card_type === 'DISCOUNT'">折</span>
              </div>
              <div class="label">
                <template v-if="coupon.card_type === 'CASH'">代金券</template>
                <template v-else-if="coupon.card_type === 'DISCOUNT'">折扣券</template>
                <template v-else-if="coupon.card_type === 'GIFT'">礼品券</template>
                <template v-else-if="coupon.card_type === 'FULL_REDUCTION'">满减券</template>
              </div>
            </div>
            <div class="coupon_text">
              <p class="coupon-name">{{coupon.title|longStrFormat(7)}}</p>
              <p class="use_conditions">{{coupon.description|longStrFormat(9)}}</p>
              <p class="use_conditions">
                <template v-if="coupon.merchants.length > 0">{{coupon.merchants[0].mer_name|longStrFormat(9)}}</template>
                <template v-else>适用所有商户</template>
              </p>
              <p class="limit">每人限领{{coupon.get_limit}}张<template v-if="coupon.day_get_limit > 0">，每日限领{{coupon.day_get_limit}}张</template></p>
            </div>
          </div>
          <div class="l_right">
            <div class="money" v-if="coupon.is_buy === '2'">售价：<span>{{coupon.sale_price|formatMoney}}</span>元</div>
            <div v-if="coupon.user_count > 0 && coupon.user_count >= coupon.get_limit" class="action yilin" :class="{'need-buy': coupon.is_buy === '2'}" @click.stop="showCoupon()">查看详情</div>
            <div v-else-if="coupon.is_buy === '2' && coupon.quantity > 0" class="action" :class="{'need-buy': coupon.is_buy === '2', 'no-left': coupon.quantity <= 0}" @click.stop="receive(coupon.id, couponIndex)">购买</div>
            <div v-else-if="coupon.is_buy === '1' && coupon.quantity > 0" class="action" :class="{'need-buy': coupon.is_buy === '2', 'no-left': coupon.quantity <= 0}" @click.stop="receive(coupon.id, couponIndex)">领取</div>
            <div v-else-if="coupon.quantity <= 0" class="action" :class="{'need-buy': coupon.is_buy === '2', 'no-left': coupon.quantity <= 0}">已售罄</div>
            <div class="notice" v-if="coupon.quantity > 999">剩余<span>999</span>张</div>
            <div class="notice" v-else-if="coupon.quantity > 0 && coupon.quantity <= 999">剩余<span>{{coupon.quantity}}</span>张</div>
          </div>
          <div class="border-up"></div>
          <div class="border-down"></div>
        </li>
        <div class="padding" ref="padding">
          <div class="pull-notice" v-show="showLoading === false">
            —— {{pullTxt}} ——
          </div>
          <load-more v-show="showLoading" tip="正在加载"></load-more>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { getRect } from '../../src/assets/js/dom'
import { LoadMore } from 'vux'
import { baseRedirectUrl, appId } from '../../src/config/env'
import Valid from '../utils/valid'
export default {
  name: 'coupons',
  components: { LoadMore },
  inject: ['reload'], // 引入方法
  data () {
    return {
      cardType: '',
      coupons: [],
      pageLimit: 4,
      currentPage: 0,
      totalPage: 1,
      scroll: '',
      typeScroll: '',
      pullUp: true,
      showLoading: false,
      scrolling: false,
      posting: false,
      openId: ''
    }
  },
  computed: {
    pullTxt: function () {
      let txt = ''
      if (this.pullUp === true && this.showLoading === false) {
        txt = '滑动加载更多'
      }
      if (this.pullUp === false) {
        txt = '已经到底啦'
      }
      return txt
    }
  },
  watch: {
  },
  created () {
    if (this.$route.params.openId) {
      this.openId = this.$route.params.openId
    }
  },
  mounted () {
    this.autoLogin()
    this.getCoupons()
  },
  destroyed () {
  },
  methods: {
    getCoupons () {
      if (this.pullUp === false) {
        return false
      }
      let page = this.currentPage + 1
      let postData = {
        card_type: this.cardType,
        page_limit: this.pageLimit
      }
      this.showLoading = true
      this.$http.post(this.API.coupons + '?page=' + page, postData).then(res => {
        this.showLoading = false
        this.coupons = this.coupons.concat(res.data)
        this.currentPage = res.meta.pagination.current_page
        this.totalPage = res.meta.pagination.total_pages
        if (this.totalPage <= this.currentPage) {
          this.pullUp = false
        }
        if (this.scroll) {
          this.$nextTick(() => {
            this.refresh()
          })
        } else {
          this.$nextTick(() => {
            this.initScroll()
          })
        }
      })
    },
    autoLogin () {
      if (this.openId === '') {
        return false
      }
      this.$http.post(this.API.autologin, {openId: this.openId}).then(res => {
        if (res.access_token) {
          localStorage.setItem('access_token', res.access_token)
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.message ? '<span style="font-size: 14px">' + res.message + '</span>' : '<span style="font-size: 14px">登录失败</span>',
            position: 'middle'
          })
        }
      })
    },
    // 初始化滚动
    initScroll () {
      if (!this.$refs.couponsWrapper) {
        return
      }
      this.$refs.couponsWrapper.style.minHeight = `${getRect(this.$refs.couponsWrapper).height + 1}px`
      let options = {
        probeType: 1,
        click: true,
        pullUpLoad: true
      }
      this.scroll = new BScroll(this.$refs.couponsWrapper, options)

      if (this.pullUp) {
        this.scroll.on('scrollEnd', () => {
          // 滚动到底部
          if (this.scroll.y <= (this.scroll.maxScrollY + 10)) {
            this.getCoupons()
          }
        })
      }

      this.scroll.on('scroll', (pos) => {
        this.scrollY = 0 - pos.y
        if (pos.y < 0) {
          this.scrolling = true
        } else {
          this.scrolling = false
        }
      })
    },
    refresh () {
      // 代理better-scroll的refresh方法
      this.scroll && this.scroll.refresh()
    },
    setCardType (cardType) {
      this.cardType = cardType
      this.pullUp = true
      this.currentPage = 0
      this.totalPage = 1
      this.coupons = []
      this.getCoupons()
    },
    receive (pcid, couponIndex) {
      if (this.posting) {
        return false
      }
      this.$vux.loading.show({})
      this.posting = true
      this.$http.post(this.API.receiveCoupon, {pcid: pcid, frontUrl: baseRedirectUrl + '/coupon.html'}).then(res => {
        this.posting = false
        this.$vux.loading.hide()
        if (typeof res.payUrl === 'undefined') {
          if (res.status_code === 401) {
            this.$vux.toast.show({
              type: 'text',
              text: '<span style="font-size: 14px">未登录</span>',
              position: 'middle'
            })
            if (Valid.check_weixin()) {
              setTimeout(() => {
                let redirect = this.$router.currentRoute.fullPath
                let redirectUri = baseRedirectUrl + '/wechat.html'
                // let oauthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(redirectUri) + '&response_type=code&scope=snsapi_userinfo&state=' + encodeURIComponent(redirect) + '#wechat_redirect'
                let oauthUrl = 'http://wxgw.yklsh.etonepay.com/authorize?etone_id=' + appId + '&redirect_uri=' + encodeURIComponent(redirectUri) + '&scope=snsapi_userinfo&state=' + encodeURIComponent(redirect)
                window.location.href = oauthUrl
              }, 2000)
            }
            return false
          } else {
            let message = res.message ? res.message : '未知错误'
            this.$vux.toast.show({
              type: 'text',
              text: '<span style="font-size: 14px">' + message + '</span>',
              position: 'middle'
            })
            return false
          }
        } else if (res.payUrl === '') {
          this.$vux.toast.show({
            type: 'text',
            text: '<span style="font-size: 14px">领取成功</span>',
            position: 'middle'
          })
          this.coupons[couponIndex].quantity = this.coupons[couponIndex].quantity - 1
          this.coupons[couponIndex].user_count = this.coupons[couponIndex].user_count + 1
          return true
        } else {
          window.location.href = res.payUrl
          return true
        }
      })
    },
    showCoupon () {
      this.$router.push('/coupon_show')
    },
    showCouponDetail (pcId) {
      this.$router.push({path: 'coupon_detail/' + pcId})
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/css/common";
  @keyframes myopacity
  {
    from {opacity:1;}
    to {opacity:0;}
  }

  /*Safari 和 Chrome:*/
  @-webkit-keyframes myopacity
  {
    from {opacity:1;}
    to {opacity:0;}
  }
  .coupons-page {
    height: 100%;
    background:rgba(255,255,255,1);
    .types-wrapper {
      position: fixed;
      left: 0;
      top: 0;
      height: 44px;
      width: 375px;
      z-index: 99;
      background:rgba(255,255,255,1);
      .types-wrapper-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        /*padding-top: 12px;*/
        padding: 0 25px;
        .item {
          position: relative;
          min-width:50px;
          font-size:15px;
          font-weight:400;
          /*line-height:37px;*/
          color:#999999;
        }
        .item:first-child {
          min-width:35px;
        }
        .active {
          color:#59AF34;
        }
        .active:after {
          content: '';
          width: 100%;
          height:3px;
          background:#59AF34;
          border-radius:1.5px;
          position: absolute;
          left: 0;
          top:31px;
        }
      }
    }
    .coupons-wrapper{
      height: 100%;
      padding: 0 10px;
      overflow: hidden;
      .coupons-wrapper-content {
        padding-top: 60px;
        .item{
          position: relative;
          display: flex;
          width: 100%;
          height:120px;
          background:rgba(255,255,255,1);
          border:1px solid rgba(0,0,0,0);
          border-radius: 6px;
          box-shadow:0px 0px 7.5px rgba(0,0,0,0.1);
          margin-bottom: 10px;
          .li_left{
            display: flex;
            width: 250.5px;
            padding: 20px 0px 22px 0px;
            border-right:1px dashed rgba(221,221,221,1);
            .coupon_icon{
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              width: 88px;
              height: 100%;
              /*margin-right: 5px;*/
              .title{
                color: #E04237;
                font-weight: bold;
                display: flex;
                justify-content: center;
                align-items: baseline;
                .currency {
                  font-size: 14px;
                }
                .number {
                  font-size: 30px;
                }
                .zhe {
                  font-size: 12px;
                }
              }
              .label{
                width: 40px;
                height: 16px;
                border:1px solid rgba(204,204,204,1);
                border-radius:2px;
                font-size:11px;
                font-weight:400;
                line-height:16px;
                color:rgba(102,102,102,1);
                opacity:0.99;
              }
            }
            .coupon_text{
              height: 100%;
              .coupon-name {
                height:21px;
                font-size:16px;
                font-weight:bold;
                line-height:21px;
                color:rgba(51,51,51,1);
                text-align: left;
              }
              .use_conditions{
                height:16.5px;
                font-size:11px;
                font-weight:400;
                line-height:16.5px;
                color:rgba(153,153,153,1);
                margin-top: 5.5px;
                text-align: left;
              }
              .limit {
                height:16.5px;
                font-size:11px;
                font-weight:400;
                line-height:12px;
                color:rgba(235,156,87,1);
                margin-top: 5px;
                text-align: left;
              }
            }
          }
          .l_right{
            position: relative;
            width: 100px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .money{
              position: relative;
              height:28px;
              font-size:10px;
              font-weight:400;
              line-height:28px;
              color:rgba(51,51,51,1);
              span {
                font-size: 20px;
                color: #F95349;
              }
            }
            .action {
              position: relative;
              width:65px;
              height:25px;
              background:rgba(89,175,52,1);
              border-radius:15px;
              text-align: center;
              line-height: 25px;
              font-size:12px;
              font-weight:400;
              color:rgba(255,255,255,1);
            }
            .need-buy {
              background:rgba(89,175,52,1);
            }
            .no-left {
              background:rgba(221,221,221,1);
            }
            .yilin {
              background:rgba(247,255,243,1);
              border:1px solid rgba(89,175,52,1);
              color:rgba(89,175,52,1);
            }
            .notice {
              position: relative;
              height:16.5px;
              font-size:12px;
              margin-top: 12px;
              font-weight:500;
              line-height:16.5px;
              color:rgba(153,153,153,1);
              text-align: center;
              span {
                font-size: 12px;
                color: #F95349;
              }
            }
          }
          .border-up {
            position: absolute;
            top: -10px;
            left: 242.5px;
            width: 16px;
            height: 16px;
            border-radius: 8px;
            background:rgba(255,255,255,1);
            box-shadow:0px -2px 0px rgba(0,0,0,0.1) inset;
          }
          .border-down {
            position: absolute;
            bottom: -10px;
            left: 242.5px;
            width: 16px;
            height: 16px;
            border-radius: 8px;
            background:rgba(255,255,255,1);
            box-shadow:0px 2px 0px rgba(0,0,0,0.1) inset;
          }
        }
        .padding {
          height: 69px;
          .pull-notice {
            height: 69px;
            line-height: 50px;
            font-size:12px;
            font-weight:400;
            color:rgba(204,204,204,1);
          }
        }
      }
    }
  }
</style>
