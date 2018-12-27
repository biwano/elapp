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
const load = async function load(elApp) {
  const modulesDir = join(__dirname, 'modules');

  // Requiring modules
  const modules = {};
  listDirectories(modulesDir).forEach((dir) => {
    const module_ = require(join(dir, 'index.js'));
    module.loaded = false;
    Object.assign(module_, {
      status: 'viewed',
      path: dir,
      elApp,
    });
    modules[module_.name] = module_;
  });
  const loadModule = async function loadModule(moduleName) {
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
          dependencies.forEach((dependencyName) => {
            loadModule(dependencyName);
          });
        }
        // Loading module
        console.log(`[Module Loader] loading: ${moduleName}`);
        const loadFiles = function loadFiles(path, callback) {
          const filesPath = join(module_.path, path);
          if (existsSync(filesPath)) {
            listFiles(filesPath).forEach(filePath => callback(require(filePath)),
            );
          }
        };
        // Initializing module
        const initPath = join(module_.path, 'init.js');
        if (existsSync(initPath)) {
          await require(initPath)(elApp);
        }
        // Loading routers
        loadFiles('routers', elAppRouter => elApp.registerRouter(elAppRouter));
        // Loading methods
        loadFiles('methods', elAppMethod => elApp.registerMethod(elAppMethod));
        module_.status = 'loaded';
        resolve();
      } else if (module_.status === 'loaded') {
        resolve();
      } else {
        error = `[Module Loader] Error: module status error: ${moduleName}`;
      }
      if (typeof error !== 'undefined') reject('error');
    }));
  };
  Object.keys(modules).forEach(async (module) => { await loadModule(module); });
};

module.exports = load;
