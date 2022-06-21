let responseArray = [];
let paraString;
let parameter;
let weatherResponse;
let weather = [];
let allWeather = [];
let mainInfo = [];
let weatherOutput = [];
let cityData;
let cityImages = [];
let light = false;


function WeatherResponse(city, cnt, cod, list, message){
    this.city = city;
    this.cnt = cnt;
    this.cod = cod;
    this.list = list;
    this.message = message;
}

function Weather(clouds, dt, dt_txt, main, pop, rain, sys, visibility, weather, wind){
    this.clouds = clouds;
    this.dt = dt;
    this.dt_txt = dt_txt;
    this.main = main;
    this.pop = pop;
    this.rain = rain;
    this.sys = sys;
    this.visibility = visibility;
    this.weather = weather;
    this.wind = wind;
}

function WeatherOutput(date, temp, weather){
    this.data = date;
    this.temp = temp;
    this.weather = weather;
}

function City(country, currency, population){
    this.country = country;
    this.currency = currency;
    this.population = population;
}
// initialization of city information page, function called in cityinformation.html;
function initPage() {

    //URL is checked for 'light' which indicates lightweight version
    //value of variable light is used for control in several functions;
    let paraString = window.location.search;
    let parameter = new URLSearchParams(paraString);
    if (parameter.get('light')){light = true;}

    checkCookie();
    navText();
    getWeather();
    window.setTimeout(cityInformation, 600); //timeout for information from getWeather() to arrive;
    progressBar();
}

function userLogin(){
    if(light === true){
        location.href = "login.html?light=true";
    }
    else{
        location.href = "login.html";
    }
}
function blogLibrary(){
    if(light === true){
        location.href = "blogLibrary.html?light=true";
    }
    else{
        location.href = "blogLibrary.html";
    }
}
//called in initPage(), if user is registered and logged in then their name will be displayed next to user icon;
function checkCookie(){
    let value = '';
    let cookie = document.cookie.toString();
    let cookieArray = cookie.split(''); //generates array from cookie String;
    for(let i = 0; i < cookie.length; i++){
        let num = cookieArray[i].charCodeAt(0).toString(); //value at index to number (UTF-16 code) to String;
        value = value + num;
    }
    let url = 'http://localhost:3456/api/username/' + value;
    fetch(url, {
        methode: 'GET'
    }).then(function (response){    //callback function(response) is argument of then() for success of promise;
        response.text()
            .then(function (text){      //callback function(text);
                let name = text;            //success of promise: variable name evalutes to text;

                if(name !== 'NO'){
                    document.getElementById('user').src = 'resources/UserIcon_logged.png';  //user icon green;
                    let username = document.createElement('p');         //new DOM element for username created;
                    username.setAttribute('id', 'usernameNav');
                    username.innerText = name.toUpperCase();
                    document.getElementById('userIconContainer').append(username);
                }
            })})
}

//called in initPage(), new DOM element with city name is created next to Holify logo;
function navText(){
    paraString = window.location.search;
    parameter = new URLSearchParams(paraString);
    let navText = document.createElement('p');
    navText.innerHTML = parameter.get('city');
    navText.setAttribute('id', 'navText');
    document.getElementById('cityName').append(navText);
}

//called in initPage(), new DOM element with progess bar is created;
function progressBar(){
    let load = document.createElement('img');
    load.src = '../resources/loading.gif';
    load.setAttribute('id', 'progBar');
    document.getElementById('main').append(load);
}
//---------------------- Weather information --------------------------;
//called in initPage();
function getWeather(){

    weatherResponse = [];
    weather = [];
    allWeather = [];
    mainInfo = [];

    //API from https://openweathermap.org ;
    let url = 'http://localhost:3456/api/getWeather/' + parameter.get('city') + '/' + parameter.get('country');

    fetch(url, {
        method: 'GET',
        contentType: 'application/json'     //original media type of resource;
    }).then(response => response.json())    //callback arrow function, response evalutes to response.json;
        .then(data => {                     //callback arrow function, data evaluates to output of function;
            weatherResponse = new WeatherResponse(data.city, data.cnt, data.cod, data.list, data.message); //array;
            for (let i = 1; i < weatherResponse.list.length; i++){
                weather = new Weather(weatherResponse.list[i].clouds, weatherResponse.list[i].dt, weatherResponse.list[i].dt_txt, weatherResponse.list[i].main, weatherResponse.list[i].pop, weatherResponse.list[i].rain, weatherResponse.list[i].sys, weatherResponse.list[i].visibility, weatherResponse.list[i].weather, weatherResponse.list[i].wind);
                allWeather.push(weather); //weather item added at end of allWeather array;
            }
            getUserLocation();
            filterInformation(allWeather);
            displayWeather();
            getImages();
        });
}

//called in getWeather(), information in allWeather array is filtered, only one per day and must be collected at 12.00 noon;
function filterInformation(allWeather){
    weatherOutput = [];
    weatherOutput.push(new WeatherOutput(allWeather[0].dt_txt, (allWeather[0].main.temp - 273.15).toFixed(0), allWeather[0].weather[0].main));
    let date = new Date(weatherOutput[0].data);
    for (let i = 0; i < allWeather.length; i++){
        let arrayDate = new Date(allWeather[i].dt_txt);
        if (arrayDate.getDay() !== date.getDay() && arrayDate.getHours() === 12){   //added to array only if arrayDate.getDay is new and taken at 12.00;
            weatherOutput.push(new WeatherOutput(allWeather[i].dt_txt, (allWeather[i].main.temp  - 273.15).toFixed(0), allWeather[i].weather[0].main));
        }
    }
}
//called in getWeather();
function displayWeather(){

    for(let i = 0; i < 5; i++){     //weather of the next 5 days displayed;
        let img = document.createElement('img');    //new DOM element created;
        //let path = "resources/UserIcon.png" +
        img.src = 'resources/WeatherIcons_' + weatherOutput[i].weather + '.png'; //weatherOutput array from filterInformation(), weather icon chosen;
        img.setAttribute('id', 'icon');
        document.getElementById('weatherBox').append(img);

        let date = new Date(weatherOutput[i].data);  //display for name of day in new DOM element;
        let day = date.getDay();
        let text;
        switch(day){
            case 1: text = 'MO'; break;
            case 2: text = 'TU'; break;
            case 3: text = 'WE'; break;
            case 4: text = 'TH'; break;
            case 5: text = 'FR'; break;
            case 6: text = 'SA'; break;
            case 0: text = 'SU'; break;
        }
        let p = document.createElement('p');
        p.innerText = text;
        p.setAttribute('id', 'day');
        document.getElementById('days-box').append(p);

        let temp = weatherOutput[i].temp;       //temperature added in new DOM element;
        let p2 = document.createElement('p');
        p2.setAttribute('id', 'temperature');
        p2.innerText = temp + '°C'
        document.getElementById('temperature-box').append(p2);
    }
}

//---------------------------- Display Images of City -------------------------------------;
//called in getWeather(), images from GOOGLE_IMG_SCRAP (getImages function in data.js),
// https://openweathermap.org gives useful information aside from weather;
function getImages(){
    if(light === false) {       //images not displayed in light weight version;
        cityImages = [];
        let url = 'http://localhost:3456/api/getImages/' + weatherResponse.city.name;  //city name is found in weatherResponse in getWeather();
        fetch(url, {
            method: 'GET',
            contentType: 'application/json'
        }).then(response => response.json())
            .then(data => {
                for (let i = 0; i < 10; i++) {      //max. 4 images are searched, duplicates are filtered;
                    let duplicate = false;
                    for (let j = 0; j < 4; j++) {
                        if (cityImages[j] === data.result[i].url) {
                            duplicate = true;
                            break;
                        }
                    }
                    if (duplicate) {
                        continue;
                    }
                    cityImages.push(data.result[i].url);
                    if (cityImages.length === 4) {
                        break
                    }
                }
                drawImages();
            })
    }
    else{
        drawNoImages();     //light weight version;
    }
}
//for light weight version, #noImage in media query in cityInformationStyle.css;
function drawNoImages(){
    let noImages = document.createElement('p');
    noImages.setAttribute('id', 'noImage');
    noImages.innerText = weatherResponse.city.name.toString().toUpperCase();
    document.getElementById('pictures').append(noImages);
}

//called in getImages(), images are included in new DOM elements;
function drawImages(){
    for(let i = 0; i < 4; i++){
        let img = document.createElement('img');
        img.src = cityImages[i];
        let id = 'img' + (i + 1);
        img.setAttribute('id', id);
        img.setAttribute('alt', 'Picture of' + weatherResponse.city.name);
        document.getElementById('pictures').append(img);
    }
}

//---------------------- Display City Information ------------------------;
//called in initPage(), https://restcountries.com , city population from weatherResponse;
function cityInformation(){

    let paraString = window.location.search;
    let parameter = new URLSearchParams(paraString);
    let country = parameter.get('country');

    let url = 'http://localhost:3456/api/getCityInformation' + '/' + country;
    fetch(url, {
        method: 'GET',
        contentType: 'application/json'
    }).then(response => response.json())
        .then(data => {
            let string = JSON.stringify(data);      //JavaScript to JSON-String;
            string = string.substring(string.indexOf(`name":"`) + 7);
            string = string.substring(0, string.indexOf('"'));
            cityData = new City(data[0].name.common, string, weatherResponse.city.population);  //population;
            drawInformation();
        });
}

//display city information in new DOM elements, country, population, currency;
function drawInformation(){
    let country = document.createElement('p');
    country.innerText = 'Country: ' + cityData.country.toUpperCase();
    let population = document.createElement('p');
    population.innerText = 'Population: ' + numberWithCommas(cityData.population);  //function numberWithCommas();
    let currency = document.createElement('p');
    currency.innerText = 'Currency: ' + cityData.currency.toUpperCase();

    document.getElementById('three').append(country, population, currency);
}

//https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//-------until here

// --------------------------- Transport Route from User Location to City ----------------- ;

//navigator is property of window, geolocation property only in secure contexts available;
function getUserLocation(){
    navigator.geolocation.getCurrentPosition(function (position){
        let location = {lat: position.coords.latitude, lon: position.coords.longitude};
        getTransportRoute(location);
    })
}
/**
function userLocation(data){

    let location = {lat: data.lat, lon: data.lon};
    console.log(data);
    if(data.cookie === '0'){
        let url = 'http://localhost:3456/api/userLocation';
        fetch(url, {
            method: 'GET',
            contentType: 'application/json'
        }).then(response => response.json())
            .then(data => {
                let location = {lat: data.location.latitude, lon: data.location.longitude};
                getTransportRoute(location);
            });
    }
    else{
        getTransportRoute(location);
    }
} **/

//called in getUserLocation, https://developer.here.com/documentation/public-transit/dev_guide/routing/index.html ;
function getTransportRoute(location){
    let origin = location.lat + ',' + location.lon;

    let destination = weatherResponse.city.coord.lat + ',' + weatherResponse.city.coord.lon;  //lat, lon information from weatherResponse;

    let url = 'http://localhost:3456/api/getTransportRoute/' + origin + '/' + destination;

    let route = fetch(url, {
        method: 'GET',
        contentType: 'application/json'
    }).then(response => response.json())
        .then(data => {
            if(data.routes.length !== 0) {
                drawTransportRoute(data);   //call of drawTransportRoute();
            }
            else{
                drawNoRoute();      //call of drawNoRoute();
            }
        });
    //return await route;
}

//display of transport route in new DOM elements, called in getTransportRoute(), parameter data evaluated there;
function drawTransportRoute(data){
    let stages = data.routes[0].sections;
    let vehicleImage;

    for(let i = 0; i < stages.length; i++){
        let div = document.createElement('div');        //create div for each stage of transport route;
        div.setAttribute('id', 'stage' + i);

        let vehicle = stages[i].transport.mode;
        switch (vehicle){                   //choose appropriate icon for means of transportation;
            case 'highSpeedTrain':
            case 'intercityTrain':
            case 'interRegionalTrain':
            case 'regionalTrain':
            case 'cityTrain':
                vehicleImage = 'resources/TransportIcons/TransportIcons_Train.png';
                break;
            case 'bus':
            case 'privateBus':
            case 'busRapid':
                vehicleImage = 'resources/TransportIcons/TransportIcons_Bus.png';
                break;
            case 'ferry':
                vehicleImage = 'resources/TransportIcons/TransportIcons_Ship.png';
                break;
            case 'subway':
            case 'lightRail':
            case 'inclined':
            case 'monorail':
                vehicleImage = 'resources/TransportIcons/TransportIcons_Subway.png';
                break;
            case 'aerial':
            case 'flight':
                vehicleImage = 'resources/TransportIcons/TransportIcons_Airplane.png';
                break;
            case 'walk':
            case 'pedestrian':
                vehicleImage = 'resources/TransportIcons/TransportIcons_Pedestrian.png';
                break;
            default:
                vehicleImage = 'resources/TransportIcons/TransportIcons_Bus.png';
        }
        let icon = document.createElement('img');
        icon.src = vehicleImage;
        icon.setAttribute('id', 'transIcon');

        let p1 = document.createElement('p');           //new DOM elements for names of stations and departure time;
        p1.setAttribute('id', 'origin');
        if(i === 0){
            p1.innerText = 'Origin';
        }
        else{
            p1.innerText = stages[i].departure.place.name.toString().slice(0, 22);
        }

        let p2 = document.createElement('p');
        p2.setAttribute('id', 'destination');
        if(i === (stages.length - 1)){
            p2.innerText = 'Destination';
        }
        else{
            p2.innerText = stages[i].arrival.place.name.toString().slice(0, 22);
        }

        let p3 = document.createElement('p');
        p3.setAttribute('id', 'departure-time');
        let text1;
        text1 = stages[i].departure.time.toString().slice(11, 16);
        p3.innerText = text1;

        let p4 = document.createElement('p');
        p4.setAttribute('id', 'arrival-time');
        let text2;
        text2 = stages[i].arrival.time.toString().slice(11, 16);
        p4.innerText = text2;

        let divName = document.createElement('div');            //DOM element for station name;
        divName.setAttribute('id', 'stations' + i)
        let divTimes = document.createElement('div');           //DOM element for departure time;
        divTimes.setAttribute('id', 'times' + i);

        if(window.innerWidth < 500) {
            div.style.top = (i * 9) + 65 + '%';
        }
        else{
            div.style.top = (i * 9) + 12 + '%';
        }

        divName.append(p1, p2);
        divTimes.append(p3, p4);
        div.append(icon, divName, divTimes);
        document.getElementById('transit').append(div);     //transit id defined in cityInformation.html;
    }
    document.getElementById('progBar').remove();        //progBar is removed;
}

//light weight version, called in getTransportRoute(), 'no route found' displayed;
function drawNoRoute(){
    let div = document.createElement('div');
    div.setAttribute('id', 'stage0');
    if(window.innerWidth < 500) {
        div.style.top = '65%';
    }
    else{
        div.style.top = '12%';
    }

    let p1 = document.createElement('p');
    p1.setAttribute('id', 'origin');
    p1.innerText = 'No Route found!';
    p1.style.top = '38%';

    let icon = document.createElement('img');
    icon.src = 'resources/TransportIcons/TransportIcons_NoRoute.png';
    icon.setAttribute('id', 'transIcon');

    div.append(icon, p1);
    document.getElementById('transit').append(div);
    document.getElementById('progBar').remove();
}