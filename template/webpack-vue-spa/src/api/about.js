/**
 * wiki: http://api-doc.yodafone.cn/project/13/interface/api/99
 * 购物车下单接口
 * @param {Object} data
 * @returns {Promise}
 */
export function SimOrderMulti(data) {
  return request({
    url: '/NewSimOrderMulti',
    method: 'post',
    data,
  });
}
