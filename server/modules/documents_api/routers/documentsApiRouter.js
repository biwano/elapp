const express = require('express');

const router = express.Router();

const api = async function (api, req, res) {
  const documentService = req.elApp.UserDocumentService(req.user);
  const filter = JSON.parse(req.query.filter);
  const promise = documentService[api](filter);
  promise.then((result) => {
    res.sendData(result);
  });
};
router.use('/search', async (req, res) => {
  api('search', req, res);
});
router.use('/count', async (req, res) => {
  api('count', req, res);
});

module.exports = { path: '/', router };
