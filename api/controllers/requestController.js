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
        let country = req.params.country;
        res.send(await model.getCityInformation(country));
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

    login(req, res){
        let username = req.params.username;
        let password = req.params.password;
        let cookie = req.params.cookie;

        if(!model.checkIfUserExistsByName(username)){
            if(model.login(username, password, cookie)){
                res.status(202).send('You are logged in now.');
            }
            else {
                res.status(621).send('Wrong Password.');
            }
        }
        else {res.status(620).send(`Username doesn't exist.`)}
    }

    register(req, res){
        let cookie = req.params.cookie;
        let email = req.params.email;
        let username = req.params.username;
        let password = req.params.password;
        let xoj = false;

        if(email.includes('@') && username.length > 3 && username.length < 17 &&password.length > 7) {
            if (model.checkIfUserExists(email) && model.checkIfUserExistsByName(username)) {
                model.register(cookie, email, username, password, xoj);
                res.status(202).send('Registration successfull.');
            } else if (!model.checkIfUserExists(email)){
                res.status(602).send('Email address already taken.');
            } else if (!model.checkIfUserExistsByName(username)){
                res.status(603).send('Name already taken.');
            }
        }
        else if(!email.includes('@')){res.status(617).send('Enter a valid email address.');}
        else if(username.length < 4){res.status(618).send('Username too short.');}
        else if(username.length > 16){res.status(618).send('Username too long.');}
        else{res.status(619).send('Password too short.');}
    }

    editUser(req, res){
        let cookie = req.params.cookie;
        let email = req.params.email;
        let username = req.params.username;
        let password = req.params.password;

        if(email.includes('@') && username.length > 4 && password.length > 7){
            if(model.editUser(cookie, email, username, password)) {
                res.status(202).send('Changed data.');
            }
            else res.status(619).send('Session timed out. Please log in again.');
        }
        else if(!email.includes('@')){res.status(617).send('Enter a valid email address.');}
        else if(username.length < 5){res.status(618).send('Username too short.');}
        else{res.status(618).send('Password too short.');}
    }

    deleteUser(req, res){
        let cookie = req.params.cookie;

        if(model.deleteUser(cookie)){
            res.status(202).send('User deleted.');
        }
        else {
            res.status(602).send('Error.');
        }
    }

    logOut(req, res){
        let cookie = req.params.cookie;

        if(model.logOut(cookie)){
            res.status(202).send('Logged out.');
        }
        else {
            res.status(619).send('Session timed out. Please log in again.');
        }
    }

    username(req, res){
        let cookie = req.params.cookie;
        res.send(model.username(cookie));
    }

    getUser(req, res){
        let username = req.params.username;
        res.send(model.getUser(username));
    }
}

module.exports = new RequestController();
