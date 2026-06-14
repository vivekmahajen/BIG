'use strict';

const { calculateDemandScore }       = require('./demandScore');
const { calculateCompetitionScore }  = require('./competitionScore');
const { calculateMonetisationScore } = require('./monetisationScore');

const COMP_NUMERIC = { 'Very Low': 10, 'Low': 8, 'Medium': 6, 'High': 4, 'Very High': 2 };
const MONO_NUMERIC = { 'Very High': 10, 'High': 8, 'Medium': 6, 'Low': 3 };

function calculateViability(demand, competition, monetisation) {
  const dScore = demand?.score ?? 6;        // default to 6 if no data
  const cScore = COMP_NUMERIC[competition?.level] ?? 6;
  const mScore = MONO_NUMERIC[monetisation?.level] ?? 6;

  const composite = dScore * 0.40 + cScore * 0.30 + mScore * 0.30;
  const score     = Math.round(composite * 10) / 10;

  const grade =
    score >= 8.5 ? 'A+' :
    score >= 8   ? 'A'  :
    score >= 7   ? 'B'  :
    score >= 6   ? 'C'  :
    score >= 5   ? 'D'  : 'F';

  const verdict =
    score >= 8 ? 'Strong opportunity — act fast' :
    score >= 7 ? 'Good opportunity — validate before committing' :
    score >= 6 ? 'Viable — proceed with caution' :
    score >= 5 ? 'Marginal — needs differentiation' : 'High risk — rethink approach';

  const topRisk =
    competition?.level === 'Very High'    ? 'Market saturation'      :
    (demand?.score ?? 10) < 4            ? 'Unproven demand'         :
    monetisation?.level === 'Low'        ? 'Thin margins'            :
    competition?.incumbentStrength === 'Strong' ? 'Strong incumbents' : null;

  return { score, grade, verdict, topRisk };
}

/**
 * Master scoring function — call after buildValidationPayload()
 */
function scoreOpportunity(sector, validationPayload) {
  const demand       = calculateDemandScore(validationPayload);
  const competition  = calculateCompetitionScore(validationPayload);
  const monetisation = calculateMonetisationScore(sector, validationPayload);
  const viability    = calculateViability(demand, competition, monetisation);

  return { demand, competition, monetisation, viability };
}

module.exports = { scoreOpportunity };
