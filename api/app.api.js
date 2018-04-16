const { random } = require('lodash');

/*应用全局*/
module.exports = (app, prefix)=>{

  /**
   * 获得全局数据
   */

  app.get(`${prefix}/`, function(req, res) {

    //初始化请求中，会传入场景值等信息
    //https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html
    const {
      path,
      query,
      scene
    } = req.params;
    
    res.json({

      errcode: 0, //random(0, 1),
      errmsg: ':)',
      result: {

        //返回一些app初始化时的全局信息

      }
    });
  });
}