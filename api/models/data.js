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

class Data {

    //---------------------REST services ---------------------------------- ;
    //https://api-ninjas.com/api/city ,
    // needed for searchFiledActivated() in mobileMainController;
    async getCity(name) {           //async means script is executed as soon as possible (vs. defer), always returns a promise;
        let url = 'https://api.api-ninjas.com/v1/city?name=' + name;

         let response = fetch(url, {
             method: 'GET',
             headers: {'X-Api-Key': 'vhYp5iFdT8c9Nfgb4v1T3Q==j68KFgrUWXAfpKyJ'},
             contentType: 'application/json',
         }).then(response => response.json());
        return await response; //no return before promise is settled
    }

    //https://api-ninjas.com/api/city ,
    // needed for getFiveBiggestCities(), clickNearestCities(), mainFetch();
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

    //https://openweathermap.org , needed multiple times, for weather and city Information;
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

    //https://restcountries.com , needed in function cityInformation();
    async getCityInformation(country){
        let url = 'https://restcountries.com/v3.1/alpha/' + country;

        let response = fetch(url, {
            method: 'GET',
            contentType: 'application/json'
        }).then(response => response.json());

        return await response;
    }
    //for getImages() in cityInformationController.js , GOOGLE_IMG_SCRAP is npm module;
    async getImages(city){

        const { GOOGLE_IMG_SCRAP , GOOGLE_QUERY } = require('google-img-scrap');
        const test = GOOGLE_IMG_SCRAP({
            search: city,
            limit: 10,
            safeSearch: true,
        });
        return test;
    }

    //https://developer.here.com/documentation/public-transit/dev_guide/routing/index.html , for getTransportRoute() in cityInformationController.js;
    async getTransportRoute(origin, destination){
        let url = 'https://transit.router.hereapi.com/v8/routes?apiKey=aS8UvScT_UJ5MMroiqglho8U-dCcC6fNDIqfxvR5nXs&origin=' + origin + '&destination=' + destination;

        let response = fetch(url, {
            method: 'GET',
            contentType: 'application/json',
        }).then(response => response.json())
        return await response;
    }
    //https://www.geoapify.com ,
    // was used for user location at getTransportRoute() in citInformationController but yielded only location of ISP;
    async userLocation(){
        let response = fetch("https://api.geoapify.com/v1/ipinfo?&apiKey=b94f067fb31b473592762ee5c90520e1", {
            method: 'GET',
        }).then(response => response.json())
        return await response;
    }

// ------------------ LogIn and Session Management ------------------------ ;
    checkIfUserExistsByName(username){
        let userData = fs.readFileSync('userDB.json');
        let userDataArray = JSON.parse(userData);
        for(let i = 0; i < userDataArray.length; i++){
            if(userDataArray[i].username.toUpperCase() === username.toUpperCase()){
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

    deleteUser(username, password){
        let userData = fs.readFileSync('userDB.json');
        let userDataArray = JSON.parse(userData);
        let tempArray = [];

        for(let i = 0; i < userDataArray.length; i++){
            if(userDataArray[i].username !== username && userDataArray[i].password !== password){
                tempArray.push(userDataArray[i]);
            }
        }
        userData = JSON.stringify(tempArray);
        fs.writeFileSync('userDB.json', userData);
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
        for(let i = 0; i < userDataArray; i++){
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
        for(let i = 0; i < userDataArray; i++){
            if(userDataArray[i].cookie === cookie){
                userDataArray[i].cookie = '';
                return true;
            }
        }
        return false;
    }

    username(cookie){
        let userData = fs.readFileSync('userDB.json');
        let userDataArray = JSON.parse(userData);

        for(let i = 0; i < userDataArray.length; i++){

            let value = '';
            let storedCookie = userDataArray[i].cookie.toString();

            let cookieArray = storedCookie.toString().split('');

            for(let i = 0; i < cookieArray.length; i++){
                let num = cookieArray[i].charCodeAt(0).toString();
                value = value + num;
            }

            if(value === cookie){
                return userDataArray[i].username;
            }
        }
        return 'NO';
    }
    newPost(json) {
        let blogData = fs.readFileSync('blogPost.json');
        let blogDataArray = JSON.parse(blogData);
        blogDataArray.push(json);
        blogData = JSON.stringify(blogDataArray);
        fs.writeFileSync("blogPost.json", blogData);

        let content = json.content;
        let content1 = content.substring(0, content.indexOf('<img'));
        let content2 = content.substring(content.indexOf('">'), content.indexOf('"'));

        content = content1 + content2;
        console.log(content);

        let blogDataLight = fs.readFileSync('blogPostLight.json');
        let blogDataArrayLight = JSON.parse(blogDataLight);
        blogDataArrayLight.push(json);
        blogDataLight = JSON.stringify(blogDataArrayLight);
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