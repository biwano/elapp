const express = require('express');

const router = express.Router();


// Middleware to compute user groups
router.get('/:category/:name', async (req, res) => {
  const name = req.params.name;
  const category = req.params.category;
  return req.elApp.assetsService.sendAsset(res, category, name);
});

module.exports = { path: '/asset', router };
