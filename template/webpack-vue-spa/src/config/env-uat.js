// uat环境配置文件

export default {
  api_base: '',
  wechat: {
    responseType: 'code',
    scope: 'snsapi_base',
    redirectUri: 'http://yue.yodafone.cn/nihao-wx-redirect',
    appid: 'wxc88ab6b54722e29f'
  },
  payGate: {
    wechat: 'http://wx.yodafone.cn/wx/wx_wap_pay/WxPayOrder.php',
    paypal: 'http://wx.yodafone.cn/wx/wx_wap_pay/PayGate.php',
    alipay: 'http://my.yodafone.cn/wx/wx_wap_pay/PayGate.php'
  }
};
