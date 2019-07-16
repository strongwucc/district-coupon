<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
    <div class="tabbar" v-show="showTabbar">
      <div class="tabbar-item" @click.stop="$router.push({name: 'coupons'})">
        <div class="icon">
          <img v-if="routeName === 'coupons'" src="./assets/img/base/buttom_lingquan_press@2x.png"/>
          <img src="./assets/img/base/buttom_lingquan_normal@2x.png" v-else/>
        </div>
        <div class="txt" :class="{active: routeName === 'coupons'}">领券中心</div>
      </div>
      <div class="tabbar-item" @click.stop="$router.push({name: 'my_coupons'})">
        <div class="icon">
          <img v-if="routeName === 'my_coupons'" src="./assets/img/base/buttom_mycard_press@2x.png"/>
          <img src="./assets/img/base/buttom_mycard_normal@2x.png" v-else/>
        </div>
        <div class="txt" :class="{active: routeName === 'my_coupons'}">我的券包</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide () { // 注册一个方法
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true,
      routeName: 'home'
    }
  },
  watch: {
    '$route': function (newValue, oldValue) {
      this.routeName = newValue.name
    }
  },
  computed: {
    showTabbar: function () {
      return ['coupons', 'my_coupons'].indexOf(this.routeName) >= 0
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';
  #app {
    /*font-family: San Francisco, 'Avenir', Helvetica, Arial, sans-serif;*/
    font-family:PingFang SC;
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #333333;
    background-color: #F2F4F7;
    height: 100%;
    .tabbar {
      display: flex;
      position: fixed;
      justify-content: space-between;
      align-items: center;
      bottom: 0;
      width: 100%;
      height: 49px;
      background:rgba(255,255,255,1);
      box-shadow:0px -1px 5px rgba(0,0,0,0.1);
      z-index: 99;
      .tabbar-item {
        /*padding-top: 6px;*/
        height: 100%;
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        .icon {
          margin-top: 6px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          width: 24px;
          height: 24px;
          img {
            width: 24px;
            height: 24px;
          }
        }
        .txt {
          margin-top: 1px;
          height:14px;
          font-size:10px;
          font-weight:400;
          line-height:12px;
          text-align: center;
        }
        .active {
          color:#59AF34;
        }
        &:first-child {
          border-right: 1px solid rgba(229,229,229,1);
        }
      }
    }
  }
</style>
