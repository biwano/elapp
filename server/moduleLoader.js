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

const loadModule = async function loadModule(elApp, modules, moduleName) {
  return new Promise((async (resolve, reject) => {
    const module_ = modules[moduleName];
    let error;
    if (typeof module_ === 'undefined') {
      error = `Error: module not found: ${moduleName}`;
    } else if (module_.status === 'loading') {
      error = `Error: module cycle detected: ${moduleName}`;
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
      const loadFiles = async function loadFiles(path, callback) {
        const filesPath = join(module_.path, path);
        if (existsSync(filesPath)) {
          const files = listFiles(filesPath);
          for (let i=0;i<files.length;i+=1) {
            await callback(require(files[i]));
          };
        }
      };
        // Loading routers
      await loadFiles('routers', elAppRouter => elApp.registerRouter(elAppRouter));
      // Loading services
      await loadFiles('services', elAppService => elApp.registerService(elAppService));
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
      error = `[ Module Loader ] Error: module status error: ${moduleName}`;
    }
    if (typeof error !== 'undefined') reject(error);
  }));
};

const load = async function load(elApp) {
  return new Promise((async (resolve, reject) => {
    const modulesDir = join(__dirname, 'modules');

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
          elApp,
        });
        if (typeof modules[module_.name] === "undefined") {
          modules[module_.name] = module_;
        }
        else error(elApp, `Duplicate module name: ${module_.name}`)
      }
      catch(e) {
        debug(elApp, `Ignoring folder: ${dir}`);
      }
    });
    /* eslint-disable */
    for (const moduleName of Object.keys(modules)) {
      debug(elApp, `Loading module starts: ${moduleName}`);
      await loadModule(elApp, modules, moduleName);
      debug(elApp, `Loading module ends: ${moduleName}`);
    }
    resolve();
  }));
  
};

module.exports = load;
