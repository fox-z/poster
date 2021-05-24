'use strict';

const Pool = require('./utils/pool');

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  configWillLoad() {
    // 此时 config 文件已经被读取并合并，但是还并未生效
    // 这是应用层修改配置的最后时机
    // 注意：此函数只支持同步调用
  }

  async didLoad() {
    // 所有的配置已经加载完毕
    // 可以用来加载应用自定义的文件，启动自定义的服务

    const { app } = this;
    const { chromePath, MAX_WSE, MAX_PAGE } = app.config;

    const pagePool = new Pool(MAX_WSE, MAX_PAGE, chromePath);
    pagePool.browsers = await pagePool.createAll();

    app.pagePool = pagePool;

    // function loopFreeMem(ms) {
    //   setTimeout(async () => {
    //     const oldPool = pagePool;
    //     const backup = new Pool(MAX_WSE, MAX_PAGE, chromePath);
    //     backup.browsers = await backup.createAll();
    //     pagePool = backup;
    //     app.pagePool = backup;
    //     await oldPool.checkFree();
    //     await oldPool.close();
    //     loopFreeMem(ms);
    //   }, ms);
    // }

    // loopFreeMem(1000 * 60 * 60 * 10);
  }

  async willReady() {
    // 所有的插件都已启动完毕，但是应用整体还未 ready
    // 可以做一些数据初始化等操作，这些操作成功才会启动应用

  }

  async didReady() {
    // 应用已经启动完毕
  }

  async serverDidReady() {
    // http / https server 已启动，开始接受外部请求
    // 此时可以从 app.server 拿到 server 的实例
  }
}

module.exports = AppBootHook;
