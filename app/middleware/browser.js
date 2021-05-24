'use strict';
const puppeteer = require('puppeteer-core');
const Response = require('../extend/response');

/**
 * @param {*} options
 * @param {*} app
 * 海报服务的中间件用法
 * 适用于对速度没要求的情况
 */
module.exports = (options, app) => {
  return async function browser(ctx, next) {
    try {
      // 初始化无头浏览器
      const MAX_WSE = app.config.MAX_WSE; // 启动几个浏览器 最大不超过2
      console.log(app.baseDir, 'base');
      const WSE_LIST = []; // 存储browserWSEndpoint列表
      // Chromium的启动项优化后能节省200ms左右的请求时间，收益非常可观
      for (let i = 0; i < MAX_WSE; i++) {
        // 创建浏览器实例
        const browserDis = await puppeteer.launch({
          // 无头模式 指不打开浏览器窗口
          headless: true, // 是否以 无头模式 运行浏览器 false 打开浏览器，设置 true 不打开 无头浏览器
          args: [
            '--no-sandbox', // 如果没有可用于Chrome的优质沙箱，它将因错误崩溃，如果您完全信任在Chrome中打开的内容，则可以使用以下--no-sandbox参数启动Chrome
            '–single-process', // Dom解析和渲染放到同一进程
            '–disable-gpu', // disable掉，比如GPU、Sandbox、插件等，减少内存的使用和相关计算
            '–disable-dev-shm-usage',
            '–disable-setuid-sandbox',
            '–no-first-run',
            '–no-zygote',
          ],
          ignoreDefaultArgs: [ '--disable-extensions' ],
          defaultViewport: {
            width: 800, // 页面宽度像素。不能超过1000px，会有崩溃的情况
            height: 800, // <number> 页面高度像素。
          },
        });
        if (browserDis) {
          WSE_LIST[i] = await browserDis.wsEndpoint();
          // 断开链接
          // browserDis.disconnect();
        }
      }
      // 赋值给ctx，在业务中可以直接使用puppeteer实例
      ctx.puppeteer = puppeteer;
      // 保存打开的浏览器的节点，便于重新建立链接，而不是重新创建浏览器 性能提高 200ms以上, 有崩溃的情况
      ctx.WSE_LIST = WSE_LIST;

      // 调用next
      await next();

    } catch (err) {
      Response.SYSTEMERR(ctx, err);
    }
  };
};
