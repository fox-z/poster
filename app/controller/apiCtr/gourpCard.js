'use strict';
const Controller = require('egg').Controller;
const Response = require('../../extend/response');

class PosterController extends Controller {
  async index() {
    const { ctx, app, logger } = this;
    try {
      const { img, itemName, groupPrice = 0 } = ctx.query;
      // itemName = '腹肌都快精神分裂机风刀霜剑啊了';
      // groupPrice = '5555.43';
      // img = 'https://sp1-test.bluewhale365.com/bw/2020/06/01/151c8b39_h_630_w_630.png?x-oss-process=image/resize,m_fixed,h_630,w_630/quality,Q_100/format,jpg';
      if (!img || !itemName) {
        Response.Fail(ctx, '缺少img,itemName等参数');
        return;
      }

      const imgBase64 = await app.pagePool.use(async page => {

        const template = await ctx.renderView('gourpCard.html', {
          img,
          itemName,
          groupPrice,
        });
        await page.setContent(template);
        const buff = await page.screenshot({
          encoding: 'base64',
          type: 'jpeg',
          quality: 100,
          fullPage: false,
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
        logger.error('gourpCard-PosterController-fail', '生成图片失败');
      }
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error('gourpCard-PosterController-errow', err);
    }
  }
}

module.exports = PosterController;
