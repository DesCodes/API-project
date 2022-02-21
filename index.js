const express = require('express');
const { response } = require('express');
const res = require('express/lib/response');

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

app.get('/location/:latlon', async (request, response) => {
  const latlon = request.params.latlon.split(',');
  const lat = latlon[0];
  const lon = latlon[1];
  const mapBox_API_key = 'pk.eyJ1IjoicmhvZ2EiLCJhIjoiY2pva3oyamNxMDNpdDNwcDM2NjRyejJkNSJ9.TYs4auLcIzhsSxVgI7EXlw';
  const api_url = `https://api.mapbox.com/styles/v1/streets-v11/static/${lat},${lon},9?access_token=${mapBox_API_key}`;

  // https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-122.304,37.8112,9,0/300x200?access_token=pk.eyJ1IjoicmhvZ2EiLCJhIjoiY2pva3oyamNxMDNpdDNwcDM2NjRyejJkNSJ9.TYs4auLcIzhsSxVgI7EXlw
  const fetch_response = await fetch(api_url);
  const json = await fetch_response.json();
  response.json(json);
});

const myMap = L.map('map').setView([0, 0], 1);
const marker = L.marker([0, 0]).addTo(myMap);

const tileUrl = 'https://api.mapbox.com/v4/{tileset_id}/tilequery/{lon},{lat}.json'
const tiles = L.tileLayer(tileUrl, { attribution })
tiles.addTo(myMap)