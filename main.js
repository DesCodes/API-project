const apiKey = 'eabc1c71960388';
L.mapbox.accessToken = 'pk.eyJ1IjoicmhvZ2EiLCJhIjoiY2pva3oyamNxMDNpdDNwcDM2NjRyejJkNSJ9.TYs4auLcIzhsSxVgI7EXlw';


								//GLOBAL OBJECT VARIABLES
mapApp = {}
//global object variable for the get map function (default set to null)
//by making the global object then it is possible to access the map
mapApp.map = undefined;	

//stores the longitude and latitude values
mapApp.coordinates = {
	latitude: '',
	longitude: ''
}

//stores nearby restaurants
mapApp.restaurants = [];


//this updates the radius of the circle
let radius = 500;

//function that updates the html from the search request
mapApp.searchResults = function(results) {
	const searchResults = `<h2>${results.display_place}</h2>
							<h3>${results.display_address}</h3>
							<h3>Type: ${results.type}</h3>`;

	$('#results').empty().append(searchResults);
}





								// OBJECT FUNCTIONS
//function that produces a map
mapApp.getMap = function(x, y) {
	const latitude = mapApp.coordinates.latitude;
	const longitude = mapApp.coordinates.longitude;

	//if not equal to undefined then apply the code below
	if (!mapApp.map) {
		//mapbox plugin that creates a new map for every search
		//this stores the new values in the mapApp.map global object
		mapApp.map = L.mapbox.map('map', 'mapbox.streets').setView([y, x], 15.5);
	}

    //on load, add a circle to the center coordinates
	mapApp.createCircle(radius, latitude, longitude);
    //changes the map view to the current updated coordinates
    mapApp.map.flyTo([y, x], 15.5);
    //invoke the centre marker function
	mapApp.centerMarker();

	//gets the points of interests nearby
	mapApp.PointOfInterest(longitude, latitude);
	//invoke the marker function
	// mapApp.marker();
}



//function that creates a circle on the map, requires meters argument
mapApp.createCircle = function(meters, x, y) {
	//removes the previously created circle
	$('path').remove();
	//creates the circle on the map
	// L.circle([latitude, longitude], meters).addTo(mapApp.map);
	L.circle([x, y], meters).addTo(mapApp.map);
}


//this is a search input that takes the location argument and returns 10 unique results from the search
mapApp.getUserInput = function(search) {
	$.ajax({
		url: 'https://proxy.hackeryou.com',
		dataType: 'json',
		method: 'GET',
		data: {
			reqUrl: 'https://api.locationiq.com/v1/autocomplete.php',
			params: {
				key: apiKey,
				q: search
			}
		}
	}).then(function(res) {
		console.log(res);
		const longitude = mapApp.coordinates.longitude;
		const latitude = mapApp.coordinates.latitude;
		//invoke the html function here
		mapApp.searchResults(res[0]);


		//push the long and lat values to the coordinates object
		mapApp.coordinates.latitude = res[0].lat;
		mapApp.coordinates.longitude = res[0].lon;

		mapApp.getMap(longitude, latitude);
	}).catch(err => console.log(err))
}


//function that gets the users current position
const getLocation = function() {
	navigator.geolocation.getCurrentPosition(displayLocation);

	//adds the loading gif
	const spinner = function() {
		$('.fa-spinner').addClass('spin');
	}
	//removes the loading gif
	const removeSpinner = function() {
		$('.fa-spinner').removeClass('spin');
	}
	setTimeout(spinner, 500);
	setTimeout(removeSpinner, 1600);
	setTimeout(spinner, 3200);
	setTimeout(removeSpinner, 4300);
	setTimeout(spinner, 5600);
	setTimeout(removeSpinner, 6800);
}
//function that inputs the user location to the html
const displayLocation = function(position) {
	//updates the user coordinates to the coordinates object
	mapApp.coordinates.latitude = position.coords.latitude;
	mapApp.coordinates.longitude = position.coords.longitude;

	//gets the coordinates from the object
	const latitude = mapApp.coordinates.latitude;
	const longitude = mapApp.coordinates.longitude;

	const showCoordinates = `<h3>Latitude: ${latitude}</h3>
							 <h3>Longitude: ${longitude}</h3>`;

	//puts the coordinates in html
	$('#coords').empty().append(showCoordinates);

	//this invokes the getMap function with the users current location
	mapApp.getMap(longitude, latitude);
}


// function that gets Points of Interests
mapApp.PointOfInterest = function(x, y) {
	$.ajax({
		url: 'https://us1.locationiq.com/v1/nearby.php?',
		dataType: 'json',	
		method: 'GET',
		data: {
			key: apiKey,
			lat: y,
			lon: x,
			radius: 5000,
			tag: 'restaurant'
		}
	}).then(function(res) {
			// console.log(res);
			//saves all the returned api calls to the restaurants object
			mapApp.restaurants = [];
			mapApp.restaurants.push(res);

			// iterates all the restaurant array indexes to remove the markers
			for (let i = 0; i < res.length; i++) {
				// mapApp.removeMarker(res[i].distance, radius);
			}
			//invokes the marker function
			// mapApp.marker();
	});
}


//formula that calculates the distance from two longitude and latitude points
const measureDistance = function(lat1, lon1, lat2, lon2) {
	var R = 6378.137; //radius of earth in KM
	var dLat = lat2 * Math.PI/180 - lat1 * Math.PI/180;
	var dLon = lon2 * Math.PI/180 - lon1 * Math.PI/180;
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI/180) * 
			Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	return Math.floor(d * 1000); //meters
}
// measureDistance(marker._latlng.lat, marker._latlng.lng, mapApp.restaurants[0][0].lat, mapApp.restaurants[0][0].lon);


// function that adds a marker
mapApp.marker = function() {
	mapApp.restaurants[0].forEach(function(restaurant) {
		//adds a marker for all the restaurants
		L.marker([restaurant.lat, restaurant.lon]).addTo(mapApp.map);
		// console.log(restaurant);
	});
		// $('div.leaflet-marker-pane img:not(:first-child)').hide();
}




//adds a draggable center marker
mapApp.centerMarker = function() {
	//returns the marker coordinates
	marker._latlng.lat = mapApp.coordinates.latitude;
	marker._latlng.lng = mapApp.coordinates.longitude;
	const latitude = marker._latlng.lat;
	const longitude = marker._latlng.lng;

	marker.addTo(mapApp.map);
	// console.log(marker._latlng);
	// mapApp.createCircle(radius, marker._latlng.lat, marker._latlng.lng);
	mapApp.createCircle(radius, latitude, longitude);
}



//function that removes markers if they are out of range
mapApp.removeMarker = function(radius) {
	// const markers = $('L.marker');
	for(let i = 0; i < mapApp.restaurants[0].length; i++) {
		if(mapApp.restaurants[0][i].distance < radius){
			// console.log(i)
			// L.marker([mapApp.restaurants[0][i].lat, mapApp.restaurants[0][i].lon]).addTo(mapApp.map);
			//need to target this in the map.restaurants markers, its only targeting all the
			//div markers and it doesnt know which one to target
		// $('div.leaflet-marker-pane img:not(:first-child)').hide();
		} else {
		//removes all the marker except the first-child (first child is the center marker)
		// $('div.leaflet-marker-pane img:not(:first-child)').show();
		}
	// }
	const res = mapApp.restaurants[0];
	const eachRes = res[i].distance;
	console.log(eachRes)
	//filter method 
	const results = res.filter(eachRes => eachRes > 500);
	console.log(results);
	}
}


//this is where all the event handlers go
mapApp.init = function() {

	$('#userInput').on('submit', function(e) {
		e.preventDefault();
		
		const userInput = $('input[type=text]').val();
		$('input[type=text]').val('');
		mapApp.getUserInput(userInput);
	});
	
	$('#userLocation').on('click', function() {
		getLocation();
	});

	//on slider change, get the value of the slider value
	$('#slider').on('input', function() {
		const meters = $(this).val();
		const showMeters = `${meters} Meters`;
		const longitude = mapApp.coordinates.longitude;
		const latitude = mapApp.coordinates.latitude;

		$('.meters').empty().append(showMeters);
		//gets the value from the slider and updates the value to the radius object
		radius = parseInt(meters);
		// mapApp.getMap(longitude, latitude);
		mapApp.createCircle(radius, latitude, longitude);
	});

	//locks the circle to the center marker
	let interval;
	$('body').on('mousedown', '.leaflet-marker-draggable', function(e){
		// mapApp.centerMarker();
		interval = setInterval(function() {
			mapApp.createCircle(radius, marker._latlng.lat, marker._latlng.lng);

			for(let i = 0; i < mapApp.restaurants[0].length; i++) {
			// 	measureDistance(marker._latlng.lat, marker._latlng.lng, mapApp.restaurants[0][i].lat, mapApp.restaurants[0][i].lon);
				const distance = measureDistance(marker._latlng.lat, marker._latlng.lng, mapApp.restaurants[0][0].lat, mapApp.restaurants[0][0].lon)
				if (distance < radius) {
					$('div.leaflet-marker-pane img:not(:first-child)').show();
				} else {
					$('div.leaflet-marker-pane img:not(:first-child)').hide();
				}
			}
			}, 1);
	});
	$('body').on('mouseup', '.leaflet-marker-draggable', function(e){
		clearInterval(interval);
	});
}


//global center marker (gives the user access to the center marker)
const marker = L.marker(new L.LatLng(mapApp.coordinates.latitude, mapApp.coordinates.longitude), {
	icon: L.mapbox.marker.icon({
	    'marker-color': '#03f',
	    'marker-symbol': 'x',
	    'marker-size': 'large'
	}),
	draggable: true
});

$(function() {

	mapApp.init();

});