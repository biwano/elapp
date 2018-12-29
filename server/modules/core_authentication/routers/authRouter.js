const express = require('express');

const router = express.Router();

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
// Middleware to inject the authenticated user to the request
router.use('/', (req, res, next) => {
  const config = req.elApp.config.authentication;
  for (let i = 0; i < config.chain.length; i += 1) {
    const chainElement = config.chain[i];
    const authServiceName = `auth${capitalizeFirstLetter(chainElement.method)}Service`;
    const authenticationService = req.elApp[authServiceName];
    const user = authenticationService.authenticate(req, chainElement);
    if (user !== undefined) {
      req.user = user;
      break;
    }
  }
  next();
});
// Returns the authenticated user
router.get('/auth', (req, res) => {
  res.json(req.user);
});

module.exports = { path: '/', router };
