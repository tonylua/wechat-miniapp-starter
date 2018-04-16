// components/countdown/countdown.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    timeto: {
      type: Number,
      value: 0
    },
    now: {
      type: Number,
      value: Date.now()
    },
    interval: {
      type: Number,
      value: 1000
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hours: 0,
    minutes: 0,
    seconds: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
  },

  ready() {
    const { timeto, now, interval } = this.properties;
    let diff = timeto - now;
    if (diff <= 0) return;

    const _me = this;

    this._itv = setInterval(
      function() {
        if (diff <= 0) {
          clearInterval(_me._itv);
          _me.triggerEvent('Finish', {}, {});
          return;
        }

        const
          h = parseInt( diff / 1000 / 60 / 60 ),
          m = parseInt( (diff - h*1000*60*60) / 1000 / 60 ),
          s = parseInt( (diff - h*1000*60*60 - m*1000*60) / 1000 );

        _me.setData({
          hours: h,
          minutes: m,
          seconds: s
        });

        diff -= interval;
      },
      interval
    );
  },

  detached() {
    clearInterval(this._itv);
  }
})
