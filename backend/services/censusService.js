const axios = require('axios');
const NodeCache = require('node-cache');
const { STATE_FIPS } = require('../config/sectorMap');

const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL_CENSUS) || 86400 });

/**
 * Fetches business establishment data from Census ZIP Business Patterns API.
 * Falls back to County Business Patterns if ZIP data is suppressed.
 */
async function getBusinessDensity(zip, state, naicsCode) {
  const cacheKey = `census_${zip}_${naicsCode}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const year = 2022; // Most reliably available ZBP data
  const apiKey = process.env.CENSUS_API_KEY;
  if (!apiKey) {
    return { estab: null, emp: null, payann: null, naicsLabel: '', source: 'unavailable (no CENSUS_API_KEY)', year, zip };
  }

  const naics2 = naicsCode.substring(0, 2);

  // Try ZIP-level data first
  try {
    const zipUrl = `https://api.census.gov/data/${year}/zbp` +
      `?get=ESTAB,EMP,PAYANN,NAICS2017_LABEL` +
      `&for=zipcode:${zip}` +
      `&NAICS2017=${naics2}` +
      `&key=${apiKey}`;

    const response = await axios.get(zipUrl, { timeout: 8000 });
    const rows = response.data;

    if (rows && rows.length > 1) {
      const headers = rows[0];
      const dataRow = rows[1];
      const estabIdx = headers.indexOf('ESTAB');
      const empIdx = headers.indexOf('EMP');
      const payIdx = headers.indexOf('PAYANN');
      const labelIdx = headers.indexOf('NAICS2017_LABEL');

      const estab = parseInt(dataRow[estabIdx]);
      if (!isNaN(estab) && estab > 0) {
        const result = {
          estab,
          emp: parseInt(dataRow[empIdx]) || 0,
          payann: parseInt(dataRow[payIdx]) || 0,
          naicsLabel: dataRow[labelIdx] || '',
          source: 'Census ZBP (ZIP-level)',
          year,
          zip,
        };
        cache.set(cacheKey, result);
        return result;
      }
    }
  } catch (zipError) {
    console.warn(`[Census] ZIP-level data unavailable for ${zip}: ${zipError.message}`);
  }

  // Fallback: County-level CBP data
  try {
    const fips = STATE_FIPS[state];
    if (!fips) throw new Error(`Unknown state FIPS for: ${state}`);

    const countyUrl = `https://api.census.gov/data/${year}/cbp` +
      `?get=ESTAB,EMP,PAYANN,NAME` +
      `&for=county:*` +
      `&in=state:${fips}` +
      `&NAICS2017=${naics2}` +
      `&key=${apiKey}`;

    const response = await axios.get(countyUrl, { timeout: 8000 });
    const rows = response.data;

    if (rows && rows.length > 1) {
      let totalEstab = 0, totalEmp = 0, totalPayann = 0;
      for (let i = 1; i < rows.length; i++) {
        totalEstab  += parseInt(rows[i][0]) || 0;
        totalEmp    += parseInt(rows[i][1]) || 0;
        totalPayann += parseInt(rows[i][2]) || 0;
      }
      const result = {
        estab: totalEstab,
        emp: totalEmp,
        payann: totalPayann,
        naicsLabel: rows[1][3] || '',
        source: `Census CBP (${state} state-level)`,
        year,
        zip,
      };
      cache.set(cacheKey, result);
      return result;
    }
  } catch (countyError) {
    console.error('[Census] CBP fallback failed:', countyError.message);
  }

  return { estab: null, emp: null, payann: null, naicsLabel: '', source: 'unavailable', year, zip };
}

module.exports = { getBusinessDensity };
