'use strict';

const Service = require('egg').Service;
// const path = require('path');

const actUrl = '/poster/project/activityPromote'; // 获取商品信息

class SpecialService extends Service {
  // 上传图片
  async getActivityPromote(params) {
    const { ctx, logger, config } = this;
    const { activityId, discountType, itemId, regionId, stepId } = params;
    let result;
    try {
      const actResult = await ctx.curl(`${config.discount}${actUrl}`, {
        // 必须指定 method，支持 POST，PUT 和 DELETE
        method: 'POST',
        contentType: 'json',
        // 不需要设置 contentType，HttpClient 会默认以 application/x-www-form-urlencoded 格式发送请求
        data: {
          activityId,
          discountType,
          itemId,
          regionId,
          stepId,
        },
        // 明确告诉 HttpClient 以 JSON 格式处理响应 body
        dataType: 'json',
      });
      if (actResult && actResult.data && actResult.data.code === 1) {
        result = actResult.data.data;
      } else {
        logger.error('getActivityPromote_java_error-0- %s', JSON.stringify(actResult));
      }
    } catch (err) {
      result = null;
      logger.error('SpecialService-getActivityPromote %s', err.toString());
    }
    return result;
  }
}

module.exports = SpecialService;
