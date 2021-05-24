'use strict';

const Service = require('egg').Service;
// const path = require('path');

class UploadFileService extends Service {
  // 上传图片
  async uploadFile(params) {
    const { ctx, logger } = this;
    const { fileName, fileAbsPath } = params;
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
      logger.info('UploadFileService-uploadFile-params %s', params.toString());
      result = await ctx.oss.put(fileName, fileAbsPath);
    } catch (err) {
      result = null;
      logger.error('UploadFileService-uploadFile %s', err.toString());
    }
    return result;
  }
}

module.exports = UploadFileService;
