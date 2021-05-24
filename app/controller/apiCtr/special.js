'use strict';
const Controller = require('egg').Controller;
const Response = require('../../extend/response');
const dayjs = require('dayjs');

class PosterController extends Controller {
  async index() {
    // 小程序专题页海报
    const { ctx, app, logger, config } = this;
    try {
      const { url } = ctx.query;
      if (!url) {
        Response.Fail(ctx, '缺少url参数');
        return;
      }
      logger.info('h5-link-params', url);
      const path = url.replace(/(\/)?\#\//gi, '');
      logger.info('h5-link-params-path', path);
      const imgBase64 = await app.pagePool.use(async page => {
        await page.goto(`${config.baseUrl}/#/${path}`, {
          waitUntil: 'networkidle0',
        });
        // await page.goto('https://h5-test.bluewhale365.com/#/subject/subjectPage?pageId=1327182605015576659&organizeId=1308330472140886021&activityId=1326825288701042752&collectionSiteId=1308331003789889598');
        const buff = await page.screenshot({
          encoding: 'base64',
          type: 'png',
          fullPage: true,
          omitBackground: true,
        });
        await page.goto('about:blank');
        return buff;
      }, ctx);
      if (imgBase64) {
        Response.SUCCESS(ctx, imgBase64);
      } else {
        Response.Fail(ctx, '生成图片失败, 请重试');
        logger.error('special-PosterController-fail', '生成图片失败');
      }
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error('special-PosterController-errow', err);
    }
  }
  async detailImg() {
    // 商品详情生成图
    const { ctx, app, logger, config } = this;
    try {
      // const { url } = ctx.request.body;
      const { url } = ctx.query;
      logger.info('detailImg-h5-link-params', JSON.stringify(ctx.query));
      // logger.info('detailImg-h5-link-params', JSON.stringify(ctx.request.body));
      if (!url) {
        Response.Fail(ctx, '缺少url参数');
        return;
      }
      const path = url.replace(/^\//, '');
      logger.info('detailImg-h5-link-params-path', path);
      const imgBase64 = await app.pagePool.use(async page => {
        await page.goto(`${config.baseUrl}/#/${path}`, {
          waitUntil: 'networkidle0',
        });
        // await page.goto('https://h5-test.bluewhale365.com/#/subject/subjectPage?pageId=1327182605015576659&organizeId=1308330472140886021&activityId=1326825288701042752&collectionSiteId=1308331003789889598');
        const buff = await page.screenshot({
          encoding: 'base64',
          type: 'png',
          fullPage: true,
          omitBackground: true,
        });
        await page.goto('about:blank');
        return buff;
      }, ctx);
      if (imgBase64) {
        Response.SUCCESS(ctx, imgBase64);
      } else {
        Response.Fail(ctx, '生成图片失败, 请重试');
        logger.error('detailImg-special-PosterController-fail', '生成图片失败');
      }
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error('detailImg-special-PosterController-errow', err);
    }
  }

  async cateSubject() {
    // 分类页海报
    const { ctx, app, logger, config } = this;
    try {
      const { businessId, posterProjectType, regionId, stepId = '' } = ctx.query;
      // 专题页类型 万人团-81 秒杀-77 新品-82 源选首页活动分类-84

      logger.info('cateSubject-params', JSON.stringify(ctx.query));
      if (!posterProjectType) {
        Response.Fail(ctx, '缺少posterProjectType参数');
        return;
      }
      if (!regionId) {
        Response.Fail(ctx, '缺少regionId参数');
        return;
      }
      if (+posterProjectType === 84 && !businessId) {
        Response.Fail(ctx, 'posterProjectType=84时，businessId参数必传');
        return;
      }

      const path = `subject/cateShare?posterProjectType=${posterProjectType}&businessId=${businessId}&regionId=${regionId}&stepId=${stepId}`; // 新的专题页h5链接
      const imgBase64 = await app.pagePool.use(async page => {
        await page.goto(`${config.baseUrl}/#/${path}`, {
          waitUntil: 'networkidle0',
        });
        const buff = await page.screenshot({
          encoding: 'base64',
          type: 'png',
          fullPage: true,
          omitBackground: true,
        });
        await page.goto('about:blank');
        return buff;
      }, ctx);
      if (imgBase64) {
        Response.SUCCESS(ctx, imgBase64);
      } else {
        Response.Fail(ctx, '生成图片失败, 请重试');
        logger.error('cateSubject-special-PosterController-fail', '生成图片失败');
      }
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error('cateSubject-special-PosterController-errow', err);
    }
  }

  async activityPromote() {
    // 分类页海报
    const { ctx, app, logger } = this;
    try {
      const { activityId, discountType, itemId, regionId, stepId } = ctx.query;
      // discountType活动类型 万人团-81 秒杀-77 拼团-65

      logger.info('activityPromote-params', JSON.stringify(ctx.query));
      if (!discountType) {
        Response.Fail(ctx, '缺少discountType参数');
        return;
      }

      if (!itemId) {
        Response.Fail(ctx, 'itemId参数必传');
        return;
      }

      // 从java接口拿到数据
      const data = await ctx.service.special.getActivityPromote({
        activityId,
        discountType,
        itemId,
        regionId,
        stepId,
      });

      // const data = {
      //   activityPriceText: '444.55',
      //   endTime: '2019-12-12 20:00:00',
      //   img: 'https://sp1-test.bluewhale365.com/bw/2020/12/18/7f65efe2_h_400_w_500.png?x-oss-process=image/resize,m_fixed,w_444/quality,q_100/format,jpg',
      //   itemId: '2323232',
      //   name: '时间都放辣椒发动啊范德萨范德萨',
      //   preferPriceText: '555.44',
      //   startTime: '2019-12-12 20:00:00',
      // };

      if (!data) {
        Response.Fail(ctx, '海报数据为空，请重试');
        return;
      }

      data.type = discountType; // 活动类型
      data.activityPriceTextInt = data.activityPriceText;
      const arr = data.activityPriceText.split('.');
      if (arr[1]) {
        data.activityPriceTextInt = arr[0];
        data.activityPriceTextDot = arr[1];
      }
      data.differenceTextInt = data.differenceText;
      const arr2 = data.differenceText.split('.');
      if (arr2[1]) {
        data.differenceTextInt = arr2[0];
        data.differenceTextDot = arr2[1];
      }

      data.startTime = dayjs(data.startTime).format('M月DD日 HH:mm');
      data.endTime = dayjs(data.endTime).format('M月DD日 HH:mm');

      logger.info('activityPromote-special-PosterController-javaData', JSON.stringify(data));

      const imgBase64 = await app.pagePool.use(async page => {

        const template = await ctx.renderView('activityPromote.html', data);
        await page.setContent(template);

        const buff = await page.screenshot({
          encoding: 'base64',
          type: 'png',
          clip: {
            x: 0,
            y: 0,
            width: 750,
            height: 1334, // max 1400
          },
          omitBackground: true,
        });
        return buff;
      }, ctx);

      if (imgBase64) {
        Response.SUCCESS(ctx, imgBase64);
      } else {
        Response.Fail(ctx, '生成图片失败, 请重试');
        logger.error('activityPromote-special-PosterController-fail', '生成图片失败');
      }
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error('activityPromote-special-PosterController-errow', err);
    }
  }
}

module.exports = PosterController;
