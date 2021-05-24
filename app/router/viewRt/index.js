'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const { router, controller } = app;
  // 主路由 用于测试部署是否成功s
  router.get('/', controller.home.index);

  router.get('/view/goods/card', controller.viewCtr.goodsCard.second);
  /**
   * 页面路由配置列表
   */
  // router.get('/view/gourp/record', controller.viewCtr.gourpRecord.index);
  // router.get('/view/gourp/card', controller.viewCtr.gourpCard.index);

  // // 商品卡片分享图片
  // router.get('/view/card/goods', controller.viewCtr.goodsCard.index);
  // // 商品海报分享图片
  // router.get('/view/poster/goods', controller.viewCtr.goodsPoster.index);

  // // 单个海报
  // router.get('/view/gourp/singleBill', controller.viewCtr.singleBill.index);

  // // 源选配送单
  // router.get('/view/liver/list', controller.viewCtr.pdf.liver);
  // // 源选检获单
  // router.get('/view/pick/list', controller.viewCtr.pdf.pick);
  // // 源选提货单
  // router.get('/view/take/list', controller.viewCtr.pdf.take);
  // // 团长推广码
  // router.get('/view/organization/code', controller.viewCtr.organization.code);
  // router.get('/view/goods/card1', controller.viewCtr.goodsCard.index);
};
