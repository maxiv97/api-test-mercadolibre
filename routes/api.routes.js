const ApiController = require('../controllers/api.controllers');
const express = require('express');
const api = express.Router();

api.get('/items', ApiController.getItems);
api.get('/items/:id', ApiController.getItemDescription);

module.exports = api;
