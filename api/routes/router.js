const { Router } = require('express');
const requestController = require('../controllers/requestController.js');

const routes = Router();

routes.get('/getCity/:city', requestController.getCity);
routes.get('/getCity/:latMin/:latMax/:lonMin/:lonMax/:scope', requestController.getCityByCoords);

routes.get('/getWeather/:city/:country', requestController.getWeather);
routes.get('/getCityInformation/:country', requestController.getCityInformation);
routes.get('/getImages/:city', requestController.getImages);
routes.get('/userLocation', requestController.userLocation);
routes.get('/getTransportRoute/:origin/:destination', requestController.getTransportRoute);

routes.post('/newPost', requestController.newPost);
routes.delete('/deletePost/:title', requestController.deletePost);
routes.get('/getLibrary', requestController.getLibrary);
routes.get('/getLibraryLight', requestController.getLibraryLight);

routes.get('/login/:username/:password/:cookie', requestController.login);
routes.post('/register/:cookie/:email/:username/:password', requestController.register);
routes.put('/editUser/:cookie/:email/:username/:password', requestController.editUser);
routes.delete('/deleteUser/:cookie', requestController.deleteUser);
routes.patch('/logOut/:cookie', requestController.logOut);
routes.get('/username/:cookie', requestController.username);
routes.get('/userdata/:username', requestController.getUser);

module.exports = routes;