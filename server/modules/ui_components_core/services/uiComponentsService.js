
const service = function service(elApp) {
  return elApp.chainedService({
    getConfig() {
      return elApp.config.uiComponents;
    },
    getServiceName(method) {
      return `${method}UiComponentsService`;
    },
  });
};

module.exports = {
  name: 'uiComponentsService',
  service,
};
