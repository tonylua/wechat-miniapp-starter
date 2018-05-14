const { assign, random } = require('lodash');



const init_data = {
  login_confirm: {
    msg: `为了不影响使用会员等功能，请求允许获取您的头像、昵称等基本信息！`,
    btn: `允许`
  },

  //...其他全局初始化数据
};


/*应用全局*/
module.exports = (app, prefix)=>{

  /**
   * 获得全局数据
   */
  app.get(`${prefix}/`, function(req, res) {

    //初始化请求中，会传入场景值等信息
    //https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html
    //另外也传入了 
    //  wx.login() 获取的 code 等
    //  https://developers.weixin.qq.com/miniprogram/dev/api/api-login.html#wxloginobject
    //  wx.getExtConfigSync() 获取的第三方平台自定义数据字段等
    //  https://developers.weixin.qq.com/miniprogram/dev/api/ext-api.html#wxgetextconfigsync
    //以及可能存在的上一次存在本地的 login_state
    const {
      path,
      query,
      scene,
      code,
      login_state
    } = req.query;
    
    console.log(`app init: scene: ${scene}, code: ${code}`, login_state);

    // do sth. here ...
    
    //此次访问是否在有效登录态下
    // 根据首次的 code 等，或后续打开的 login_state 等决定
    const isLoginStateValid = 1; //random(0,1); 
    
    res.json({

      errcode: 0, //random(0, 1),
      errmsg: ':)',
      result: isLoginStateValid
        ? assign({
          login_state: {
            foo: 'bar' + random(10, 99)
          },
        }, init_data)
        : init_data
    });
  });

  /**
   * 授权后登录
   */
  app.post(`${prefix}/login`, function(req, res) {

    //传入了 
    //  wx.getUserInfo() 获取的 encryptedData 等
    //  https://developers.weixin.qq.com/miniprogram/dev/api/open.html#wxgetuserinfoobject
    const {
      path,
      query,
      scene,
      code,
      encryptedData,
      iv,
      signature,
      userInfo
    } = req.body;
    
    console.log(`app login: encryptedData: ${encryptedData}, scene: ${scene}, code: ${code}`);

    res.json({
      errcode: 0, //random(0, 1),
      errmsg: ':)',
      result: assign({
          login_state: {
            foo: 'bar' + random(10, 99)
          },
        }, init_data)
    });
  });

};