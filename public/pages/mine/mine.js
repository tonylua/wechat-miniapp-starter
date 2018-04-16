//因为tabbar无法动态设置链接，单独设置一个页面
const app = getApp();

Page({
  data: {
  },
  onLoad: function (opts) {
    this.setData({
      page_url: decodeURIComponent(app.globalData.tabbar_mine_url )
    });
  }
})