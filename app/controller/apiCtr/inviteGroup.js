
'use strict';

const Controller = require('egg').Controller;
const Response = require('../../extend/response');

class PosterController extends Controller {
  async index() {
    const { ctx, app, logger } = this;

    // private String avatarUrl; 用户头像

    // private String nickName; 用户昵称

    // 背景图片 bgImg

    // 二维码图片 ewmBase64
    try {
      let {
        avatarUrl,
        nickName,
        ewmBase64,
      } = ctx.request.body;
      if (!avatarUrl || !ewmBase64) {
        Response.Fail(ctx, '缺少avatarUrl, ewmBase64等参数');
        return;
      }

      const urlReg = /^(https|http)?:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9]+[/=?%\-&_~`@[\]':+!]*([^<>""])*$/;
      if (!urlReg.test(ewmBase64)) {
        ewmBase64 = 'data:image/png;base64,' + ewmBase64;
      }

      const imgBase64 = await app.pagePool.use(async page => {

        const template = await ctx.renderView('inviteGroup.html', {
          bgImg: 'https://img1.huopin360.com/miniprogram/orgainzer/orgz-invite-bg-poster.png',
          avatarUrl,
          nickName,
          ewmBase64,
        });
        await page.setContent(template);
        const buff = await page.screenshot({
          encoding: 'base64',
          type: 'png',
          fullPage: false,
          omitBackground: true,
          clip: {
            x: 0,
            y: 0,
            width: 750,
            height: 1324,
          },
        });
        return buff;
      }, ctx);
      if (imgBase64) {
        Response.SUCCESS(ctx, imgBase64);
      } else {
        Response.Fail(ctx, '生成图片失败');
        logger.error('inviteGroup-PosterController-fail', '生成图片失败');
      }
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error('inviteGroup-PosterController-errow', err);
    }
  }

  async inviteNew() {
    const { ctx, app, logger } = this;

    try {
      let {
        ewmBase64,
      } = ctx.request.body;
      if (!ewmBase64) {
        Response.Fail(ctx, '缺少ewmBase64参数');
        return;
      }

      const urlReg = /^(https|http)?:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9]+[/=?%\-&_~`@[\]':+!]*([^<>""])*$/;
      if (!urlReg.test(ewmBase64)) {
        ewmBase64 = 'data:image/png;base64,' + ewmBase64;
      }

      const imgBase64 = await app.pagePool.use(async page => {

        const template = await ctx.renderView('inviteNew.html', {
          ewmBase64,
        });
        await page.setContent(template);
        const buff = await page.screenshot({
          encoding: 'base64',
          type: 'png',
          fullPage: false,
          omitBackground: true,
          clip: {
            x: 0,
            y: 0,
            width: 640,
            height: 1048,
          },
        });
        return buff;
      }, ctx);
      if (imgBase64) {
        Response.SUCCESS(ctx, imgBase64);
      } else {
        Response.Fail(ctx, '生成图片失败');
        logger.error('inviteNew-PosterController-fail', '生成图片失败');
      }
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error('inviteNew-PosterController-errow', err);
    }
  }  
}

module.exports = PosterController;
