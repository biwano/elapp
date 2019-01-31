const express = require('express');
// const moduleLoader = require('./moduleLoader');
const elAppMaker = require('./elApp');
const cors = require('cors');

const app = express();
app.use(cors(
  { origin: true,
    credentials: true },
));

elAppMaker(app).then(() => {
// Listen to clients
  app.listen(3000, () => {
    console.log('elApp Started on port 3000');
  });
});
