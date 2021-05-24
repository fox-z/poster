'use strict';
const Controller = require('egg').Controller;
const Response = require('../../extend/response');

const itemList = [
  {
    itemName: '商品名称',
    itemNumber: '商品货号',
    itemSpec: '商品规格',
    quantity: 11,
  },
  {
    itemName: '商品名称',
    itemNumber: '商品货号',
    itemSpec: '商品规格',
    quantity: 11,
  },
  {
    itemName: '商品名称',
    itemNumber: '商品货号',
    itemSpec: '商品规格',
    quantity: 11,
  },
  {
    itemName: '商品名称',
    itemNumber: '商品货号',
    itemSpec: '商品规格',
    quantity: 11,
  },
  {
    itemName: '商品名称',
    itemNumber: '商品货号',
    itemSpec: '商品规格',
    quantity: 11,
  },
  {
    itemName: '商品名称',
    itemNumber: '商品货号',
    itemSpec: '商品规格',
    quantity: 11,
  },
  {
    itemName: '商品名称',
    itemNumber: '商品货号',
    itemSpec: '商品规格',
    quantity: 11,
  },
  {
    itemName: '商品名称',
    itemNumber: '商品货号',
    itemSpec: '商品规格',
    quantity: 11,
  },
  {
    itemName: '商品名称',
    itemNumber: '商品货号',
    itemSpec: '商品规格',
    quantity: 11,
  },
  {
    itemName: '商品名称',
    itemNumber: '商品货号',
    itemSpec: '商品规格',
    quantity: 11,
  },
  {
    itemName: '商品名称',
    itemNumber: '商品货号',
    itemSpec: '商品规格',
    quantity: 11,
  },
  {
    itemName: '商品名称',
    itemNumber: '商品货号',
    itemSpec: '商品规格',
    quantity: 11,
  },
  {
    itemName: '商品名称',
    itemNumber: '商品货号',
    itemSpec: '商品规格',
    quantity: 11,
  },
  {
    itemName: '商品名称',
    itemNumber: '商品货号',
    itemSpec: '商品规格',
    quantity: 11,
  },
  {
    itemName: '商品名称',
    itemNumber: '商品货号',
    itemSpec: '商品规格',
    quantity: 11,
  },
  {
    itemName: '商品名称',
    itemNumber: '商品货号',
    itemSpec: '商品规格',
    quantity: 11,
  },
];

const routeList = [
  {
    routeName: '余杭一线',
  },
  {
    routeName: '余杭二线',
  },
  {
    routeName: '余杭三线',
  },
  {
    routeName: '余杭四线',
  },
  {
    routeName: '余杭五线',
  },
];

class PDFViewController extends Controller {
  async liver() {
    const { ctx, logger } = this;
    try {
      const { deliverBillId = '1' } = ctx.query;
      if (!deliverBillId) {
        Response.Fail(ctx, '缺少deliverBillId参数');
        return;
      }
      // const liverList = await ctx.service.pdf.getLiverList({ deliverBillId });
      await ctx.render('liverList.html');
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error(`liverList-view-Controller-errow-${JSON.stringify(err)}`);
    }
  }
  async pick() {
    const { ctx, logger } = this;
    try {
      const { deliverBillId = '2' } = ctx.query;
      if (!deliverBillId) {
        Response.Fail(ctx, '缺少deliverBillId参数');
        return;
      }
      // const liverList = await ctx.service.pdf.getLiverList({ deliverBillId });
      await ctx.render('pickList.html', {
        itemList,
        routeList,
        routeCount: 8,
        sum: 10,
      });
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error(`pickList-view-Controller-errow-${JSON.stringify(err)}`);
    }
  }
  async take() {
    const { ctx, logger } = this;
    try {
      const { deliverBillId = '3' } = ctx.query;
      if (!deliverBillId) {
        Response.Fail(ctx, '缺少deliverBillId参数');
        return;
      }
      // const liverList = await ctx.service.pdf.getLiverList({ deliverBillId });
      await ctx.render('takeList.html', { itemList });
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error(`takeList-view-Controller-errow-${JSON.stringify(err)}`);
    }
  }
}

module.exports = PDFViewController;
