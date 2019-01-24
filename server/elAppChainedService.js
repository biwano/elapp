module.exports = function chainedServiceMaker(elApp) {
  return function chainedService(service) {
  // Helper function to pass a callback function to a chain of services.
  // returns when a callback does not return undefined
    service.forAllChainedServices = function forAllChainedServices(callback) {
      const config = this.getConfig();
      return new Promise(async (resolve) => {
        let res;
        for (let i = 0; i < config.chain.length; i += 1) {
          const chainElement = config.chain[i];
          const serviceName = this.getServiceName(chainElement.method);
          const service = elApp[serviceName];
          if (typeof service !== 'undefined') {
            res = await callback(chainElement, serviceName, service);
          } else {
            elApp.logService.error('core', `Cannot find service ${serviceName}`);
          }
          if (typeof res !== 'undefined') break;
        }
        resolve(res);
      });
    };
    service.getChainedServiceConfig = function getChainedServiceConfig(method) {
      const serviceName = this.getServiceName(method);
      return this.forAllChainedServices((chainElement, localServiceName) => {
        if (serviceName === localServiceName) return Promise.resolve(chainElement);
        return Promise.resolve();
      });
    };
    return service;
  };
};
