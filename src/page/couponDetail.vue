<template>
  <div class="coupon-detail-page" ref="couponDetailPage">
    <div class="content" ref="content">
      <div class="left-count">
        剩余
        <span>{{coupon.quantity}}</span>张
      </div>
      <div class="title">{{coupon.title}}</div>
      <div class="face-value">
        <span class="currency" v-if="coupon.card_type !== 'DISCOUNT'">￥</span>
        <span class="number">
          <template v-if="coupon.card_type === 'DISCOUNT'">{{NP.divide(coupon.discount, 10)}}</template>
          <template v-else>{{coupon.reduce_cost|formatMoney(0)}}</template>
        </span>
        <span class="zhe" v-if="coupon.card_type === 'DISCOUNT'">折</span>
      </div>
      <div class="description">{{coupon.description}}</div>
      <div
        class="btn"
        v-if="coupon.user_count > 0 && coupon.user_count >= coupon.get_limit"
        :class="{'yilin': true, 'need-buy': coupon.is_buy === '2'}"
        @click.stop="showCoupon"
      >前往我的券包</div>
      <div
        class="btn"
        v-else-if="coupon.is_buy === '2' && coupon.quantity > 0"
        :class="{'need-buy': coupon.is_buy === '2', 'no-left': coupon.quantity <= 0}"
        @click.stop="receive(coupon.id)"
      >立即购买</div>
      <div
        class="btn"
        v-else-if="coupon.is_buy === '1' && coupon.quantity > 0"
        :class="{'need-buy': coupon.is_buy === '2', 'no-left': coupon.quantity <= 0}"
        @click.stop="receive(coupon.id)"
      >我要领</div>
      <div
        class="btn"
        v-else-if="coupon.quantity <= 0"
        :class="{'need-buy': coupon.is_buy === '2', 'no-left': coupon.quantity <= 0}"
      >已售罄</div>
      <div class="get-limit">
        每人限购{{coupon.get_limit}}张
        <template
          v-if="coupon.day_get_limit > 0"
        >，每日限领{{coupon.day_get_limit}}张</template>
      </div>
      <div class="limit-time">
        <div class="expire-time">
          <span>有效期：</span>
          <span>{{coupon.expire_date}}</span>
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
      <div class="item notice">
        <div class="notice-title" @click.stop="showNotice = !showNotice;resetHeight()">
          <span class="txt">使用须知</span>
          <img v-show="!showNotice" src="../assets/img/base/icon_arrow_down@2x.png" />
          <img v-show="showNotice" src="../assets/img/base/icon_arrow_up@2x.png" />
        </div>
        <div v-show="showNotice" class="notice-content">{{coupon.notice}}</div>
      </div>
      <div class="item store">
        <div class="notice-title" @click.stop="showMerchants = !showMerchants;resetHeight()">
          <span class="txt">适用商户</span>
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
import BScroll from "better-scroll";
import { baseRedirectUrl, appId, oauthBaseUrl } from "../../src/config/env";
import { getRect } from "../../src/assets/js/dom";
import Valid from "../utils/valid";
export default {
  name: "coupon_detail",
  components: {},
  inject: ["reload"], // 引入方法
  data() {
    return {
      pcId: "",
      coupon: {},
      showNotice: false,
      showMerchants: false,
      posting: false,
      scroll: ""
    };
  },
  computed: {},
  watch: {},
  created() {
    if (this.$route.params.pcId) {
      this.pcId = this.$route.params.pcId;
    }
  },
  mounted() {
    this.getCouponDetail();
  },
  destroyed() {},
  methods: {
    // 初始化滚动
    initScroll() {
      if (!this.$refs.couponDetailPage) {
        return;
      }
      this.$refs.couponDetailPage.style.minHeight = `${getRect(
        this.$refs.couponDetailPage
      ).height + 1}px`;
      let options = {
        probeType: 1,
        click: true,
        pullUpLoad: false
      };
      this.scroll = new BScroll(this.$refs.couponDetailPage, options);
    },
    refresh() {
      // 代理better-scroll的refresh方法
      this.scroll && this.scroll.refresh();
    },
    getCouponDetail() {
      this.$vux.loading.show({});
      this.$http.post(this.API.couponDetail, { pcid: this.pcId }).then(res => {
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
    receive(pcid) {
      if (this.posting) {
        return false;
      }

      this.$vux.loading.show({});
      this.posting = true;
      this.$http
        .post(this.API.receiveCoupon, {
          pcid: pcid,
          frontUrl: baseRedirectUrl + "/coupon.html"
        })
        .then(res => {
          this.$vux.loading.hide();
          this.posting = false;
          if (typeof res.payUrl === "undefined") {
            if (res.status_code === 401) {
              this.$vux.toast.show({
                type: "text",
                text: '<span style="font-size: 14px">未登录</span>',
                position: "middle"
              });
              if (Valid.check_weixin()) {
                setTimeout(() => {
                  let redirect = this.$router.currentRoute.fullPath;
                  let redirectUri = baseRedirectUrl + "/wechat.html";
                  // let oauthUrl = 'http://wxgw.yklsh.etonepay.com/authorize?etone_id=' + appId + '&redirect_uri=' + encodeURIComponent(redirectUri) + '&scope=snsapi_userinfo&state=' + encodeURIComponent(redirect)
                  // let oauthUrl =
                  //   "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
                  //   appId +
                  //   "&redirect_uri=" +
                  //   encodeURIComponent(redirectUri) +
                  //   "&response_type=code&scope=snsapi_userinfo&state=" +
                  //   encodeURIComponent(redirect) +
                  //   "#wechat_redirect";
                  let oauthUrl =
                    oauthBaseUrl +
                    "/weixin_redirect?redirect_uri=" +
                    encodeURIComponent(redirectUri) +
                    "&redirect=" +
                    encodeURIComponent(redirect);
                  window.location.href = oauthUrl;
                }, 2000);
              }
              return false;
            } else {
              let message = res.message ? res.message : "未知错误";
              this.$vux.toast.show({
                type: "text",
                text: '<span style="font-size: 14px">' + message + "</span>",
                position: "middle"
              });
              return false;
            }
          } else if (res.payUrl === "") {
            this.$vux.toast.show({
              type: "text",
              text: '<span style="font-size: 14px">领取成功</span>',
              position: "middle"
            });
            this.coupon.quantity = this.coupon.quantity - 1;
            this.coupon.user_count = this.coupon.user_count + 1;
          } else {
            window.location.href = res.payUrl;
          }
        });
    },
    showCoupon() {
      this.$router.push("/my_coupons");
    },
    resetHeight() {
      this.$nextTick(() => {
        // let clientHeight = document.body.clientHeight
        // let contentHeight = getRect(this.$refs.content).height
        // let newPageHeight = contentHeight < clientHeight ? clientHeight : contentHeight
        // this.$refs.couponDetailPage.style.height = (newPageHeight + 40) + 'px'
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
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/*Safari 和 Chrome:*/
@-webkit-keyframes myopacity {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.coupon-detail-page {
  height: 100%;
  background: rgba(255, 255, 255, 1);
  padding: 25px 15px;
  color: rgba(51, 51, 51, 1);
  .content {
    position: relative;
    width: 345px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 20px rgba(89, 175, 52, 0.25);
    padding: 17.5px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    .left-count {
      width: 100%;
      height: 20px;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      text-align: right;
      span {
        color: #f95349;
      }
    }
    .title {
      margin-top: 14.5px;
      height: 31px;
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
      /*line-height:39px;*/
      color: rgba(153, 153, 153, 1);
      text-align: center;
    }
    .btn {
      margin-top: 20px;
      width: 295px;
      height: 40px;
      background: rgba(89, 175, 52, 1);
      border-radius: 22px;
      font-size: 16px;
      font-weight: 400;
      line-height: 40px;
      color: rgba(255, 255, 255, 1);
    }
    .no-left {
      background: rgba(221, 221, 221, 1);
    }
    .yilin {
      background: rgba(247, 255, 243, 1);
      border: 1px solid rgba(89, 175, 52, 1);
      color: rgba(89, 175, 52, 1);
    }
    .get-limit {
      margin-top: 19px;
      font-size: 13px;
      font-weight: 400;
      color: rgba(235, 156, 87, 1);
    }
    .limit-time {
      margin-top: 30px;
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
          font-size: 14px;
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
  /*background:rgba(89,175,52,1);*/
  /*}*/
  /*}*/
  /*.content:before {*/
  /*content: '';*/
  /*background:rgba(255,255,255,1);*/
  /*box-shadow:0px 0px 20px rgba(89,175,52,0.1) inset;*/
  /*width: 12.5px;*/
  /*height: 25px;*/
  /*border-radius: 0 12.5px 12.5px 0;*/
  /*position: absolute;*/
  /*top: 135px;*/
  /*left: 0px;*/
  /*}*/
  /*.content:after {*/
  /*content: '';*/
  /*background:rgba(89,175,52,1);*/
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
