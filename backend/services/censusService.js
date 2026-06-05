const axios = require('axios');
const NodeCache = require('node-cache');
const { STATE_FIPS } = require('../config/sectorMap');

const cache = new NodeCache({ stdTTL: 86400 }); // 24-hour cache

async function getBusinessDensity(zip, state, naicsCode) {
  const naics2 = naicsCode.substring(0, 2);
  const cacheKey = `census_${zip}_${naics2}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.CENSUS_API_KEY;
  if (!apiKey) return { estab: null, emp: null, payann: null, source: 'no-key', year: 2023 };

  const year = 2022; // ZBP 2022 is widely available
  // ZIP-level attempt
  try {
    const url = `https://api.census.gov/data/${year}/zbp?get=ESTAB,EMP,PAYANN&for=zipcode:${zip}&NAICS2017=${naics2}&key=${apiKey}`;
    const { data } = await axios.get(url, { timeout: 8000 });
    if (data && data.length > 1) {
      const [estab, emp, payann] = data[1];
      const result = { estab: parseInt(estab)||0, emp: parseInt(emp)||0, payann: parseInt(payann)||0, source: 'Census ZBP (ZIP)', year };
      cache.set(cacheKey, result);
      return result;
    }
  } catch {}

  // State-level fallback (sum all counties — clearly labelled as statewide)
  try {
    const fips = STATE_FIPS[state];
    if (!fips) throw new Error('no fips');
    const url = `https://api.census.gov/data/${year}/cbp?get=ESTAB,EMP,PAYANN&for=county:*&in=state:${fips}&NAICS2017=${naics2}&key=${apiKey}`;
    const { data } = await axios.get(url, { timeout: 8000 });
    if (data && data.length > 1) {
      let estab = 0, emp = 0, payann = 0;
      for (let i = 1; i < data.length; i++) { estab += parseInt(data[i][0])||0; emp += parseInt(data[i][1])||0; payann += parseInt(data[i][2])||0; }
      const result = { estab, emp, payann, source: `Census CBP (${state} statewide — ZIP-level data unavailable)`, year, statewide: true };
      cache.set(cacheKey, result);
      return result;
    }
  } catch {}

  return { estab: null, emp: null, payann: null, source: 'unavailable', year };
}

module.exports = { getBusinessDensity };
