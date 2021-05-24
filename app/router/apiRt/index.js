'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const { router, controller } = app;

  /**
   * 通用接口
   */
  // router.get('/snapshot', controller.apiCtr.snapshot.index);
  /**
   * 接口列表
   */
  // 跟团记录海报
  router.get('/poster/gourp/record', controller.apiCtr.gourpRecord.index);
  // 拼团商品卡片分享
  router.get('/poster/gourp/card', controller.apiCtr.gourpCard.index);

  // 商品卡片海报生成
  router.get('/card/goods', controller.apiCtr.goodsCard.index);
  // 商品卡片海报生成 v2
  router.get('/v2/card/goods', controller.apiCtr.goodsCard.second);
  // 多个商品海报生成
  router.post('/poster/goods/mut', controller.apiCtr.goodsPoster.mut);
  // 单个商品海报生成
  router.post('/poster/goods/sig', controller.apiCtr.goodsPoster.sig);
  // 专题海报生成
  router.get('/poster/special/goods', controller.apiCtr.special.index);
  // 详情也图片生产
  router.get('/poster/goods/detailImg', controller.apiCtr.special.detailImg);
  // 邀请团长海报生成
  router.post('/poster/invite/group', controller.apiCtr.inviteGroup.index);
  // 新品分享卡片
  router.post('/card/new/goods', controller.apiCtr.goodsCard.newGoods);
  // 万人团，秒杀，分类，新品专题页面海报生成
  router.get('/poster/cate/subject', controller.apiCtr.special.cateSubject);

  // 万人团，秒杀，拼团 单品海报生成
  router.get('/poster/activity/goods', controller.apiCtr.special.activityPromote);

  // 邀请新人海报生成
  router.post('/poster/invite/new', controller.apiCtr.inviteGroup.inviteNew);

  // 二维码生成
  router.get('/ewm/create', controller.apiCtr.qr.index);
  // pdf生成
  // router.get('/pdf/create', controller.apiCtr.pdf.create);
  // router.get('/pdf/zip', controller.apiCtr.pdf.createZip);
  // 源选团长推广二维码
  router.get('/poster/organization/qrcode', controller.apiCtr.organization.index);
  // c端团长推广二维码
  router.post('/organization/ewm', controller.apiCtr.organization.code);
};
