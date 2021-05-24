'use strict';

const Controller = require('egg').Controller;
const Response = require('../../extend/response');

class GroupController extends Controller {
  async index() {
    const { ctx, logger } = this;
    try {
      const { activityId, count, organizeId } = ctx.query;
      // organizeId = 1252945225836441661;
      // activityId = 1287654122534776891;
      // let { buyRecordList, minPrice } = ctx.query;
      // if (buyRecordList) {
      //   buyRecordList = JSON.parse(decodeURIComponent(buyRecordList));
      // } else {
      //   buyRecordList = initbuyRecordList;
      // }
      // if (!minPrice) {
      //   minPrice = initminPrice;
      // }
      const data = await ctx.service.groupRecord.getDrawData({
        activityId,
        organizeId,
        count,
      });
      if (data.code === 1 && data.data) {
        const { buyerRecord } = data.data;
        if (buyerRecord && buyerRecord.length) {
          buyerRecord.forEach(item => {
            const spUrl = item.userFig.split('?')[0];
            item.userFig = `${spUrl}?x-oss-process=image/resize,m_fixed,w_${34}/quality,q_${100}/format,jpg`;
          });
        }
      }
      // console.log(JSON.stringify(data.data), data.data.minItemPrice, '----------');
      await ctx.render('siggoodsPoster.html', data.data);
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error(`ViewGroupController-errow-${JSON.stringify(err)}`);
    }
  }
}

module.exports = GroupController;
