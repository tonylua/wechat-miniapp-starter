const { word } = require('../../utils/locale');

//首页秒杀
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    locale: getApp().locale.miaosha,
    word
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCountdownFinish() {
      console.log("[index-miaosha] countdown is finish!")
    }
  }
})
