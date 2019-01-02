const express = require('express');

const router = express.Router();


// Middleware to authenticate the request
router.use('/', async (req, res, next) => {
  // Preparing each authentication module in the authentication chain
  await req.elApp.authService.forAllServices((chainElement, authServiceName, authService) => {
    if (typeof authService.preAuth !== 'undefined') {
      req.elApp.logService.trace('authentication', `Preparing ${authServiceName}`);
      return authService.preAuth(req, chainElement, res);
    }
    return Promise.resolve();
  });

  // Trying each authentication module in the authentication chain
  await req.elApp.authService.forAllServices((chainElement, authServiceName, authService) =>
    new Promise(async (resolve) => {
      req.elApp.logService.trace('authentication', `Trying ${authServiceName}`);
      const login = await authService.authenticate(req, chainElement, res);
      if (login !== undefined) {
        req.elApp.logService.trace('authentication', `Authentication successful '${login}'`);
        req.user = { login };
        resolve(true);
      } else resolve();
    }));

  // Cleaning up each authentication module in the authentication chain
  await req.elApp.authService.forAllServices(async (chainElement, authServiceName, authService) => {
    if (typeof authService.postAuth !== 'undefined') {
      req.elApp.logService.trace('authentication', `Cleaning up ${authServiceName}`);
      return authService.postAuth(req, chainElement, res);
    }
    return Promise.resolve();
  });
  if (typeof req.user === 'undefined') {
    req.elApp.logService.trace('authentication', 'No successful authentication methods');
  }
  next();
});
// Returns the authenticated user
router.get('/auth', (req, res) => {
  res.json(req.user);
});

module.exports = { path: '/', router };
