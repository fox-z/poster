'use strict';
// 请求成功
const SUCCESS = (ctx, data) => {
  ctx.body = {
    code: 1,
    msg: 'success',
    data,
  };
};

// 请求错误
const Fail = (ctx, msg) => {
  ctx.body = {
    code: 0,
    msg,
    data: null,
  };
};

// 系统错误
const SYSTEMERR = (ctx, err) => {
  ctx.body = {
    code: -1,
    msg: '系统错误，请稍后重试',
    data: JSON.stringify(err),
  };
};


module.exports = {
  SUCCESS,
  Fail,
  SYSTEMERR,
};
