'use strict';
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const timeObj = new Date();
    const year = timeObj.getFullYear();
    const month = timeObj.getMonth() + 1;
    const date = timeObj.getDate();

    const hour = timeObj.getHours();
    const minu = timeObj.getMinutes();
    const secd = timeObj.getSeconds();
    ctx.body = `<div style="text-align: center; color: green;">访问成功, ${year}年${month}月${date}日 ${hour}时${minu}分${secd}秒</div>`;
  }
}

module.exports = HomeController;
