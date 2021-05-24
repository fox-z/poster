// const MAX_WSE = 4;  //启动几个浏览器
// let WSE_LIST = []; //存储browserWSEndpoint列表
// let ErrCount = 0;
// init();

// function init() {
//   (async () => {
//     const PCR = require("puppeteer-chromium-resolver");
//     const stats = await PCR();

//     for(var i = 0; i < MAX_WSE; i++) {
//       const browser = await stats.puppeteer.launch({
//         headless: true,
//         args: [
//           '--no-sandbox',
//           '–single-process',
//           '–disable-gpu',
//           '–disable-dev-shm-usage',
//           '–disable-setuid-sandbox',
//           '–no-first-run',
//           '–no-zygote'
//         ],
//         executablePath: stats.executablePath,
//         defaultViewport: {
//           width: 375, // 页面宽度像素。
//           height: 300, // <number> 页面高度像素。
//           deviceScaleFactor: 1, // <number> 设置设备的缩放（可以认为是 dpr）。默认是 1。
//           isMobile: true, // <boolean> 是否在页面中设置了 meta viewport 标签。默认是 false。
//           hasTouch: false, // <boolean> 指定viewport是否支持触摸事件。默认是 false。
//           isLandscape: false, // <boolean> 指定视口是否处于横向模式。默认是 false。
//         }
//       }).catch(function(error) {
//         ErrCount += 1;
//       });
//       browserWSEndpoint = await browser.wsEndpoint();
//       WSE_LIST[i] = browserWSEndpoint;
//     }
//     console.log(WSE_LIST);
//   })();
// }

// module.exports = WSE_LIST;
