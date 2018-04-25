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

    getIndex(rst => {
      _me.setData({
        data: assign(rst, {
          _globalData: app.globalData
        })
      });

      //do sth. else ...
    });

  } //end of onLoad()

})
