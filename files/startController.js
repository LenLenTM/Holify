let interactionMode = 'start'; /* modes: start -> zoom -> popup */
let zoom = 0.6;
let latitude;
let longitude;
let map;
let responseArray = [];
let markerList = [];

/* Cities received from Cities API */
class city {
    constructor(name, latitude, longitude, country, population) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.country = country;
        this.population = population;
    }
}

/* Initialize GoogleMap */
function initMap() {
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

        console.log('L1 ' + latitude + " - " + longitude);

        if (interactionMode === 'start') {
            removeTip();
            zoomMap(event);
            appendTip();
            fadeOutTip();
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

        console.log('L2 ' + latitude + " - " + longitude);

        if (interactionMode === 'zoom') {
            removeTip();
            clickNearestCities();
            progressBar();
        }
        else if (interactionMode === 'popup') {
            closePopUp();
        }
    });
}
window.initMap = initMap;

function zoomMap(event) {
    map.panTo(event.latLng);
    map.setZoom(4.5);
    interactionMode = 'zoom';
    appendBackUp();
    removeSearchBar();
}

/* Get up to 5 cities where the user clicked */
function clickNearestCities() {

    /* define the square around the click in which to search for cities */
    let latMin = (latitude - 1);
    let latMax = (latitude + 1);
    let lonMin = (longitude - 1);
    let lonMax = (longitude + 1);

    /* generating the url */
    let url = 'https://api.api-ninjas.com/v1/city?min_lat=' + latMin + '&max_lat=' + latMax + '&min_lon=' + lonMin + '&max_lon=' + lonMax + '&limit=5&min_population=25000';
    responseArray = [];

    /* get the city data */
    fetch(url, {
        method: 'GET',
        headers: {'X-Api-Key': 'vhYp5iFdT8c9Nfgb4v1T3Q==j68KFgrUWXAfpKyJ'},
        contentType: 'application/json',
    }).then(response => response.json()
        .then(data => {
            console.log('Success: ', data);
            for (let i = 0; i < data.length; i++) {
                responseArray.push(new city(data[i].name, data[i].latitude, data[i].longitude, data[i].country, data[i].population));
            }
            /* if no cities where found set page back to start */
            if (responseArray.length === 0) {
                initMap();
                interactionMode = 'start';
                removeBackUp();
                appendSearchBar();
            }
            /* if cities -> create the popup with up to 5 entries */
            else {
                createPopUp(responseArray);
                document.getElementById('progBar').remove();
                createMarker();
            }
        }));
    interactionMode = 'popup';
}

function progressBar() {
    let bar = 0;
    let elem = document.createElement('div');
    elem.setAttribute('id', 'progBar');
    document.getElementById('buttons').append(elem);

    if (bar === 0) {
        bar = 1;
        let width = 1;
        let id = setInterval(frame, 10);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
                bar = 0;
            } else {
                width++;
                elem.style.width = width + "%";
            }
        }
    }
}

function createPopUp(responseArray) {
    if (responseArray !== 0) {
        let nameArray = [];
        for (let i = 0; i < responseArray.length; i++) {
            nameArray.push(responseArray[i].name);
        }

        let divPop = document.createElement('div');
        divPop.setAttribute('id', 'divPop')
        let popup = document.createElement('img');
        popup.src = "../resources/SelectCityPopUp.png";
        popup.setAttribute('id', 'popup');
        let citiesDiv = document.createElement('div');
        citiesDiv.setAttribute('id', 'citiesDiv');
        citiesDiv.setAttribute('class', 'citiesBox')
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
        for (let i = 0; i < responseArray.length; i++) {
            let url = 'cityInformation.html?city=' + responseArray[i].name;
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
    initMap();
    interactionMode = 'start';
    removeBackUp();
    appendSearchBar();
}

function createMarker() {
    let markerCount = 0;
    let markerName = 'marker';

    for (markerCount = 1; markerCount < (responseArray.length + 1); markerCount++) {
        let position = {lat: responseArray[markerCount - 1].latitude, lng: responseArray[markerCount - 1].longitude};
        let icon = {url: '../resources/Marker.png'}
        markerList.push(eval('let ' + markerName + markerCount + ' = new google.maps.Marker({position: position, icon: icon, map: map})'));
    }
}

/* set page back to start using the back button */
function backUp(event) {
    if (interactionMode === 'popup') {closePopUp()}
    else {
        initMap();
        interactionMode = 'start';
        appendSearchBar();
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
    document.getElementById('backUp').remove();
}

/* generating the search bar and set its style properties */
function appendSearchBar() {
    let search = document.createElement('textarea');
    search.setAttribute('id', 'searchText');
    search.setAttribute('placeholder', 'Search for a city ...');
    search.style.width = '52%';     /* generate a relative style which works for all mobiles */
    search.style.top = `${(window.innerHeight - 60)}` + 'px';
    search.style.left = `${(screen.width / 2) - (26 * screen.width / 100)}` + 'px';
    search.style.width = `${(52 * 100 /screen.width)}`
    document.getElementById('buttons').append(search);
}

function removeSearchBar() {
    document.getElementById('searchText').remove();
}

function appendTip() {
    let tip = document.createElement('textarea');
    tip.setAttribute('id', 'tip')
    if (interactionMode === 'start') {
        tip.innerText = 'Tab map to zoom in';
    }
    else if (interactionMode === 'zoom') {
        tip.innerText = 'Tab to get cities';
    }

    tip.style.width = '40%'; /* generate a relative style which works for all mobiles */
    tip.style.top = `${(window.innerHeight - 160)}` + 'px';
    tip.style.left = `${(screen.width / 2) - (20 * screen.width / 100)}` + 'px';
    tip.setAttribute('readonly', '');
    document.getElementById('buttons').append(tip);
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

function startScreen(event) {
    document.getElementById('nav').style.opacity = '1';
    document.getElementById('body').style.backgroundColor = '#9ae7cd';
    document.getElementById('intro').remove();
    appendSearchBar();
    appendTip();
    fadeOutTip();
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