/**
 * 判断设备类型(平板作为PC)
 * PC端浏览器返回1，移动端浏览器返回2，PC端微信内置浏览器返回3，手机端微信内置浏览器返回4
 * @returns {Number}
 */
export const GetClient = function() {
  let ret = 1; // 默认PC端浏览器
  const ua = navigator.userAgent.toLowerCase();
  const Agents = [
    'android',
    'iphone',
    'symbianos',
    'windows phone',
    'ipad',
    'ipod'
  ];
  for (let c of Agents) {
    if (ua.indexOf(c) > 0) {
      ret = 2; // 移动端浏览器
      break;
    }
  }
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    const system = {
      win: false,
      mac: false
    };
    const p = navigator.platform;
    system.win = p.indexOf('Win') == 0;
    system.mac = p.indexOf('Mac') == 0;
    if (system.win || system.mac) {
      ret = 3; // PC端微信内置浏览器
    } else {
      ret = 4; // 手机端微信内置浏览器
    }
  }
  return ret;
};

/**
 * 判断是否为移动设备(移动端浏览器/手机端微信内置浏览器)
 * @param {}
 * @returns {Boolean}
 */
export const isMobile = () => {
  let type = GetClient();
  return type === 2 || type === 4;
};

/**
 * 获取url参数值
 * @param {String}
 * @returns {String}
 */
export const getQueryVariable = variable => {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
};

/**
 * 判断是不是微信浏览器
 * @returns {Boolean}
 */
export const isWechat = () => {
  return (
    String(navigator.userAgent.toLowerCase().match(/MicroMessenger/i)) ===
    'micromessenger'
  );
};

/**
 * 节流函数；当被调用 n 毫秒后才会执行，如果在这时间内又被调用则至少每隔 n 秒毫秒调用一次该函数
 *
 * @param {Function} callback 回调
 * @param {Number} wait 多少毫秒
 * @param {Object} options 参数{leading: 是否在之前执行 默认true, trailing: 是否在之后执行, 默认false}
 * @return {Function}
 */
export const throttle = function(callback, wait, options) {
  var args, context;
  var opts = options || {};
  var runFlag = false;
  var timeout = 0;
  var optLeading = 'leading' in opts ? opts.leading : true;
  var optTrailing = 'trailing' in opts ? opts.trailing : false;
  var runFn = function() {
    runFlag = true;
    callback.apply(context, args);
    timeout = setTimeout(endFn, wait);
  };
  var endFn = function() {
    timeout = 0;
    if (!runFlag && optTrailing === true) {
      runFn();
    }
  };
  var cancelFn = function() {
    var rest = timeout !== 0;
    clearTimeout(timeout);
    runFlag = false;
    timeout = 0;
    return rest;
  };
  var throttled = function() {
    args = arguments;
    context = this;
    runFlag = false;
    if (timeout === 0) {
      if (optLeading === true) {
        runFn();
      } else if (optTrailing === true) {
        timeout = setTimeout(endFn, wait);
      }
    }
  };
  throttled.cancel = cancelFn;
  return throttled;
};

/**
 * 函数去抖；当被调用 n 毫秒后才会执行，如果在这时间内又被调用则将重新计算执行时间
 *
 * @param {Function} callback 回调
 * @param {Number} wait 多少毫秒
 * @param {Object} options 参数{leading: 是否在之前执行, trailing: 是否在之后执行}
 * @return {Function}
 */
export const debounce = function(callback, wait, options) {
  var args, context;
  var opts = options || {};
  var runFlag = false;
  var timeout = 0;
  var isLeading = typeof options === 'boolean';
  var optLeading = 'leading' in opts ? opts.leading : isLeading;
  var optTrailing = 'trailing' in opts ? opts.trailing : !isLeading;
  var runFn = function() {
    runFlag = true;
    timeout = 0;
    callback.apply(context, args);
  };
  var endFn = function() {
    if (optLeading === true) {
      timeout = 0;
    }
    if (!runFlag && optTrailing === true) {
      runFn();
    }
  };
  var cancelFn = function() {
    var rest = timeout !== 0;
    clearTimeout(timeout);
    timeout = 0;
    return rest;
  };
  var debounced = function() {
    runFlag = false;
    args = arguments;
    context = this;
    if (timeout === 0) {
      if (optLeading === true) {
        runFn();
      }
    } else {
      clearTimeout(timeout);
    }
    timeout = setTimeout(endFn, wait);
  };
  debounced.cancel = cancelFn;
  return debounced;
};
