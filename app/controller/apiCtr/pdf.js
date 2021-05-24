'use strict';
const fs = require('fs');
const path = require('path');
const Pool = require('../../../utils/pool');
const Controller = require('egg').Controller;
const Response = require('../../extend/response');
const PDFMerge = require('pdf-merge');
const dayjs = require('dayjs');
const qr = require('qr-image');
const compressing = require('compressing');

/**
 * pdf默认配置
 */

const footerTemplate =
  `<div
    style="width:80%;margin:0 auto;font-size: 8px;padding:10px 0;display: flex; justify-content: space-between; ">
    <span style="">页码</span>
    <div><span class="pageNumber">
    </span> / <span class="totalPages"></span></div>
    </div>`;
// 页眉
//     <span class="totalPages"></span>
// <span class="date"></span>
const headerTemplate =
  `<div
    style="width:80%;margin:0 auto;font-size: 8px;padding:10px 0;display: flex; justify-content: space-between;">
    </div>`;
const defaultOptions = {
  // width: '794px',
  // height: '1123px',
  displayHeaderFooter: true,
  headerTemplate,
  footerTemplate,
  format: 'A4',
  margin: {
    top: '55px',
    bottom: '60px',
  },
};

/**
 * 最终需要的文件
 * /imgs/1298170034618675296/
 * [ 总拣货单.pdf, 临平一线.pdf, 临平二线.pdf ]
 */

function removeDir(dir) {
  if (fs.existsSync(dir)) {
    if (fs.lstatSync(dir).isDirectory()) {
      const directory = fs.readdirSync(dir);
      directory.forEach(file => {
        if (fs.existsSync(`${dir}/${file}`)) {
          fs.unlinkSync(`${dir}/${file}`);
        }
      });
      fs.rmdirSync(dir);
    } else {
      fs.unlinkSync(dir);
    }
  }
}
function removeFiles(files) {
  if (!files || !Array.isArray(files)) {
    return;
  }
  const len = files.length;
  for (let i = 0; i < len; i++) {
    if (fs.existsSync(files[i])) {
      fs.unlinkSync(files[i]);
    }
  }
}

class PDFController extends Controller {
  // 生成pdf开始 总的入口
  async create() {
    const { ctx, config, logger } = this;
    try {
      const { deliverBillId = '' } = ctx.query;
      if (!deliverBillId) {
        Response.Fail(ctx, '缺少deliverBillId参数');
        return;
      }
      // 后台执行生成pdf
      ctx.runInBackground(async () => {
        const { chromePath, baseDir, localImgDir } = config;
        const pagePool = new Pool(1, 1, chromePath); // 实例化
        const GoogleBroswer = await pagePool.createBrowser(794, 1123); // 打开一个谷歌
        const GooglePage = await GoogleBroswer.newPage(); // 打开一个页面
        this.GoogleBroswer = GoogleBroswer;
        this.GooglePage = GooglePage; // 挂载到this上
        // 监听浏览器报错
        // Chromium 关闭或崩溃
        // 调用browser.disconnect 方法
        GoogleBroswer.on('disconnected', this.closeBroswer);

        // 操作的主要文件夹， 根目录下imgs 使用绝对路径
        const deliverBillIdFile = path.join(baseDir, localImgDir, `${deliverBillId}_${dayjs().valueOf()}`);

        // 总的操作文件夹
        this.actionDir = deliverBillIdFile;
        // 生成单号对应的文件，便于操作pdf文件
        if (!fs.existsSync(deliverBillIdFile)) {
          fs.mkdirSync(deliverBillIdFile);
        }
        /**
         * 开始生成总的拣货单
         */
        const allPickListRes = await this.allPickList(deliverBillId);

        /**
         * 生成各个线路的 拣货单 配送单 提货单
         */
        const allRouteListRes = await this.allRoutePdf(deliverBillId);

        // 所有的pdf生成都完成了
        if (allPickListRes && allRouteListRes) {
          // 打包 上传 更新链接
          this.createZip(deliverBillIdFile, deliverBillId + '');
          ctx.logger.error('pdf_file_create %s', '开始打包上传并更新发货单链接');
        } else {
          // 生成失败 需要清理谷歌和本地文件 释放内存
          this.clearMemory(deliverBillIdFile);
          ctx.logger.error('pdf_file_create_error %s', '总拣货单或者线路单部分生成失败');
        }
      });
      // 返回调用成功
      Response.SUCCESS(ctx, true);
    } catch (err) {
      logger.error('pdfcreate-PDFController-errow', err);
      Response.Err(ctx, true);
    }
  }

  closeBroswer() {
    const { logger, GoogleBroswer } = this;
    logger.info('GoogleBroswer_Disconnected');
    GoogleBroswer.close();
  }

  // 所有的拣货单
  async allPickList(deliverBillId) {
    const { ctx, logger } = this;
    try {
      if (!deliverBillId) {
        return false;
      }
      // 从java端拿到总的拣货单数据
      const allPickRes = await ctx.service.pdf.allPickList({ deliverBillId });
      if (allPickRes) {
        const {
          activityName = '',
          routeName = '',
          routeCount = '',
          orderEndTime = '',
          orderStartTime = '',
          itemList = [],
        } = allPickRes;

        // 有商品才生成
        if (itemList.length) {
          // 拿到总计总的商品数量
          let sum = 0;
          itemList.forEach(item => {
            sum += parseInt(item.quantity, 10);
          });

          // 开始生产pdf
          const pdfPath = path.join(this.actionDir, '总拣货单.pdf');
          const template = await ctx.renderView('allPickList.html', {
            sum,
            activityName,
            routeName,
            routeCount,
            orderEndTime,
            orderStartTime,
            itemList,
          });
          if (this.GooglePage.isClosed()) {
            // 重新创建一个page
            this.GooglePage = await this.GoogleBroswer.newPage();
          }
          await this.GooglePage.setContent(template);
          await this.GooglePage.pdf({
            ...defaultOptions,
            path: pdfPath,
          });

          return pdfPath;
        }
        logger.info('allPickList-PDFController-fail', '生成配送单pdf失败，商品数据为空');
        return false;
      }
      logger.info('allPickList-PDFController-fail', '生成配送单pdf失败，java返回为空');
      return false;
    } catch (err) {
      logger.error('allPickList-PDFController-errow', err);
      return false;
    }
  }

  // 线路 的拣货单 配送单 提货单
  async allRoutePdf(deliverBillId) {
    const { logger } = this;
    try {
      if (!deliverBillId) {
        return false;
      }
      let routes = []; // 所有线路的返回结果
      let pageNum = 1;

      let routePdf = await this.routePdf(deliverBillId, pageNum);
      // routePdf = {
      //   hasNext: hasNext,
      //   outPut,
      //   pageNum,
      // }
      routes.push(routePdf);
      while (routePdf && routePdf.hasNext) {
        // 如果有下一页
        pageNum += 1;
        logger.info('allRoutePdf_create_pageNum 分页线路+++++', pageNum);
        routePdf = await this.routePdf(deliverBillId, pageNum);
        routes.push(routePdf);
      }
      // 需要拿到所有的线路 说明执行完毕
      if (routes && routes.length) {
        let flag = true;
        for (let i = 0; i < routes.length; i++) {
          if (!routes[i].outPut) {
            flag = false;
          }
        }
        // 清空缓存数据
        routes = [];
        if (flag) {
          return true;
        }
        // 有线路缺失 不上传压缩文件
        return false;
      }
      return false;
    } catch (err) {
      logger.error('allRoutePdf-PDFController-errow', err);
      return false;
    }
  }

  // 单个线路 pdf
  async routePdf(deliverBillId, pageNum) {
    const { logger, ctx } = this;
    try {
      const routePdfRes = await ctx.service.pdf.routeDeliverBillList({ deliverBillId, pageNum });
      if (routePdfRes) {
        const {
          findDeliverBillDeliverListResp = null, findDeliverBillPickingListResp = null, findDeliverBillTakeListResp = null, hasNext,
        } = routePdfRes;
        if (findDeliverBillDeliverListResp &&
            findDeliverBillPickingListResp &&
            findDeliverBillTakeListResp) {

          // routeLiverRes,routePickRes,routeTakeRes返回值：一个path 或者 false

          // 单个路线拣货单
          const routePickRes = await this.pickList(findDeliverBillPickingListResp);

          // 单个路线配送单
          const routeLiverRes = await this.liverList(findDeliverBillDeliverListResp);

          // 单个路线提货单
          const routeTakeRes = await this.takeList(findDeliverBillTakeListResp);

          logger.info(`routePdf ${findDeliverBillPickingListResp.routeName}单个路线pdf生成结果+++++`, routeLiverRes, routePickRes, routeTakeRes);

          if (routeLiverRes && routePickRes && routeTakeRes) {
            // 一个线路的pdf都生成完毕, 需要合并在一起
            // 拿到线路名
            const routeName = findDeliverBillPickingListResp.routeName;
            const outPut = path.join(this.actionDir, `${routeName}.pdf`);
            // 生成顺序 拣货单 配送单 提货单
            let files = [ routePickRes, routeLiverRes, routeTakeRes ];
            await PDFMerge(files, { output: outPut });

            logger.info('routePdf-PDFController-info 单个线路合并结果+++++', routeLiverRes, routePickRes, routeTakeRes);
            // 合并完成 后需要删除 单个线路的 拣货单 配送单 提货单 pdf
            removeFiles(files);
            files = [];
            // 保证最后留下的都是 需要打包的pdf
            return {
              hasNext,
              outPut,
              pageNum,
            };
          }
          logger.info('routePdf-PDFController-info', `${findDeliverBillPickingListResp.routeName}单个线路合并数据缺失`);
          // 返回一个是否有下一个路线的标示符号
          return {
            hasNext,
            pageNum,
          };
        }
        logger.info('routePdf-PDFController-info', `${findDeliverBillPickingListResp.routeName}单个线路java数据内容为空`);
        return {
          hasNext,
          pageNum,
        };
      }
      logger.info('routePdf-PDFController-info', '单个线路java数据为空');
      return {
        hasNext: false,
        pageNum,
      };
    } catch (err) {
      logger.error('routePdf-PDFController-errow', err);
      return {
        hasNext: false,
        pageNum,
      };
    }
  }
  // 单个线路配送单
  async liverList(liverList) {
    const { ctx, logger } = this;
    try {
      // 获取配送单数据
      if (liverList) {
        const {
          activityName = '',
          orderEndTime = '',
          orderStartTime = '',
          organizerList = [],
        } = liverList;
        const pdfListData = [];
        if (activityName && organizerList.length) {
          organizerList.forEach((item, index) => {
            const {
              collectionSiteName,
              itemList,
              qrcodeUrl,
              organizerAddress,
              organizerCountryRegion,
              organizerMobile,
              organizerSort,
              organizerName,
              routeName,
              shopper,
              shopperPhone,
            } = item;
            let sum = 0; // 总计
            if (itemList && itemList.length) {
              itemList.forEach(item => {
                sum += parseInt(item.quantity, 10);
              });
            }

            // 拿到扫码链接
            const base64Src = qr.imageSync(qrcodeUrl, { type: 'png', size: 120 }).toString('base64');
            // 直接无法显示，需要加上前缀
            const url = `data:image/png;base64,${base64Src}`;

            // 单个团长配送单所需数据
            const obj = {
              currentPage: index + 1,
              pageCount: organizerList.length,
              sum,
              url,
              collectionSiteName,
              organizerSort,
              activityName,
              orderEndTime,
              orderStartTime,
              organizerAddress, // 团长地址
              organizerCountryRegion, // 团长所在区
              organizerMobile, // 团长手机
              organizerName, // 团长名称
              routeName, // 线路名称
              shopper, // 配送员
              shopperPhone, // 配送员电话
              itemList, // 商品信息
              nowTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            };
            pdfListData.push(obj);
          });
        } else {
          logger.info('liverList-PDFController-fail', '单个路线生成拣货单pdf失败，java返回为空');
          return false;
        }

        if (pdfListData.length) {
          // 开始生产pdf
          let files = [];
          for (let i = 0, len = pdfListData.length; i < len; i++) {
            const pdfPath = path.join(this.actionDir, `liver_list_${i}.pdf`);
            const template = await ctx.renderView('liverList.html', pdfListData[i]);
            if (this.GooglePage.isClosed()) {
              this.GooglePage = await this.GoogleBroswer.newPage();
            }
            await this.GooglePage.setContent(template);
            await this.GooglePage.pdf({
              ...defaultOptions,
              path: pdfPath,
            });
            files.push(pdfPath);
          }

          // 生成完成之后，合并pdf
          const outPut = path.join(this.actionDir, 'liver_list.pdf');
          // 保存合并pdf
          /**
           * 需要依赖pdftk，本地需要自己安装，服务器已经安装
           */
          await PDFMerge(files, { output: outPut });

          // 清除本地文件
          removeFiles(files);
          files = [];
          logger.info('liverList-PDFController-success+++++', outPut);
          return outPut;
        }
        logger.info('liverList-PDFController-fail', '单个路线生成拣货单pdf失败，处理数据为空');
        return false;
      }
      logger.info('liverList-PDFController-fail', '单个路线生成拣货单pdf失败，java返回为空');
      return false;
    } catch (err) {
      logger.error('liverList-PDFController-errow', err);
      return false;
    }
  }

  // 单个线路拣货单
  async pickList(pickList) {
    const { ctx, logger } = this;
    try {
      // 获取配送单数据
      if (pickList) {
        const {
          // qrcodeUrl = '',
          activityName = '',
          orderEndTime = '',
          orderStartTime = '',
          routeCount = 0,
          routeName = '',
          itemList = [],
        } = pickList;
        // 有商品才生成
        if (itemList.length) {
          // 拿到总计 总的商品数量
          let sum = 0;
          itemList.forEach(item => {
            sum += parseInt(item.quantity, 10);
          });

          // // 拿到扫码链接
          // const base64Src = qr.imageSync(qrcodeUrl || 'https://baidu.com', { type: 'png', size: 120 }).toString('base64');
          // // 直接无法显示，需要加上前缀
          // const url = `data:image/png;base64,${base64Src}`;
          // 开始生产pdf
          const pdfPath = path.join(this.actionDir, 'pick_list.pdf');
          const template = await ctx.renderView('pickList.html', {
            sum,
            activityName,
            routeName,
            routeCount,
            orderEndTime,
            orderStartTime,
            itemList,
          });
          if (this.GooglePage.isClosed()) {
            this.GooglePage = await this.GoogleBroswer.newPage();
          }
          await this.GooglePage.setContent(template);
          await this.GooglePage.pdf({
            ...defaultOptions,
            path: pdfPath,
          });
          logger.info('pickList-PDFController-success+++++', pdfPath);
          return pdfPath;
        }
        logger.info('pickList-PDFController-fail', '单个线路拣货单pdf失败，商品数据为空');
        return false;
      }
      logger.info('pickList-PDFController-fail', '单个线路拣货单pdf失败，商品数据为空');
      return false;
    } catch (err) {
      logger.error('pickList-PDFController-errow', err);
      return false;
    }
  }

  // 单个线路提货单
  async takeList(takeList) {
    const { ctx, logger } = this;
    try {
      // 获取配送单数据
      if (takeList) {
        const {
          activityName = '',
          orderEndTime = '',
          orderStartTime = '',
          organizerList = [],
        } = takeList;
        const pdfListData = [];
        if (activityName && organizerList.length) {
          organizerList.forEach((item, index) => {
            const {
              buyerList,
              collectionSiteName,
              organizerAddress,
              organizerCountryRegion,
              organizerMobile,
              organizerName,
              organizerSort,
            } = item;
            // 单个团长提货单所需数据
            const obj = {
              currentPage: index + 1,
              pageCount: organizerList.length,
              activityName,
              orderEndTime,
              orderStartTime,
              collectionSiteName,
              organizerAddress, // 团长地址
              organizerCountryRegion, // 团长所在区
              organizerMobile, // 团长手机
              organizerName, // 团长名称
              organizerSort, // 团长序号
              buyerList: buyerList.map((buyer, dex) => { buyer.index = dex + 1; return buyer; }), // 商品信息
              nowTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            };
            pdfListData.push(obj);
          });
        } else {
          logger.info('takeList-PDFController-fail', '单个路线生成提货单pdf失败，java返回为空');
          return false;
        }

        if (pdfListData.length) {
          // 开始生产pdf
          let files = [];
          for (let i = 0, len = pdfListData.length; i < len; i++) {
            const pdfPath = path.join(this.actionDir, `take_list_${i}.pdf`);
            const template = await ctx.renderView('takeList.html', pdfListData[i]);
            if (this.GooglePage.isClosed()) {
              this.GooglePage = await this.GoogleBroswer.newPage();
            }
            await this.GooglePage.setContent(template);
            await this.GooglePage.pdf({
              ...defaultOptions,
              path: pdfPath,
            });
            files.push(pdfPath);
          }

          // 生成完成之后，合并pdf
          const outPut = path.join(this.actionDir, 'take_list.pdf');
          // 保存合并pdf
          /**
           * 需要依赖pdftk，本地需要自己安装，服务器已经安装
           */
          await PDFMerge(files, { output: outPut });

          // 清除本地文件
          removeFiles(files);
          files = [];
          logger.info('takeList-PDFController-success+++++', outPut);
          return outPut;
        }
        logger.info('takeList-PDFController-fail', '单个路线生成提货单pdf失败，处理数据为空');
        return false;
      }
      logger.info('takeList-PDFController-fail', '单个路线生成提货单pdf失败，java返回为空');
      return false;
    } catch (err) {
      logger.error('takeList-PDFController-errow', err);
      return false;
    }
  }

  // 生成压缩文件
  async createZip(actionDir, deliverBillId) {
    const { ctx, logger, config } = this;

    try {
      // 压缩文件夹
      await compressing.zip.compressDir(actionDir, `${actionDir}.zip`);
      // 上传压缩文件到图片服务器
      const params = {
        fileName: `${config.ossImgDir}/赞麦源选发货单-${dayjs().format('YYYY-MM-DD-HH-mm')}.zip`,
        fileAbsPath: `${actionDir}.zip`,
      };
      const result = await ctx.service.uploadFile.uploadFile(params);
      logger.info('uploadFile_pdf_zip_result %s', JSON.stringify(result));
      if (result && result.url) {
        // 拿到了url
        const updateRes = await ctx.service.pdf.updatePdfLink({
          deliverBillId,
          downloadUrl: result.url,
        });

        if (!updateRes) {
          logger.error('upDate_pdf_zip_File_result %s', '更新pdf链接失败');
        }
      } else {
        logger.error('upload_pdf_zip_File_result %s', '上传压缩包失败哦');
      }
      // 删除本地文件
      this.clearMemory(actionDir);
    } catch (err) {
      logger.error('PDF_createZip_error', err);
      // 删除本地文件
      this.clearMemory(actionDir);
      return;
    }
  }

  async clearMemory(actionDir) {
    // 清理工作 释放内存
    const { logger } = this;
    try {
      this.GoogleBroswer.removeListener('disconnected', this.closeBroswer);
      removeDir(actionDir);
      removeDir(`${actionDir}.zip`);
      await this.GooglePage.close();
      await this.GoogleBroswer.close();
      this.actionDir = '';
      logger.info('pdf_create_clearMemory %s', '清理工作完成++++++');
    } catch (err) {
      logger.error('file_clear_error', err);
      return;
    }
  }
}

module.exports = PDFController;
