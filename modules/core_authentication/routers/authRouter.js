const express = require('express');

const router = express.Router();

router.use('/', (req, res, next) => {
  const config = req.elApp.config.authentication;
  for (let i = 0; i < config.chain.length; i += 1) {
    const chainElement = config.chain[i];
    const authenticationMethod = req.elApp.getMethod('authentication', chainElement.method);
    const user = authenticationMethod(req, chainElement);
    if (user !== undefined) {
      req.user = user;
      console.log(req.user);
      break;
    }
  }
  next();
});

module.exports = { path: '/', router };
