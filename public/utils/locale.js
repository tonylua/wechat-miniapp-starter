module.exports = {
  /**
 * 获取基于模板的文本值
 * @param  {String} tmpl - 文本模板，格式为 'hello{0},world{1}'
 * @param  {...String} args - 用于替换的若干参数
 * @return {String}
 */
  word(tmpl, ...args) {
    let rtn = tmpl.substr(0);
    if (args.length) {
      let flagArr = tmpl.match(/\{\d+\}/g); //{1},{0},{2}...
      if (flagArr) {
        //剔除数组重复项用
        let realNeedLeng = flagArr.filter((ele, idx) => flagArr.indexOf(ele) == idx).length;
        if (args.length != realNeedLeng) {
          throw new Error(`[i18n] Error: ${tmpl} need ${realNeedLeng} parameters, but ${args.length} received`);
        }
        for (let ii = 0; ii < realNeedLeng; ii++)
          rtn = rtn.replace(new RegExp("\\{" + ii + "\\}", "g"), args[ii]);
      }
    }
    return rtn;
  }
}