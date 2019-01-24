const express = require('express');

const router = express.Router();


router.use('/search', async (req, res) => {
  res.sendData([{ id: '525' }]);
});

module.exports = { path: '/', router };
