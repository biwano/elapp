const configuration = require('./config.js');
const ChainedService = require('./elAppChainedService.js');

const elAppMaker = function elAppMaker(app) {
  const elApp = {};
  elApp.express = app;
  elApp.services = {};
  elApp.config = configuration;
  elApp.hooks = {};

  elApp.utils = {
    camelCase(name) {
      const items = name.split('_');
      return [items[0]].concat(items.slice(1).map(t => this.capitalizeFirstLetter(t))).join('');
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
  };
  // returns a config element given a path
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
  // register a router
  elApp.registerRouter = async function registerRouter(elAppRouter) {
    if (typeof elAppRouter === 'function') {
      elAppRouter = await elAppRouter(elApp);
    }
    elApp.express.use(elAppRouter.path, elAppRouter.router);
  };
  // register a service
  elApp.registerService = async function registerService(elAppService) {
    elApp[`${elAppService.name}`] = await elAppService.service(elApp);
  };
  // returns a registered service
  elApp.getService = function getService(serviceName) {
    const service = elApp[serviceName];
    if (typeof service === 'undefined') {
      elApp.logService.error('core', `Cannot find service ${serviceName}`);
    }
    return service;
  };
  // register a hook
  elApp.registerHook = function registerHook(category, func, context) {
    this.hooks[category] = this.hooks[category] || [];
    this.hooks[category].push({ func, context });
  };
  // invoke all hooks of a given category
  elApp.invokeHooks = function invokeHooks(category, ...args) {
    this.hooks[category] = this.hooks[category] || [];
    this.hooks[category].forEach(({ func, context }) => {
      func.apply(context, args);
    });
  };
  elApp.chainedService = ChainedService(elApp);

  return elApp;
};

module.exports = elAppMaker;
