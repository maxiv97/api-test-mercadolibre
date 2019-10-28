const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const api = require('./routes/api.routes');
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:4200',
  }

//settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use('/api', api);

module.exports = app;
