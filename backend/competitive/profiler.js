function estimateRevenue(reviewCount, priceLevel) {
  const priceMultiplier = { '$': 50, '$$': 150, '$$$': 400, '$$$$': 1000 }[priceLevel] ?? 100;
  const monthlyCustomers = Math.max(20, reviewCount / 12);
  return {
    low: Math.round(monthlyCustomers * priceMultiplier * 0.5),
    high: Math.round(monthlyCustomers * priceMultiplier * 1.5),
  };
}

function formatRevenue(est) {
  const fmt = n => n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`;
  return `${fmt(est.low)}–${fmt(est.high)}/mo`;
}

async function profileCompetitors(competitors) {
  return competitors.map(c => ({
    ...c,
    estimatedRevenue: formatRevenue(estimateRevenue(c.reviewCount, c.priceLevel)),
    hasWebsite: !!c.website,
    hasPriceLevel: !!c.priceLevel,
    lowReviewCount: c.reviewCount < 50,
    lowRating: c.rating !== null && c.rating < 4.0,
  }));
}

module.exports = { profileCompetitors };
