const sessionMaker = require('express-session');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const service = async function service(elApp) {
  return {
    //
    async getSession() {
      if (typeof this.session === 'undefined') {
        const config = await elApp.authenticationService.getChainedServiceConfig('cookie');
        const secret = config.secret;
        const storeName = config.store || 'memory';
        const storeServiceName = `cookieAuthentication${capitalizeFirstLetter(storeName)}StoreService`;
        const storeService = elApp[storeServiceName];
        if (typeof storeService !== 'undefined') {
          elApp.logService.debug('authentication', `Creating cookie based session using store '${storeServiceName}'`);
          elApp.logService.trace('authentication', `Options ${JSON.stringify(config.storeOptions)}'`);
          const store = await storeService.getStore(config.storeOptions);
          this.session = sessionMaker({
            secret,
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false },
            store,
          //
          });
        } else elApp.logService.error('authorization', `Cannot find service ${storeServiceName}`);
      }
      return this.session;
    },
    // Setting up the session middleware
    preAuth(req, config, res) {
      return new Promise(async (resolve) => {
        const session = await this.getSession(req.elApp);
        session(req, res, () => { resolve(); });
      });
    },
    // Authenticating against the session
    authenticate(req) {
      let login;
      if (typeof req.session.login !== 'undefined') login = req.session.login;
      return Promise.resolve(login);
    },
    // Setting up credentials in the cookie
    postAuth(req) {
      if (typeof req.user !== 'undefined' && req.user.login !== req.session.login) {
        elApp.logService.trace('authentication', `Saving credentials '${req.user.login}' in sesson`);
        req.session.login = req.user.login;
      }
      return Promise.resolve();
    },
    // Sign Out
    signOut(req) {
      elApp.logService.trace('authentication', `Destroying session '${req.session.user}'`);
      req.session.destroy();
      return Promise.resolve();
    },
  };
};

module.exports = {
  name: 'cookieAuthenticationService',
  service,
};
