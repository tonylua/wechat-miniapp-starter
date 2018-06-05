const {assign} = require('./object');

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

const promisify = wxFunc=>{
  if (typeof wxFunc !== 'function') {
    throw new Error('[promisify] target is not a function!');
  }

  return (setting)=>{
    console.log('[api.js] promisify ', setting);
    return new Promise( (resolve, reject)=>{
      const enhancedSetting = assign({}, setting, {
        success(res) {
          resolve(res);
        },
        fail(res) {
          reject(res);
        }
      });
      if (setting && setting.hasOwnProperty('success')) {
        enhancedSetting.success = res=>{
          setting.success(res);
          resolve(res);
        };
      }
      if (setting && setting.hasOwnProperty('fail')) {
        enhancedSetting.fail = res=>{
          setting.fail(res);
          resolve(res);
        };
      }
      wxFunc.call(wx, enhancedSetting);
    } );
  };
};

if (!Promise.prototype.finally) {
  const shim = {
    fin(callback) {
      const _promise = this;
      return Promise.prototype.then.call(
        _promise,
        x=> new Promise(resolve=>resolve( callback() )).then( ()=>x ),
        e=> new Promise(resolve=>resolve( callback() )).then( ()=>{throw e;} )
      );
    }
  };
  Object.defineProperty(Promise.prototype, 'finally', {
    configurable: true,
    writable: true,
    value: shim.fin
  });
}

module.exports = {
  show_loading,
  hide_loading,
  promisify
};