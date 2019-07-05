<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
    <div class="tabbar" v-show="showTabbar">
      <div class="tabbar-item" @click.stop="$router.push({name: 'home'})">
        <div class="icon">
          <img v-if="routeName === 'home'" src="./assets/img/base/buttom_shouye_press@2x.png"/>
          <img src="./assets/img/base/buttom_shouye_normal@2x.png" v-else/>
        </div>
        <div class="txt" :class="{active: routeName === 'home'}">首页</div>
      </div>
      <div class="tabbar-item" @click.stop="$router.push({name: 'merchant'})">
        <div class="icon">
          <img v-if="routeName === 'merchant'" src="./assets/img/base/buttom_shanghu_press@2x.png"/>
          <img src="./assets/img/base/buttom_shanghu_normal@2x.png" v-else/>
        </div>
        <div class="txt" :class="{active: routeName === 'merchant'}">商户</div>
      </div>
      <div class="tabbar-item" @click.stop="$router.push({name: 'center'})">
        <div class="icon">
          <img v-if="routeName === 'center'" src="./assets/img/base/buttom_huiyuan_press@2x.png"/>
          <img src="./assets/img/base/buttom_huiyuan_normal@2x.png" v-else/>
        </div>
        <div class="txt" :class="{active: routeName === 'center'}">会员</div>
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
      return ['home', 'merchant', 'center'].indexOf(this.routeName) >= 0 ? true : false
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
      padding: 0px 45px;
      background:rgba(255,255,255,1);
      box-shadow:0px -1px 5px rgba(0,0,0,0.1);
      z-index: 99;
      .tabbar-item {
        /*padding-top: 6px;*/
        height: 100%;
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
          font-weight:bold;
          line-height:12px;
          text-align: center;
        }
        .active {
          color:rgba(33,149,252,1);
        }
      }
    }
  }
</style>
