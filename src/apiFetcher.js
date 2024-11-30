const fetch = require('node-fetch');
require('dotenv').config();
async function fetchFromOpenFoodFacts(barcode) {
  const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
  const response = await fetch(url);
  return response.ok ? response.json() : null;
}

// async function fetchFromAmazon(barcode, apiKey) {
//   const url = `https://api.amazon.com/product?barcode=${barcode}`;
//   const response = await fetch(url, {
//     headers: { Authorization: `Bearer ${apiKey}` },
//   });
//   return response.ok ? response.json() : null;
// }

async function fetchFromRapidAPI(barcode, apiKey) {
  const apiKey = process.env.RAPIDAPI_KEY;
  const url = `https://upcitemdb.p.rapidapi.com/lookup?upc=${barcode}`;
  const response = await fetch(url, {
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'upcitemdb.p.rapidapi.com',
    },
  });
  return response.ok ? response.json() : null;
}

module.exports = { fetchFromOpenFoodFacts, fetchFromAmazon, fetchFromRapidAPI };
