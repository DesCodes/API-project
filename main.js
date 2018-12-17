
// const apiKey = 'eabc1c71960388';
L.mapbox.accessToken = 'pk.eyJ1IjoicmhvZ2EiLCJhIjoiY2pva3oyamNxMDNpdDNwcDM2NjRyejJkNSJ9.TYs4auLcIzhsSxVgI7EXlw';
const yelpAPI = 'NeeK12jNxlEAng-IzrJeyS2vV7XbhyXADQmZK8_rLgVb8EzTfy3S-1fJZTYbeM-HpflLGC8gKwbOczWDgxHn_ul-sT2LDYRqBYn4_0AtxBMxeu8PGQqx3YHYJosRXHYx';

											// GLOBAL OBJECT VARIABLES //
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
	const searchResults = `<h2 class="searchResults">${results.display_place}</h2>
							<h3 class="searchResults italic">${results.display_address}</h3>
							<h3 class="searchResults">Type: ${results.type}</h3>`;

	$('#results').empty().append(searchResults);
}





											// OBJECT FUNCTIONS //
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
	mapApp.PointOfInterest(latitude, longitude);
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


// this is a search input that takes the location argument and returns 10 unique results from the search
// mapApp.getUserInput = function(search) {
// 	$.ajax({
// 		url: 'https://proxy.hackeryou.com',
// 		dataType: 'json',
// 		method: 'GET',
// 		data: {
// 			reqUrl: 'https://api.locationiq.com/v1/autocomplete.php',
// 			params: {
// 				key: apiKey,
// 				q: search
// 			}
// 		}
// 	}).then(function(res) {
// 		// console.log(res);
// 		//push the long and lat values to the coordinates object
// 		mapApp.coordinates.latitude = res[0].lat;
// 		mapApp.coordinates.longitude = res[0].lon;
// 		const longitude = mapApp.coordinates.longitude;
// 		const latitude = mapApp.coordinates.latitude;
// 		//invoke the html function here
// 		mapApp.searchResults(res[0]);

// 		mapApp.getMap(longitude, latitude);
// 	});
// }

mapApp.getUserInput = function(search) {
	$.ajax({
		url: 'https://proxy.hackeryou.com',
		dataType: 'json',
		method: 'GET',
		data: {
			reqUrl: 'https://api.yelp.com/v3/businesses/search',
			params: {
				location: search,
				limit: 50,
				radius: 500,
			},
			proxyHeaders: {
				Authorization: 'Bearer ' + yelpAPI,
			}
		}
	}).then(function(res){
		// mapApp.coordinates.latitude = res.businesses[0].coordinates.latitude;
		// mapApp.coordinates.longitude = res.businesses[0].coordinates.longitude;
		// const latitude = mapApp.coordinates.latitude - 0.0000001;
		// const longitude = mapApp.coordinates.longitude + 0.0000001;
		mapApp.coordinates.latitude = res.region.center.latitude;
		mapApp.coordinates.longitude = res.region.center.longitude;
		const latitude = mapApp.coordinates.latitude;
		const longitude = mapApp.coordinates.longitude;

		mapApp.getMap(longitude, latitude);
	});
}

mapApp.yelpSearch = function(x, y) {
	$.ajax({
		url: 'https://proxy.hackeryou.com',
		dataType: 'json',
		method: 'GET',
		data: {
			reqUrl: 'https://api.yelp.com/v3/businesses/search',
			params: {
				latitude: x,
				longitude: y,
				limit: 50,
				radius: 500,
			},
			proxyHeaders: {
				Authorization: 'Bearer ' + yelpAPI,
			}
		}
	}).then(function(res){
		console.log(res)
	});
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
	// $('#coords').empty().append(showCoordinates);

	//this invokes the getMap function with the users current location
	mapApp.getMap(longitude, latitude);
}


// function that gets Points of Interests
// mapApp.PointOfInterest = function(x, y) {
// 	$.ajax({
// 		url: 'https://us1.locationiq.com/v1/nearby.php?',
// 		dataType: 'json',	
// 		method: 'GET',
// 		data: {
// 			key: apiKey,
// 			lat: y,
// 			lon: x,
// 			radius: 5000,
// 			tag: 'restaurant'
// 		}
// 	}).then(function(res) {
// 		//saves all the returned api calls to the restaurants object
// 		mapApp.restaurants = [];
// 		mapApp.restaurants.push(res);
// 		//}
// 		//invokes the marker function
// 		mapApp.marker();
// 		removeSpinner();
// 	});
// }

mapApp.PointOfInterest = function(x, y) {
	$.ajax({
		url: 'https://proxy.hackeryou.com',
		dataType: 'json',
		method: 'GET',
		data: {
			reqUrl: 'https://api.yelp.com/v3/businesses/search',
			params: {
				latitude: x,
				longitude: y,
				limit: 50,
				radius: 500,
			},
			proxyHeaders: {
				Authorization: 'Bearer ' + yelpAPI,
			}
		}
	}).then(function(res){
		console.log(res)

		mapApp.restaurants = [];
		mapApp.restaurants.push(res.businesses);

		mapApp.marker();
		removeSpinner();
	});
}


// function that adds a marker for each restaurant (yelp)
mapApp.marker = function() {
	mapApp.restaurants[0].forEach(restaurant => {
		//adds a marker for all the restaurants
		const restaurantName = restaurant.name;
		const markerCard = `<div class="markerCard">
								<img src="${restaurant.image_url}">
								<a href='${restaurant.url}' target='_blank'>	
									<h4>${restaurant.name}</h4>
								</a>	
								<p>Rating: ${restaurant.rating}</p>
								<p>Category: ${restaurant.categories[0].title}</p>
								<p>Phone: ${restaurant.phone}</p>
							</div>
							`
		// const latitude = restaurant.coordinates.latitude;
		// const longitude = restaurant.coordinates.longitude;
		const individualPopup = L.popup()
			.setLatLng([restaurant.coordinates.latitude, restaurant.coordinates.longitude])
			.setContent(`${markerCard}`);

		L.marker([restaurant.coordinates.latitude, restaurant.coordinates.longitude], {zIndexOffset: 0, opacity: 0})
			.bindPopup(individualPopup)
			.addTo(mapApp.map);
	});
}

//updates the restaurant marker distance from the center marker
mapApp.updateDistance = function() {
	mapApp.restaurants[0].forEach(markerDistance => {
	// mapApp.map['_layers'].forEach(markerDistance => {
	// $.each(mapApp.map._layers[35]._latlng, markerDistance => {
		const lat = parseFloat(markerDistance.coordinates.latitude);
		const lon = parseFloat(markerDistance.coordinates.longitude);
		const distance = marker._latlng.distanceTo([lat, lon]);

		markerDistance.distance = distance;
	});
	mapApp.checkDistance();
}

mapApp.checkDistance = function() {
	mapApp.restaurants[0].filter(restaurant => {
		// const lat1 = parseFloat(restaurant.lat);
		// const lng1 = parseFloat(restaurant.lon);
		const lat1 = restaurant.coordinates.latitude;
		const lng1 = restaurant.coordinates.longitude;
		if (restaurant.distance < radius) {

			const item = this;
			$.each(item, function(index, value) {
				//saves all the results into an object variable

				if (!this._layers) {
					// Quit if _layers is undefined (sometimes is... dunno why)
					return;
				}

				const arrayValues = Object.values(this._layers);
				
				arrayValues.filter(coordinate => { 
					return coordinate._latlng;
				}).forEach(coordinate => {
					
					const latLng = coordinate._latlng;
					const lat = latLng.lat;
					const lng = latLng.lng;

					if(lat1 == lat && lng1 == lng) {
						//makes the markers visible if within range
						coordinate.setOpacity(1);
					}
				});
			});
				
		} else {
			const item = this;
			$.each(item, function(index, value) {
				//saves all the results into an object variable

				if (!this._layers) {
					// Quit if _layers is undefined (sometimes is... dunno why)
					return;
				}

				const arrayValues = Object.values(this._layers);
				
				arrayValues.filter(coordinate => { 
					return coordinate._latlng;
				}).forEach(coordinate => {

					const latLng = coordinate._latlng;
					const lat = latLng.lat;
					const lng = latLng.lng;

					if(lat1 == lat && lng1 == lng) {
						//makes the markers invisible if out of range
						coordinate.setOpacity(0);
					}
				});
			});
		}
	});
}



//adds a draggable center marker
mapApp.centerMarker = function() {

	//returns the marker coordinates
	marker._latlng.lat = mapApp.coordinates.latitude;
	marker._latlng.lng = mapApp.coordinates.longitude;
	const latitude = marker._latlng.lat;
	const longitude = marker._latlng.lng;

	marker.addTo(mapApp.map);
	mapApp.createCircle(radius, latitude, longitude);
}






										// GENERAL GLOBAL FUNCTIONS //

const submitInput = function() {
	$('#userInput').on('submit', function(e) {
		e.preventDefault();
		
		const userInput = $('input[type=text]').val();
		$('input[type=text]').val('');
		mapApp.getUserInput(userInput);
	});
}

//displays the loading gif
const showSpinner = function() {
	$('#userLocation').on('click', function() {
		$('.fa-spinner').addClass('spin');
	});
}
//removes the loading gif
const removeSpinner = function() {
	$('.fa-spinner').removeClass('spin');
	$('.fa-spinner').css('animation', 'none');
}
//function that gets the users current position
const getLocation = function() {
	$('#userLocation').on('click', function() {
		navigator.geolocation.getCurrentPosition(displayLocation);
	});
}
//on slider change, get the value of the slider value
const sliderChange = function() {
	$('#slider').on('input', function() {
		const meters = $(this).val();
		const showMeters = `${meters} Meters`;
		const longitude = marker._latlng.lng;
		const latitude = marker._latlng.lat;

		$('.meters').empty().append(showMeters);
		//gets the value from the slider and updates the value to the radius object
		radius = parseInt(meters);

		mapApp.createCircle(radius, latitude, longitude);
		mapApp.checkDistance();
	});
}

//locks the circle to the center marker
const updateCircle = function() {
	let interval;
	$('body').on('mousedown', '.leaflet-marker-draggable', function(e){
		// mapApp.centerMarker();
		interval = setInterval(function() {
			mapApp.createCircle(radius, marker._latlng.lat, marker._latlng.lng);


			for(let i = 0; i < mapApp.restaurants[0].length; i++) {

				const latitude = mapApp.restaurants[0][i].coordinates.latitude;
				const longitude = mapApp.restaurants[0][i].coordinates.longitude;
				// const distance = marker._latlng.distanceTo(mapApp.restaurants[0][i]);
				const distance = marker._latlng.distanceTo([latitude, longitude]);
					return distance < radius;

				// const newMarker = L.marker(new L.LatLng(mapApp.restaurants[0][i].coordinates.latitude, mapApp.restaurants[0][i].coordinates.longitude));
			}
		}, 10);
	});
	$('body').on('mouseup', '.leaflet-marker-draggable', function(e){
		clearInterval(interval);
	});
}
//tracks the restaurants near the center marker
const trackRestaurants = function() {
	let secondInterval;
	$('body').on('mousedown', '.leaflet-marker-draggable', function(e){
		secondInterval = setInterval(function() {
			mapApp.updateDistance();
			// mapApp.checkDistance();
		}, 250);
	});
	$('body').on('mouseup', '.leaflet-marker-draggable', function(e){
		clearInterval(secondInterval);
	});
}



											//	EVENT HANDLERS //

mapApp.init = function() {

	submitInput();
	getLocation();
	showSpinner();
	updateCircle();
	sliderChange();
	trackRestaurants();

}

//global center marker (gives the user access to the center marker)
const marker = L.marker(new L.LatLng(mapApp.coordinates.latitude, mapApp.coordinates.longitude),{
	icon: L.mapbox.marker.icon({
	    // 'marker-color': '#03f',
	    'marker-color': '#F58714',
	    'marker-symbol': 'x',
	    'marker-size': 'large'
	}),
	draggable: true,
	zIndexOffset: 500
});



$(function() {

	mapApp.init();

});