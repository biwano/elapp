const express = require('express');

const router = express.Router();


// Middleware to authenticate the request
router.use('/', async (req, res, next) => {
  // Preparing each authentication module in the authentication chain
  await req.elApp.authenticationService.forAllChainedServices((chainElement, authServiceName, authService) => {
    if (typeof authService.preAuth !== 'undefined') {
      req.elApp.logService.debug('authentication', `Preparing ${authServiceName}`);
      return authService.preAuth(req, chainElement, res);
    }
    return Promise.resolve();
  });

  // Trying each authentication module in the authentication chain
  await req.elApp.authenticationService.forAllChainedServices((chainElement, authServiceName, authService) =>
    new Promise(async (resolve) => {
      req.elApp.logService.debug('authentication', `Trying ${authServiceName}`);
      const user = await authService.authenticate(req, chainElement, res);
      if (user !== undefined) {
        req.elApp.logService.trace('authentication', `Authentication successful '${user.realm} ${user.login}'`);
        req.user = Object.assign({}, user, { authService: authServiceName });
        resolve(true);
      } else resolve();
    }));

  // Cleaning up each authentication module in the authentication chain
  await req.elApp.authenticationService.forAllChainedServices(async (chainElement, authServiceName, authService) => {
    if (typeof authService.postAuth !== 'undefined') {
      req.elApp.logService.debug('authentication', `Cleaning up ${authServiceName}`);
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
  res.sendData(req.user);
});
// Signout
router.delete('/auth', async (req, res) => {
  try {
    await req.elApp.authenticationService.signOut(req);
    res.sendSuccess();
  } catch (e) {
    res.sendError(e);
  }
});

module.exports = { path: '/', router };
