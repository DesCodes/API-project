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
	//if not equal to undefined then apply the code below
	if (!mapApp.map) {
		//mapbox plugin that creates a new map for every search
		//this stores the new values in the mapApp.map global object
		mapApp.map = L.mapbox.map('map', 'mapbox.streets').setView([y, x], 15.5);
	}

    //on load, add a circle to the center coordinates
	mapApp.createCircle(radius);
    //changes the map view to the current updated coordinates
    mapApp.map.flyTo([y, x], 15.5);
    //invoke the create marker function
	mapApp.marker(mapApp.coordinates.latitude, mapApp.coordinates.longitude);

	//gets the points of interests nearby
	mapApp.PointOfInterest(mapApp.coordinates.longitude, mapApp.coordinates.latitude);
}


//function that creates a circle on the map, requires meters argument
mapApp.createCircle = function(meters) {

	//gets the coordinates from the object
	const latitude = mapApp.coordinates.latitude;
	const longitude = mapApp.coordinates.longitude;

	//removes the previously created circle
	$('path').remove();
	//creates the circle on the map
	L.circle([latitude, longitude], meters).addTo(mapApp.map);
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
		//invoke the html function here
		mapApp.searchResults(res[0]);


		//push the long and lat values to the coordinates object
		mapApp.coordinates.latitude = res[0].lat;
		mapApp.coordinates.longitude = res[0].lon;

		mapApp.getMap(mapApp.coordinates.longitude, mapApp.coordinates.latitude);
	}).catch(err => console.log(err))
}


//function that gets the users current position
const getLocation = function() {
	navigator.geolocation.getCurrentPosition(displayLocation);
}
//function that inputs the user location to the html
const displayLocation = function(position) {
	//pushes the user coordinates to the coordinates object
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
	 {
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
			mapApp.restaurants.push(res);

			//iterates all the restaurant array indexes to remove the markers
			for (let i = 0; i < res.length; i++) {
				mapApp.removeMarker(res[i].distance, radius);
			}
			
		});
	}
}


// function that adds a marker
mapApp.marker = function(x, y) {
	mapApp.restaurants.forEach(function(restaurant) {
		//adds a marker for all the restaurants
		L.marker([restaurant.lat, restaurant.lon]).addTo(mapApp.map);
		// console.log(restaurant);
	});
		// $('div.leaflet-marker-pane img:not(:first-child)').hide();

	//adds a center marker
	L.marker([x, y], {icon: L.mapbox.marker.icon({
			'marker-color': '#03f',
			'marker-symbol': 'x',
			'marker-size': 'large'
		})}).addTo(mapApp.map);
}


//function that removes markers if they are out of range
mapApp.removeMarker = function(radius) {

	// const markers = $('L.marker');
	if(mapApp.restaurants.distance > radius){
		console.log('in range');
		$('div.leaflet-marker-pane img:not(:first-child)').hide();
		} else {
		//removes all the marker except the first-child (first child is the center marker)
		$('div.leaflet-marker-pane img:not(:first-child)').show();
		}
}


//this is where all the event handlers go
mapApp.init = function() {

	$('#userInput').on('submit', function(e) {
		e.preventDefault();
		
		const userInput = $('input[type=text]').val();
		mapApp.getUserInput(userInput);
	});
	
	$('#userLocation').on('click', function() {
		getLocation();
	});

	//on slider change, get the value of the slider value
	$('#slider').on('input', function() {
		const meters = $(this).val();
		const showMeters = `${meters} Meters`;
		$('.meters').empty().append(showMeters);
		//gets the value from the slider and updates the value to the radius object
		radius = parseInt(meters);
		
		mapApp.getMap(mapApp.coordinates.longitude, mapApp.coordinates.latitude);
	});
	//on slider change, remove the markers
	// $('#slider').on('change', function() {
	// 	$('.leaflet-marker-pane img').remove();
	// });
}







$(function() {

	mapApp.init();

});