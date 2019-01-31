const express = require('express');

const router = express.Router();

// Middleware to add response
router.use('/', async (req, res, next) => {
  res.sendResponse = function response(err, payload) {
    const status = err ? 'ko' : 'ok';
    const message = err;
    res.json({ status, message, payload });
  };
  res.sendData = function sendData(data) {
    res.sendResponse(undefined, data);
  };
  res.sendSuccess = function success(data) {
    res.sendResponse(data);
  };
  res.sendError = function error(err, payload) {
    res.sendResponse(`error_${err}`, payload);
  };
  res.sendUnexpectedError = function unexpected(err) {
    req.logService.error('response', err);
    res.sendError('unexpected', err);
  };
  res.sendException = function unexpected(exception) {
    req.logService.error('response', exception);
    res.sendError('unexpected', exception);
  };
  next();
});

module.exports = { path: '/', router };
