const { Router } = require('express');
const requestController = require('../controllers/requestController.js');

const routes = Router();

routes.get('/getCity/:city', requestController.getCity);
routes.get('/getCity/:latMin/:latMax/:lonMin/:lonMax/:scope', requestController.getCityByCoords);

routes.get('/getWeather/:city/:country', requestController.getWeather);
routes.get('/getCityInformation/:id', requestController.getCityInformation);
routes.get('/getImages/:city', requestController.getImages);

routes.post('/newPost/ ', requestController.newPost);
routes.put('/editPost/ ', requestController.editPost);
routes.delete('/deletePost/ ', requestController.deletePost);

routes.get('/login/:username/:password', requestController.login);
routes.post('/register/:username/:password', requestController.register);
routes.put('/editUser/', requestController.editUser);
routes.delete('/deleteUser/:username', requestController.deleteUser);

module.exports = routes;
