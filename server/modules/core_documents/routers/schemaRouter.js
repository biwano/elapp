const express = require('express');

const router = express.Router();

router.get('/:id', (req, res) => {
  res.send(`schema get ${req.params.id} ${req.user.authenticated} ${req.user.login}`);
});

module.exports = { path: '/schema', router };
