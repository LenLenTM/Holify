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

        if(model.checkIfUserExistsByName(username)){
            if(model.login(username, password, cookie)){
                res.status(202).send('You are logged in now.');
            }
            else {
                res.status(621).send('Wrong Password.');
            }
        }
        else {res.status(620).send(`Username doesn't exist.`)}
    }

    //https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
    validateEmail(email){
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    //until here

    register(req, res){
        let cookie = req.params.cookie;
        let email = req.params.email;
        let username = req.params.username;
        let password = req.params.password;
        let xoj = false;

        if(this.validateEmail(email) && username.length > 4 && password.length > 7) {
            if (model.checkIfUserExists(email)) {
                model.register(cookie, email, username, password, xoj);
                res.status(202).send('Registration successfull.');
            } else {
                res.status(602).send('This email-address is already registered.');
            }
        }
        else if(!this.validateEmail(email)){res.status(617).send('Enter a valid email address.');}
        else if(username.length < 5){res.status(618).send('Username too short.');}
        else{res.status(618).send('Password must be at least 8 signs long.');}
    }

    editUser(req, res){
        let cookie = req.params.cookie;
        let email = req.params.email;
        let username = req.params.username;
        let password = req.params.password;

        if(this.validateEmail(email) && username.length > 4 && password.length > 7){
            if(model.editUser(cookie, email, username, password)) {
                res.status(202).send('Changed data.');
            }
            else res.status(619).send('Session timed out. Please log in again.');
        }
        else if(!this.validateEmail(email)){res.status(617).send('Enter a valid email address.');}
        else if(username.length < 5){res.status(618).send('Username too short.');}
        else{res.status(618).send('Password must be at least 8 signs long.');}
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

    logOut(req, res){
        let cookie = req.params.cookie;
        console.log('here');

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
}

module.exports = new RequestController();
