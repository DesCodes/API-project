const apiKey = 'eabc1c71960388';
L.mapbox.accessToken = 'pk.eyJ1IjoicmhvZ2EiLCJhIjoiY2pva3oyamNxMDNpdDNwcDM2NjRyejJkNSJ9.TYs4auLcIzhsSxVgI7EXlw';

mapApp = {}

//function that updates the html from the search request
mapApp.searchResults = function(results) {
	const searchResults = `<h2>${results.display_place}</h2>
							<h3>${results.display_address}</h3>
							<h3>Type: ${results.type}</h3>`;

	$('#results').empty().append(searchResults);
}

//global object variable for the get map function (default set to null)
//by making the global object then it is possible to access the object variables from the mapbox.map
mapApp.map = undefined;

mapApp.getMap = function(x, y) {

	//if not equal to undefined then apply the code below
	if (!mapApp.map) {
		//mapbox plugin that creates a new map for every search
		//this stores the new values in the mapApp.map global object
		mapApp.map = L.mapbox.map('map', 'mapbox.streets').setView([y, x], 16);
	}

    //on load, add a circle to the center coordinates
    L.circle([y, x], 250).addTo(mapApp.map);

    //changes the map view to the current updated coordinates
    mapApp.map.flyTo([y, x], 16);
}

//this is a search input that takes the location argument and returns 10 unique results from the search
mapApp.getUserInput = function(search) {
	$.ajax({
		url: 'http://proxy.hackeryou.com',
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

		//push the longitude and latitude values from user search to the getMap object
		mapApp.getMap(res[0].lon, res[0].lat);



	}).catch(err => console.log(err))
}



const getCoords = function() {
	navigator.geolocation.getCurrentPosition;
}


//this is where all the event handlers go
mapApp.init = function() {

	$('#userInput').on('submit', function(e) {
		e.preventDefault();
		
		const userInput = $('input[type=text]').val();
		mapApp.getUserInput(userInput);
	});
	
	$('#userLocation').on('click', function() {
		map.locate();
	});
}







$(function() {
	mapApp.init();
});