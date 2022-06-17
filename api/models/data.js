const fetch = require('node-fetch');
const {response} = require("express");

class Data {

    async getCity(name) {
        let url = 'https://api.api-ninjas.com/v1/city?name=' + name;

         let response = fetch(url, {
             method: 'GET',
             headers: {'X-Api-Key': 'vhYp5iFdT8c9Nfgb4v1T3Q==j68KFgrUWXAfpKyJ'},
             contentType: 'application/json',
         }).then(response => response.json());
        return await response;
    }

    async getCityByCoords(latMin, lonMin, latMax, lonMax, scope) {
        let url;
        if(scope === 10){
            url = 'https://api.api-ninjas.com/v1/city?min_lat=' + latMin + '&max_lat=' + latMax + '&min_lon=' + lonMin + '&max_lon=' + lonMax + '&limit=50&min_population=200000';
        }
        else{
            url = 'https://api.api-ninjas.com/v1/city?min_lat=' + latMin + '&max_lat=' + latMax + '&min_lon=' + lonMin + '&max_lon=' + lonMax + '&limit=50&min_population=25000';
        }
        let response = fetch(url, {
            method: 'GET',
            headers: {'X-Api-Key': 'vhYp5iFdT8c9Nfgb4v1T3Q==j68KFgrUWXAfpKyJ'},
            contentType: 'application/json',
        }).then(response => response.json());
        return await response;
    }

    async getWeather(city, country){
        let url = 'https://community-open-weather-map.p.rapidapi.com/forecast?q=' + city + '%2C' + country;

        let response = fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'community-open-weather-map.p.rapidapi.com',
                'X-RapidAPI-Key': '0f52931f6cmsh872610cb50d77e2p105401jsn7a4fb537d6e9'
            }
        }).then(response => response.json());

        return await response;
    }

    async getCityInformation(id){
        let url = 'https://world-geo-data.p.rapidapi.com/cities/' + id;

        let response = fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'world-geo-data.p.rapidapi.com',
                'X-RapidAPI-Key': '0f52931f6cmsh872610cb50d77e2p105401jsn7a4fb537d6e9'
            }
        }).then(response => response.json());

        return await response;
    }

    async getImages(city){

        const { GOOGLE_IMG_SCRAP , GOOGLE_QUERY } = require('google-img-scrap');
        const test = GOOGLE_IMG_SCRAP({
            search: city,
            limit: 10,
            safeSearch: true,
        });
        return test;
    }
}

module.exports = new Data();