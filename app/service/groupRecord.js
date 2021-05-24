'use strict';
const Service = require('egg').Service;
const path = require('path');

const drawData = '/marquee/drawData'; // 绘制海报

class GroupService extends Service {
  // 上传图片
  async uploadImg(params) {
    const { ctx, app, logger } = this;
    const { name, imgPath } = params;
    // const imgResult = await ctx.curl(config.uploadUrl, {
    //   // 必须指定 method，支持 POST，PUT 和 DELETE
    //   method: 'POST',
    //   // 不需要设置 contentType，HttpClient 会默认以 application/x-www-form-urlencoded 格式发送请求
    //   data: {
    //     imageType: 283,
    //   },
    //   files: ,
    //   // 明确告诉 HttpClient 以 JSON 格式处理响应 body
    //   dataType: 'json',
    // });
    let result;
    try {
      // 拿到项目根路径下图片地址上传oss
      result = await ctx.oss.put(name, path.join(app.baseDir, imgPath));
    } catch (err) {
      result = null;
      logger.error(`GroupService-uploadImg-${err.toString()}`);
    }
    return result;
  }

  // 获取截图数据
  async getDrawData(params) {
    const { ctx, config, logger } = this;
    const { activityId, organizeId } = params;
    const returnData = {
      code: 0,
      data: {},
    };
    try {
      const result = await ctx.curl(`${config.discount}${drawData}`, {
        // 必须指定 method，支持 POST，PUT 和 DELETE
        method: 'POST',
        data: {
          activityId,
          count: 5,
          organizeId,
        },
        dataType: 'json',
      });
      if (result && result.data && result.data.data) {
        returnData.code = 1;
        returnData.data = result.data.data;
      }
      logger.info(`java-GroupService-getDrawData-${JSON.stringify(result)}`);
    } catch (err) {
      logger.error(`GroupService-uploadImg-${JSON.stringify(err)}`);
    }
    return returnData;
  }
}

module.exports = GroupService;
