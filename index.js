const express = require('express');
const moduleLoader = require('./moduleLoader');
const elAppMaker = require('./elApp');

const app = express();
const elApp = elAppMaker(app);
app.get('/', (req, res) => {
  res.send('hello world');
});

app.use('/', (req, res, next) => {
  req.elApp = elApp;
  next();
});
// load modules
moduleLoader(elApp);

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
