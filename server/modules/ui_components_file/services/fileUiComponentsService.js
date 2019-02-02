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
  elApp.registerHook('module_loading', (module_) => {
    elApp.forEachFile(module_, 'components', (filePath) => {
      const name = path.basename(filePath);
      elApp.logService.trace('uiComponents', `File UI: Component '${name}' registered`);
      components[name] = filePath;
    });
  });
  return {
    components,
    respond(componentName, res) {
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
  };
};

module.exports = {
  name: 'fileUiComponentsService',
  service,
};
