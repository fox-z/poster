'use strict';
const Controller = require('egg').Controller;
const Response = require('../../extend/response');

class GroupController extends Controller {
  async index() {
    const { ctx, logger } = this;
    try {
      const { img, itemName, groupPrice = 0 } = ctx.query;
      // itemName = '腹肌都快精神分裂机风刀霜剑啊了';
      // groupPrice = '5555.43';
      // img = 'https://sp1-test.bluewhale365.com/bw/2020/06/01/151c8b39_h_630_w_630.png?x-oss-process=image/resize,m_fixed,h_630,w_630/quality,Q_100/format,jpg';
      if (!img || !itemName) {
        Response.Fail(ctx, '缺少img,itemName等参数');
        return;
      }
      await ctx.render('gourpGoodsCard.html', {
        img,
        itemName,
        groupPrice,
      });
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error(`gourpCard-Controller-errow-${JSON.stringify(err)}`);
    }
  }
}

module.exports = GroupController;
