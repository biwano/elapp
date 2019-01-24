const session = require('express-session');
const FileStore = require('session-file-store')(session);

const service = async function service(elApp) {
  return {
    getStore(options) {
      const store = new FileStore(options);
      return Promise.resolve(store);
    },
  };
};

module.exports = {
  name: 'cookieAuthenticationFileStoreService',
  service,
};
