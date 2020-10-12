<template>
  <div class="coupon-show-page" ref="couponShowPage">
    <div class="content" ref="content">
      <div class="title">{{coupon.title}}</div>
      <div class="face-value">
        <span class="currency" v-if="coupon.card_type !== 'DISCOUNT'">￥</span>
        <span class="number">
          <template v-if="coupon.card_type === 'DISCOUNT'">{{(coupon.discount / 10)}}</template>
          <template v-else>{{coupon.reduce_cost|formatMoney(0)}}</template>
        </span>
        <span class="zhe" v-if="coupon.card_type === 'DISCOUNT'">折</span>
      </div>
      <div class="description">{{coupon.description}}</div>
      <div class="use-time" v-if="coupon.use_time">
        <span>使用时间：</span>
        <span>{{coupon.use_time}}</span>
      </div>
      <div class="use-notice" v-else>
        <!-- 请扫描商家付款二维码使用优惠券 -->
        <div class="barcode" @click="blowBarcode = true">
          <barcode :value="coupon.qrcode" :options="{ displayValue: true, height: 54, width: 1.5, fontSize: 12, textMargin: 10}"></barcode>
        </div>
        <div class="qrcode" @click="blowQrcode = true">
          <qrcode :value="coupon.qrcode" :options="{ width: 120, margin: 0 }"></qrcode>
          <div class="qrcode-notice">扫不出来？点击放大</div>
        </div>
      </div>
      <div class="limit-time">
        <div class="expire-time">
          <span>有效期：</span>
          <span>{{coupon.begin_date_time}}-{{coupon.end_date_time}}</span>
        </div>
        <div class="days-weeks">
          <span class="label">可用时间：</span>
          <span
            class="txt"
            v-if="coupon.limit_days_and_weeks.days !== '' || coupon.limit_days_and_weeks.weeks !== ''"
          >
            {{coupon.limit_days_and_weeks.weeks}}
            <template v-if="coupon.limit_days_and_weeks.days">；</template>
            {{coupon.limit_days_and_weeks.days}}
          </span>
          <span class="txt" v-else>有效期内任何时间都可用</span>
        </div>
      </div>
      <div class="item notice is-first">
        <div class="notice-title" @click.stop="showNotice = !showNotice;resetHeight()">
          <span class="txt">使用须知</span>
          <img v-show="!showNotice" src="../assets/img/base/icon_arrow_down@2x.png" />
          <img v-show="showNotice" src="../assets/img/base/icon_arrow_up@2x.png" />
        </div>
        <div v-show="showNotice" class="notice-content">{{coupon.notice}}</div>
      </div>
      <div class="item store">
        <div class="notice-title" @click.stop="showMerchants = !showMerchants;resetHeight()">
          <span class="txt">适用范围</span>
          <img v-show="!showMerchants" src="../assets/img/base/icon_arrow_down@2x.png" />
          <img v-show="showMerchants" src="../assets/img/base/icon_arrow_up@2x.png" />
        </div>
        <div v-show="showMerchants" class="notice-content">
          <div
            class="merchant"
            v-for="(merchant, merchantIndex) in coupon.merchants"
            :key="merchantIndex"
          >
            <div class="mer-name">{{merchant.mer_name}}</div>
            <div class="open-time">营业时间：{{merchant.open_time}}</div>
            <div class="addr">地址：{{merchant.mer_addr}}</div>
          </div>
          <div class="no-merchant" v-if="coupon.merchants.length === 0">全部适用</div>
        </div>
      </div>
    </div>
    <div class="qrcode-popup" :class="{blow: blowQrcode}" @click="blowQrcode = false" v-show="blowQrcode" @touchmove.prevent>
      <qrcode class="qrcode" :value="coupon.qrcode" :options="{ width: 240, margin: 0 }"></qrcode>
    </div>
    <div class="barcode-popup" :class="{blow: blowBarcode}" @click="blowBarcode = false" v-show="blowBarcode" @touchmove.prevent>
      <barcode class="barcode" :value="coupon.qrcode" :options="{ displayValue: true, height: 54, width: 1.5, fontSize: 16, textMargin: 10}"></barcode>
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
import BScroll from "better-scroll";
import Barcode from "@xkeshi/vue-barcode";
import Qrcode from "@chenfengyuan/vue-qrcode";
import { Swiper, SwiperItem } from "vux";
import { getRect } from "../../src/assets/js/dom";
export default {
  name: "coupon_show",
  components: { Barcode, Qrcode, Swiper, SwiperItem },
  inject: ["reload"], // 引入方法
  data() {
    return {
      code: "",
      coupon: {},
      showNotice: false,
      showOrder: false,
      showMerchants: false,
      scroll: "",
      blowQrcode: false,
      blowBarcode: false
    };
  },
  computed: {},
  watch: {},
  created() {
    if (this.$route.params.code) {
      this.code = this.$route.params.code;
    }
  },
  mounted() {
    this.showCouponDetail();
  },
  destroyed() {},
  methods: {
    // 初始化滚动
    initScroll() {
      if (!this.$refs.couponShowPage) {
        return;
      }
      this.$refs.couponShowPage.style.minHeight = `${getRect(
        this.$refs.couponShowPage
      ).height + 1}px`;
      let options = {
        probeType: 1,
        click: true,
        pullUpLoad: false
      };
      this.scroll = new BScroll(this.$refs.couponShowPage, options);
    },
    refresh() {
      // 代理better-scroll的refresh方法
      this.scroll && this.scroll.refresh();
    },
    showCouponDetail() {
      this.$vux.loading.show({});
      this.$http.post(this.API.couponShow, { qrcode: this.code }).then(res => {
        this.$vux.loading.hide();
        if (res.id) {
          this.coupon = res;
        } else {
        }
        this.$nextTick(() => {
          this.initScroll();
        });
      });
    },
    resetHeight() {
      this.$nextTick(() => {
        // let clientHeight = document.body.clientHeight
        // let contentHeight = getRect(this.$refs.content).height
        // let newPageHeight = contentHeight < clientHeight ? clientHeight : contentHeight
        // this.$refs.couponShowPage.style.height = (newPageHeight + 40) + 'px'
        this.refresh();
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../assets/css/common";
@keyframes myopacity {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/*Safari 和 Chrome:*/
@-webkit-keyframes myopacity {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes mysize {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

/*Safari 和 Chrome:*/
@-webkit-keyframes mysize {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

@keyframes myrotate {
  from {
    transform: scale(1) rotate(0deg);
  }
  to {
    transform: scale(2) rotate(90deg);
  }
}

/*Safari 和 Chrome:*/
@-webkit-keyframes myrotate {
  from {
    transform: scale(1) rotate(0deg);
  }
  to {
    transform: scale(2) rotate(90deg);
  }
}

.coupon-show-page {
  height: 100%;
  background: rgba(255, 255, 255, 1);
  padding: 25px 15px;
  color: rgba(51, 51, 51, 1);
  .content {
    position: relative;
    width: 344.5px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 20px rgba(89, 175, 52, 0.25);
    padding: 17.5px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    .title {
      margin-top: 14.5px;
      // height:31px;
      font-size: 20px;
      font-weight: 400;
      line-height: 31px;
    }
    .face-value {
      margin-top: 15px;
      color: #e04237;
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
      width: 242.5px;
      font-size: 13px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      text-align: center;
    }
    .use-notice {
      margin-top: 40.5px;
      margin-bottom: 15px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(89, 175, 52, 1);
      .qrcode-notice {
        color: rgba(153, 153, 153, 1);
        font-size: 12px;
      }
    }
    .use-time {
      margin-top: 57.5px;
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      width: 100%;
      text-align: left;
    }
    .limit-time {
      margin-top: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      border-top: 1px solid rgba(229, 229, 229, 1);
      border-bottom: 1px solid rgba(229, 229, 229, 1);
      .expire-time,
      .days-weeks {
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        width: 100%;
        text-align: left;
      }
      .days-weeks {
        margin-bottom: 15px;
        .txt {
          width: 157.5px;
          text-align: right;
        }
      }
    }
    .item {
      width: 100%;
      border-bottom: 1px solid rgba(229, 229, 229, 1);
      .notice-title {
        height: 44px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .txt {
          height: 20px;
          font-size: 15px;
          font-weight: 500;
          line-height: 20px;
          color: rgba(51, 51, 51, 1);
        }
        img {
          width: 14px;
          height: 14px;
        }
      }
      .notice-content {
        font-size: 13px;
        font-weight: 400;
        line-height: 17px;
        color: rgba(102, 102, 102, 1);
        text-align: left;
        padding-bottom: 15.5px;
        .mer-name {
          font-size: 13px;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          margin-bottom: 11.5px;
        }
        .open-time,
        .addr {
          font-size: 13px;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
        }
        .open-time {
          margin-bottom: 5px;
        }
        .addr {
          margin-bottom: 15.5px;
        }
      }
      .order-content {
        font-size: 13px;
        font-weight: 400;
        line-height: 17px;
        color: rgba(102, 102, 102, 1);
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
  .qrcode-popup,
  .barcode-popup {
    background-color: rgba(255, 255, 255, 1);
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &.blow {
      animation: myopacity 1s;
      .qrcode {
        animation: mysize 1s;
      }
      .barcode {
        animation: myrotate 1s;
        animation-fill-mode:forwards;
        -webkit-animation-fill-mode:forwards;
      }
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
