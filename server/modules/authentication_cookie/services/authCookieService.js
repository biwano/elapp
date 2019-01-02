const sessionMaker = require('express-session');

const service = async function service(elApp) {
  const config = await elApp.authService.getServiceConfig('cookie');
  const secret = config.secret;
  const session = sessionMaker({
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  });
  return {
    // Setting up the session middleware
    preAuth(req, config, res) {
      return new Promise((resolve) => {
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
        console.log(req.session.login);
      }
      return Promise.resolve();
    },
  };
};

module.exports = {
  name: 'authCookieService',
  service,
};
