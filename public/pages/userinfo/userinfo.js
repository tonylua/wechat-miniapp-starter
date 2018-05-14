const { omit } = require('../../utils/object');
// const { init }= require('../../app_requests');

const app = getApp();

Page({
    data: {
    },
    onLoad(opts) {
        const { code, message, buttons } = opts;
        this.setData({
            message,
            code,
            buttons: buttons ? JSON.parse(decodeURIComponent(buttons)) : []
        });
    },
    onUserInfo(res) {
      const {errMsg} = res.detail;
      const isFail = errMsg !== 'getUserInfo:ok';
      if (isFail) return;
      app.onUserinfoGot(res.detail);
    },
    onButtonClick(e) {
      const { route, opentype } = e.currentTarget.dataset;
      
      if ("getUserInfo" === opentype) return;

      wx.redirectTo({
        url: route,
        fail() {
          wx.showModal({
            title: '提示',
            content: `无法跳转到 ${route}`,
            showCancel: false
          })
        }
      });
    }
});