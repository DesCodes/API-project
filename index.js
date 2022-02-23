const express = require('express');
const fetch = require('cross-fetch');
const { response } = require('express');
const res = require('express/lib/response');
const app = express();

app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });


app.get('/map/:latlon', async (request, response) => {
  const latlon = request.params.latlon.split(',');
  const lat = latlon[0];
  const lon = latlon[1];

  const API_key = 'NeeK12jNxlEAng-IzrJeyS2vV7XbhyXADQmZK8_rLgVb8EzTfy3S-1fJZTYbeM-HpflLGC8gKwbOczWDgxHn_ul-sT2LDYRqBYn4_0AtxBMxeu8PGQqx3YHYJosRXHYx';
  const api_url = `https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=${lat}&longitude=${lon}`;

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + API_key
    }
  }

  const fetch_response = await fetch(api_url, options);
  const json = await fetch_response.json();
  response.json(json);
});



  
  // https://api.mapbox.com/geocoding/v5/mapbox.places/tokyo.json?access_token=pk.eyJ1IjoicmhvZ2EiLCJhIjoiY2pva3oyamNxMDNpdDNwcDM2NjRyejJkNSJ9.TYs4auLcIzhsSxVgI7EXlw