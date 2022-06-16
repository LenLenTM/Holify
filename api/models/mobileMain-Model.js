const fetch = require('node-fetch');
const {response} = require("express");

/* Cities received from Cities API */
function City(name, latitude, longitude, country, population) {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.country = country;
    this.population = population;
}

class MobileMainModel {

    haulCity(name) {

        console.log("and here!");
        let city;
        let url = 'https://api.api-ninjas.com/v1/city?name=' + name;
        fetch(url, {
            method: 'GET',
            headers: {'X-Api-Key': 'vhYp5iFdT8c9Nfgb4v1T3Q==j68KFgrUWXAfpKyJ'},
            contentType: 'application/json',
        }).then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    city = new City(null, null, null, null, null);
                } else {
                    city = new City(data[0].name, data[0].latitude, data[0].longitude, data[0].country, data[0].population);
            }})
    }
}
module.exports = new MobileMainModel();