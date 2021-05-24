'use strict';
const Pool = require('../../utils/pool');

module.exports = app => {
  return {
    schedule: {
      cron: '0 0 4 * * *', // 每天的4点0分0秒重启谷歌
      type: 'all', // 指定所有的 worker 都需要执行
    },
    async task() {
      const { chromePath, MAX_WSE, MAX_PAGE } = app.config;
      app.logger.info('reStartChrome_config', MAX_WSE, MAX_PAGE);
      const oldPool = app.pagePool;
      const backup = new Pool(MAX_WSE, MAX_PAGE, chromePath);
      backup.browsers = await backup.createAll();
      app.pagePool = backup;
      await oldPool.checkFree();
      await oldPool.close();
      app.logger.info('reStartChrome', '定时器执行成功+++++');
    },
  };
};
