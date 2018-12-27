const config = require('./config.js');

const elAppMaker = function elAppMaker(app) {
  const elApp = {};
  elApp.express = app;
  elApp.methods = {};
  elApp.config = config;

  elApp.getConfig = function getConfig(path, def) {
    const elems = path.split('.');
    let localconfig = elApp.config;
    let i = 0;
    while (i < elems.length) {
      localconfig = localconfig[elems[i]];
      i += 1;
      if (typeof localconfig === 'undefined') return def;
    }
    return localconfig;
  };
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
