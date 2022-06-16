const { Router } = require('express');
const mobileMainController = require('../controllers/mobileMain-controller.js');

const routes = Router();

routes.get('/categories', mobileMainController.getCategories);
routes.get('/getcity/:city', mobileMainController.getCity);

module.exports = routes;
