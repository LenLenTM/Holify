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

    newPost(){
    }

    editPost(){
    }

    deletePost(){
    }

    login(){
    }

    register(){
    }

    editUser(){
    }

    deleteUser(){
    }
}

module.exports = new RequestController();
