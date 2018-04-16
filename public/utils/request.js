const { assign } = require('./object');
const { show_loading, hide_loading } = require('./api');

const _isValidCode = code=>{
	let c = parseInt(code); 
    return (!isNaN(c)) && (c == 0)
};

let _globalData = {};

const _request = function(method, url, data, success, onfail=null) {
    //console.log(_globalData)
    show_loading();

    _globalData.requesting = true;
    wx.request({
      url: `http://localhost:7001${url}`,
      data: assign(
        data, 
        {
          _from_weapp: 1,
          code: _globalData['wx_code']
          // openid: wx.getStorageSync('openid')
        }
      ),
      method,
      header: {},
      success(res){
        // if (res.statusCode == 401) {
        //   setTimeout(function() {
        //     if (wx.reLaunch)
        //       wx.reLaunch({
        //         url: '/pages/login/login',
        //         onfail(ex) {
        //           console.error(ex);
        //         }
        //       });
        //     else
        //       wx.redirectTo({
        //         url: '/pages/login/login',
        //         onfail(ex) {
        //           console.error(ex);
        //         }
        //       })
        //   }, 500);
        //   return;
        // }

        const logicResponse = res.data;
        const {errcode, errmsg, result} = logicResponse;
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
          } else { //默认
            let url = `/pages/msg/msg?code=${ errcode }&message=${ errmsg }`;

            if (result && 'weapp_buttons' in result) {
                url += `&buttons=${ encodeURIComponent(JSON.stringify(result.weapp_buttons)) }`;
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
        _globalData.requesting = false;
        
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
