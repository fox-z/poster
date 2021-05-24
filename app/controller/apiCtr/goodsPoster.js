'use strict';
const Controller = require('egg').Controller;
const Response = require('../../extend/response');

class PosterController extends Controller {
  async mut() {
    // 多个商品海报
    const { ctx, app, logger } = this;
    try {
      let { groupInfo = {}, goodsList = [] } = ctx.request.body;
      if (!(goodsList && goodsList.length) || !Object.keys(groupInfo).length || !groupInfo.ewmBase64) {
        Response.Fail(ctx, '请检查参数 groupInfo是否字段缺失[ewmBase64], goodsList是否为空');
        return;
      }
      // 截取三个商品
      goodsList = goodsList.slice(0, 3);
      goodsList.forEach(item => {
        if (item.img && item.img.indexOf('.gif') > -1) {
          // gif图转成jpg
          if (item.img.indexOf('?') > -1) {
            item.img = `${item.img.split('?')[0]}?x-oss-process=image/format,jpg`;
          } else {
            item.img = `${item.img}?x-oss-process=image/format,jpg`;
          }
        }
      });
      // if (groupInfo.activityStatus === 1) {
      //   // 未开始
      //   groupInfo.timeStr = timestampToDate(groupInfo.startTimeStamp, 'MDHMS') + '开始';
      // } else if (groupInfo.activityStatus === 3) {
      //   // 进行中
      //   groupInfo.timeStr = timestampToDate(groupInfo.endTimeStamp, 'MDHMS') + '结束';
      // }
      const urlReg = /^(https|http)?:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9]+[/=?%\-&_~`@[\]':+!]*([^<>""])*$/;
      if (!urlReg.test(groupInfo.ewmBase64)) {
        groupInfo.ewmBase64 = 'data:image/png;base64,' + groupInfo.ewmBase64;
      }

      const imgBase64 = await app.pagePool.use(async page => {
        const template = await ctx.renderView('mutgoodsPoster.html', {
          groupInfo,
          goodsList,
        });
        await page.setContent(template);
        const buff = await page.screenshot({
          encoding: 'base64',
          type: 'png',
          omitBackground: true,
          clip: {
            x: 0,
            y: 0,
            width: 576,
            height: 904,
          },
        });
        return buff;
      }, ctx);
      if (imgBase64) {
        Response.SUCCESS(ctx, imgBase64);
      } else {
        Response.Fail(ctx, '生成图片失败');
        logger.error('mutgoodsPoster-PosterController-fail', '生成图片失败');
      }
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error('mutgoodsPoster-PosterController-errow', err);
    }
  }

  async sig() {
    const { ctx, app, logger } = this;
    try {
      // type 1为普通商品的海报分享图 3 为万人团
      const { groupInfo = {}, buyRecordList = [], type = 1 } = ctx.request.body;

      if (!Object.keys(groupInfo).length || !groupInfo.ewmBase64) {
        Response.Fail(ctx, '请检查参数 groupInfo是否字段缺失[ewmBase64]');
        return;
      }
      // if (groupInfo.activityStatus === 1) {
      //   // 未开始
      //   groupInfo.timeStr = timestampToDate(groupInfo.startTimeStamp, 'MDHMS') + '开始';
      // } else if (groupInfo.activityStatus === 3) {
      //   // 进行中
      //   groupInfo.timeStr = timestampToDate(groupInfo.endTimeStamp, 'MDHMS') + '结束';
      // }
      if (groupInfo.img && groupInfo.img.indexOf('.gif') > -1) {
        // gif图转成jpg
        if (groupInfo.img.indexOf('?') > -1) {
          groupInfo.img = `${groupInfo.img.split('?')[0]}?x-oss-process=image/format,jpg`;
        } else {
          groupInfo.img = `${groupInfo.img}?x-oss-process=image/format,jpg`;
        }
      }
      const urlReg = /^(https|http)?:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9]+[/=?%\-&_~`@[\]':+!]*([^<>""])*$/;
      if (!urlReg.test(groupInfo.ewmBase64)) {
        groupInfo.ewmBase64 = 'data:image/png;base64,' + groupInfo.ewmBase64;
      }

      buyRecordList.forEach(item => {
        item.avatarUrl = item.avatarUrl || item.userFig;
      });

      const imgBase64 = await app.pagePool.use(async page => {
        let template = null;
        if (+type === 3) {
          template = await ctx.renderView('groupShare.html', {
            groupInfo,
            buyRecordList,
          }).catch(err => {
            console.log(err, 'err');
          });
        } else {
          template = await ctx.renderView('siggoodsPoster.html', {
            groupInfo,
            buyRecordList,
          }).catch(err => {
            console.log(err, 'err');
          });
        }
        await page.setContent(template);
        const height = +type === 3 ? 1040 : 1000;
        const buff = await page.screenshot({
          encoding: 'base64',
          type: 'png',
          omitBackground: true,
          clip: {
            x: 0,
            y: 0,
            width: 576,
            height,
          },
        });
        return buff;
      }, ctx);
      if (imgBase64) {
        Response.SUCCESS(ctx, imgBase64);
      } else {
        Response.Fail(ctx, '生成图片失败');
        logger.error('siggoodsPoster-PosterController-fail', '生成图片失败');
      }
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error('siggoodsPoster-PosterController-errow', err);
    }
  }
}

module.exports = PosterController;
