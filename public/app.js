const { assign, omit } = require('utils/object');
const {init}= require('./app_requests');
const locale = require('./locale');
const {word} = require('utils/locale');

let _app = null;
let paramsWithCode = null;

//方法：退出小程序
const exitApp = () => wx.navigateBack({});

//回调：取得了login::code以后
const _codeCbk = loginRes=>{
  //申请授权并取得用户信息
  wx.getUserInfo({
    success(userinfoRes) {
      _userinfoCbk(userinfoRes);
    },
    fail(obj) {
      wx.showModal({
        title: locale.userInfoModal.title,
        content: locale.userInfoModal.content,
        success(modalRes) {

          if (modalRes.confirm) {

            wx.openSetting({ //打开小程序设置页面
              success(modalRes) {
                if (modalRes.authSetting["scope.userInfo"]) {
                  wx.getSetting({
                    success(gsRes) {
                      _userinfoCbk(gsRes.authSetting["scope.userInfo"]);
                    },
                    fail() {
                      _app.alert(locale.userInfoModal.fail);
                      exitApp();
                    }
                  });
                } else {
                  exitApp();
                }
              },
              fail() {
                exitApp();
              }
            });

          } else {
            exitApp();
          }

        }
      }) // end of wx.showModal
    }
  }); //end of wx.getUserInfo
};

//回调：取得了userinfo以后
const _userinfoCbk = userinfoRes => {
  //获取第三方平台自定义的数据字段
  wx.getExtConfig({
    success(extCfgRes) {
      paramsWithCode = assign({}, paramsWithCode, userinfoRes, extCfgRes.extConfig);
      paramsWithCode = omit(paramsWithCode, 'errMsg', 'rawData');

      console.log('app.js init', paramsWithCode);
      
      //初始化的ajax请求
      init(_app, paramsWithCode);
    },
    fail() {
      _app.alert(loginRes.errMsg);
    }
  });
};

//app.js
App({
  onShow(launchParams) {

    _app = this;
    
    wx.login({
      success(loginRes) {
        if (loginRes.code) {
          paramsWithCode = assign({}, loginRes, launchParams);
          _codeCbk(loginRes);
        } else {
          _app.alert(loginRes.errMsg);
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