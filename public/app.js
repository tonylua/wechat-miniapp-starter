const reqs= require('./app_requests');
const locale = require('./locale');
const {word} = require('utils/locale');

//app.js
App({
  onLaunch(launchParams) {

    let _app = this;
    
    wx.login({
      success(res) {
        if (res.code) {
          _app.globalData['wx_code'] = res.code;
          
          reqs.init(
            _app,
            launchParams
          );

        } else {
          _app.alert(res.errMsg);
        }
      },
    })

  },
  
  globalData: {
    requesting: false,
    locale
  },

  locale_str(key, ...args) {
    let keys = key.split(',');
    let lobj = locale;
    while (keys.length) {
      let k = keys.shift();
      if (k in lobj)
        lobj = lobj[k];
      else
        return "";
    }
    if (typeof lobj !== 'string')
      return "";
    return word.apply(null, [lobj].concat(args));
  },

  alert(msg) {
    wx.showModal({
      title: '',
      content: String(msg),
      showCancel: false
    })
  }
})