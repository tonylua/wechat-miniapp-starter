/**
 * 字符串反转
 * @param  {String} str
 * @return {String}
 * @memberOf mUtils.format
 */
const reverse_str = str => str.split('').reverse().join('');

/**
 * 格式化手机号等，按位插入分隔符
 * @param  {Number|String} target - 目标数字或字符串
 * @param  {Number} [step=4] - 插入分隔符的相隔位数
 * @param  {Boolean} [needReverse=true] - 是否要从右向左进行插入
 * @param  {String} [div=" "] - 分隔符
 * @return {String}
 * @memberOf mUtils.format
 */
const step_str = (target, step = 4, needReverse = false, div = " ") => {
  let
    nStr = target.toString(),
    rst = nStr.replace(/\s/g, ''),
    rTarget = needReverse ? reverse_str(rst) : rst,
    re = new RegExp('(.{' + step + '})', 'g');
  rst = rTarget.replace(re, `$1${div}`);
  rst = needReverse ? reverse_str(rst) : rst;
  rst = trim(rst);
  rst = rst.replace(new RegExp('^\\' + div), '');
  return rst;
};

/**
 * 添加千分位的数字分结号
 * @param  {Number} num - 目标数字
 * @param  {Number} [fix=null] - 如果同时要对小数限制位数则指定其位数
 * @return {String}
 * @memberOf mUtils.format
 */
const knot_num = (num, fix = null) => {
  let n = num;
  if (fix !== null && fix >= 0) {
    n = limit_decimal(n, fix);
  }
  let
    numParts = n.toString().split('.'),
    integralPart = numParts[0],
    decimalPart = numParts.length > 1 ? numParts[1] : null,
    formatedIntegral = step_str(integralPart, 3, true, ','),
    rst;
  if (!decimalPart) return formatedIntegral;
  rst = `${formatedIntegral}.${decimalPart}`;
  return rst;
};

/**
 * 限制小数位
 * @param  {Number} num
 * @param  {Number} [fix=2]
 * @return {String}
 * @memberOf mUtils.format
 */
const limit_decimal = (num, fix = 2) => {
  let v = parseFloat(num);
  if (isNaN(v)) {
    throw new Error(`[limit_decimal] ${num} is not a number`);
  }
  return v.toFixed(fix);
};


/**
 * 补全数字左侧的0
 * @param  {Number} num - 目标数字
 * @param  {Number} [leng=2] - 最终位数
 * @return {String}
 * @memberOf mUtils.format
 */
const num_pad_left = function (num, leng = 2) {
  let
    lng = leng,
    zeroStr = '',
    n = num.toString();
  while (lng--) {
    zeroStr += '0';
  }
  if (n.length < leng)
    return zeroStr.substr(0, leng - n.length) + n;
  return n;
};

/**
 * 去首尾空格
 * @param  {String} str
 * @return {String}
 * @memberOf mUtils.format
 */
const trim = str => str.replace(/(^\s+|\s+$)/g, '');

export
/**
 * @namespace format
 * @memberOf mUtils
 * @type {Object}
 */ {
  reverse_str,
  step_str,
  knot_num,
  num_pad_left,
  limit_decimal,
  trim,
};