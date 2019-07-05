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
          <div class="coupon-info">
            <div class="left">
              <img :src="coupon.logo|upload"/>
              <span class="label">
                <template v-if="coupon.card_type === 'CASH'">代金券</template>
                <template v-else-if="coupon.card_type === 'DISCOUNT'">折扣券</template>
                <template v-else-if="coupon.card_type === 'GIFT'">礼品券</template>
                <template v-else-if="coupon.card_type === 'FULL_REDUCTION'">满减券</template>
              </span>
            </div>
            <div class="middle">
              <p class="coupon-name">{{coupon.title|longStrFormat(7)}}</p>
              <p class="use_conditions">{{coupon.description|longStrFormat(9)}}</p>
              <p class="use_conditions">{{coupon.notice|longStrFormat(9)}}</p>
            </div>
            <div class="right">
              <span v-if="coupon.dated === 0 && coupon.use_status === '0'" class="use-btn" @click.stop="showCouponDetail(coupon.qrcode)">立即使用</span>
              <img v-if="coupon.dated === 0 && coupon.use_status === '1'" class="used-icon" src="../assets/img/my_coupons/label_yishiyong@2x.png"/>
              <img v-if="coupon.dated === 1" class="expired-icon" src="../assets/img/my_coupons/label_yiguoqi@2x.png"/>
            </div>
          </div>
          <div class="expired-time">
            <span class="warning" v-if="coupon.dated === 0 && coupon.use_status === '0' && coupon.left_days <= 3 && coupon.left_days >= 0">{{coupon.left_days|expiredNotice}}</span>
            <span class="normal" v-else>{{coupon.begin_date_time}}-{{coupon.end_date_time}}</span>
          </div>
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
      <img src="../assets/img/my_coupons/states_yhq_kong@2x.png"/>
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
        color:rgba(56,161,255,1);
      }
      .active:after {
        content: '';
        width: 30px;
        height:3px;
        background:rgba(56,161,255,1);
        border-radius:1.5px;
        position: absolute;
        left: 6.5px;
        top:41px;
      }
    }
    .coupons-wrapper{
      background:rgba(242,244,247,1);
      padding: 0 10px;
      height: 100%;
      overflow: hidden;
      .wrapper-content {
        padding-top: 44px;
        .item{
          margin-top: 10.5px;
          height:127.5px;
          border-radius: 6px;
          background:rgba(255,255,255,1);
          border:1px solid rgba(0,0,0,0);
          box-shadow:0px 0px 6.5px rgba(0,0,0,0.1);
          padding: 15px 19px 0 15px;
          display: flex;
          flex-direction: column;
          .coupon-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left {
              position: relative;
              width: 65px;
              height: 65px;
              margin-right: 10px;
              img {
                width: 100%;
                height: 100%;
              }
              .label{
                position: absolute;
                top: 0;
                left: 0;
                width: 41px;
                height: 17.5px;
                background:rgba(51,51,51,1);
                opacity:0.8;
                border-radius:2px 2px 2px 0px;
                font-size: 10px;
                font-weight:400;
                line-height:17.5px;
                text-align: center;
                color:rgba(255,255,255,1);
              }
            }
            .middle {
              width: 181px;
              p {
                text-align: left;
              }
              .coupon-name {
                height:21px;
                font-size:15px;
                font-weight:bold;
                line-height:21px;
              }
              .use_conditions {
                margin-top: 5.5px;
                height:16.5px;
                font-size:12px;
                font-weight:400;
                line-height:16.5px;
                color:rgba(153,153,153,1);
              }
            }
            .right {
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              .use-btn {
                width:65px;
                height:27px;
                border:1px solid rgba(249,83,73,1);
                border-radius:13.5px;
                font-size:12px;
                font-weight:400;
                line-height:27px;
                color:rgba(249,83,73,1);
              }
              img {
                width: 60px;
                height: 60px;
              }
            }
          }
          .expired-time {
            margin-top: 15.5px;
            padding-top: 8px;
            height:16.5px;
            font-size:12px;
            font-weight:400;
            line-height:16.5px;
            color:rgba(153,153,153,1);
            text-align: left;
            border-top:1px solid rgba(229,229,229,1);
            .warning {
              color:rgba(249,83,73,1);
            }
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
        margin-top: 138px;
        width: 123.5px;
        height: 80.5px;
      }
      .notice {
        margin-top: 44px;
        height:18.5px;
        font-size:13px;
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
