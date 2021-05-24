'use strict';

const Controller = require('egg').Controller;
const Response = require('../../extend/response');

class PosterController extends Controller {
  async index() {
    const { ctx, app, logger } = this;
    // @ApiModelProperty(value = "小程序码链接")
    // private String miniUrl;

    // @ApiModelProperty(value = "用户头像")
    // private String avatarUrl;

    // @ApiModelProperty(value = "邀请你加入赞麦源选")
    // private String descOrganizeTemplate;

    // @ApiModelProperty(value = "用户昵称")
    // private String nickName;
    try {
      const { miniUrl, avatarUrl, descOrganizeTemplate, nickName } = ctx.query;
      if (!miniUrl || !avatarUrl || !descOrganizeTemplate || !nickName) {
        Response.Fail(ctx, '缺少miniUrl, avatarUrl, descOrganizeTemplate, nickName等参数');
        return;
      }

      const imgBase64 = await app.pagePool.use(async page => {

        const template = await ctx.renderView('organizationQr.html', {
          miniUrl, avatarUrl, descOrganizeTemplate, nickName,
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
            width: 375,
            height: 480,
          },
        });
        return buff;
      }, ctx);
      if (imgBase64) {
        Response.SUCCESS(ctx, imgBase64);
      } else {
        Response.Fail(ctx, '生成图片失败');
        logger.error('organization-PosterController-fail', '生成图片失败');
      }
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error('organization-PosterController-errow', err);
    }
  }
  async code() {
    const { ctx, app, logger } = this;
    // @ApiModelProperty(value = "小程序码链接")
    // private String miniUrl;

    // @ApiModelProperty(value = "用户头像")
    // private String avatarUrl;

    // @ApiModelProperty(value = "用户昵称")
    // private String siteName;
    try {
      let { miniUrl, avatarUrl, siteName } = ctx.request.body;
      if (!miniUrl || !avatarUrl || !siteName) {
        Response.Fail(ctx, '缺少miniUrl, avatarUrl, siteName等参数');
        return;
      }

      const urlReg = /^(https|http)?:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9]+[/=?%\-&_~`@[\]':+!]*([^<>""])*$/;
      if (!urlReg.test(miniUrl)) {
        miniUrl = 'data:image/png;base64,' + miniUrl;
      }

      const imgBase64 = await app.pagePool.use(async page => {

        const template = await ctx.renderView('organizationEwm.html', {
          miniUrl,
          avatarUrl,
          siteName: siteName.substr(0, 10),
        });
        await page.setContent(template);
        const buff = await page.screenshot({
          encoding: 'base64',
          type: 'png',
          fullPage: false,
          omitBackground: true,
          clip: {
            x: 2,
            y: 2,
            width: 746,
            height: 1080,
          },
        });
        return buff;
      }, ctx);
      if (imgBase64) {
        Response.SUCCESS(ctx, imgBase64);
      } else {
        Response.Fail(ctx, '前面排队有点长,请稍后');
        logger.error('organization-ewm-PosterController-fail', '生成图片失败');
      }
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error('organization-ewm-PosterController-errow', err);
    }
  }
}

module.exports = PosterController;
