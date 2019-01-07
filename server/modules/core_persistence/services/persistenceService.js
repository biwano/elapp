module.exports = {
  name: 'persistence',
  service(elApp) {
    const serviceId = elApp.getConfig('persistence.backend');
    const serviceName = elApp.utils.camelCase(`persistence_${serviceId}_service`);
    console.log(serviceName);
    return elApp[serviceName];
  },
};