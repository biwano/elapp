const fs = require('fs');
const path = require('path');

const serviceMaker = function serviceMaker(elApp) {
  const categories = {};
  elApp.registerHook('module_loading', (module_) => {
    // Registering assets
    Object.keys(categories).forEach((categoryName) => {
      const category = categories[categoryName];
      elApp.forEachFile(module_, categoryName, (filePath) => {
        const name = path.basename(filePath);
        elApp.logService.trace('assets', `${module_.name} asset '${name}' registered`);
        category.assets[name] = filePath;
        if (typeof category.callback !== 'undefined') {
          category.callback(module_, filePath);
        }
      });
    });
  });
  const service = {
    categories,
    registerCategory(category, callback) {
      this.categories[category] = this.categories[category] || { assets: {}, callback };
    },
    getAsset(category, assetName) {
      return new Promise((resolve) => {
        this.registerCategory(category);
        const assetPath = this.categories[category].assets[assetName];
        if (typeof assetPath !== 'undefined') {
          elApp.logService.debug('assets', `Reading asset '${assetPath}' at location ${assetPath}`);
          fs.readFile(assetPath, { encoding: 'utf-8' }, (err, data) => {
            resolve(data);
          });
        } else {
          elApp.logService.error('assets', `Reading asset '${assetName}' failed`);
          resolve();
        }
      });
    },
    sendAsset(res, category, assetName) {
      this.getAsset(category, assetName).then((data) => {
        res.setHeader('Content-Length', data.length);
        res.write(data, 'binary');
        res.end();
        return data;
      }).catch(() => {
        res.sendNotFound();
      });
    },
  };
  service.registerCategory('helpers');
  return service;
};

module.exports = {
  name: 'assetsService',
  service: serviceMaker,
};
