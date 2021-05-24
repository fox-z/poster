/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1595496380840_5786_test';

  // add your middleware config here

  config.MAX_WSE = 1; // 启动多少个浏览器
  config.MAX_PAGE = 5;
  config.chromePath = './chrome-linux/chrome';

  config.uploadUrl = 'https://h5-test.bluewhale365.com/img/file/upload';
  config.baseUrl = 'https://h5-test.bluewhale365.com';
  config.ossImgDir = 'posterTest'; // oss上存放图片的filename
  config.discount = 'discount-api-test.bwtest.cc';
  config.cps = 'cps-api-test.bwtest.cc';
  // add your user config here
  const userConfig = {
  };

  return {
    ...config,
    ...userConfig,
    logger: {
      dir: '/data/logs/bw-poster',
    },
    cluster: {
      // 配置服务启动的端口
      listen: {
        port: 7001,
        hostname: '0.0.0.0', // 不建议设置 hostname 为 '0.0.0.0'，它将允许来自外部网络和来源的连接，请在知晓风险的情况下使用
        // workers: 4, // 不需要配置 默认开启内核相同的线程
        // https: {
        //   key: '',
        //   cert: '',
        // },
      },
    },
  };
};
