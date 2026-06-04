const axios = require('axios');
const { parse } = require('csv-parse/sync');
const NodeCache = require('node-cache');
const { STATE_FIPS } = require('../config/sectorMap');

const cache = new NodeCache({ stdTTL: 86400 });

async function getEmploymentData(state, naicsCode) {
  const naics2 = naicsCode.substring(0, 2);
  const cacheKey = `bls_${state}_${naics2}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const fips = STATE_FIPS[state];
  if (!fips) return { employment: null, avgWeeklyWage: null, establishments: null, source: 'unavailable' };

  try {
    const url = `https://data.bls.gov/cew/data/api/2023/a/industry/${naics2}.csv`;
    const { data: csv } = await axios.get(url, { timeout: 12000, responseType: 'text' });
    const records = parse(csv, { columns: true, skip_empty_lines: true });

    // Try own_code=5 (private), agglvl=74 (state×industry)
    let row = records.find(r => r.area_fips === fips && r.own_code === '5' && r.agglvl_code === '74');
    // Broader fallback
    if (!row) row = records.find(r => r.area_fips === fips && r.own_code === '5');

    if (row) {
      const result = {
        employment: parseInt(row.annual_avg_emplvl) || null,
        avgWeeklyWage: parseInt(row.annual_avg_wkly_wage) || null,
        avgAnnualPay: parseInt(row.avg_annual_pay) || null,
        establishments: parseInt(row.annual_avg_estabs) || null,
        source: `BLS QCEW 2023 (${state})`,
      };
      cache.set(cacheKey, result);
      return result;
    }
  } catch (err) {
    console.warn(`BLS fetch failed ${state}/${naics2}:`, err.message);
  }

  return { employment: null, avgWeeklyWage: null, establishments: null, source: 'unavailable' };
}

module.exports = { getEmploymentData };
