 let interactionMode = 'start'; /* modes: start -> zoom -> popup */
let zoom = 0.6;
let latitude;
let longitude;
let map;
let responseArray = [];
let responseArrayBackup = [];
let markerList = [];
let landscape = false;
let latMin;
let latMax;
let lonMin;
let lonMax;
let lightWeight = false;


/* Cities received from Cities API */
function City(name, latitude, longitude, country, population) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.country = country;
        this.population = population;
}

/* Initialize GoogleMap */
function initMap() {
    let paraString = window.location.search;
    let parameter = new URLSearchParams(paraString);
    if (parameter.get('lw')){lightWeight = true;}

    map = new google.maps.Map(document.getElementById("worldMap"), {
        zoom: zoom,
        center: {lat: 0, lng: 0},
        styles: mapStyle,
        disableDefaultUI: true,
        backgroundColor: '#9ae7cd',
        gestureHandling: 'none'
    });

    /* Add Geo data to map. this data contains all the land, making land and ocean distinguishable */
    map.data.loadGeoJson('../resources/custom.geo.json');

    /* Style map after Geo data. */
    map.data.setStyle(function(feature) {
        return ({
            fillColor: '#ffffff',
            fillOpacity: 1,
            strokeColor: '#d1d1d1',
            strokeWeight: zoom / 2
        });

    });

    /* Handle map click on land */
    map.data.addListener('click', function (event) {
        latitude = event.latLng.lat();
        longitude = event.latLng.lng();

        if (interactionMode === 'start') {
            removeTip();
            zoomMap(event);
            appendTip();
            fadeOutTip();
            getFiveBiggestCities();
        }
        else if (interactionMode === 'zoom') {
            removeTip();
            clickNearestCities();
            progressBar();
        }
        else if (interactionMode === 'popup') {
            closePopUp();
        }
    });

    /* Handle map click on water */
    map.addListener('click', function (event) {
        latitude = event.latLng.lat();
        longitude = event.latLng.lng();

        if (interactionMode === 'zoom') {
            removeTip();
            clickNearestCities();
            progressBar();
        }
        else if (interactionMode === 'popup') {
            closePopUp();
        }
    });
    checkCookie();
    appendSearchBar();
    appendTip();
    fadeOutTip();
}
window.initMap = initMap;

function calculateZoom(){
}

function checkCookie(){
    let value = '';
    let cookie = 'connect.sid=s%3Av6whpb6LtXy7eHU2VhfEhyi6Pw1uPr_Y.0PIFoQ4on8TlM2pzAaA8gpaloqxSPrTNakZ7j3eI9Rs'; //document.cookie.toString();
    let cookieArray = cookie.split('');
    for(let i = 0; i < cookie.length; i++){
        let num = cookieArray[i].charCodeAt(0).toString();
        value = value + num;
    }
    let url = 'http://localhost:3456/api/username/' + value;
    fetch(url, {
        methode: 'GET'
    }).then(function (response){
        response.text()
            .then(function (text){
                let name = text;

                if(name !== 'NO'){
                    document.getElementById('user').src = 'resources/UserIcon_logged.png';
                    let username = document.createElement('p');
                    username.setAttribute('id', 'username');
                    username.innerText = name.toUpperCase();
                    document.getElementById('nav').append(username);
                }
            })})
}

function zoomMap(event) {
    map.panTo(event.latLng);
    map.setZoom(4.5);
    interactionMode = 'zoom';
    appendBackUp();
    removeSearchBar();
}

function getFiveBiggestCities(){
    let bounds = map.getBounds();
    let southWest = bounds.getSouthWest();
    let northEast = bounds.getNorthEast();

    latMin = southWest.lat();
    latMax = northEast.lat();
    lonMin = southWest.lng();
    lonMax = northEast.lng();

    markerList = [];
    responseArray = [];
    progressBar();

    let url = 'http://localhost:3456/api/getCity/' + latMin + '/' + latMax + '/' + lonMin + '/' + lonMax+ '/10';

    fetch(url, {
        method: 'GET',
        contentType: 'application/json',
    }).then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                responseArray.push(new City(data[i].name, data[i].latitude, data[i].longitude, data[i].country, data[i].population));
            }
            responseArray.sort((a, b) => b.population - a.population);
            responseArray = responseArray.slice(0, 5);
            createMarker(responseArray, true);
            document.getElementById('progBar').remove();
        })
}

/* Get up to 5 cities where the user clicked */
function clickNearestCities() {

    /* define the square around the click in which to search for cities */
    latMin = (latitude - 1);
    latMax = (latitude + 1);
    lonMin = (longitude - 1);
    lonMax = (longitude + 1);
    responseArray = [];
    responseArrayBackup = [];
    removeMarker();
    let url2 = 'http://localhost:3456/api/getCity/' + (latMin - 1) + '/' + (latMax +1 ) + '/' + (lonMin - 1) + '/' + (lonMax + 1) + '/1';

    /* backup search with bigger radius */
    fetch(url2, {
        method: 'GET',
        contentType: 'application/json',
    }).then(response => response.json()
        .then(data2 => {
        for (let i = 0; i < data2.length; i++) {
            responseArrayBackup.push(new City(data2[i].name, data2[i].latitude, data2[i].longitude, data2[i].country, data2[i].population));
        }
    }));
    window.setTimeout(mainFetch, 250);
    /* get the city data */
}

function mainFetch(){
    let url = 'http://localhost:3456/api/getCity/' + latMin + '/' + latMax + '/' + lonMin + '/' + lonMax + '/1';

    fetch(url, {
        method: 'GET',
        contentType: 'application/json',
    }).then(response => response.json()
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                responseArray.push(new City(data[i].name, data[i].latitude, data[i].longitude, data[i].country, data[i].population));
            }
            /* if no cities where found set page back to start */
            if ((responseArray.length === 0) && (responseArrayBackup.length === 0)) {
                document.getElementById('progBar').remove();
                createErrorMessage();
                window.setTimeout(resetOnEmptyFetch, 1000);
            }
            else if (responseArray.length !== 0) {
                createPopUp(responseArray);
                document.getElementById('progBar').remove();
                markerList = [];
                createMarker(responseArray, false);
                interactionMode = 'popup';
            }
            /* if cities -> create the popup with up to 5 entries */
            else {
                createPopUp(responseArrayBackup);
                document.getElementById('progBar').remove();
                markerList = [];
                createMarker(responseArrayBackup, false);
                interactionMode = 'popup';
            }
        }));
}

function resetOnEmptyFetch(){
    removeSearchBar();
    initMap();
    interactionMode = 'start';
    removeBackUp();
}

function createErrorMessage(){
    let divPop = document.createElement('div');
    divPop.setAttribute('id', 'divPop')
    let popup = document.createElement('img');
    popup.src = "../resources/SelectCityPopUp.png";
    popup.setAttribute('id', 'popup');
    divPop.append(popup);
    let citiesDiv = document.createElement('div');
    citiesDiv.setAttribute('id', 'citiesDiv');
    citiesDiv.setAttribute('class', 'citiesBox');
    let p = document.createElement('p');
    p.setAttribute('id', 'errorMessage');
    p.innerText = "No cities\nin\nthis area.\n\nTry again!";

    citiesDiv.append(p);
    document.getElementById('worldMap').append(divPop, citiesDiv);
    removeTip();

    window.setTimeout(closePopUp, 1000);
}

function progressBar(){
    let load = document.createElement('img');
    load.src = '../resources/loading.gif';
    load.setAttribute('id', 'progBar');
    document.getElementById('buttons').append(load);
}

function createPopUp(responseArray) {
    if (responseArray !== 0) {
        let nameArray = [];
        for (let i = 0; i < responseArray.length; i++) {
            if(responseArray[i].name.length > 16){
                let name = responseArray[i].name.slice(0, 16) + '.';
                nameArray.push(name);
            }
            else{
                nameArray.push(responseArray[i].name);
            }
        }

        let divPop = document.createElement('div');
        divPop.setAttribute('id', 'divPop')
        let popup = document.createElement('img');
        popup.src = "../resources/SelectCityPopUp.png";
        popup.setAttribute('id', 'popup');
        let citiesDiv = document.createElement('div');
        citiesDiv.setAttribute('id', 'citiesDiv');
        citiesDiv.setAttribute('class', 'citiesBox');
        divPop.append(popup, citiesDiv);

        let name = 'a';
        let div = 'div';
        let digit = 0;
        let citiesContainer = [];
        let divContainer = [];

        /* generating an array with lenght = amount of cities in response, containing variables for
        * creating the popup elements */
        for (digit = 1; digit < (responseArray.length + 1); digit++) {
            citiesContainer.push(eval('let ' + name + digit + ' = document.createElement(\'a\');'));
            divContainer.push(eval('let' + div + digit + ' = document.createElement(\'div\');'));
        }
        for (let i = 0; i < 5; i++) {
            let url = 'cityInformation.html?city=' + responseArray[i].name + '&country=' + responseArray[i].country;
            citiesContainer[i] = document.createElement('a');
            citiesContainer[i].setAttribute('href', url);
            divContainer[i] = document.createElement('div');
            divContainer[i].setAttribute('id', 'city' + (i + 1));
            divContainer[i].innerText = nameArray[i].toUpperCase();
            citiesContainer[i].appendChild(divContainer[i]);
            citiesDiv.append(citiesContainer[i]);
        }
        document.getElementById('worldMap').append(divPop);
    }
}

/* if popup exists delete its childs and itself and set page back to start */
function closePopUp() {
    if (document.getElementById('popup')) {
        let popup = document.getElementById('divPop');
        while (popup.firstChild) {
            popup.removeChild(popup.lastChild);
        }
        popup.remove();
    }
    removeSearchBar();
    initMap();
    interactionMode = 'start';
    removeBackUp();
}

function closeErrorMessage() {
    if (document.getElementById('popup')) {
        document.getElementById('errorMessage').remove();
        document.getElementById('citiesDiv').remove();
        document.getElementById('divPop').remove();
    }
}

function createMarker(responseArray, boolean) {

    markerList = [];

    for (let i = 0; i < responseArray.length; i++) {
        let position = {lat: responseArray[i].latitude, lng: responseArray[i].longitude};
        let icon = {url: '../resources/Marker.png', labelOrigin: new google.maps.Point(8, -6)};

        if (boolean) {
            let label = {text: responseArray[i].name, fontFamily: 'Avenir', color: 'grey'};
            let marker = new google.maps.Marker({position: position, icon: icon, label: label, map: map});
            marker.addListener('click', function (){
                window.location.href = 'cityInformation.html?city=' + responseArray[i].name + '&country=' + responseArray[i].country;
            })
            markerList.push(marker);
        }
        else {
            let marker = new google.maps.Marker({position: position, icon: icon, map: map});
            markerList.push(marker);
        }
    }
}

function removeMarker(){
    for (let i = 0; i < 5; i++){
        markerList[i].setMap(null);
    }
}

/* set page back to start using the back button */
function backUp(event) {
    if (interactionMode === 'popup') {closePopUp()}
    else {
        removeSearchBar();
        initMap();
        interactionMode = 'start';
        removeBackUp();
    }
}

/* generating the back button and set its style properties */
function appendBackUp() {
    let back = document.createElement('img');
    back.src = '../resources/backUp.png';
    back.style.opacity = '70%'; /* generate a relative style which works for all mobiles */
    back.style.top = `${(window.innerHeight - 60)}` + 'px';
    back.style.left = `${(screen.width / 2) - (7.5 * screen.width / 100)}` + 'px';
    back.style.width = `${(15 * 100 /screen.width)}`
    back.setAttribute('onclick', 'backUp()');
    back.setAttribute('id', 'backUp');
    document.getElementById('buttons').append(back);
}

function removeBackUp() {
    if (document.getElementById('backUp')) {
        document.getElementById('backUp').remove();
    }
}

/* generating the search bar and set its style properties */
function appendSearchBar() {
    let search = document.createElement('textarea');
    search.setAttribute('id', 'searchText');
    search.setAttribute('placeholder', 'Search for a city ...');
    search.addEventListener("keydown", searchFiledActivated);
    search.style.width = '52%';     /* generate a relative style which works for all mobiles */
    search.style.top = `${(window.innerHeight - 60)}` + 'px';
    search.style.left = `${(screen.width / 2) - (26 * screen.width / 100)}` + 'px';
    search.style.width = `${(52 * 100 /screen.width)}`
    search.style.resize = 'none';
    let addCSS = document.createElement('style');
    addCSS.innerHTML = "::placeholder {color: lightgray;}";
    document.body.append(addCSS);
    document.getElementById('buttons').append(search);
}

function searchFiledActivated(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        let entry = document.getElementById('searchText').value;

        let url = 'http://localhost:3456/api/getCity/' + entry;

        progressBar();
        document.getElementById('progBar').style.top = '70%';

        fetch(url, {
            method: 'GET',
            contentType: 'application/json'
        })
            .then(response => response.json())
            .then(data => {
                if (data.length === 0 || entry === "") {
                    document.getElementById('searchText').setAttribute('placeholder', 'not a valid city!');
                    let addCSS = document.createElement('style');
                    addCSS.innerHTML = "::placeholder {color: red; opacity: 40%;}";
                    document.body.append(addCSS);
                    document.getElementById('searchText').value = "";
                } else {
                    city = new City(data[0].name, data[0].latitude, data[0].longitude, data[0].country, data[0].population);
                    if(lightWeight === true){
                        window.location.href = 'cityInformation.html?city=' + city["name"] + '&country=' + city.country + '&lw=true';
                    }
                    else {
                        window.location.href = 'cityInformation.html?city=' + city["name"] + '&country=' + city.country;
                    }
                }
                document.getElementById('progBar').remove();
            });
    }
}

function removeSearchBar() {
    if (document.getElementById('searchText')) {
        document.getElementById('searchText').remove();
    }
}

function appendTip() {
    if (!document.getElementById('tip')) {
        let tip = document.createElement('textarea');
        tip.setAttribute('id', 'tip')
        if (interactionMode === 'start' || interactionMode === 'popup') {
            tip.innerText = 'Tab map to zoom in';
        } else if (interactionMode === 'zoom') {
            tip.innerText = 'Tab to get cities';
        }

        tip.style.width = '40%'; /* generate a relative style which works for all mobiles */
        tip.style.top = `${(window.innerHeight - 160)}` + 'px';
        tip.style.left = `${(screen.width / 2) - (20 * screen.width / 100)}` + 'px';
        tip.style.resize = 'none';
        tip.setAttribute('readonly', '');
        document.getElementById('buttons').append(tip);
    }
}

/* fade out the tip
* following methode is from:
*  https://stackoverflow.com/questions/29017379/how-to-make-fadeout-effect-with-pure-javascript */
function fadeOutTip() {
    let tip = document.getElementById("tip");
    let fadeEffect = setInterval(function () {
        if (!tip.style.opacity) {
            tip.style.opacity = 0.7;
        }
        if (tip.style.opacity > 0) {
            tip.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
        }
    }, 500);
} /* until here */

function removeTip() {
    if (document.getElementById('tip')) {
        document.getElementById('tip').remove();
    }
}

/* Google Map Styling - setting the land color to the background color. later
coloring it with the GeoJson data overlay back to white to get rid of antarctica */
let mapStyle = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#e1e0e0"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#9ae7cd"
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e5e5e5"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "road",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dadada"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e5e5e5"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c9c9c9"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#9ae7cd"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    }
]