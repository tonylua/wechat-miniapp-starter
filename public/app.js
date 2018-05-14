const { assign } = require('utils/object');
const appSession = require('./app_session');
const locale = require('./locale');

let _app = null;

//app.js
App({
  
  locale,
  requesting: false,
  globalData: {},
  
  onLaunch(launchParams) {
    console.log('app.js onLaunch', launchParams)
    _app = this;
    wx.setStorageSync('launch_params', launchParams);
    appSession.checkAfterAppLaunch(_app, launchParams);
  },

  onShow(launchParams) {
    console.log('app onShow', launchParams, getCurrentPages().map(p=>p.route));

    wx.setStorageSync('launch_params', launchParams);

    if (_app && _app.globalData) {
      assign(_app.globalData, launchParams);
    }
    
    if (getCurrentPages().length > 1) {
      wx.reLaunch({
        url: '/pages/index/index',
        complete() {
          console.log('reLaunch in app_onShow ok');
        }
      });
    }
  },

  alert(msg, callback=null) {
    wx.showModal({
      title: '',
      content: String(msg),
      showCancel: false,
      success(res) {
        if (res.confirm && callback) {
          callback();
        }
      }
    })
  },

  showMessagePage(errcode=0, errmsg='', buttons=[], iconUrl=null) {
    const c = parseInt(errcode);
    if (isNaN(c)) throw new Error('wrong errcode', errcode);

    const m = encodeURIComponent(errmsg);

    if (buttons 
      && (typeof buttons === 'object') 
      && !Array.isArray(buttons) ) {
      buttons = [buttons];
    }

    if (buttons && buttons.length && !buttons[0].hasOwnProperty('label'))
      throw new Error('wrong buttons', buttons);

    let url = `/pages/msg/msg?code=${c}&message=${m}`;
    if (buttons && buttons.length) {
      url += `&buttons=${ encodeURIComponent(JSON.stringify(buttons)) }`;
    }
    if (iconUrl) {
      url += `&icon=${iconUrl}`;
    }

    wx.navigateTo({url});
  },

  //普通请求前校验失败后的重新登录
  reLogin() {
    appSession.onSessionFail();
  },

  //用户已经授权后(由userinfo页面调用)
  onUserinfoGot(userinfo) {
    appSession.onUserinfoGot(userinfo);
  }
})