'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  require('./router/apiRt')(app);
  require('./router/viewRt')(app);
};
