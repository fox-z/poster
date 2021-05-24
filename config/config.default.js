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
  config.keys = appInfo.name + '_1595496380840_5786';

  // add your middleware config here

  config.security = {
    csrf: {
      enable: false,
      // headerName: 'x-csrf-zmall-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
    },
  };

  config.view = {
    defaultViewEngine: 'nunjucks',
    defaultExtension: '.html',
    mapping: {
      '.html': 'nunjucks',
    },
  };

  config.static = {
    dynamic: true, // 是否緩存靜態資源
    preload: false, // 啓動項目開啓緩存
    maxAge: 0, // 緩存時間 開發建議設0 跳坑
    buffer: true, // 是否緩存到内存 默認prod 緩存
  };

  config.MAX_WSE = 1; // 启动多少个浏览器
  config.MAX_PAGE = 5;

  config.uploadUrl = 'http://h5-dev.bw365.net/img/file/upload'; // 图片上传地址
  config.baseUrl = 'http://h5-dev.bw365.net'; // 接口api根地址
  config.baseImgUrl = 'https://img.bluewhale365.com'; // oss上图片的根地址
  config.localImgDir = 'imgs'; // 本地存放图片的filename

  // add your user config here
  const userConfig = {
    myAppName: 'egg-poster',
  };

  return {
    ...config,
    ...userConfig,
    cluster: {
      // 配置服务启动的端口
      listen: {
        port: 7001,
        hostname: '0.0.0.0', // 不建议设置 hostname 为 '0.0.0.0'，它将允许来自外部网络和来源的连接，请在知晓风险的情况下使用
        // workers: 4, // 不需要配置 默认会创建和 CPU 核数相当的 app worker 数，可以充分的利用 CPU 资源
        // https: {
        //   key: '',
        //   cert: '',
        // },
      },
    },
    // logger: {
    //   dir: '/data/logs/bw-poster',
    // },
    oss: {
      client: {
        accessKeyId: 'LTAIGKbKNao1CFgI',
        accessKeySecret: '4Kuq4TSbE8g9hMmnkkwynqZ4gM2pwJ',
        bucket: 'bw-online-img',
        endpoint: 'oss-cn-hangzhou.aliyuncs.com',
        timeout: '60s',
      },
    },
  };
};
