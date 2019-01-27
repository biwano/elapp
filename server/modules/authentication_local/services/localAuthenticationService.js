const bcrypt = require('bcrypt');

const service = function service(elApp) {
  return {
    encrypt(password) {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      return bcrypt.hashSync(password, salt);
    },
    verify(plainPassword, hashedPassword) {
      return bcrypt.compareSync(plainPassword, hashedPassword);
    },
    async authenticate(req) {
      let user = null;
      const realm = req.headers['elapp-realm'] || elApp.realmService.defaultRealm;
      const apikey = req.headers['elapp-api-key'];
      const login = req.headers['elapp-login'];
      const password = req.headers['elapp-password'];
      const documentService = req.elApp.DocumentService('group:admin', realm);
      if (typeof key !== 'undefined') {
        // Api key authentication
        user = await documentService.matchOne({ $schema: 'user', apikey });
      } else if (typeof login !== 'undefined' && typeof password !== 'undefined') {
        // Password authentication
        const tmpUser = await documentService.getByKey('user', login);
        if (tmpUser !== null && this.verify(password, tmpUser.password)) {
          user = tmpUser;
        }
      }
      if (user !== null) return { realm, login: user.login };
      return undefined;
    },
  };
};

module.exports = {
  name: 'localAuthenticationService',
  service,
};
