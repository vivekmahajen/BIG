const axios = require('axios');
const { parse } = require('csv-parse/sync');
const NodeCache = require('node-cache');
const { STATE_FIPS } = require('../config/sectorMap');

const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL_BLS) || 86400 });

/**
 * Fetches employment and wage data from BLS QCEW Open Data CSV files.
 * Returns state-level data for the given NAICS sector.
 */
async function getEmploymentData(state, naicsCode) {
  const cacheKey = `bls_${state}_${naicsCode}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const fips = STATE_FIPS[state];
  if (!fips) {
    return { employment: null, avgWeeklyWage: null, establishments: null, source: 'unavailable' };
  }

  const naics2 = naicsCode.substring(0, 2);
  const year = 2023;
  const url = `https://data.bls.gov/cew/data/api/${year}/a/industry/${naics2}.csv`;

  try {
    const response = await axios.get(url, {
      timeout: 12000,
      responseType: 'text',
      headers: { 'Accept': 'text/csv', 'User-Agent': 'BIG-App/1.0' },
    });

    const records = parse(response.data, { columns: true, skip_empty_lines: true });

    // Filter: this state fips, private ownership (own_code=5), annual
    let stateRow = records.find(r =>
      r.area_fips === fips &&
      r.own_code === '5' &&
      r.industry_code === naics2 &&
      r.agglvl_code === '54'  // State, NAICS sector, private
    );

    if (!stateRow) {
      // Try broader agglvl
      stateRow = records.find(r =>
        r.area_fips === fips &&
        r.own_code === '5' &&
        r.industry_code === naics2
      );
    }

    if (!stateRow) {
      const result = { employment: null, avgWeeklyWage: null, establishments: null, source: 'unavailable (no state row)', state, year };
      cache.set(cacheKey, result);
      return result;
    }

    const result = {
      employment: parseInt(stateRow.annual_avg_emplvl) || null,
      avgWeeklyWage: parseInt(stateRow.annual_avg_wkly_wage) || null,
      avgAnnualPay: parseInt(stateRow.avg_annual_pay) || null,
      establishments: parseInt(stateRow.annual_avg_estabs) || null,
      source: `BLS QCEW ${year} Annual (${state})`,
      state,
      year,
    };
    cache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.error(`[BLS] Fetch failed for ${state} / NAICS ${naics2}:`, err.message);
    return { employment: null, avgWeeklyWage: null, establishments: null, source: 'unavailable', state, year };
  }
}

module.exports = { getEmploymentData };
