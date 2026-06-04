// Maps BIG's display sector names to NAICS codes for Census and BLS API calls.
const SECTOR_MAP = {
  'Food & Beverage':             { naics: '72', naicsLabel: 'Accommodation and Food Services',                   trendsKeywords: ['restaurant', 'food delivery', 'cafe'] },
  'Technology & Software':       { naics: '54', naicsLabel: 'Professional, Scientific, and Technical Services',  trendsKeywords: ['software startup', 'SaaS', 'tech company'] },
  'Healthcare & Life Sciences':  { naics: '62', naicsLabel: 'Health Care and Social Assistance',                 trendsKeywords: ['healthcare startup', 'telehealth', 'medical clinic'] },
  'Financial Services & Fintech':{ naics: '52', naicsLabel: 'Finance and Insurance',                            trendsKeywords: ['fintech', 'financial advisor', 'investment app'] },
  'Retail & E-Commerce':         { naics: '44', naicsLabel: 'Retail Trade',                                      trendsKeywords: ['online store', 'ecommerce', 'retail business'] },
  'Real Estate & Construction':  { naics: '23', naicsLabel: 'Construction',                                      trendsKeywords: ['real estate investing', 'property management', 'construction'] },
  'Education & EdTech':          { naics: '61', naicsLabel: 'Educational Services',                              trendsKeywords: ['online course', 'tutoring', 'edtech'] },
  'Manufacturing & Logistics':   { naics: '31', naicsLabel: 'Manufacturing',                                     trendsKeywords: ['manufacturing startup', 'logistics', '3PL'] },
  'Media & Entertainment':       { naics: '71', naicsLabel: 'Arts, Entertainment, and Recreation',               trendsKeywords: ['content creator', 'media company', 'entertainment'] },
  'Energy & Sustainability':     { naics: '22', naicsLabel: 'Utilities',                                         trendsKeywords: ['solar energy', 'EV charging', 'clean energy'] },
  'Professional Services':       { naics: '54', naicsLabel: 'Professional, Scientific, and Technical Services',  trendsKeywords: ['consulting', 'fractional CFO', 'professional services'] },
  'Transportation & Mobility':   { naics: '48', naicsLabel: 'Transportation and Warehousing',                    trendsKeywords: ['delivery service', 'logistics startup', 'fleet management'] },
  'Agriculture & AgTech':        { naics: '11', naicsLabel: 'Agriculture, Forestry, Fishing and Hunting',        trendsKeywords: ['agtech', 'vertical farming', 'farm startup'] },
  'Government & Public Sector':  { naics: '92', naicsLabel: 'Public Administration',                             trendsKeywords: ['govtech', 'government contract', 'public sector'] },
  'Wellness & Fitness':          { naics: '81', naicsLabel: 'Other Services',                                    trendsKeywords: ['wellness business', 'fitness studio', 'health coaching'] },
  'Hospitality & Tourism':       { naics: '72', naicsLabel: 'Accommodation and Food Services',                   trendsKeywords: ['boutique hotel', 'Airbnb management', 'tourism'] },
};

// State name → Census FIPS code (2-digit string)
const STATE_FIPS = {
  'Alabama':'01','Alaska':'02','Arizona':'04','Arkansas':'05','California':'06',
  'Colorado':'08','Connecticut':'09','Delaware':'10','Florida':'12','Georgia':'13',
  'Hawaii':'15','Idaho':'16','Illinois':'17','Indiana':'18','Iowa':'19','Kansas':'20',
  'Kentucky':'21','Louisiana':'22','Maine':'23','Maryland':'24','Massachusetts':'25',
  'Michigan':'26','Minnesota':'27','Mississippi':'28','Missouri':'29','Montana':'30',
  'Nebraska':'31','Nevada':'32','New Hampshire':'33','New Jersey':'34','New Mexico':'35',
  'New York':'36','North Carolina':'37','North Dakota':'38','Ohio':'39','Oklahoma':'40',
  'Oregon':'41','Pennsylvania':'42','Rhode Island':'44','South Carolina':'45',
  'South Dakota':'46','Tennessee':'47','Texas':'48','Utah':'49','Vermont':'50',
  'Virginia':'51','Washington':'53','West Virginia':'54','Wisconsin':'55','Wyoming':'56',
  'District of Columbia':'11',
};

// State name → Google Trends geo code
const STATE_TRENDS_GEO = {
  'Alabama':'US-AL','Alaska':'US-AK','Arizona':'US-AZ','Arkansas':'US-AR','California':'US-CA',
  'Colorado':'US-CO','Connecticut':'US-CT','Delaware':'US-DE','Florida':'US-FL','Georgia':'US-GA',
  'Hawaii':'US-HI','Idaho':'US-ID','Illinois':'US-IL','Indiana':'US-IN','Iowa':'US-IA',
  'Kansas':'US-KS','Kentucky':'US-KY','Louisiana':'US-LA','Maine':'US-ME','Maryland':'US-MD',
  'Massachusetts':'US-MA','Michigan':'US-MI','Minnesota':'US-MN','Mississippi':'US-MS',
  'Missouri':'US-MO','Montana':'US-MT','Nebraska':'US-NE','Nevada':'US-NV',
  'New Hampshire':'US-NH','New Jersey':'US-NJ','New Mexico':'US-NM','New York':'US-NY',
  'North Carolina':'US-NC','North Dakota':'US-ND','Ohio':'US-OH','Oklahoma':'US-OK',
  'Oregon':'US-OR','Pennsylvania':'US-PA','Rhode Island':'US-RI','South Carolina':'US-SC',
  'South Dakota':'US-SD','Tennessee':'US-TN','Texas':'US-TX','Utah':'US-UT',
  'Vermont':'US-VT','Virginia':'US-VA','Washington':'US-WA','West Virginia':'US-WV',
  'Wisconsin':'US-WI','Wyoming':'US-WY','District of Columbia':'US-DC',
};

module.exports = { SECTOR_MAP, STATE_FIPS, STATE_TRENDS_GEO };
