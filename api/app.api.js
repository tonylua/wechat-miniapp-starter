const { random } = require('lodash');

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
    //  wx.getUserInfo() 获取的 encryptedData 等
    //  https://developers.weixin.qq.com/miniprogram/dev/api/open.html#wxgetuserinfoobject
    //  wx.getExtConfigSync() 获取的第三方平台自定义数据字段等
    //  https://developers.weixin.qq.com/miniprogram/dev/api/ext-api.html#wxgetextconfigsync
    const {
      path,
      query,
      scene,
      code,
      encryptedData,
      iv,
      signature,
      userInfo
    } = req.query;
    
    console.log(`scene: ${scene}, code: ${code}, encryptedData: ${encryptedData}`);

    // do sth. here ...
    
    res.json({

      errcode: 0, //random(0, 1),
      errmsg: ':)',
      result: {

        //返回自定义登录态，之后的每次请求都会携带该信息
        //https://developers.weixin.qq.com/miniprogram/dev/api/api-login.html
        login_state: {
          foo: 'bar' + random(10, 99)
        },

        //返回一些app初始化时的其他全局信息

      }
    });
  });
}