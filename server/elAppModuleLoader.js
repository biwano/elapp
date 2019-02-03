/* eslint-disable import/no-dynamic-require, global-require */
const { lstatSync, readdirSync, existsSync } = require('fs');
const { join } = require('path');

const isDirectory = source => lstatSync(source).isDirectory();
const isFile = source => lstatSync(source).isFile();
const listDirectories = function listDirectories(dir) {
  return readdirSync(dir).map(name => join(dir, name)).filter(isDirectory);
};
const listFiles = function listFiles(dir) {
  return readdirSync(dir).map(name => join(dir, name)).filter(isFile);
};
const trace = function trace(elApp, data) {
  if (typeof elApp.logService !== 'undefined') {
    elApp.logService.trace('moduleloader', data);
  }
};
const debug = function debug(elApp, data) {
  if (typeof elApp.logService !== 'undefined') {
    elApp.logService.debug('moduleloader', data);
  }
};
const error = function error(elApp, data) {
  if (typeof elApp.logService !== 'undefined') {
    elApp.logService.debug('moduleloader', data);
  } else {
    console.log(data);
  }
};
const loadFiles = async function loadFiles(module_, path, callback) {
  const filesPath = join(module_.path, path);
  if (existsSync(filesPath)) {
    const files = listFiles(filesPath);
    for (let i = 0; i < files.length; i += 1) {
      const filePath = files[i];
      await callback(require(filePath), filePath);
    }
  }
};
const forEachFile = async function forEachFile(module_, path, callback) {
  const filesPath = join(module_.path, path);
  if (existsSync(filesPath)) {
    const files = listFiles(filesPath);
    for (let i = 0; i < files.length; i += 1) {
      const filePath = files[i];
      await callback(filePath);
    }
  }
};

const loadModule = async function loadModule(elApp, modules, moduleName) {
  return new Promise((async (resolve, reject) => {
    const module_ = modules[moduleName];
    let moduleError;
    if (typeof module_ === 'undefined') {
      moduleError = `Error: module not found: ${moduleName}`;
    } else if (module_.status === 'loading') {
      moduleError = `Error: module cycle detected: ${moduleName}`;
    } else if (module_.status === 'viewed') {
      // Setting loading status
      module_.status = 'loading';
      // Loading dependencies
      let dependencies = module_.dependencies;
      if (typeof dependencies === 'function') {
        dependencies = dependencies(elApp);
      }
      if (typeof dependencies === 'string') {
        dependencies = [dependencies];
      }
      if (typeof dependencies === 'object') {
        /* eslint-disable */
        for (const dependencyName of dependencies) {
          debug(elApp, `Loading dependency starts: ${dependencyName}`);
          await loadModule(elApp, modules, dependencyName);
          debug(elApp, `Loading dependency ends: ${dependencyName}`);
        }
      }
      // Loading module
      trace(elApp, `Loading: ${moduleName}`);
      // Loading routers
      await loadFiles(module_, 'routers', elAppRouter => elApp.registerRouter(elAppRouter));
      // Loading services
      await loadFiles(module_, 'services', elAppService => elApp.registerService(elAppService));
      // Trigering hooks
      elApp.invokeHooks('module_loading', module_)
      // Initializing module
      if (typeof module_.init !== "undefined") {
        await module_.init(elApp);
      }
      module_.status = 'loaded';
      debug(elApp, `Loaded: ${moduleName}`);
      resolve();
    } else if (module_.status === 'loaded') {
      debug(elApp, `already loaded: ${moduleName}`);
      resolve();
    } else {
      moduleError = `[ Module Loader ] Error: module status error: ${moduleName}`;
    }
    if (typeof moduleError !== 'undefined') reject(moduleError);
  }));
};

const loadModules = async function load(modulesDir) {
  return new Promise((async (resolve, reject) => {
    // Requiring modules
    const modules = {};
    listDirectories(modulesDir).forEach((dir) => {
      let module_;
      try {
        module_ = require(join(dir, 'elapp_module.js'));
        module.loaded = false;
        Object.assign(module_, {
          status: 'viewed',
          path: dir,
          elApp: this,
        });
        if (typeof modules[module_.name] === "undefined") {
          modules[module_.name] = module_;
        }
        else error(this, `Duplicate module name: ${module_.name}`)
      }
      catch(e) {
        debug(this, `Ignoring folder: ${dir}`);
      }
    });
    /* eslint-disable */
    for (const moduleName of Object.keys(modules)) {
      debug(this, `Loading module starts: ${moduleName}`);
      await loadModule(this, modules, moduleName);
      debug(this, `Loading module ends: ${moduleName}`);
    }
    resolve();
  }));
  
};

module.exports = { forEachFile, loadFiles, listFiles, loadModule, loadModules };
