<template>
  <div class="activity-page">
    <div class="poster">
      <img :src="posterUrl" />
    </div>
    <div class="btn" v-if="loaded" @click.stop="showCouponDetail">点我购买</div>
  </div>
</template>

<script>
export default {
  name: 'activity',
  components: {},
  inject: ['reload'], // 引入方法
  data () {
    return {
      loaded: false,
      pageLimit: 1,
      coupon: null,
      posterUrl: 'http://zjxh.yeemkt.com/activity.jpg'
    }
  },
  computed: {},
  watch: {},
  created () {
    if (this.$route.params.openId) {
      this.openId = this.$route.params.openId
    }
  },
  mounted () {
    this.getCoupon()
  },
  destroyed () {},
  methods: {
    getCoupon () {
      this.loaded = false
      this.$vux.loading.show({})
      this.$http
        .post(this.API.coupons + '?page=1', { page_limit: this.pageLimit })
        .then((res) => {
          this.loaded = true
          this.$vux.loading.hide()
          if (res.data.length > 0) {
            this.coupon = res.data[0]
          }
        })
    },
    showCouponDetail () {
      if (this.coupon) {
        this.$router.push({ path: 'coupon_detail/' + this.coupon.id })
      }
    }
  }
}
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
.activity-page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  .poster {
    img {
      width: 100%;
      height: auto;
    }
  }
  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 50px;
    background: rgba(89, 175, 52, 1);
    font-size: 16px;
    border-radius: 6px;
    color: rgba(255, 255, 255, 1);
    // font-weight: bold;
  }
}
</style>
