const { Router } = require('express');
const controller = require('../controllers/controller');

const routes = Router();

routes.get('/categories', controller.getCategories);

module.exports = routes;
