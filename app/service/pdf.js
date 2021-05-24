'use strict';

const Service = require('egg').Service;
// 更新链接
const upDateLink = '/deliver/bill/savePdfUrl'; // 更新pdf链接
// 总的拣货单列表
const allPickListUrl = '/deliver/bill/findPickingList';
// 获取线路的 拣货单 配送单 提货单
const routeDeliverBillListUrl = '/deliver/bill/findRouteDeliverBillResp';

class PDFService extends Service {
  // 总的拣货单列表
  async allPickList(params) {
    const { ctx, config, logger } = this;
    let result = null;
    try {
      const { deliverBillId } = params;
      const allPickResult = await ctx.curl(`${config.cps}${allPickListUrl}`, {
        // 必须指定 method，支持 POST，PUT 和 DELETE
        method: 'POST',
        contentType: 'json',
        data: {
          deliverBillId,
        },
        timeout: 20000, // 20s超时时间
        dataType: 'json',
      });
      if (allPickResult && allPickResult.data && allPickResult.data.code === 1) {
        result = allPickResult.data.data;
      } else {
        logger.error('allPickList_java_error-0- %s', allPickResult);
      }
    } catch (err) {
      result = null;
      logger.error(`allPickList_java_error- %s${err.toString()}`);
    }
    return result;
  }

  // 获取线路的 拣货单 提货单 配送单
  async routeDeliverBillList(params) {
    const { ctx, config, logger } = this;
    let result = null;
    try {
      const { deliverBillId, pageNum } = params;
      const routeResult = await ctx.curl(`${config.cps}${routeDeliverBillListUrl}`, {
        // 必须指定 method，支持 POST，PUT 和 DELETE
        method: 'POST',
        contentType: 'json',
        data: {
          deliverBillId,
          pageNum,
        },
        timeout: 20000, // 20s超时时间
        dataType: 'json',
      });
      if (routeResult && routeResult.data && routeResult.data.code === 1) {
        result = routeResult.data.data;
      } else {
        logger.error('single_routeDeliverBillList_java_error-0- %s', JSON.stringify(routeResult));
      }
    } catch (err) {
      result = null;
      logger.error(`single_routeDeliverBillList_java_error- %s${err.toString()}`);
    }
    return result;
  }

  // 更新下载链接
  async updatePdfLink(params) {
    const { ctx, config, logger } = this;
    let result = false;
    try {
      const { deliverBillId, downloadUrl } = params;
      const updatePdfLinkResult = await ctx.curl(`${config.cps}${upDateLink}`, {
        // 必须指定 method，支持 POST，PUT 和 DELETE
        method: 'POST',
        contentType: 'json',
        // 不需要设置 contentType，HttpClient 会默认以 application/x-www-form-urlencoded 格式发送请求
        data: {
          deliverBillId,
          downloadUrl,
        },
        // 明确告诉 HttpClient 以 JSON 格式处理响应 body
        dataType: 'json',
      });
      if (updatePdfLinkResult && updatePdfLinkResult.data && updatePdfLinkResult.data.code === 1) {
        result = true;
      } else {
        result = false;
        logger.error(`updatePdfLink-error-0-${updatePdfLinkResult.toString()}`);
      }
    } catch (err) {
      result = false;
      logger.error(`updatePdfLink-error-${err.toString()}`);
    }
    return result;
  }
}

module.exports = PDFService;
