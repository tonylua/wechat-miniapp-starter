//通用的h5壳
Page({
  data: {
  },
  onLoad: function (opts) {
    this.setData({
      page_url: decodeURIComponent(opts.page_url)
    });
  }
})