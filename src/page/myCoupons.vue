<template>
  <div class="my-coupons-page">
    <div class="status">
      <div class="item" :class="{active: status === 'unused'}" @click.stop="setStatus('unused')">未使用</div>
      <div class="item" :class="{active: status === 'used'}" @click.stop="setStatus('used')">已使用</div>
      <div class="item" :class="{active: status === 'dated'}" @click.stop="setStatus('dated')">已过期</div>
    </div>
    <div ref="couponsWrapper" class="coupons-wrapper" v-if="coupons.length > 0">
      <ul class="wrapper-content">
        <li class="item" v-for="(coupon, couponIndex) in coupons" :key="couponIndex" @click.stop="showCouponDetail(coupon.qrcode)">
          <div class="li_left">
            <div class="coupon_icon">
              <div class="title">
                <span class="currency" v-if="coupon.card_type !== 'DISCOUNT'">￥</span>
                <span class="number">
                  <template v-if="coupon.card_type === 'DISCOUNT'">{{(coupon.discount / 10)}}</template>
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
              <p class="use_conditions">{{coupon.begin_date_time}}-{{coupon.end_date_time}}</p>
            </div>
          </div>
          <div class="l_right">
            <div v-if="coupon.dated === 0 && coupon.use_status === '0'" class="action yilin" @click.stop="showCouponDetail(coupon.qrcode)">查看详情</div>
            <img v-if="coupon.dated === 0 && coupon.use_status === '1'" class="used-icon" src="../assets/img/my_coupons/label_yishiyong@2x.png"/>
            <img v-if="coupon.dated === 1" class="expired-icon" src="../assets/img/my_coupons/label_yiguoqi@2x.png"/>
            <div class="notice" v-if="coupon.dated === 0 && coupon.use_status === '0' && coupon.left_days <=3 && coupon.left_days >= 0">{{coupon.left_days|expiredNotice}}</div>
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
    <div class="no-coupon" v-if="coupons.length === 0 && !showLoading">
      <img src="../assets/img/my_coupons/empty_icon_youhuiquan@2x.png"/>
      <span class="notice">暂时没有优惠券哦</span>
      <span class="btn" v-show="status === 'unused'" @click.stop="$router.push({path: '/coupons'})">去领取中心</span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { getRect } from '../../src/assets/js/dom'
import { LoadMore } from 'vux'
export default {
  name: 'my_coupons',
  components: { LoadMore },
  inject: ['reload'], // 引入方法
  data () {
    return {
      status: 'unused',
      coupons: [],
      pageLimit: 4,
      currentPage: 0,
      totalPage: 1,
      scroll: '',
      pullUp: true,
      showLoading: false,
      scrolling: false
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
  },
  mounted () {
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
        status: this.status,
        page_limit: this.pageLimit
      }
      this.showLoading = true
      this.$vux.loading.show({})
      this.$http.post(this.API.myCoupons + '?page=' + page, postData).then(res => {
        this.showLoading = false
        this.$vux.loading.hide()
        this.coupons = this.coupons.concat(res.data)
        this.currentPage = 1
        this.totalPage = 1
        if (this.totalPage <= this.currentPage) {
          this.pullUp = false
        }
        if (this.scroll) {
          this.$nextTick(() => {
            this.initScroll()
          })
        } else {
          this.$nextTick(() => {
            this.initScroll()
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
    setStatus (status) {
      this.status = status
      this.pullUp = true
      this.currentPage = 0
      this.totalPage = 1
      this.coupons = []
      this.getCoupons()
    },
    showCouponDetail (code) {
      this.$router.push({path: 'coupon_show/' + code})
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
  .my-coupons-page {
    height: 100%;
    background:rgba(242,244,247,1);
    padding-top: 14.5px;
    .status {
      position: fixed;
      left: 0;
      top: 0;
      height: 44px;
      width: 100%;
      z-index: 99;
      background:rgba(255,255,255,1);
      display: flex;
      justify-content: space-between;
      padding: 0 40px;
      .item {
        position: relative;
        height:44px;
        font-size:15px;
        font-weight:400;
        line-height:44px;
        color:rgba(153,153,153,1);
        /*border-bottom: 3px solid #38A1FF;*/
      }
      .item:first-child {
        min-width:30px;
      }
      .active {
        color:#59AF34;
        font-weight: bold;
      }
      .active:after {
        content: '';
        width: 30px;
        height:3px;
        background:#59AF34;
        border-radius:1.5px;
        position: absolute;
        left: 6.5px;
        top:41px;
      }
    }
    .coupons-wrapper{
      background:rgba(255,255,255,1);
      padding: 0 10px;
      height: 100%;
      overflow: hidden;
      .wrapper-content {
        padding-top: 44px;
        .item{
          position: relative;
          display: flex;
          width: 100%;
          height:120px;
          background:rgba(255,255,255,1);
          border:1px solid rgba(0,0,0,0);
          border-radius: 6px;
          box-shadow:0px 0px 34px rgba(0,0,0,0.1);
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
            .used-icon, .expired-icon {
              width: 60px;
              height: 60px;
            }
            .notice {
              position: relative;
              height:16.5px;
              margin-top: 12px;
              line-height:16.5px;
              font-size:11px;
              font-weight:400;
              color:rgba(224,66,55,1);
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
            line-height: 69px;
            font-size:12px;
            font-weight:400;
            color:rgba(204,204,204,1);
          }
        }
      }
    }
    .no-coupon {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        margin-top: 101px;
        width: 170px;
        height: 170px;
      }
      .notice {
        margin-top: 44px;
        height:18.5px;
        font-size:14px;
        font-weight:400;
        line-height:18.5px;
        color:rgba(153,153,153,1);
      }
      .btn {
        margin-top: 45.5px;
        width:110px;
        height:44px;
        border:1px solid rgba(56,161,255,1);
        border-radius:22px;
        font-size:14px;
        font-weight:400;
        line-height:44px;
        color:rgba(56,161,255,1);
      }
    }
  }
</style>
