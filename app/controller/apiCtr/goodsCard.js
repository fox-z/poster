'use strict';
const Controller = require('egg').Controller;
const Response = require('../../extend/response');

class PosterController extends Controller {
  async index() {
    const { ctx, app, logger } = this;
    try {
      const {
        img,
        itemName,
        price = 0, // 商品价格
        type = 1,
        quality = 60,
      } = ctx.query;
      // const img = 'https://sp1-test.bluewhale365.com/bw/2020/09/09/b70267af_h_1280_w_853.jpg'; // ?x-oss-process=image/resize,m_fixed,w_220/quality,q_100/format,jpg
      // const price = 10.2;
      // const type = 1;
      // const quality = 0;
      // const itemName = '放假倒计时了看法';
      // type 1 普通商品卡片 3 拼团商品卡片 5 限时秒杀商品卡片
      logger.info('goods_card_params', JSON.stringify(ctx.query));
      if (!img) {
        Response.Fail(ctx, '缺少img参数');
        return;
      }
      if (+type === 3 && !itemName) {
        Response.Fail(ctx, '缺少itemName参数');
        return;
      }


      const imgBase64 = await app.pagePool.use(async page => {
        let template = '';
        if (+type === 1) {
          // 普通的商品卡片
          template = await ctx.renderView('goodsCard.html', {
            img,
            price,
          });
        } else if (+type === 3) {
          // 拼团的商品卡片
          template = await ctx.renderView('gourpGoodsCard.html', {
            img,
            itemName,
            groupPrice: price,
          });
        } else if (+type === 5) {
          // 限时秒杀商品卡片
          template = await ctx.renderView('seckillGoodsCard.html', {
            img,
            price,
          });
        }

        await page.setContent(template);
        const buff = await page.screenshot({
          encoding: 'base64',
          type: 'jpeg',
          quality: +quality || 60,
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
        logger.error('goodsCard-PosterController-fail', '生成图片失败');
      }
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error('goodsCard-PosterController-errow', err);
    }
  }

  async second() {
    const { ctx, app, logger } = this;
    try {
      const {
        itemName = '', // 商品名称
        groupNum = 0, // 几人团
        seckillHour = '', // 秒杀时间
        marketPriceText = 0, // 市场价格
        img, // 商品主图
        price = 0, // 商品价格
        type = 1, // 1 普通商品卡片 3 拼团商品卡片 5 限时秒杀商品卡片
        quality,
      } = ctx.query;
      // const img = 'https://sp1-test.bluewhale365.com/bw/2020/09/09/b70267af_h_1280_w_853.jpg'; // ?x-oss-process=image/resize,m_fixed,w_220/quality,q_100/format,jpg
      // const price = '10.2';
      // const type = 5;
      // const quality = 70;
      // const groupNum = 80;
      // const marketPriceText = '33.4';
      // const seckillHour = '10:00';

      // type 1 普通商品卡片 3 拼团商品卡片 5 限时秒杀商品卡片
      logger.info('v2_goods_card_params', JSON.stringify(ctx.query));
      if (!img) {
        Response.Fail(ctx, '缺少img参数');
        return;
      }
      if (+type === 3 && !groupNum) {
        Response.Fail(ctx, '缺少groupNum参数');
        return;
      }
      if (+type === 5 && !seckillHour) {
        Response.Fail(ctx, '缺少seckillHour参数');
        return;
      }
      if (+type === 7 && !itemName) {
        Response.Fail(ctx, '缺少itemName参数');
        return;
      }
      const imgBase64 = await app.pagePool.use(async page => {
        let template = null;
        if (+type === 7) {
          // 万人团 区分开来
          let priceInt = 0;
          let priceDot = null;

          if (price.toString().indexOf('.') > -1) {
            const arr = price.toString().split('.');
            priceInt = arr[0];
            priceDot = arr[1];
          } else {
            priceInt = price;
            priceDot = null;
          }
          template = await ctx.renderView('thousandGoodsCard.html', {
            marketPriceText,
            img,
            itemName,
            priceInt,
            priceDot,
          });
        } else {
          template = await ctx.renderView('goodsCard1.html', {
            groupNum,
            seckillHour,
            marketPriceText,
            img,
            itemName,
            price,
            type: +type,
          });
        }

        await page.setContent(template);
        const buff = await page.screenshot({
          encoding: 'base64',
          type: 'jpeg',
          quality: +quality || 70,
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
        logger.error('v2-goodsCard-PosterController-fail', '生成图片失败');
      }
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error('v2-goodsCard-PosterController-errow', err);
    }
  }

  async newGoods() {
    // 新品推荐页面 分享卡片
    const { ctx, app, logger } = this;
    try {
      const {
        itemList,
        type = 1,
        quality = 60,
      } = ctx.request.body;
      logger.info('new_goods_card_params', JSON.stringify(ctx.request.body));
      if (!itemList || !itemList.length) {
        Response.Fail(ctx, '缺少itemList参数');
        return;
      }

      // 处理数据
      itemList.forEach(item => {
        item.pricePre = item.price;
        item.priceNext = '';
        // 是否有小数
        const arr = item.price ? item.price.split('.') : [];
        if (arr[1]) {
          item.pricePre = `${arr[0]}.`;
          item.priceNext = arr[1];
        }
      });

      const imgBase64 = await app.pagePool.use(async page => {
        let template = '';
        if (+type === 1) {
          template = await ctx.renderView('newGoodsCard.html', {
            itemList,
          });
        } else if (+type === 3) {
          template = await ctx.renderView('findGoods.html', {
            itemList,
          });
        }

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
        Response.Fail(ctx, '生成图片失败, 请重试');
        logger.error('newGoodsCard-PosterController-fail', '生成图片失败');
      }
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error('newGoodsCard-PosterController-errow', err);
    }
  }
}

module.exports = PosterController;
