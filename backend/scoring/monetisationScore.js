'use strict';

// Keyed on BIG sector IDs (from geoData.js SECTORS array)
const SECTOR_PROFILES = {
  'Technology & Software':        { avgTicket: 2500,  recurring: true,  ltvLevel: 'High',   level: 'Very High' },
  'Healthcare & Life Sciences':   { avgTicket: 800,   recurring: true,  ltvLevel: 'High',   level: 'High'      },
  'Financial Services & Fintech': { avgTicket: 1200,  recurring: true,  ltvLevel: 'High',   level: 'Very High' },
  'Retail & E-Commerce':          { avgTicket: 75,    recurring: false, ltvLevel: 'Low',    level: 'Low'       },
  'Real Estate & Construction':   { avgTicket: 8500,  recurring: false, ltvLevel: 'Low',    level: 'High'      },
  'Food & Beverage':              { avgTicket: 45,    recurring: true,  ltvLevel: 'Medium', level: 'Medium'    },
  'Education & EdTech':           { avgTicket: 600,   recurring: true,  ltvLevel: 'High',   level: 'High'      },
  'Manufacturing & Logistics':    { avgTicket: 5000,  recurring: true,  ltvLevel: 'High',   level: 'High'      },
  'Media & Entertainment':        { avgTicket: 15,    recurring: true,  ltvLevel: 'Medium', level: 'Medium'    },
  'Energy & Sustainability':      { avgTicket: 4000,  recurring: true,  ltvLevel: 'High',   level: 'High'      },
  'Professional Services':        { avgTicket: 1200,  recurring: true,  ltvLevel: 'High',   level: 'High'      },
  'Transportation & Mobility':    { avgTicket: 350,   recurring: true,  ltvLevel: 'Medium', level: 'Medium'    },
  'Agriculture & AgTech':         { avgTicket: 800,   recurring: false, ltvLevel: 'Medium', level: 'Medium'    },
  'Government & Public Sector':   { avgTicket: 5000,  recurring: true,  ltvLevel: 'High',   level: 'High'      },
  'Wellness & Fitness':           { avgTicket: 120,   recurring: true,  ltvLevel: 'High',   level: 'Medium'    },
  'Hospitality & Tourism':        { avgTicket: 200,   recurring: false, ltvLevel: 'Low',    level: 'Medium'    },
  // Fallback for international sector IDs
  'food':          { avgTicket: 45,   recurring: true,  ltvLevel: 'Medium', level: 'Medium'  },
  'tech':          { avgTicket: 2500, recurring: true,  ltvLevel: 'High',   level: 'Very High' },
  'health':        { avgTicket: 800,  recurring: true,  ltvLevel: 'High',   level: 'High'    },
  'retail':        { avgTicket: 75,   recurring: false, ltvLevel: 'Low',    level: 'Low'     },
  'education':     { avgTicket: 600,  recurring: true,  ltvLevel: 'High',   level: 'High'    },
  'beauty':        { avgTicket: 120,  recurring: true,  ltvLevel: 'High',   level: 'Medium'  },
  'fitness':       { avgTicket: 80,   recurring: true,  ltvLevel: 'High',   level: 'Medium'  },
  'construction':  { avgTicket: 8500, recurring: false, ltvLevel: 'Low',    level: 'High'    },
  'transport':     { avgTicket: 350,  recurring: true,  ltvLevel: 'Medium', level: 'Medium'  },
  'agriculture':   { avgTicket: 800,  recurring: false, ltvLevel: 'Medium', level: 'Medium'  },
  'manufacturing': { avgTicket: 5000, recurring: true,  ltvLevel: 'High',   level: 'High'    },
  'finance':       { avgTicket: 1200, recurring: true,  ltvLevel: 'High',   level: 'Very High' },
  'hospitality':   { avgTicket: 200,  recurring: false, ltvLevel: 'Low',    level: 'Medium'  },
  'ecommerce':     { avgTicket: 85,   recurring: false, ltvLevel: 'Medium', level: 'Medium'  },
  'media':         { avgTicket: 15,   recurring: true,  ltvLevel: 'Medium', level: 'Medium'  },
};

const LEVEL_RANK = { 'Very High': 4, 'High': 3, 'Medium': 2, 'Low': 1 };

function calculateMonetisationScore(sector, validationPayload) {
  const profile = SECTOR_PROFILES[sector] || { avgTicket: 200, recurring: false, ltvLevel: 'Medium', level: 'Medium' };

  // CPC boost: if advertisers pay > $3/click, there's proven commercial value
  const avgCPC = (validationPayload.search?.keywords || [])
    .reduce((s, k) => s + (k.cpc || 0), 0) /
    Math.max((validationPayload.search?.keywords || []).length, 1);

  const baseRank   = LEVEL_RANK[profile.level] || 2;
  const boostedRank = avgCPC > 3 ? Math.min(4, baseRank + 1) : baseRank;
  const level      = Object.keys(LEVEL_RANK).find(k => LEVEL_RANK[k] === boostedRank) || profile.level;

  return {
    level,
    score:      boostedRank * 2.5, // 0–10 scale
    avgTicket:  profile.avgTicket,
    recurring:  profile.recurring,
    ltvLevel:   profile.ltvLevel,
    cpcSignal:  +avgCPC.toFixed(2),
    cpcBoost:   avgCPC > 3,
  };
}

module.exports = { calculateMonetisationScore };
