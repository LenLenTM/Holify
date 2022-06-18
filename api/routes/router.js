const { Router } = require('express');
const mobileMainController = require('../controllers/mobileMain-controller.js');
const sessionController = require('../controllers/session-controller.js');
const routes = Router();


routes.get('/getcity/:city', mobileMainController.getCity);
routes.get('/login', sessionController.getLoginForm);
routes.post('/auth', )

module.exports = routes;
