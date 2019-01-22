function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function getAuthServiceName(method) {
  const authServiceName = `auth${capitalizeFirstLetter(method)}Service`;
  return authServiceName;
}
const service = function service(elApp) {
  return {
    getConfig() {
      return elApp.config.authentication;
    },
    // Helper function to pass a callback function to all the auth services synchronously.
    // returns when a callback does not return undefined
    async forAllServices(callback) {
      const config = this.getConfig();
      let res;
      return new Promise(async (resolve) => {
        for (let i = 0; i < config.chain.length; i += 1) {
          const chainElement = config.chain[i];
          const authServiceName = getAuthServiceName(chainElement.method);
          const authService = elApp[authServiceName];
          res = await callback(chainElement, authServiceName, authService);
          if (typeof res !== 'undefined') break;
        }
        resolve(res);
      });
    },
    getServiceConfig(method) {
      const serviceName = getAuthServiceName(method);
      return this.forAllServices((chainElement, authServiceName, authService) => {
        if (authServiceName === serviceName) return Promise.resolve(chainElement);
        return Promise.resolve();
      });
    },
    signOut(req, res) {
      this.forAllServices(async (chainElement, authServiceName, authService) => {
        if (typeof authService.signOut !== 'undefined') {
          return authService.signOut(req, chainElement, res);
        }
        return Promise.resolve();
      });
    },
  };
};

module.exports = {
  name: 'authService',
  service,
};
