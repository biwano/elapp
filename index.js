const express = require('express');
const moduleLoader = require('./moduleLoader');
const elAppMaker = require('./elApp');

const app = express();
const elApp = elAppMaker(app);

// Put elApp in request context
app.use('/', (req, res, next) => {
  req.elApp = elApp;
  next();
});
// load modules
moduleLoader(elApp);

// Listen to clients
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
