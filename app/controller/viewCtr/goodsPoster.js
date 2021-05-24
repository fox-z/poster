'use strict';
const Controller = require('egg').Controller;
const Response = require('../../extend/response');

class PosterController extends Controller {
  async index() {
    const { ctx, logger } = this;
    try {
      let { img, price = 0 } = ctx.query;
      price = '5555.43';
      img = 'https://sp1-test.bluewhale365.com/bw/2020/06/01/151c8b39_h_630_w_630.png?x-oss-process=image/resize,m_fixed,h_630,w_630/quality,Q_100/format,jpg';
      if (!img) {
        Response.Fail(ctx, '缺少img,itemName等参数');
        return;
      }
      await ctx.render('mutgoodsPoster.html', {
        goodsList: [],
        groupInfo: {
          avatarUrl: 'https://sp1-test.bluewhale365.com/bw/2020/08/28/0e673540_h_132_w_132.jpg',
          activityStatus: 3,
          addressDetail: '盖好啊啊啊实打实大苏打实打实(测试被邀请啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊)',
          endTimeStamp: 1600416155000,
          ewmBase64: '',
          introduce: '',
          startTimeStamp: 1600243351000,
        },
      });
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error(`goodsCard-Controller-errow-${JSON.stringify(err)}`);
    }
  }
}

module.exports = PosterController;
