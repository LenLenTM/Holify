const model = require("../models/data.js");

class RequestController {

    async getCity(req, res){
        let city = req.params.city;
        res.send(await model.getCity(city));
    }

    async getCityByCoords(req, res){
        let latMin = req.params.latMin;
        let lonMin = req.params.latMax;
        let latMax = req.params.lonMin;
        let lonMax = req.params.lonMax;
        let scope = req.params.scope;

        res.send(await model.getCityByCoords(latMin, latMax, lonMin, lonMax, scope));
    }

    async getWeather(req, res) {
        let city = req.params.city;
        let country = req.params.country;

        res.send(await model.getWeather(city, country));
    }

    async getCityInformation(req, res){
        let id = req.params.id;
        res.send(await model.getCityInformation(id));
    }

    async getImages(req, res){
        let city = req.params.city;

        res.send(await model.getImages(city));
    }

    async getTransportRoute(req, res){
        let origin = req.params.origin;
        let destination = req.params.destination;

        res.send(await model.getTransportRoute(origin, destination));
    }

    async userLocation(req, res){
        res.send(await model.userLocation());
    }

    newPost(){
    }

    editPost(){
    }

    deletePost(){
    }

    login(){
    }

    register(req, res){
        let cookie = req.params.cookie;
        let email = req.params.email;
        let username = req.params.username;
        let password = req.params.password;
        let xoj = req.params.xoj;

        if(model.checkIfUserExists(email)){
            model.register(cookie, email, username, password, xoj);
            res.status(202).send('Registration successfull.');
        }
        else {
            res.status(602).send('This email-address is already registered.');
        }
    }

    editUser(){
    }

    deleteUser(req, res){
        let username = req.params.username;
        let password = req.params.password;

        if(model.deleteUser(username, password)){
            res.status(202).send('User deleted.');
        }
        else {
            res.status(602).send('Wrong password or username.');
        }
    }
}

module.exports = new RequestController();
