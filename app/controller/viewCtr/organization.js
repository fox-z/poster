'use strict';

const Controller = require('egg').Controller;
const Response = require('../../extend/response');

class OrganiziController extends Controller {
  async index() {
    const { ctx, logger } = this;
    try {
      const { miniUrl, avatarUrl, descOrganizeTemplate, nickName } = ctx.query;
      if (!miniUrl || !avatarUrl || !descOrganizeTemplate || !nickName) {
        Response.Fail(ctx, '缺少miniUrl, avatarUrl, descOrganizeTemplate, nickName等参数');
        return;
      }
      await ctx.render('organizationQr.html', {
        miniUrl, avatarUrl, descOrganizeTemplate, nickName,
      });
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error(`organizationQr-view-Controller-errow-${JSON.stringify(err)}`);
    }
  }
  async code() {
    const { ctx, logger } = this;
    try {
      const { miniUrl, avatarUrl, siteName } = ctx.query;
      await ctx.render('organizationEwm.html', {
        miniUrl, avatarUrl, siteName,
      });
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error(`organizationEwm-view-Controller-errow-${JSON.stringify(err)}`);
    }
  }
}

module.exports = OrganiziController;
