const path = require('path');

const service = function service(elApp) {
  const locales = {};
  elApp.assetsService.registerCategory('components');
  elApp.assetsService.registerCategory('locales', (module_, filePath) => {
    const locale = require(filePath);
    let language = path.basename(filePath);
    language = language.split('.')[0];
    elApp.logService.trace('uiComponents', `${module_.name} Locale '${language}' registered`);
    locales[language] = locales[language] || {};
    Object.assign(locales[language], locale);
  });
  return {
    getLocale(language) {
      return Promise.resolve(locales[language]);
    },
  };
};

module.exports = {
  name: 'fileUiComponentsService',
  service,
};
