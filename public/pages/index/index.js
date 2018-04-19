import {
  getIndex
} from '../../app_requests';
import { assign } from '../../utils/object';
import { word } from '../../utils/locale';

const app = getApp();
const { locale } = app.globalData;

Page({
  data: {
    data: null
  },
  onLoad(opts) {
    let _me = this;
    //方法：请求页面数据
    const initPage = () => getIndex(rst => {
      _me.setData({
        data: assign(rst, {
          _globalData: app.globalData
        })
      });

      //do sth. else ...
    });

    //方法：退出小程序
    const exitApp = () => wx.navigateBack({});

    //申请授权并取得用户信息
    wx.getUserInfo({
      success(res) {

        _me.setData({
          userInfo: res.userInfo
        });

        initPage();
      },
      fail(obj) {
        wx.showModal({
          title: "授权提示",
          content: "要先允许使用[用户信息]才可以登录哦",
          success(res) {
            if (res.confirm)
              wx.openSetting({ //打开小程序设置页面
                success(res) {
                  if (res.authSetting) {
                    initPage();
                  } else {
                    exitApp();
                  }
                },
                fail() {
                  exitApp();
                }
              });
            else
              exitApp();
          }
        })
      }
    }); //end of wx.getUserInfo

  } //end of onLoad()

})
