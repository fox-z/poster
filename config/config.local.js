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
  config.keys = appInfo.name + '_1595496380840_5786_dev';

  // add your middleware config here

  config.MAX_WSE = 1; // 启动多少个浏览器
  config.MAX_PAGE = 1;
  config.chromePath = './chrome-mac/Chromium.app/Contents/MacOS/Chromium';

  config.uploadUrl = 'http://h5-dev.bw365.net/img/file/upload';
  config.baseUrl = 'http://h5-dev.bw365.net';
  config.ossImgDir = 'poster'; // oss上存放图片的filename
  config.discount = 'discount-dev.bw365.net';
  config.cps = 'cps-dev.bw365.net';
  // add your user config here
  const userConfig = {
  };

  return {
    ...config,
    ...userConfig,
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
