const express = require('express');

const router = express.Router();


// Middleware to compute user groups
router.use('/', async (req, res, next) => {
  let groups = [];
  if (typeof req.user !== 'undefined') {
    // Concatenating groups from each groupService in the chain
    req.elApp.groupsService.forAllChainedServices((chainElement, serviceName, service) => service.getGroups(req.user.login).then((localGroups) => {
      groups = groups.concat(localGroups);
    })).then(() => {
      req.elApp.logService.debug('groups', JSON.stringify(groups));
      req.user.groups = groups;
      next();
    });
  } else next();
});
// Middleware to athorize the request
router.use('/groups', async (req, res) => {
  res.sendData(req.user.groups);
});
module.exports = { path: '/', router };
