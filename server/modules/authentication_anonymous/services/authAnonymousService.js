const service = function service(elApp) {
  return {
    authenticate(req, config) {
      return Promise.resolve(config.login || 'anonymous');
    },
  };
};

module.exports = {
  name: 'authAnonymousService',
  service,
};
