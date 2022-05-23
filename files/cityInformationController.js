let responseArray = [];
let paraString;
let parameter;

function initPage() {
    navText();
    getWeather();
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
        /*.then(data => {
            for (let i = 0; i < data.length; i++) {
                responseArray.push(new city(data[i].name, data[i].latitude, data[i].longitude, data[i].country, data[i].population));
            }
        }) */
        .then(response => console.log(response))
        .catch(err => console.error(err));
}