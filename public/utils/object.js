const ObjectUtil = {
    assign(target) {
        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
          var source = arguments[index];
          if (source != null) {
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
              }
          }
        }
        return target;
    },
    omit(target, ...properties) {
      if (!target) {
        return null;
      }
      let rst = ObjectUtil.assign({}, target);
      Object.keys(target).filter(k=>~properties.indexOf(k)).forEach(k=>delete rst[k]);
      return rst;
    },
    pick(target, ...properties) {
      if (!target || typeof target !== 'object') {
        return null;
      }
      let rst = {};
      properties.forEach(p=>{
        if (p && target[p]) {
          rst[p] = target[p];
        }
      });
      return rst;
    }
};

module.exports = ObjectUtil;