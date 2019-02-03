const fs = require('fs');
const path = require('path');

/*
function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
function serializeFunctions(object) {
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const val = object[key];
    if (isFunction(val)) {
      object[key] = `function ${val.toString()}`;
    } else if (typeof (val) === 'object') {
      serializeFunctions(val);
    }
  }
}
*/
const service = function service(elApp) {
  const components = {};
  const locales = {};
  elApp.registerHook('module_loading', (module_) => {
    // Registering components
    elApp.forEachFile(module_, 'components', (filePath) => {
      const name = path.basename(filePath);
      elApp.logService.trace('uiComponents', `File UI: Component '${name}' registered`);
      components[name] = filePath;
    });
    // Registering locales
    elApp.loadFiles(module_, 'locales', (locale, filePath) => {
      let language = path.basename(filePath);
      language = language.split('.')[0];
      elApp.logService.trace('uiComponents', `File UI: Locale '${language}' registered`);
      locales[language] = locales[language] || {};
      Object.assign(locales[language], locale);
    });
  });
  return {
    components,
    locales,
    getComponent(componentName, res) {
      return new Promise((resolve) => {
        const componentPath = this.components[`${componentName}.js`];
        elApp.logService.debug('uiComponents', `Reading component '${componentName}' at location ${componentPath}`);
        if (typeof componentPath !== 'undefined') {
          fs.readFile(componentPath, { encoding: 'utf-8' }, (err, data) => {
            res.setHeader('Content-Length', data.length);
            res.write(data, 'binary');
            res.end();
            resolve(data);
          });
        } else resolve();
      });
    },
    getLocale(language) {
      return Promise.resolve(locales[language]);
    },
  };
};

module.exports = {
  name: 'fileUiComponentsService',
  service,
};
