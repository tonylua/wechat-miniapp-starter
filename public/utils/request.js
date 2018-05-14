const { assign, pick } = require('./object');
const { show_loading, hide_loading } = require('./api');
const { mock_host, mock_port, mock_protocal } = require('../app.config');

const _isValidCode = code=>{
	let c = parseInt(code); 
    return (!isNaN(c)) && (c == 0)
};

let _globalData = {};

const _request = function(method, url, data, success, onfail=null) {
    //console.log(_globalData)
    show_loading();

    getApp().requesting = true;

    const reqData = assign(
      {_from_weapp: 1}, 
      pick(
        getApp().globalData,
        'encryptedData',
        'rawData',
        'iv',
        'path',
        'query',
        'scene',
        'signature',
        'userInfo',
        'code',
        'extConfig',
        'login_state'
      ), 
      data
    );

    wx.request({
      url: `${mock_protocal}://${mock_host}:${mock_port}${url}`,
      data: reqData,
      method: method.toUpperCase(),
      header: {},
      success(res){

        const logicResponse = res.data;
        const {errcode, errlevel, errmsg, result} = logicResponse;
        //自动更新标题
        try {
          const {weapp_pagetitle} = result;
          if (weapp_pagetitle) {

            setTimeout(function () {
              wx.setNavigationBarTitle({
                title: weapp_pagetitle
              });
            }, 500);
          }
        } catch(ex) {}
        //报错页面
        if (!_isValidCode(errcode)) {
          if (onfail !== null) { //自定义
            onfail(logicResponse);
          } else if (errlevel && errlevel === 'alert') {
            getApp().alert(errmsg, ()=>{
              if (result.hasOwnProperty('routeAfterAlert')) {
                wx.navigateTo({url: result.routeAfterAlert});
              }
            });
          } else { //默认
            let url = `/pages/msg/msg?code=${ errcode }&message=${ errmsg }`;
            if (result && 'weapp_buttons' in result) {
              url += `&buttons=${ encodeURIComponent(JSON.stringify(result.weapp_buttons)) }`;
            }
            if (result && 'weapp_iconUrl' in result) {
              url += `&icon=${ encodeURIComponent(result.weapp_iconUrl) }`;
            }
            wx.navigateTo({url});
          }
          return;
        }
        //成功回调
        if (typeof success === 'function') {
          success(result);
        }
      },
      fail(res) {
        console.log(res);
      },
      complete(res) {
        getApp().requesting = false;
        
        hide_loading();
      }
    })
}

module.exports = {
    configUtil(app) {
        _globalData = app.globalData;
    },
    request: _request
}
