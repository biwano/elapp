const express = require('express');
const moduleLoader = require('./moduleLoader');
const elAppMaker = require('./elApp');
const cors = require('cors');

const app = express();
app.use(cors(
  { origin: true,
    credentials: true },
));

const elApp = elAppMaker(app);

// Put elApp in request context
app.use('/', (req, res, next) => {
  req.elApp = elApp;
  next();
});
// load modules
moduleLoader(elApp).then(() => {
// Listen to clients
  app.listen(3000, () => {
    console.log('elApp Started on port 3000');
  });
});