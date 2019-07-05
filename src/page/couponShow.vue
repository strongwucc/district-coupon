<template>
  <div class="coupon-show-page" ref="couponShowPage">
    <div class="content" ref="content">
      <div class="title">{{coupon.title}}</div>
      <div class="description">{{coupon.description}}</div>
      <div class="code" v-if="coupon.id">
        <swiper dots-position="center" height="170px">
          <swiper-item>
            <qrcode :value="coupon.qrcode" :options="{ width: 120, margin: 0 }"></qrcode>
          </swiper-item>
          <swiper-item>
            <barcode :value="coupon.qrcode" :options="{ displayValue: true, height: 54, width: 1.8, fontSize: 12, textMargin: 10}"></barcode>
          </swiper-item>
        </swiper>
      </div>
      <div class="get-limit">每人限购{{coupon.get_limit}}张</div>
      <div class="expire-time">有效期：{{coupon.begin_date_time}}-{{coupon.end_date_time}}</div>
      <div class="item order-info is-first" v-if="coupon.order && coupon.order.orderNo">
        <div class="notice-title" @click.stop="showOrder = true;resetHeight()">
          <span class="txt">订单详情</span>
          <img v-show="!showOrder" src="../assets/img/base/icon_arrow_down@2x.png"/>
        </div>
        <div v-show="showOrder" class="order-content">
          <div class="order-item">
            <span>实付款</span>
            <span>{{coupon.order.payAmount|formatMoney}}元</span>
          </div>
          <div class="order-item">
            <span>订单编号</span>
            <span>{{coupon.order.orderNo}}</span>
          </div>
          <div class="order-item">
            <span>支付时间</span>
            <span>{{coupon.order.tranRime}}</span>
          </div>
        </div>
        <div v-show="showOrder" class="action-up" @click.stop="showOrder = false;resetHeight()"><img src="../assets/img/base/icon_arrow_up@2x.png"/></div>
      </div>
      <div class="item notice" :class="{'is-first': !coupon.order || !coupon.order.orderNo}">
        <div class="notice-title" @click.stop="showNotice = true;resetHeight()">
          <span class="txt">使用须知</span>
          <img v-show="!showNotice" src="../assets/img/base/icon_arrow_down@2x.png"/>
        </div>
        <div v-show="showNotice" class="notice-content">{{coupon.notice}}</div>
        <div v-show="showNotice" class="action-up" @click.stop="showNotice = false;resetHeight()"><img src="../assets/img/base/icon_arrow_up@2x.png"/></div>
      </div>
      <div class="item store">
        <div class="notice-title">
          <span class="txt">适用门店</span>
          <img src="../assets/img/base/icon_arrow_down@2x.png"/>
        </div>
      </div>
    </div>
    <div class="circles">
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
    </div>
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
      showOrder: false
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
    background:rgba(82,173,255,1);
    padding: 25px 15px;
    color:rgba(51,51,51,1);
    .content {
      position: relative;
      width:344.5px;
      background:rgba(255,255,255,1);
      padding: 17.5px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      .title {
        margin-top: 14.5px;
        height:31px;
        font-size:22px;
        font-weight:bold;
        line-height:31px;
      }
      .description {
        margin-top: 14.5px;
        width:242.5px;
        font-size:13px;
        font-weight:400;
        line-height:39px;
        color:rgba(153,153,153,1);
        text-align: center;
      }
      .code {
        height: 191px;
        padding-top: 50px;
        width: 100%;
        .vux-slider {
          /*width: 207px;*/
          width: 100%;
        }
      }
      .get-limit, .expire-time {
        margin-top: 20px;
        height:18.5px;
        font-size:13px;
        font-weight:400;
        line-height:18.5px;
        color:rgba(102,102,102,1);
        width: 100%;
        text-align: left;
      }
      .expire-time {
        margin-top: 10px;
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
            font-size:14px;
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
      .is-first {
        margin-top: 15.5px;
        border-top:1px dashed rgba(229,229,229,1);
      }
      .store {
        margin-bottom: 15px;
      }
    }
    .circles {
      position: relative;
      top: -4px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      .circle {
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background:rgba(82,173,255,1);
      }
    }
    .content:before {
      content: '';
      background:rgba(82,173,255,1);
      width: 25px;
      height: 25px;
      border-radius: 12.5px;
      position: absolute;
      top: 135px;
      left: -12.5px;
    }
    .content:after {
      content: '';
      background:rgba(82,173,255,1);
      width: 25px;
      height: 25px;
      border-radius: 12.5px;
      position: absolute;
      top: 135px;
      right: -12.5px;
    }
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
