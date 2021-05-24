'use strict';

const crypto = require('crypto');
const Response = require('../extend/response');

module.exports = () => {
  return async function auth(ctx, next) {
    try {
      // 进行md5校验
      const hash = crypto.createHash('md5');
      // ctx.headers，ctx.header，ctx.request.headers，ctx.request.header 等价
      // ctx.get(name)，ctx.request.get(name) 获取 header 某一个字段
      const zmall_key = ctx.get('zmall_key');
      // const timeStamp = ctx.get('timeStamp');
      // const md5key = hash.update(`+==zmall_poster#${timeStamp}create&image$`);
      const key = hash.digest('hex');
      ctx.logger.info('md5key', key);
      // const nowTimeStamp = Date.now();
      // 1s内的请求可通行 超过1s都拦截 1s=1000ms
      if (key === zmall_key) {
        // 调用next
        await next();
      } else {
        Response.Fail(ctx, '抱歉，您现在还无权访问!');
      }
    } catch (err) {
      Response.SYSTEMERR(ctx, err);
    }
  };
};
