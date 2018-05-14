/**
 * 获取基于模板的文本值
 * @param  {String} tmpl - 文本模板，格式为 'hello{0},world{1}'
 * @param  {...String} args - 用于替换的若干参数
 * @return {String}
 */
const word = (tmpl, ...args)=>{
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
};

/**
 * 封装 word()，提供更简化的操作
 * @param {Object} lobj - 语言包对象
 * @param  {String} key - 由”.“分隔的语言包key值路径字符串
 * @param  {...String} args - 用于替换的若干参数
 * @return {String}
 */
const locale_str = (lobj, key, ...args)=>{
  let keys = key.split('.');
  while (keys.length) {
    let k = keys.shift();
    if (k in lobj)
      lobj = lobj[k];
    else
      return "";
  }
  if (typeof lobj !== 'string')
    return "";
  return word.apply(null, [lobj].concat(args));
};

module.exports = {
  word,
  locale_str
};