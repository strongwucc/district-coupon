<template>
  <div class="coupon-show-page" ref="couponShowPage">
    <div class="content" ref="content">
      <div class="title">{{coupon.title}}</div>
      <div class="face-value">
        <span class="currency" v-if="coupon.card_type !== 'DISCOUNT'">￥</span>
        <span class="number">
          <template v-if="coupon.card_type === 'DISCOUNT'">{{((100 - coupon.discount) / 10)|formatMoney(0)}}</template>
          <template v-else>{{coupon.reduce_cost|formatMoney(0)}}</template>
        </span>
        <span class="zhe" v-if="coupon.card_type === 'DISCOUNT'">折</span>
      </div>
      <div class="description">{{coupon.description}}</div>
      <div class="use-notice">
        请扫描商家付款二维码使用优惠券
      </div>
      <div class="expire-time"><span>有效期：</span><span>{{coupon.begin_date_time}}-{{coupon.end_date_time}}</span></div>
      <div class="item notice is-first">
        <div class="notice-title" @click.stop="showNotice = !showNotice;resetHeight()">
          <span class="txt">使用须知</span>
          <img v-show="!showNotice" src="../assets/img/base/icon_arrow_down@2x.png"/>
          <img v-show="showNotice" src="../assets/img/base/icon_arrow_up@2x.png"/>
        </div>
        <div v-show="showNotice" class="notice-content">{{coupon.notice}}</div>
      </div>
      <div class="item store">
        <div class="notice-title" @click.stop="showMerchants = !showMerchants;resetHeight()">
          <span class="txt">适用商户</span>
          <img v-show="!showMerchants" src="../assets/img/base/icon_arrow_down@2x.png"/>
          <img v-show="showMerchants" src="../assets/img/base/icon_arrow_up@2x.png"/>
        </div>
        <div v-show="showMerchants" class="notice-content">
          <div class="merchant" v-for="(merchant, merchantIndex) in coupon.merchants" :key="merchantIndex">
            <div class="mer-name">{{merchant.mer_name}}</div>
            <div class="open-time">营业时间：{{merchant.open_time}}</div>
            <div class="addr">地址：{{merchant.mer_addr}}</div>
          </div>
          <div class="no-merchant" v-if="coupon.merchants.length === 0">适用所有商户</div>
        </div>
      </div>
    </div>
    <!--<div class="circles">-->
      <!--<div class="circle"></div>-->
      <!--<div class="circle"></div>-->
      <!--<div class="circle"></div>-->
      <!--<div class="circle"></div>-->
      <!--<div class="circle"></div>-->
      <!--<div class="circle"></div>-->
      <!--<div class="circle"></div>-->
      <!--<div class="circle"></div>-->
      <!--<div class="circle"></div>-->
      <!--<div class="circle"></div>-->
      <!--<div class="circle"></div>-->
      <!--<div class="circle"></div>-->
      <!--<div class="circle"></div>-->
      <!--<div class="circle"></div>-->
      <!--<div class="circle"></div>-->
      <!--<div class="circle"></div>-->
      <!--<div class="circle"></div>-->
      <!--<div class="circle"></div>-->
      <!--<div class="circle"></div>-->
    <!--</div>-->
  </div>
</template>

<script>
import Barcode from '@xkeshi/vue-barcode'
import Qrcode from '@chenfengyuan/vue-qrcode'
import { Swiper, SwiperItem } from 'vux'
import { getRect } from '../../src/assets/js/dom'
export default {
  name: 'coupon_show',
  components: { Barcode, Qrcode, Swiper, SwiperItem },
  inject: ['reload'], // 引入方法
  data () {
    return {
      code: '',
      coupon: {},
      showNotice: false,
      showOrder: false,
      showMerchants: false
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
    if (this.$route.params.code) {
      this.code = this.$route.params.code
    }
  },
  mounted () {
    this.showCouponDetail()
  },
  destroyed () {
  },
  methods: {
    showCouponDetail () {
      this.$vux.loading.show({})
      this.$http.post(this.API.couponShow, {qrcode: this.code}).then(res => {
        this.$vux.loading.hide()
        if (res.id) {
          this.coupon = res
        } else {
        }
      })
    },
    resetHeight () {
      this.$nextTick(() => {
        let clientHeight = document.body.clientHeight
        let contentHeight = getRect(this.$refs.content).height
        let newPageHeight = contentHeight < clientHeight ? clientHeight : contentHeight
        this.$refs.couponShowPage.style.height = (newPageHeight + 40) + 'px'
      })
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
  .coupon-show-page {
    height: 100%;
    background:rgba(255,255,255,1);
    padding: 25px 15px;
    color:rgba(51,51,51,1);
    .content {
      position: relative;
      width:344.5px;
      background:rgba(255,255,255,1);
      box-shadow:0px 0px 20px rgba(89,175,52,0.25);
      padding: 17.5px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      .title {
        margin-top: 14.5px;
        height:31px;
        font-size:20px;
        font-weight:400;
        line-height:31px;
      }
      .face-value {
        margin-top: 15px;
        color: #E04237;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: baseline;
        .currency {
          font-size: 20px;
        }
        .number {
          font-size: 40px;
        }
        .zhe {
          font-size: 20px;
        }
      }
      .description {
        margin-top: 14.5px;
        width:242.5px;
        font-size:13px;
        font-weight:400;
        color:rgba(153,153,153,1);
        text-align: center;
      }
      .use-notice {
        margin-top: 40.5px;
        font-size:14px;
        font-weight:400;
        color:rgba(89,175,52,1);
      }
      .expire-time {
        display: flex;
        justify-content: space-between;
        margin-top: 42px;
        height:44px;
        font-size:13px;
        font-weight:400;
        line-height:44px;
        color:rgba(102,102,102,1);
        width: 100%;
        text-align: left;
        border-top:1px solid rgba(229,229,229,1);
        border-bottom:1px solid rgba(229,229,229,1);
      }
      .item {
        width: 100%;
        border-bottom:1px solid rgba(229,229,229,1);
        .notice-title {
          height: 44px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .txt {
            height:20px;
            font-size:15px;
            font-weight:500;
            line-height:20px;
            color:rgba(51,51,51,1);
          }
          img {
            width: 14px;
            height: 14px;
          }
        }
        .notice-content {
          font-size:13px;
          font-weight:400;
          line-height:17px;
          color:rgba(102,102,102,1);
          text-align: left;
          padding-bottom: 15.5px;
          .mer-name {
            font-size:13px;
            font-weight:bold;
            color:rgba(51,51,51,1);
            margin-bottom: 11.5px;
          }
          .open-time, .addr {
            font-size:13px;
            font-weight:400;
            color:rgba(102,102,102,1);
          }
          .open-time {
            margin-bottom: 5px;
          }
          .addr {
            margin-bottom: 15.5px;
          }
        }
        .order-content {
          font-size:13px;
          font-weight:400;
          line-height:17px;
          color:rgba(102,102,102,1);
          .order-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
        }
        .action-up {
          height: 25px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          img {
            width: 14px;
            height: 14px;
          }
        }
      }
      .store {
        margin-bottom: 15px;
      }
    }
    /*.circles {*/
      /*position: relative;*/
      /*top: -4px;*/
      /*width: 100%;*/
      /*display: flex;*/
      /*justify-content: space-between;*/
      /*padding: 0 20px;*/
      /*.circle {*/
        /*width: 10px;*/
        /*height: 10px;*/
        /*border-radius: 5px;*/
        /*background:rgba(82,173,255,1);*/
      /*}*/
    /*}*/
    /*.content:before {*/
      /*content: '';*/
      /*background:rgba(82,173,255,1);*/
      /*width: 25px;*/
      /*height: 25px;*/
      /*border-radius: 12.5px;*/
      /*position: absolute;*/
      /*top: 135px;*/
      /*left: -12.5px;*/
    /*}*/
    /*.content:after {*/
      /*content: '';*/
      /*background:rgba(82,173,255,1);*/
      /*width: 25px;*/
      /*height: 25px;*/
      /*border-radius: 12.5px;*/
      /*position: absolute;*/
      /*top: 135px;*/
      /*right: -12.5px;*/
    /*}*/
    /*.content:after {*/
      /*content: '';*/
      /*background:rgba(82,173,255,1);*/
      /*width: 25px;*/
      /*height: 25px;*/
      /*border-radius: 12.5px;*/
      /*position: absolute;*/
      /*top: 150px;*/
      /*left: 347px;*/
    /*}*/
  }
</style>
