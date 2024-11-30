const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Endpoint for fetching product details using a barcode
app.get('/api/products/:barcode', async (req, res) => {
  const barcode = req.params.barcode;

  // API URLs for different sources
  const openFoodFactsUrl = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
  const amazonApiUrl = `https://api.amazon.com/product?barcode=${barcode}`;
  const rapidApiUrl = `https://upcitemdb.p.rapidapi.com/lookup?upc=${barcode}`;

  // Fetch data from different APIs
  async function fetchFromOpenFoodFacts() {
    const response = await fetch(openFoodFactsUrl);
    return response.ok ? response.json() : null;
  }

  async function fetchFromAmazon() {
    const response = await fetch(amazonApiUrl, {
      headers: {
        'Authorization': 'Bearer YOUR_AMAZON_API_KEY',
      },
    });
    return response.ok ? response.json() : null;
  }

  async function fetchFromRapidAPI() {
    const response = await fetch(rapidApiUrl, {
      headers: {
        'x-rapidapi-key': '1853f6622amsh91b5e650f9386edp146f3cjsn29d8935d91bc',
        'x-rapidapi-host': 'upcitemdb.p.rapidapi.com',
      },
    });
    return response.ok ? response.json() : null;
  }

  try {
    const [openFoodData, amazonData, rapidApiData] = await Promise.all([
      fetchFromOpenFoodFacts(),
      fetchFromAmazon(),
      fetchFromRapidAPI(),
    ]);

    // Extract required fields
    const responseData = {
      name: openFoodData?.product?.product_name || amazonData?.name || rapidApiData?.items?.[0]?.title || "N/A",
      brand: openFoodData?.product?.brands || amazonData?.brand || rapidApiData?.items?.[0]?.brand || "N/A",
      ingredients: openFoodData?.product?.ingredients_text || amazonData?.ingredients || "N/A",
      image_url: openFoodData?.product?.image_url || amazonData?.image || rapidApiData?.items?.[0]?.images?.[0] || "N/A",
      // expiry_date: openFoodData?.product?.expiration_date || amazonData?.expiryDate || rapidApiData?.items?.[0]?.expiryDate || "N/A",
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ message: 'Error fetching product details' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});