import {
  getIndex
} from '../../app_requests';
import { assign } from '../../utils/object';

const app = getApp();

Page({
  data: {
    data: null
  },
  _init() {
    let _me = this;

    getIndex(rst => {
      _me.setData({
        data: assign(rst, {
          _globalData: app.globalData
        })
      });

      //do sth. else ...
    });

  }, //end of _init()

  _ready: false,

  onShow() {
    if (!this._ready) return;
    this._init();
    console.log("INDEX INIT@ONSHOW", app.initializing, app.globalData);
  },
  onReady() {
    this._init();
    this._ready = true;
    console.log("INDEX INIT@ONREADY", app.initializing, app.globalData);
  }

})
