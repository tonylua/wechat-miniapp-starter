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
    onButtonClick(e) {
      const r = e.currentTarget.dataset.route
      wx.redirectTo({
        url: r,
        fail() {
          wx.showModal({
            title: '提示',
            content: `无法跳转到 ${r}`,
            showCancel: false
          })
        }
      });
    }
});