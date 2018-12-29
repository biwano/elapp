const service = function service(elApp) {
  return {
    authenticate(req, config) {
      return { login: config.login || 'anonymous' };
    },
  };
};

module.exports = {
  name: 'authAnonymousService',
  service,
};
