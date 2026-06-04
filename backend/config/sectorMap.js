const SECTOR_MAP = {
  'Food & Beverage': {
    label: 'Food & Beverage',
    naics: '72',
    naicsLabel: 'Accommodation and Food Services',
    trendsKeywords: ['restaurant', 'food delivery', 'cafe'],
  },
  'Technology & Software': {
    label: 'Technology & Software',
    naics: '54',
    naicsLabel: 'Professional, Scientific, and Technical Services',
    trendsKeywords: ['software startup', 'tech company', 'SaaS'],
  },
  'Healthcare & Life Sciences': {
    label: 'Healthcare & Life Sciences',
    naics: '62',
    naicsLabel: 'Health Care and Social Assistance',
    trendsKeywords: ['healthcare startup', 'medical clinic', 'telehealth'],
  },
  'Financial Services & Fintech': {
    label: 'Financial Services & Fintech',
    naics: '52',
    naicsLabel: 'Finance and Insurance',
    trendsKeywords: ['fintech', 'financial advisor', 'investment'],
  },
  'Retail & E-Commerce': {
    label: 'Retail & E-Commerce',
    naics: '44',
    naicsLabel: 'Retail Trade',
    trendsKeywords: ['online store', 'ecommerce', 'retail'],
  },
  'Real Estate & Construction': {
    label: 'Real Estate & Construction',
    naics: '23',
    naicsLabel: 'Construction',
    trendsKeywords: ['real estate investing', 'property management', 'construction'],
  },
  'Education & EdTech': {
    label: 'Education & EdTech',
    naics: '61',
    naicsLabel: 'Educational Services',
    trendsKeywords: ['online course', 'tutoring', 'edtech'],
  },
  'Manufacturing & Logistics': {
    label: 'Manufacturing & Logistics',
    naics: '31',
    naicsLabel: 'Manufacturing',
    trendsKeywords: ['manufacturing startup', '3PL', 'logistics'],
  },
  'Media & Entertainment': {
    label: 'Media & Entertainment',
    naics: '71',
    naicsLabel: 'Arts, Entertainment, and Recreation',
    trendsKeywords: ['content creator', 'media company', 'entertainment'],
  },
  'Energy & Sustainability': {
    label: 'Energy & Sustainability',
    naics: '22',
    naicsLabel: 'Utilities',
    trendsKeywords: ['solar energy', 'EV charging', 'clean energy'],
  },
  'Professional Services': {
    label: 'Professional Services',
    naics: '54',
    naicsLabel: 'Professional, Scientific, and Technical Services',
    trendsKeywords: ['consulting', 'professional services', 'fractional CFO'],
  },
  'Transportation & Mobility': {
    label: 'Transportation & Mobility',
    naics: '48',
    naicsLabel: 'Transportation and Warehousing',
    trendsKeywords: ['logistics startup', 'delivery service', 'fleet management'],
  },
  'Agriculture & AgTech': {
    label: 'Agriculture & AgTech',
    naics: '11',
    naicsLabel: 'Agriculture, Forestry, Fishing and Hunting',
    trendsKeywords: ['agtech', 'farm startup', 'vertical farming'],
  },
  'Government & Public Sector': {
    label: 'Government & Public Sector',
    naics: '92',
    naicsLabel: 'Public Administration',
    trendsKeywords: ['govtech', 'government contract', 'public sector'],
  },
  'Wellness & Fitness': {
    label: 'Wellness & Fitness',
    naics: '81',
    naicsLabel: 'Other Services',
    trendsKeywords: ['wellness business', 'fitness studio', 'health coaching'],
  },
  'Hospitality & Tourism': {
    label: 'Hospitality & Tourism',
    naics: '72',
    naicsLabel: 'Accommodation and Food Services',
    trendsKeywords: ['Airbnb management', 'boutique hotel', 'tourism'],
  },
};

const STATE_FIPS = {
  'Alabama': '01', 'Alaska': '02', 'Arizona': '04', 'Arkansas': '05',
  'California': '06', 'Colorado': '08', 'Connecticut': '09', 'Delaware': '10',
  'Florida': '12', 'Georgia': '13', 'Hawaii': '15', 'Idaho': '16',
  'Illinois': '17', 'Indiana': '18', 'Iowa': '19', 'Kansas': '20',
  'Kentucky': '21', 'Louisiana': '22', 'Maine': '23', 'Maryland': '24',
  'Massachusetts': '25', 'Michigan': '26', 'Minnesota': '27', 'Mississippi': '28',
  'Missouri': '29', 'Montana': '30', 'Nebraska': '31', 'Nevada': '32',
  'New Hampshire': '33', 'New Jersey': '34', 'New Mexico': '35', 'New York': '36',
  'North Carolina': '37', 'North Dakota': '38', 'Ohio': '39', 'Oklahoma': '40',
  'Oregon': '41', 'Pennsylvania': '42', 'Rhode Island': '44', 'South Carolina': '45',
  'South Dakota': '46', 'Tennessee': '47', 'Texas': '48', 'Utah': '49',
  'Vermont': '50', 'Virginia': '51', 'Washington': '53', 'West Virginia': '54',
  'Wisconsin': '55', 'Wyoming': '56',
};

// Map state names to Google Trends geo codes
const STATE_TRENDS_GEO = {
  'Alabama': 'US-AL', 'Alaska': 'US-AK', 'Arizona': 'US-AZ', 'Arkansas': 'US-AR',
  'California': 'US-CA', 'Colorado': 'US-CO', 'Connecticut': 'US-CT', 'Delaware': 'US-DE',
  'Florida': 'US-FL', 'Georgia': 'US-GA', 'Hawaii': 'US-HI', 'Idaho': 'US-ID',
  'Illinois': 'US-IL', 'Indiana': 'US-IN', 'Iowa': 'US-IA', 'Kansas': 'US-KS',
  'Kentucky': 'US-KY', 'Louisiana': 'US-LA', 'Maine': 'US-ME', 'Maryland': 'US-MD',
  'Massachusetts': 'US-MA', 'Michigan': 'US-MI', 'Minnesota': 'US-MN', 'Mississippi': 'US-MS',
  'Missouri': 'US-MO', 'Montana': 'US-MT', 'Nebraska': 'US-NE', 'Nevada': 'US-NV',
  'New Hampshire': 'US-NH', 'New Jersey': 'US-NJ', 'New Mexico': 'US-NM', 'New York': 'US-NY',
  'North Carolina': 'US-NC', 'North Dakota': 'US-ND', 'Ohio': 'US-OH', 'Oklahoma': 'US-OK',
  'Oregon': 'US-OR', 'Pennsylvania': 'US-PA', 'Rhode Island': 'US-RI', 'South Carolina': 'US-SC',
  'South Dakota': 'US-SD', 'Tennessee': 'US-TN', 'Texas': 'US-TX', 'Utah': 'US-UT',
  'Vermont': 'US-VT', 'Virginia': 'US-VA', 'Washington': 'US-WA', 'West Virginia': 'US-WV',
  'Wisconsin': 'US-WI', 'Wyoming': 'US-WY',
};

// Map state codes (2-letter) to full names
const STATE_CODE_TO_NAME = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
  'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
  'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
  'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
  'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
  'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
  'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
  'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
  'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
  'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
  'WI': 'Wisconsin', 'WY': 'Wyoming',
};

module.exports = { SECTOR_MAP, STATE_FIPS, STATE_TRENDS_GEO, STATE_CODE_TO_NAME };
