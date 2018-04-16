const show_loading = (msg='loading')=>{
  if (wx.showLoading) {
    wx.showLoading({
      title: msg,
    })
  } else {
    wx.showToast({
      title: msg,
    })
  }
};

const hide_loading = () => {
  if (wx.hideLoading) {
    wx.hideLoading()
  } else {
    wx.hideToast()
  }
};

module.exports = {
  show_loading,
  hide_loading
};