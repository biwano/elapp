const service = function service(elApp) {
  return {
    authenticate(req, config) {
      return Promise.resolve(config.login || 'anonymous');
    },
    // Setting up anonymous state
    postAuth(req, config) {
      if (typeof req.user !== 'undefined' && req.user.login === config.login) {
        req.user.anonymous = true;
      }
      return Promise.resolve();
    },

  };
};

module.exports = {
  name: 'authAnonymousService',
  service,
};
