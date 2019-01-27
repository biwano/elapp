const express = require('express');

const router = express.Router();


router.use('/search', async (req, res) => {
  const documentService = req.elApp.UserDocumentService(req.user);
  const filter = JSON.parse(req.query.filter);
  const promise = documentService.search(filter);
  promise.then((documents) => {
    res.sendData(documents);
  });
});

module.exports = { path: '/', router };
