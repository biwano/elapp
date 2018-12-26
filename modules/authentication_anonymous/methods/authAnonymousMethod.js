const method = function method(req, config) {
  return {
    login: config.login || 'anonymous',
  };
};

module.exports = {
  category: 'authentication',
  name: 'anonymous',
  method,
};
