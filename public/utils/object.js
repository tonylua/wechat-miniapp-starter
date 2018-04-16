const ObjectUtil = {
    assign(target) {
        if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

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
      if (target == null) {
        throw new TypeError('Cannot parse undefined or null to object');
      }

      let rst = ObjectUtil.assign({}, target);
      Object.keys(target).filter(k=>~properties.indexOf(k)).forEach(k=>delete rst[k]);
      return rst;
    }
};

module.exports = ObjectUtil;