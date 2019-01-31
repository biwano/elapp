const service = function service(elApp) {
  const components = {};
  elApp.registerHook('module_loading', (module_) => {
    elApp.loadFiles(module_, 'components', (component) => {
      elApp.logService.trace('uiComponents', `File UI: Component '${component.name}' registered`);
      components[component.name] = component;
    });
  });
  return {
    components,
    get(componentName) {
      const component = this.components[componentName];
      return Promise.resolve(component);
    },
  };
};

module.exports = {
  name: 'fileUiComponentsService',
  service,
};
