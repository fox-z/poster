'use strict';
const Controller = require('egg').Controller;
const Response = require('../../extend/response');

class CardController extends Controller {
  async index() {
    const { ctx, logger } = this;
    try {
      await ctx.render('thousandGoodsCard.html', {
        img: 'https://sp1-test.bluewhale365.com/bw/2020/05/28/9d780a63_h_800_w_800.jpg?x-oss-process=image/resize,m_fixed,w_444/quality,q_100/format,jpg',
        marketPriceText: '4444',
        itemName: '我是商品名称发动机啊范德萨我是商品名称发动机啊范德萨我是商品名称发动机啊范德萨',
        price: '3344',
        type: 7,
      });
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error(`v2-goodsCard-Controller-errow-${JSON.stringify(err)}`);
    }
  }

  async second() {
    const { ctx, logger } = this;
    try {
      await ctx.render('inviteNew.html');
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error(`v2-goodsCard-Controller-errow-${JSON.stringify(err)}`);
    }
  }

  async three() {
    const { ctx, logger } = this;
    try {
      const data = {
        activityPriceText: '1233.23',
        endTime: '2019-12-12 20:00:00',
        img: 'https://sp1-test.bluewhale365.com/bw/2020/12/18/7f65efe2_h_400_w_500.png?x-oss-process=image/resize,m_fixed,w_444/quality,q_100/format,jpg',
        itemId: '2323232',
        name: '时间都放辣椒发动机了撒娇浪费大家啊激发了大家撒了范德萨家里范德萨范德萨范德萨家啊了多少啊范德萨范德萨',
        preferPriceText: '555.44',
        startTime: '2019-12-12 20:00:00',
        type: 77,
        activityPriceTextInt: '11.02',
        grouponNum: 6,
        activityStock: 1000,
        limitBuyNum: 11,
        limitBuyFlag: true,
      };


      data.type = 77; // 活动类型
      data.activityPriceTextInt = data.activityPriceText;
      const arr = data.activityPriceText.split('.');
      if (arr[1]) {
        data.activityPriceTextInt = arr[0];
        data.activityPriceTextDot = arr[1];
      }
      await ctx.render('activityPromote.html', data);
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error(`v2-goodsCard-Controller-errow-${JSON.stringify(err)}`);
    }
  }
}

module.exports = CardController;
