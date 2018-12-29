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
const loadModule = async function loadModule(elApp, modules, moduleName) {
  return new Promise((async (resolve, reject) => {
    const module_ = modules[moduleName];
    let error;
    if (typeof module_ === 'undefined') {
      error = `[Module Loader] Error: module not found: ${moduleName}`;
    } else if (module_.status === 'loading') {
      error = `[Module Loader] Error: module cycle detected: ${moduleName}`;
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
          //console.log(`DEP start: ${dependencyName}`);
          await loadModule(elApp, modules, dependencyName);
          //console.log(`DEP end: ${dependencyName}`);
        }
      }
      // Loading module
      console.log(`[ Module Loader ] loading: ${moduleName}`);
      const loadFiles = function loadFiles(path, callback) {
        const filesPath = join(module_.path, path);
        if (existsSync(filesPath)) {
          listFiles(filesPath).forEach(filePath => callback(require(filePath)),
          );
        }
      };
        // Loading routers
      loadFiles('routers', elAppRouter => elApp.registerRouter(elAppRouter));
      // Loading services
      loadFiles('services', elAppService => elApp.registerService(elAppService));
      // Initializing module
      if (typeof module_.init !== "undefined") {
        await module_.init(elApp);
      }
      module_.status = 'loaded';
      //console.log(`[Module Loader] loaded: ${moduleName}`);
      resolve();
    } else if (module_.status === 'loaded') {
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
        modules[module_.name] = module_;
      }
      catch(e) {
        console.log(`[ Module Loader ] ignoring folder: ${dir}`);
      }
    });
    /* eslint-disable */
    for (const moduleName of Object.keys(modules)) {
      //console.log(`ROOT start: ${moduleName}`);
      await loadModule(elApp, modules, moduleName);
      //console.log(`ROOT end: ${moduleName}`);
    }
    resolve();
  }));
  
};

module.exports = load;
