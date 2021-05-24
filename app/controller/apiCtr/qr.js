'use strict';
const Controller = require('egg').Controller;
const Response = require('../../extend/response');
const qr = require('qr-image');

class QRController extends Controller {
  async index() {
    const { ctx, logger } = this;
    try {
      const { url } = ctx.query;
      if (!url) {
        Response.Fail(ctx, '缺少url参数');
        return;
      }
      const res = qr.imageSync(url, { type: 'png' });
      ctx.body = res;
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
      logger.error('qrcode-QRController-error', err);
    }
  }
}

module.exports = QRController;
