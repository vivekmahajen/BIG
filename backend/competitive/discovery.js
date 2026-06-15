const axios = require('axios');

async function discoverCompetitors(industry, city, country = 'US', limit = 5) {
  const res = await axios.get('https://serpapi.com/search.json', {
    params: {
      engine: 'google_maps',
      q: `${industry} ${city}`,
      hl: 'en',
      gl: country.toLowerCase(),
      api_key: process.env.SERPAPI_KEY,
    },
    timeout: 10000,
  });
  return (res.data?.local_results ?? []).slice(0, limit).map(r => ({
    name: r.title,
    rating: r.rating ?? null,
    reviewCount: r.reviews ?? 0,
    address: r.address,
    placeId: r.place_id,
    website: r.website ?? null,
    phone: r.phone ?? null,
    priceLevel: r.price ?? null,
    hours: r.hours ?? null,
    types: r.type ?? [],
    serpPosition: r.position,
  }));
}

module.exports = { discoverCompetitors };
