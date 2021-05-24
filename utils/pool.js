/* eslint-disable */

const path = require('path');
const puppeteer = require('puppeteer-core');
// const Response = require('../app/extend/response');

class Pool {

  constructor(browserMax, pageMax, chromePath) {
    this.browsers = [];
    this.browserMax = browserMax;
    this.pageMax = pageMax;
    this.chromePath = chromePath;
    this.useCount = 200;
  }

  async createAll() {
    for (var i = 0; i < this.browserMax; i++) {
      let browser = await this.createBrowser();
      this.browsers[i] = { browser, pages: []};
      // let [defaultPage] = await browser.pages();
      // defaultPage = await this.setPage(defaultPage);
      // this.browsers[i].pages[0] = {
      //   page: defaultPage,
      //   used: false,
      //   count: 0,
      //   browser
      // };
      for (var k = 0; k < this.pageMax; k++) {
        let page = await this.createPage(browser);
        this.browsers[i].pages[k] = {
          page,
          used: false,
          count: 0,
          browser
        };
      }
    }
    return this.browsers;
  }

  async createBrowser(w, h) {
    let browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
      args: [
        '--no-sandbox', // 如果没有可用于Chrome的优质沙箱，它将因错误崩溃，如果您完全信任在Chrome中打开的内容，则可以使用以下--no-sandbox参数启动Chrome
        '-–single-process', // Dom解析和渲染放到同一进程
        '-–disable-gpu', // disable掉，比如GPU、Sandbox、插件等，减少内存的使用和相关计算
        '-–disable-dev-shm-usage', // 默认情况下，Docker运行一个/dev/shm共享内存空间为64MB 的容器。这通常对Chrome来说太小，并且会导致Chrome在渲染大页面时崩溃。要修复，必须运行容器 docker run --shm-size=1gb 以增加/dev/shm的容量。从Chrome 65开始，使用--disable-dev-shm-usage标志启动浏览器即可，这将会写入共享内存文件/tmp而不是/dev/shm.
        '-–disable-setuid-sandbox', // 禁用setuid沙箱（仅限Linux）
        '-–no-first-run', // 跳过首次运行任务，无论它是否实际上是第一次运行。被kForceFirstRun覆盖。这不会丢弃FirstRun标记，因此不会阻止在下次没有此标志的情况下启动chrome时首次运行
        '-–no-zygote', // 禁用使用zygote进程来分叉子进程。相反，子进程将被分叉并直接执行。请注意，-no-sandbox也应该与此标志一起使用，因为沙箱需要zygote才能工作。
      ],
      ignoreDefaultArgs: ['--disable-extensions', '--enable-automation',],
      defaultViewport: {
        width: w || 750, // 页面宽度像素
        height: h || 1400, // <number> 页面高度像素。
        isMobile: true, // 手机模式
      },
      executablePath: path.resolve(this.chromePath),
    });
    return browser;
  }

  async createPage(browser) {
    // 使用默认的就是PC 的 devices
    // const devices = require("puppeteer/DeviceDescriptors");
    // const iPhonex = devices["iPhone X"];
    let page = await browser.newPage();
    // 关闭缓存
    await page.setCacheEnabled(false);
    return page;
  }

  async setPage(page) {
    await page.setViewport({
      width: 750,
      height: 1000
    });
    // await page.emulate(iPhonex);
    // await page.setJavaScriptEnabled(false);
    await page.setRequestInterception(true);
    // page.on("request", request => {
    //   let type = request.resourceType(); // else
    //   if (type === "image" || type === "script") request.abort();
    //   else if (
    //     request.isNavigationRequest() ||
    //     request.redirectChain().length > 0
    //   ) {
    //     request.abort();
    //   } else {
    //     request.continue();
    //   }
    // });
    return page;
  }

  async use(func, ctx) {
    let item = await this._findFreePage();
    let ret;
    if (item) {
      item.used = true;
      item.count++;
      try {
        ret = await func(item.page);
      } catch (e) {
        ret = false;
      }
      if (item.count >= this.useCount) {
        await item.page.close();
        item.page = await this.createPage(item.browser);
        item.count = 0;
      }
      item.used = false;
      return ret;
    } else {
      // 没有拿到空闲的page 临时新建一个用完关闭
      let page = await this.createPage(this.browsers[0].browser);
      try {
        ret = await func(page);
      } catch (e) {
        ret = false;
      }
      await page.close();
      return ret;
    }
  }

  async _findFreePage() {
    for (var i = 0; i < this.browserMax; i++) {
      for (var k = 0; k < this.pageMax; k++) {
        let item = this.browsers[i].pages[k];
        if (item.used === false) {
          if (item.page.isClosed()) {
            item.page = await this.createPage(this.browsers[i].browser);
            item.count = 0;
          }
          this.browsers[i].pages.push(this.browsers[i].pages.splice(k, 1)[0]);
          return item;
        }
      }
    }
    return false;
  }

  sleep (time) {
    return new Promise((res, rej) => setTimeout(res, time))
  };

  async checkFree() {
    for (var i = 0; i < this.browserMax; i++) {
      for (var k = 0; k < this.pageMax; k++) {
        if (this.browsers[i].pages[k].used) {
          await this.sleep(1000);
          return this.checkFree();
        }
      }
    }
  }

  async close() {
    for (var i = 0; i < this.browserMax; i++) {
      await this.browsers[i].browser.close();
    }
  }
}

module.exports = Pool