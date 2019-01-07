const crypto = require('crypto');

const service = function service(elApp) {
  return {
    encrypt(password) {
      const key = elApp.getConfig(elApp.authentication);
      const encrypted = crypto.createHmac('sha1', key).update(password).digest('hex');
      return encrypted;
    },
    async authenticate(req) {
      let user = null;
      const key = req.headers['ELAPP-API-KEY'];
      const login = req.headers['ELAPP-LOGIN'];
      const password = req.headers['ELAPP-PASSWORD'];
      if (typeof key !== 'undefined') {
        // Api key authentication
        user = await req.documentService.getByfields({ apikey: req.headers['ELAPP-API-KEY'] });
      } else if (typeof login !== 'undefined' && typeof password !== 'undefined') {
        // Password authentication
        user = await req.documentService.getByfields({
          login: req.headers['ELAPP-API-KEY'],
          password: this.encrypt(password,
          ) });
      }
      if (user !== null) return { login: user.login };
      return undefined;
    },
  };
};

module.exports = {
  name: 'authLocalService',
  service,
};
