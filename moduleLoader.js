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
const load = function load(elApp) {
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
  const loadModule = function loadModule(moduleName) {
    const module_ = modules[moduleName];
    if (typeof module_ === 'undefined') {
      console.log(`[Module Loader] module not found: ${moduleName}`);
    } else if (module_.status === 'loading') {
      console.log(`[Module Loader] module cycle detected: ${moduleName}`);
    } else if (module_.status === 'viewed') {
      // Setting loading status
      module_.status = 'loading';
      // Loading dependencies
      if (typeof module_.dependencies !== 'undefined') {
        module_.dependencies.forEach((dependencyName) => {
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

      // Loading routers
      loadFiles('routers', elAppRouter => elApp.registerRouter(elAppRouter));
      // Loading methods
      loadFiles('methods', elAppMethod => elApp.registerMethod(elAppMethod));
      module_.status = 'loaded';
      console.log(`[Module Loader] loaded: ${moduleName}`);
    } else if (module_.status === 'loaded') {
    } else {
      console.log(`[Module Loader] module status error: ${moduleName}`);
    }
  };
  // Loading modules
  Object.keys(modules).forEach(loadModule);
};

module.exports = load;
