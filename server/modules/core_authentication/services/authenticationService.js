const service = function service(elApp) {
  return elApp.chainedService({
    getConfig() {
      return elApp.config.authentication;
    },
    getServiceName(method) {
      return `${method}AuthenticationService`;
    },
    signOut(req, res) {
      this.forAllChainedServices(async (chainElement, authServiceName, authService) => {
        if (typeof authService.signOut !== 'undefined') {
          return authService.signOut(req, chainElement, res);
        }
        return Promise.resolve();
      });
    },
  });
};

module.exports = {
  name: 'authenticationService',
  service,
};
