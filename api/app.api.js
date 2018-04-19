const { random } = require('lodash');

/*应用全局*/
module.exports = (app, prefix)=>{

  /**
   * 获得全局数据
   */

  app.get(`${prefix}/`, function(req, res) {

    //初始化请求中，会传入场景值等信息
    //https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html
    //另外也传入了 wx.login() 获取的 code
    //https://developers.weixin.qq.com/miniprogram/dev/api/api-login.html#wxloginobject
    const {
      path,
      query,
      scene,
      code
    } = req.query;
    
    console.log(`scene: ${scene}, code: ${code}`);
    
    res.json({

      errcode: 0, //random(0, 1),
      errmsg: ':)',
      result: {

        //返回自定义登录态，之后的每次请求都会携带该信息
        //https://developers.weixin.qq.com/miniprogram/dev/api/api-login.html
        login_state: {
          foo: 'bar' + random(10, 99)
        }

        //返回一些app初始化时的其他全局信息

      }
    });
  });
}