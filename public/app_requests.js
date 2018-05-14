const { assign } = require('utils/object');
const { request, configUtil } = require('utils/request');
const { mock_prefix } = require('./app.config');

let _retryTimes = 0;

function _chkSessionAndRequest(...args) {
  if (getApp().initializing) return;
  
  const {code} = getApp().globalData;
  const isFakeCode = /\s/.test(code); //不填appid测试时为，"the code is a mock one"，会导致wx.checkSession失败
  if (isFakeCode) {
    request.apply(null, args);
    return;
  }

  wx.checkSession({
    success() {
      console.log("checkSession before request: ok");
      request.apply(null, args);

      _retryTimes = 0;
    }, 
    fail(ex) {
      console.log("checkSession before request: fail, errmsg: %s, retry times: %s", ex.errMsg, _retryTimes);

      if (_retryTimes++ >= 3) {
        _retryTimes = 0;
        return;
      }
      
      getApp().reLogin();
    }
  });
}

//应用初始化
const initApp = (app, paramsWithCode, callback) => request(
  'GET', `${mock_prefix}/`,
  paramsWithCode,
  callback
);
//应用授权后登陆
const loginApp = (app, paramsWithCode, callback) => request(
  'POST', `${mock_prefix}/login`,
  paramsWithCode,
  callback
);

//业务请求：获得首页数据
const getIndex = callback => _chkSessionAndRequest('GET', `${mock_prefix}/index`, {}, callback);

module.exports = {
  init(app, paramsWithCode, callback) {
    configUtil(app);
    assign(app.globalData, paramsWithCode);
    initApp(app, paramsWithCode, callback);
    return this;
  },
  login(app, paramsWithCode, callback) {
    configUtil(app);
    assign(app.globalData, paramsWithCode);
    loginApp(app, paramsWithCode, callback);
    return this;
  },
  getIndex
}