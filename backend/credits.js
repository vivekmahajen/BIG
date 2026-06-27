// Credit costs per action
const CREDIT_COSTS = {
  'sector-opportunities': 0,    // browsing is free
  'generate-idea': 3,           // complex AI generation
  'generate-blue-ocean': 8,     // blue ocean (no competitors) — 3 base + 5 premium
  'competitor-compare': 2,      // AI analysis
  'competitive-analysis': 5,    // deep AI roadmap
  'business-plan': 3,           // investor-ready business plan generation
  'refine-idea': 1,             // refine existing idea with instruction
  'compare-ideas': 2,           // side-by-side idea comparison
  'validate-idea': 5,           // honest data-grounded idea assessment
};

// Subscription tiers
const TIERS = {
  free: {
    name: 'Free',
    monthlyCredits: 10,
    price: 0,
    rolloverMax: 0,
  },
  analyst: {
    name: 'Analyst',
    monthlyCredits: 50,
    price: 29,
    annualPrice: 24,
    rolloverMax: 25,
  },
  growth: {
    name: 'Growth',
    monthlyCredits: 200,
    price: 69,
    annualPrice: 57,
    rolloverMax: 75,
  },
  business: {
    name: 'Business',
    monthlyCredits: 750,
    price: 149,
    annualPrice: 119,
    rolloverMax: 250,
  },
};

// One-time credit packs (never expire)
const CREDIT_PACKS = [
  { id: 'pack_10',   credits: 10,   price: 7.99,   label: 'Quick Look' },
  { id: 'pack_25',   credits: 25,   price: 16.99,  label: 'Project Pack' },
  { id: 'pack_50',   credits: 50,   price: 29.99,  label: 'Month Pack' },
  { id: 'pack_150',  credits: 150,  price: 74.99,  label: 'Quarterly Pack' },
  { id: 'pack_500',  credits: 500,  price: 199.99, label: 'Annual Pack' },
  { id: 'pack_1000', credits: 1000, price: 349.99, label: 'Agency Pack' },
];

module.exports = { CREDIT_COSTS, TIERS, CREDIT_PACKS };
