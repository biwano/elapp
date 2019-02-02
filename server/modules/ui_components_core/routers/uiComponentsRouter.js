const express = require('express');

const router = express.Router();


// Middleware to compute user groups
router.get('/:name', async (req, res) => {
  const componentName = req.params.name;
  req.elApp.uiComponentsService.forAllChainedServices((chainElement, serviceName, service) => {
    if (typeof service.respond !== 'undefined') {
      return service.respond(componentName, res);
    } else if (typeof service.get !== 'undefined') {
      return service.get(componentName).then((component) => {
        res.sendData(component);
      });
    }
  });
});
// Middleware to athorize the request
router.use('/groups', async (req, res) => {
  res.sendData(req.user.groups);
});
module.exports = { path: '/component', router };
