const config = require('./config.js');

const elAppMaker = function elAppMaker(app) {
  const elApp = {};
  elApp.express = app;
  elApp.methods = {};
  elApp.config = config;


  elApp.registerRouter = function registerRouter(elAppRouter) {
    elApp.express.use(elAppRouter.path, elAppRouter.router);
  };
  elApp.registerMethod = function registerMethod(elAppMethod) {
    elApp.methods[elAppMethod.category] = elApp.methods[elAppMethod.category] || {};
    elApp.methods[elAppMethod.category][elAppMethod.name] = elAppMethod.method;
  };
  elApp.getMethod = function getMethod(category, name) {
    return elApp.methods[category][name];
  };
  return elApp;
};

module.exports = elAppMaker;
