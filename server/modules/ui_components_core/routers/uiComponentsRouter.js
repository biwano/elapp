const express = require('express');

const router = express.Router();


// Middleware to compute user groups
router.get('/component/:name', async (req, res) => {
  const name = req.params.name;
  req.elApp.uiComponentsService.forAllChainedServices((chainElement, serviceName, service) => {
    if (typeof service.getComponent !== 'undefined') {
      return service.getComponent(name, res);
    }
  });
});
router.get('/locale/:language', async (req, res) => {
  const language = req.params.language;
  req.elApp.uiComponentsService.forAllChainedServices((chainElement, serviceName, service) => {
    if (typeof service.getLocale !== 'undefined') {
      return service.getLocale(language);
    }
  }).then(locale => res.sendData(locale));
});
module.exports = { path: '/', router };
