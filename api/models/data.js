const fetch = require('node-fetch');
const {response} = require("express");
const fs = require('fs');

class User{
    constructor(cookie, email, username, password, xoj) {
        this.cookie = cookie;
        this.email = email;
        this.username = username;
        this.password = password;
        this.xoj = xoj;
    }
}
class Location{
    constructor(cookie, lat, lon) {
        this.cookie = cookie;
        this.lat = lat;
        this.lon = lon;
    }
}

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
                'X-RapidAPI-Key': '84508662f6mshe3596176d549f2dp16b030jsn84019cae481b'
            }
            //old api key: 0f52931f6cmsh872610cb50d77e2p105401jsn7a4fb537d6e9
        }).then(response => response.json());

        return await response;
    }

    async getCityInformation(country){
        let url = 'https://restcountries.com/v3.1/alpha/' + country;

        let response = fetch(url, {
            method: 'GET',
            contentType: 'application/json'
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

    async getTransportRoute(origin, destination){
        let url = 'https://transit.router.hereapi.com/v8/routes?apiKey=aS8UvScT_UJ5MMroiqglho8U-dCcC6fNDIqfxvR5nXs&origin=' + origin + '&destination=' + destination;

        let response = fetch(url, {
            method: 'GET',
            contentType: 'application/json',
        }).then(response => response.json())
        return await response;
    }

    async userLocation(){
        let response = fetch("https://api.geoapify.com/v1/ipinfo?&apiKey=b94f067fb31b473592762ee5c90520e1", {
            method: 'GET',
        }).then(response => response.json())
        return await response;
    }

    checkIfUserExistsByName(username){
        let userData = fs.readFileSync('userDB.json');
        let userDataArray = JSON.parse(userData);
        for(let i = 0; i < userDataArray.length; i++){
            if(userDataArray[i].username === username){
                return false;
            }
        }
        return true;
    }

    checkIfUserExists(email){
        let userData = fs.readFileSync('userDB.json');
        let userDataArray = JSON.parse(userData);
        for(let i = 0; i < userDataArray.length; i++){
            if(userDataArray[i].email === email){
                return false;
            }
        }
        return true;
    }

    register(cookie, email, username, password, xoj){
        let user = new User(cookie, email, username, password, xoj);
        let userData = fs.readFileSync('userDB.json');
        let userDataArray = JSON.parse(userData);
        userDataArray.push(user);
        userData = JSON.stringify(userDataArray);
        fs.writeFileSync('userDB.json', userData);
    }

    deleteUser(cookie){
        let userData = fs.readFileSync('userDB.json');
        let userDataArray = JSON.parse(userData);
        let tempArray = [];
        let deleted = false;

        for(let i = 0; i < userDataArray.length; i++){
            if(userDataArray[i].cookie !== cookie){
                tempArray.push(userDataArray[i]);
            }
            if(userDataArray[i].cookie === cookie){
                deleted = true;
            }
        }
        userData = JSON.stringify(tempArray);
        fs.writeFileSync('userDB.json', userData);
        return deleted;
    }

    login(username, password, cookie){
        let userData = fs.readFileSync('userDB.json');
        let userDataArray = JSON.parse(userData);
        for(let i = 0; i < userDataArray.length; i++){
            if(userDataArray[i].username === username && userDataArray[i].password === password){
                userDataArray[i].cookie = cookie;
                userData = JSON.stringify(userDataArray);
                fs.writeFileSync('userDB.json', userData);
                return true;
            }
        }
        return false;
    }

    editUser(cookie, email, username, password){
        let userData = fs.readFileSync('userDB.json');
        let userDataArray = JSON.parse(userData);
        for(let i = 0; i < userDataArray.length; i++){
            if(userDataArray[i].cookie === cookie){
                userDataArray[i].email = email;
                userDataArray[i].username = username;
                userDataArray[i].password = password;
                userData = JSON.stringify(userDataArray);
                fs.writeFileSync('userDB.json', userData);
                return true;
            }
        }
        return false;
    }

    logOut(cookie){
        let userData = fs.readFileSync('userDB.json');
        let userDataArray = JSON.parse(userData);
        for(let i = 0; i < userDataArray.length; i++){
            if(userDataArray[i].cookie === cookie){
                userDataArray[i].cookie = '';
                userData = JSON.stringify(userDataArray);
                fs.writeFileSync('userDB.json', userData);
                return true;
            }
        }
        return false;
    }

    username(cookie){
        let userData = fs.readFileSync('userDB.json');
        let userDataArray = JSON.parse(userData);
        for(let i = 0; i < userDataArray.length; i++){
            if(userDataArray[i].cookie === cookie){
                return userDataArray[i].username;
            }
        }
        return 'NO';
    }

    getUser(username){
        let userData = fs.readFileSync('userDB.json');
        let userDataArray = JSON.parse(userData);
        for(let i = 0; i < userDataArray.length; i++){
            if(userDataArray[i].username.toUpperCase() === username){
                return userDataArray[i];
            }
        }
    }
    newPost(json) {
        let blogData = fs.readFileSync('blogPost.json');
        let blogDataArray = JSON.parse(blogData);
        blogDataArray.push(json);
        blogData = JSON.string(blogDataArray);
        fs.writeFileSync("blogPost.json", blogData);

        let blogDataLight = fs.readFileSync('blogPostLight.json');
        let blogDataArrayLight = JSON.parse(blogDataLight);
        blogDataArrayLight.push(json);
        let index = (blogDataArrayLight.length - 1);
        blogDataArrayLight[index].
        blogDataLight = JSON.string(blogDataArrayLight);
        fs.writeFileSync("blogPostLight.json", blogDataLight);

        return "Blog added";
    }

    deletePost(title){
        let blogData = fs.readFileSync('blogPost.json');
        let blogDataArray = JSON.parse(blogData);
        let temp = [];
        for(let i = 0; i < blogDataArray.length; i++){
            if(!(blogDataArray[i].title === title)){
                temp.push(blogDataArray[i]);
            }
        }
        blogData = JSON.stringify(temp);
        fs.writeFileSync("blogPost.json", blogData);

        let blogDataLight = fs.readFileSync('blogPostLight.json');
        let blogDataArrayLight = JSON.parse(blogDataLight);
        let tempLight = [];
        for(let i = 0; i < blogDataArrayLight.length; i++){
            if(!(blogDataArrayLight[i].title === title)){
                tempLight.push(blogDataArrayLight[i]);
            }
        }
        blogDataLight = JSON.stringify(tempLight);
        fs.writeFileSync("blogPostLight.json", blogDataLight);

        return 'Deleted';
    }

    getLibrary(){
        let blogData = fs.readFileSync('blogPost.json');
        return JSON.parse(blogData);
    }

    getLibraryLight(){
        let blogDataLight = fs.readFileSync('blogPostLight.json');
        return JSON.parse(blogDataLight);
    }
}

module.exports = new Data();