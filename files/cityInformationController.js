let responseArray = [];
let paraString;
let parameter;
let weatherResponse;
let weather = [];
let allWeather = [];
let mainInfo = [];
let weatherOutput = [];
let cityData;

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
    let options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'community-open-weather-map.p.rapidapi.com',
            'X-RapidAPI-Key': '0f52931f6cmsh872610cb50d77e2p105401jsn7a4fb537d6e9'
        }
    };
    let url = 'https://community-open-weather-map.p.rapidapi.com/forecast?q=' + parameter.get('city') + '%2C' + parameter.get('country');

    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            weatherResponse = new WeatherResponse(data.city, data.cnt, data.cod, data.list, data.message);
            console.log(weatherResponse);
            for (let i = 1; i < weatherResponse.list.length; i++){
                weather = new Weather(weatherResponse.list[i].clouds, weatherResponse.list[i].dt, weatherResponse.list[i].dt_txt, weatherResponse.list[i].main, weatherResponse.list[i].pop, weatherResponse.list[i].rain, weatherResponse.list[i].sys, weatherResponse.list[i].visibility, weatherResponse.list[i].weather, weatherResponse.list[i].wind);
                allWeather.push(weather);
            }
            filterInformation(allWeather);

        })
        .catch(err => console.error(err));
}

function filterInformation(allWeather){
    weatherOutput = [];
    weatherOutput.push(new WeatherOutput(allWeather[0].dt_txt, (allWeather[0].main.temp - 273.15).toFixed(1), allWeather[0].weather[0].main));
    let date = new Date(weatherOutput[0].data);
    for (let i = 0; i < allWeather.length; i++){
        let arrayDate = new Date(allWeather[i].dt_txt);
        if (arrayDate.getDay() !== date.getDay() && arrayDate.getHours() === 12){
            weatherOutput.push(new WeatherOutput(allWeather[i].dt_txt, (allWeather[i].main.temp  - 273.15).toFixed(1), allWeather[i].weather[0].main));
        }
    }
    console.log(weatherOutput);
}

function cityInformation(){
    let geoID = weatherResponse.city.id;
    let url = 'https://world-geo-data.p.rapidapi.com/cities/' + geoID;
    let options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'world-geo-data.p.rapidapi.com',
            'X-RapidAPI-Key': '0f52931f6cmsh872610cb50d77e2p105401jsn7a4fb537d6e9'
        }
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            cityData = new City(data.country, data.currency, data.population);
            console.log(cityData);
        })
        .catch(err => console.error(err));
}