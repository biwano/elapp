module.exports = {
  name: 'groupsService',
  service(elApp) {
    const serviceId = elApp.getConfig('groups.backend', 'local');
    const serviceName = elApp.utils.camelCase(`groups_${serviceId}_service`);
    return elApp[serviceName];
  },
};
