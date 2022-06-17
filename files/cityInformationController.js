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

function initPage() {
    navText();
    getWeather();
    window.setTimeout(cityInformation, 600);
}

function navText(){
    paraString = window.location.search;
    parameter = new URLSearchParams(paraString);
    let navText = document.createElement('p');
    navText.innerHTML = parameter.get('city');
    navText.setAttribute('id', 'navText');
    document.getElementById('cityName').append(navText);
}

function getWeather(){

    weatherResponse = [];
    weather = [];
    allWeather = [];
    mainInfo = [];

    let url = 'http://localhost:3456/api/getWeather/' + parameter.get('city') + '/' + parameter.get('country');

    fetch(url, {
        method: 'GET',
        contentType: 'application/json'
    }).then(response => response.json())
        .then(data => {
            weatherResponse = new WeatherResponse(data.city, data.cnt, data.cod, data.list, data.message);
            for (let i = 1; i < weatherResponse.list.length; i++){
                weather = new Weather(weatherResponse.list[i].clouds, weatherResponse.list[i].dt, weatherResponse.list[i].dt_txt, weatherResponse.list[i].main, weatherResponse.list[i].pop, weatherResponse.list[i].rain, weatherResponse.list[i].sys, weatherResponse.list[i].visibility, weatherResponse.list[i].weather, weatherResponse.list[i].wind);
                allWeather.push(weather);
            }
            filterInformation(allWeather);
            displayWeather();
            getImages();
        });
}

function filterInformation(allWeather){
    weatherOutput = [];
    weatherOutput.push(new WeatherOutput(allWeather[0].dt_txt, (allWeather[0].main.temp - 273.15).toFixed(0), allWeather[0].weather[0].main));
    let date = new Date(weatherOutput[0].data);
    for (let i = 0; i < allWeather.length; i++){
        let arrayDate = new Date(allWeather[i].dt_txt);
        if (arrayDate.getDay() !== date.getDay() && arrayDate.getHours() === 12){
            weatherOutput.push(new WeatherOutput(allWeather[i].dt_txt, (allWeather[i].main.temp  - 273.15).toFixed(0), allWeather[i].weather[0].main));
        }
    }
}
function displayWeather(){

    for(let i = 0; i < 5; i++){
        let img = document.createElement('img');
        //let path = "resources/UserIcon.png" +
        img.src = 'resources/WeatherIcons_' + weatherOutput[i].weather + '.png';
        img.setAttribute('id', 'icon');
        document.getElementById('weatherBox').append(img);

        let date = new Date(weatherOutput[i].data);
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

        let temp = weatherOutput[i].temp;
        let p2 = document.createElement('p');
        p2.setAttribute('id', 'temperature');
        p2.innerText = temp + '°C'
        document.getElementById('temperature-box').append(p2);
    }
}

function getImages(){
    cityImages = [];
    let url = 'http://localhost:3456/api/getImages/' + weatherResponse.city.name;
    fetch (url, {
        method: 'GET',
        contentType: 'application/json'
    }).then(response => response.json())
        .then(data => {
            for(let i = 0; i < 10; i ++){
                let duplicate = false;
                for(let j = 0; j < 4; j++){
                    if(cityImages[j] === data.result[i].url){
                        duplicate = true;
                        break;
                    }
                }
                if(duplicate){continue;}
                cityImages.push(data.result[i].url);
                if(cityImages.length === 4){break}
            }
            drawImages();
        })
}

function drawImages(){
    for(let i = 0; i < 4; i++){
        let img = document.createElement('img');
        img.src = cityImages[i];
        let id = 'img' + (i + 1);
        img.setAttribute('id', id);
        document.getElementById('pictures').append(img);
    }
}

function cityInformation(){
    let geoID = weatherResponse.city.id;
    let url = 'http://localhost:3456/api/getCityInformation' + '/' + geoID;
    fetch(url, {
        method: 'GET',
        contentType: 'application/json'
    }).then(response => response.json())
        .then(data => {
            cityData = new City(data.country, data.currency, data.population);
            console.log(cityData);
            drawInformation();
        });
}

function drawInformation(){
    console.log(cityData);
    let country = document.createElement('p');
    country.innerText = 'Country: ' + cityData.country.name.toUpperCase();
    let population = document.createElement('p');
    population.innerText = 'Population: ' + cityData.population;
    let currency = document.createElement('p');
    currency.innerText = 'Currency: ' + cityData.currency.name.toUpperCase();

    document.getElementById('infos').append(country, population, currency);
}