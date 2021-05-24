'use strict';
// const fs = require('fs');
// const path = require('path');
const Controller = require('egg').Controller;
const Response = require('../../extend/response');

class PosterController extends Controller {
  async index() {
    const { ctx, app, logger } = this;
    try {
      // let { activityId = '222', buyRecordList = [], minPrice = 0 } = ctx.request.body;
      // let { activityId, organizeId, count = 5 } = ctx.request.body;
      const { organizeId, count = 5 } = ctx.query;
      // if (!activityId || !organizeId) {
      //   Response.Fail(ctx, '缺少activityId,organizeId参数');
      //   return;
      // }
      // const imgPath = `./${config.localImgDir}/group_record_${activityId}.png`; // 图片path
      // const ossName = `/${config.ossImgDir}/group_record_${activityId}.png`; // 存到oss的文件夹
      // 取随机的浏览器，简单的负载均衡
      // console.log(app.WSE_LIST, 'ctx.WSE_LIST');
      // let tmp = Math.floor(Math.random() * config.MAX_WSE * config.MAX_PAGE);
      // let browserWSEndpoint = app.WSE_LIST[tmp];
      // const page = app.PAGE_LIST[tmp];
      // logger.info(`browserWSEndpoint-${browserWSEndpoint}`);
      // 使用tab方式渲染后请求速度提升了200ms左右
      // 链接浏览器实例
      // const start = Date.now();
      // const browser = await app.puppeteer.connect({
      //   browserWSEndpoint,
      //   defaultViewport: {
      //     width: 500, // 页面宽度像素。
      //     height: 400, // <number> 页面高度像素。
      //     deviceScaleFactor: 1, // <number> 设置设备的缩放 默认是 1, 设置为2图尺寸大一倍
      //     isMobile: true, // <boolean> 是否在页面中设置了 meta viewport 标签。默认是 false。
      //     hasTouch: false, // <boolean> 指定viewport是否支持触摸事件。默认是 false。
      //     isLandscape: false, // <boolean> 指定视口是否处于横向模式。默认是 false。
      //   }
      // });

      // 打开新tab
      // console.log(Date.now() - start, '连接chrome===========');
      // const page = await browser.newPage();
      // console.log(Date.now() - start, '打开一个tab页===========');
      // 配置当前服务下的页面
      // await page.goto(`${ctx.protocol}://${ctx.host}/view/gourp/record?buyRecordList=${encodeURIComponent(JSON.stringify(buyRecordList))}&minPrice=${minPrice}`);
      // await page.goto(`${ctx.protocol}://${ctx.host}/view/gourp/record?activityId=${activityId}&organizeId=${organizeId}&count=${count}`, {
      //   waitUntil: 'load',
      // });

      // const data = await ctx.service.groupRecord.getDrawData({
      //   activityId,
      //   organizeId,
      //   count,
      // });
      // const template = await ctx.renderView('gourpRecord.html', data.data);
      // logger.info('PosterController-template');
      // await page.setContent(template);
      // logger.info('PosterController-setContent');
      // await page.emulateMediaType('screen');
      // 截图
      // console.log(Date.now() - start, '打开海报页===========');
      // const imgBase64 = await page.screenshot({
      //   // path: imgPath,
      //   encoding: 'base64',
      //   type: 'jpeg',
      //   quality: 100,
      //   fullPage: false,
      //   omitBackground: true,
      //   clip: {
      //     x: 0,
      //     y: 0,
      //     width: 500,
      //     height: 400,
      //   }
      // });
      // console.log(Date.now() - start, '截图===========');
      // 关闭页面
      // await page.close({
      //   runBeforeUnload: false, // 注意 如果 runBeforeUnload 设置为true，可能会弹出一个 beforeunload 对话框。 这个对话框需要通过页面的 ‘dialog’ 事件手动处理。
      // });
      // console.log(Date.now() - start, '关闭===========');

      // 上传图片
      // const imgResult = await ctx.service.groupRecord.uploadImg({name: ossName, imgPath });
      // console.log(Date.now() - start, '上传完===========');
      // // 上传完删除本地图片 异步执行
      // fs.unlink(path.join(app.baseDir, imgPath), (err) => {
      //   if (err) {
      //     console.log(`临时图片文件${imgPath}删除失败`);
      //   };
      //   console.log(`临时图片文件${imgPath}已被删除`);
      // });

      // if (imgResult && imgResult.url) {
      //   // 图片存在
      //   Response.SUCCESS(ctx, `${config.baseImgUrl}${ossName}`);
      // } else {
      //   Response.SUCCESS(ctx, `${config.baseImgUrl}${ossName}`);
      // }

      const imgBase64 = await app.pagePool.use(async page => {
        // await page.goto(`${ctx.protocol}://${ctx.host}/view/gourp/record?activityId=${activityId}&organizeId=${organizeId}&count=${count}`, {
        //   waitUntil: 'load',
        //   timeout: 1000,
        // });
        const data = await ctx.service.groupRecord.getDrawData({
          organizeId,
          count,
        });
        const template = await ctx.renderView('gourpRecord.html', data.data);
        await page.setContent(template);
        const buff = await page.screenshot({
          encoding: 'base64',
          type: 'png',
          omitBackground: true,
          clip: {
            x: 0,
            y: 0,
            width: 500,
            height: 400,
          },
        });
        return buff;
      }, ctx);
      if (imgBase64) {
        Response.SUCCESS(ctx, imgBase64);
      } else {
        Response.Fail(ctx, '生成图片失败');
        logger.error('gourpRecord-PosterController-fail', '生成图片失败');
      }
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error('gourpRecord-PosterController-errow', err);
    }
  }
}

module.exports = PosterController;
