const { random } = require('lodash');
const { mock_host, mock_port } = require('../dev.config');

const HOST = `http://${mock_host}:${mock_port}`; //小程序规定引用的图片等必须为https完整绝对路径

/*主页*/
module.exports = (app, prefix)=>{

  /**
   * 获得首页数据
   */
  app.get(`${prefix}/index`, function(req, res) {

    const {
      login_state
    } = req.query;

    console.log('/index', login_state);

    res.json({
      errcode: 0, //random(0, 1),
      errmsg: '很抱歉发生了某些错误',
      errlevel: 'default',
      result: {
        miaosha:  {
          more_url: "http://m.baidu.com",
          current: {
            begin_time: (new Date("2018/04/20 20:07:10")).getTime(),
            pic: "http://p3.ifengimg.com/a/2018_15/1ffe0fd6d36a04c.png",
            title: "内蒙古大瓜子",
            price: random(1,9),
            origin_price: random(10,99),
            currency: '¥',
            url: "http://m.ifeng.com"
          }
        }
      }
    });
  });

}