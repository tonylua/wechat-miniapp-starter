const { assign, omit } = require('utils/object');
const { init, login }= require('./app_requests');

let _app = null;
let _params = null;

//方法：扩展 _params
const extendMyParams = (...args)=>{
  _params = assign.apply({}, [_params].concat(args));
  _params = omit(_params, 'errMsg', 'rawData'/*, 'requesting', 'locale'*/);
};

//方法：登录并获取第三方信息
const loginAndGetExt = (succCallback, failCallback)=>{
  wx.login({
    success(loginRes) {
      if (!loginRes.code) {
        failCallback(loginRes.errMsg);
        return;
      }
      wx.getExtConfig({
        success(extCfgRes) {
          const obj = assign({}, loginRes, extCfgRes);
          console.log('[app.js] login & getExtConfig', obj);
          succCallback(obj);
        }, //end of getExtConfig-success
        fail() {
          failCallback(_app.locale.userInfoModal.extFail);
        }
      });
    }, //end of login-success
    fail(ex) {
      failCallback(ex);
    }
  });
};

//方法：session失效后的重新请求
const onSessionFail = ()=>{
  const launchParams = wx.getStorageSync('launch_params');
  const localLoginState = wx.getStorageSync('login_state');
  const localUserInfo = wx.getStorageSync('user_info');

  loginAndGetExt(obj=>{
    extendMyParams(launchParams, obj, localUserInfo);

    init(_app, _params, result=>{ //fetch
      console.log('[app.js] fetch init', _params, result);

      wx.setStorageSync('global_data', result);
      console.log('save global_data to local', result);

      const isValid = !!localUserInfo
        && result.hasOwnProperty('login_state');

      if (isValid) {
        extendMyParams(result);
        finish(false); //case b
        return;
      }

      confirmLogin(result);
    });
  }, errMsg=>{
    _app.alert(errMsg);
  });
};

//方法：提示用户需要授权
const confirmLogin = (result)=>{
  // wx.removeStorageSync('global_data');
  wx.removeStorageSync('login_state');
  wx.removeStorageSync('user_info');

  console.log('[app.js] need login', result.login_confirm);
  const { msg, btn } = result.login_confirm;

  setTimeout(()=>{
    wx.reLaunch({
      url: `/pages/userinfo/userinfo?code=401&message=${msg}&buttons=`
        + encodeURIComponent(JSON.stringify([{
            label: btn,
            type: 'primary',
            opentype: 'getUserInfo'
          }])),
      success() {
        console.log('[app.js] ========== jump to login', msg, btn);
      },
      fail(ex) {
        console.log(ex)
      }
    });
  }, 500);
};

//方法：结束初始化,转入首页
const finish = (isFromLocal=false)=>{
  if (!isFromLocal) {
    wx.setStorageSync('login_state', _params.login_state);
    assign(_app.globalData, _params);
  }

  console.log('reLaunch after login()', _params.path, getCurrentPages(), _app.globalData);

  let url = _params.path.replace(/^\/*/, '/');
  if (_params.query) {
    url += '?' + Object.keys(_params.query)
      .map(item=>`${item}=${encodeURIComponent(
        decodeURIComponent(_params.query[item])
      )}`)
      .join('&');
  }
  
  setTimeout(()=>{
    wx.reLaunch({
      url,
      success() {
        console.log("reLaunch succ", _app.globalData.login_state);
      },
      fail(ex) {
        console.log("reLaunch fail", ex)
      },
      complete() {
        console.log('CHK SESSION FINISH', _app.initializing);
        if (_app.hasOwnProperty('initializing')) {
          _app.initializing = false;
          delete _app.initializing;
        }
      }
    });
  }, 500);

};

//方法：用户已经授权后(由userinfo页面调用)
const onUserinfoGot = (userinfo)=>{
  console.log('用户已经授权后', userinfo);

  wx.setStorageSync('user_info', userinfo);
  extendMyParams(userinfo);

  loginAndGetExt(obj=>{
    extendMyParams(obj);

    login(_app, _params, result=>{ //fetch
      console.log('[app.js] fetch login', _params, result);

      extendMyParams(result);
      finish(false); //case c
    });
  }, errMsg=>{
    _app.alert(errMsg);
  });
};

//方法：打开 App 后的身份检查
const checkAfterAppLaunch = (app, launchParams)=>{ 
  _app = app;
  _app.initializing = true;

  wx.checkSession({
    success() {
      const localGlobalData = wx.getStorageSync('global_data');
      const localLoginState = wx.getStorageSync('login_state');
      const localUserInfo = wx.getStorageSync('user_info');

      console.log("[app.js] onLaunch checkSession succ", localGlobalData, localLoginState, localUserInfo);

      if (localUserInfo && localLoginState) {

        extendMyParams(
          localGlobalData,
          launchParams,
          {login_state: localLoginState},
          localUserInfo
        );

        assign(_app.globalData, _params);
        console.log('use local', _params);
        finish(true); //case a

        return;
      }

      onSessionFail();
    },
    fail() {
      console.log("[app.js] onLaunch checkSession fail", _params);
      onSessionFail();
    }
  });
};


module.exports = {
  checkAfterAppLaunch,
  onUserinfoGot,
  onSessionFail
};