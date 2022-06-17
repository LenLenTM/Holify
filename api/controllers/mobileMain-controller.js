const model = require("../models/mobileMain-Model.js");

class MobileMainController {

    getCategories(){}

    getCity(req, res){
        console.log("we got here!");
        let city = req.params.city;

        res.send(model.haulCity(city));
    }
}



module.exports = new MobileMainController();
