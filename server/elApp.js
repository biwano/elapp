const config = require('./config.js');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const elAppMaker = function elAppMaker(app) {
  const elApp = {};
  elApp.express = app;
  elApp.services = {};
  elApp.config = config;
  elApp.hooks = {};

  elApp.utils = {
    camelCase(name) {
      const items = name.split('_');
      return [items[0]].concat(items.slice(1).map(t => capitalizeFirstLetter(t))).join('');
    },
  };

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
  elApp.registerRouter = async function registerRouter(elAppRouter) {
    if (typeof elAppRouter === 'function') {
      elAppRouter = await elAppRouter(elApp);
    }
    elApp.express.use(elAppRouter.path, elAppRouter.router);
  };
  elApp.registerService = async function registerService(elAppService) {
    elApp[`${elAppService.name}`] = await elAppService.service(elApp);
  };
  elApp.registerHook = function registerHook(category, func, context) {
    this.hooks[category] = this.hooks[category] || [];
    this.hooks[category].push({ func, context });
  };
  elApp.invokeHooks = function invokeHooks(category, ...args) {
    this.hooks[category] = this.hooks[category] || [];
    this.hooks[category].forEach(({ func, context }) => {
      func.apply(context, args);
    });
  };
  elApp.getMethod = function getMethod(category, name) {
    return elApp.methods[category][name];
  };
  return elApp;
};

module.exports = elAppMaker;
