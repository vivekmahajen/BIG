const Anthropic = require('@anthropic-ai/sdk');

async function synthesiseCompetitiveAnalysis(competitors, industry, city, country) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `You are a competitive strategy analyst. Analyse the competition for ${industry} in ${city}, ${country}.

Competitor data from Google Maps:
${JSON.stringify(competitors, null, 2)}

Return ONLY valid JSON matching this exact schema:
{
  "market_summary": "2-sentence overview of competitive landscape",
  "incumbent_strength": "Strong|Moderate|Weak",
  "market_gap_score": 7.2,
  "competitors": [
    {
      "name": "...",
      "rating": 4.1,
      "review_count": 247,
      "what_they_do_well": ["specific strength 1", "specific strength 2"],
      "where_they_fail": ["specific weakness 1", "specific weakness 2"],
      "positioning": "one sentence describing their market position",
      "estimated_monthly_revenue": "$XX,XXX–$XX,XXX/mo",
      "vulnerability": "the single biggest gap an entrant could exploit against this competitor"
    }
  ],
  "aggregate_gaps": [
    { "gap": "description of market-wide gap", "frequency": 5, "severity": "High|Medium|Low" }
  ],
  "entry_angle": "The single best positioning for a new entrant based on these gaps",
  "red_flags": ["any red flags that suggest this market is harder than it looks"]
}

Be specific and evidence-based. Name actual weaknesses. Return only the JSON object.`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].text.replace(/```json|```/g, '').trim();
  return JSON.parse(text);
}

module.exports = { synthesiseCompetitiveAnalysis };
