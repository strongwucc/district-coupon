module.exports = {
  proxy: {
    '/api': { //将www.exaple.com印射为/apis
      target: 'http://47.116.68.124:8080', // 接口域名
      secure: false, // 如果是https接口，需要配置这个参数
      changeOrigin: true //是否跨域
    }
  }
}
