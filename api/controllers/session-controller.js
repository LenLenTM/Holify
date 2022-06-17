var session = require("../models/session-model.js");
const {response} = require("express");

class SessionController {

    getLoginForm(req, res){
        res.redirect('../files/login.html');
    }

    userSession(req, res){
        session = req.session;
        var username = req.body.username;
        var password = req.body.password;

    }
}

module.exports = new SessionController();