const express = require('express');

const router = express.Router();


// Middleware to compute user groups
router.get('/:name', async (req, res, next) => {
  const componentName = req.params.name;
  req.elApp.uiComponentsService.forAllChainedServices((chainElement, serviceName, service) => service.get(componentName).then(component => component)).then((component) => {
    res.sendData(component);
  });
});
// Middleware to athorize the request
router.use('/groups', async (req, res) => {
  res.sendData(req.user.groups);
});
module.exports = { path: '/component', router };
