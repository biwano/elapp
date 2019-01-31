
const service = function service(elApp) {
  return elApp.chainedService({
    getConfig() {
      return elApp.config.groups;
    },
    getServiceName(method) {
      return `${method}GroupsService`;
    },
  });
};

module.exports = {
  name: 'groupsService',
  service,
};
