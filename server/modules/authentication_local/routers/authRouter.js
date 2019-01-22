const express = require('express');

const router = express.Router();

router.post('/sign_in', async (req, res, next) => {
  try {
    const password = req.body.password;
    const login = req.body.login;
    // Getting user
    const user = await req.elApp.documentService('group:admin').getByKey('user', login);
    if (user === null) {
    } else {
      const result = req.elApp.AuthLocalService.verify(password, user.password);
      if (result === true) { req.authlocalsuccesful = true; next(); return; }
    }
    req.elApp.logService.debug('authentication', `Authentication failure for '${login}'`);
  } catch (e) {
    req.elApp.logService.debug('authentication', 'Local Sign in exception');
  }
});

module.exports = { path: '/local_auth', router };
