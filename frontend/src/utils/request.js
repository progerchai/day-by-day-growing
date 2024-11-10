import Taro from '@tarojs/taro'

const domain = 'http://localhost:7005'
const prefix = '/api'
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to
 * @param  {object} [options] The options we want to pass to "fetch"
 * @param  {object} [funcs] callback functions
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, {
  method = 'POST', headers = {}, data = {},
} = {}, funcs = {}) {
  return Taro.request({
    url: domain + prefix + url,
    method: method,
    data: data,
    header: {
      'content-type': 'application/json', // 默认值
      ...headers,
    },
  }).then(res => {
    return res.data
  })

}
