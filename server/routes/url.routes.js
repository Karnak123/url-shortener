const express = require('express');
const urlRoutes = express.Router();

const controller = require('../controllers/url.controller');

// GET /url/:shortUrl
urlRoutes.get('/:slug', controller.getUrl);

// POST /url/new
urlRoutes.post('/new', controller.postUrl);

module.exports = urlRoutes;