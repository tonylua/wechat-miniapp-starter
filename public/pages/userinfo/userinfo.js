const app = getApp();

Page({
    data: {
    },
    onLoad(opts) {
        const { message, button } = opts;
        this.setData({
            message,
            button
        });
    },
    onUserInfo(res) {
      const {errMsg} = res.detail;
      const isFail = errMsg !== 'getUserInfo:ok';
      if (isFail) return;
      app.onUserinfoGot(res.detail);
    }
});