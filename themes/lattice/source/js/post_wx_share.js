(function($) {
  if (window.WechatShareData && window.WechatJSSDKURL && window.wx) {
    $.ajax({
      type: 'get',
      url: window.WechatJSSDKURL,
      data: {
        url: encodeURIComponent(window.location.href.split('#')[0])
      }
    }).done(function (res) {

      window.wx.config({
        debug: false,
        appId: res.appId,
        timestamp: res.timestamp,
        nonceStr: res.nonceStr, 
        signature: res.signature,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
      })
      window.wx.ready(function () {
        window.wx.onMenuShareTimeline(window.WechatShareData)
        window.wx.onMenuShareAppMessage(window.WechatShareData)
        window.wx.onMenuShareQQ(window.WechatShareData)
        window.wx.onMenuShareWeibo(window.WechatShareData)
        window.wx.onMenuShareQZone(window.WechatShareData)
      })
    })
  }
})(jQuery)