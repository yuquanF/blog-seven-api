'use strict'

module.exports = {
  port: 5000,
  siteDomain: 'http://localhost:5000',
  countDefault: 10,
  pageDefault: 0,
  apiDir: 'app/api',
  accessExp: 60 * 60, // 1h 单位秒
  // debug 模式
  debug: false,
  // refreshExp 设置refresh_token的过期时间，默认一个月
  refreshExp: 60 * 24 ,
  // 暂不启用插件
  pluginPath: {},
}
