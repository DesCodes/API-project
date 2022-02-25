const express = require('express');
const fetch = require('node-fetch');
// const { response } = require('express');
// const res = require('express/lib/response');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening at server ${port}`)
});
app.use(express.static('Public'));
app.use(express.json({ limit: '1mb' }));

app.get('/map/:latlon', async (request, response) => {
  const latlon = request.params.latlon.split(',');
  const lat = latlon[0];
  const lon = latlon[1];

  const API_key = process.env.YELP_API_KEY;
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

