// Approximate metro area populations (MSA) for US cities in BIG's geo dataset.
// Source: US Census Bureau ACS 2022 estimates, rounded to nearest 50k.
// Used as a fallback when Census API key is not available.
'use strict';

const CITY_METRO_POP = {
  // Alabama
  'Birmingham': 1120000, 'Montgomery': 370000, 'Huntsville': 510000, 'Mobile': 430000,
  // Alaska
  'Anchorage': 400000, 'Fairbanks': 100000, 'Juneau': 35000,
  // Arizona
  'Phoenix': 5000000, 'Tucson': 1050000, 'Scottsdale': 5000000, 'Mesa': 5000000,
  'Chandler': 5000000, 'Tempe': 5000000, 'Gilbert': 5000000,
  // Arkansas
  'Little Rock': 750000, 'Fayetteville': 550000, 'Fort Smith': 250000,
  // California
  'Los Angeles': 13200000, 'San Francisco': 4750000, 'San Diego': 3300000,
  'San Jose': 1990000, 'Sacramento': 2400000, 'Fresno': 1000000,
  'Oakland': 4750000, 'Long Beach': 13200000, 'Bakersfield': 900000,
  'Riverside': 4600000, 'Anaheim': 3200000, 'Santa Ana': 3200000,
  'Irvine': 3200000, 'San Bernardino': 4600000, 'Stockton': 780000,
  // Colorado
  'Denver': 2950000, 'Colorado Springs': 760000, 'Aurora': 2950000, 'Fort Collins': 360000,
  // Connecticut
  'Hartford': 1210000, 'Bridgeport': 950000, 'New Haven': 860000, 'Stamford': 950000,
  // Delaware
  'Wilmington': 720000, 'Dover': 180000,
  // Florida
  'Miami': 6200000, 'Orlando': 2700000, 'Tampa': 3200000, 'Jacksonville': 1600000,
  'Fort Lauderdale': 6200000, 'St. Petersburg': 3200000, 'Tallahassee': 390000,
  'Cape Coral': 770000, 'Gainesville': 340000, 'Sarasota': 830000,
  // Georgia
  'Atlanta': 6200000, 'Augusta': 610000, 'Savannah': 400000, 'Columbus': 320000,
  'Macon': 230000,
  // Hawaii
  'Honolulu': 1000000, 'Hilo': 200000,
  // Idaho
  'Boise': 780000, 'Nampa': 780000, 'Idaho Falls': 150000,
  // Illinois
  'Chicago': 9500000, 'Aurora': 9500000, 'Naperville': 9500000, 'Rockford': 330000,
  'Joliet': 9500000, 'Springfield': 210000, 'Peoria': 360000,
  // Indiana
  'Indianapolis': 2100000, 'Fort Wayne': 420000, 'Evansville': 310000, 'South Bend': 320000,
  // Iowa
  'Des Moines': 700000, 'Cedar Rapids': 270000, 'Davenport': 380000,
  // Kansas
  'Wichita': 640000, 'Overland Park': 2200000, 'Kansas City': 2200000, 'Topeka': 230000,
  // Kentucky
  'Louisville': 1380000, 'Lexington': 520000, 'Bowling Green': 180000,
  // Louisiana
  'New Orleans': 1270000, 'Baton Rouge': 870000, 'Shreveport': 440000, 'Lafayette': 500000,
  // Maine
  'Portland': 550000, 'Bangor': 160000, 'Augusta': 120000,
  // Maryland
  'Baltimore': 2880000, 'Annapolis': 600000, 'Rockville': 6400000, 'Frederick': 290000,
  // Massachusetts
  'Boston': 4900000, 'Worcester': 980000, 'Springfield': 690000, 'Cambridge': 4900000,
  'Lowell': 4900000,
  // Michigan
  'Detroit': 4400000, 'Grand Rapids': 1090000, 'Warren': 4400000, 'Sterling Heights': 4400000,
  'Lansing': 540000, 'Ann Arbor': 380000, 'Flint': 400000,
  // Minnesota
  'Minneapolis': 3700000, 'Saint Paul': 3700000, 'Rochester': 230000, 'Duluth': 290000,
  // Mississippi
  'Jackson': 590000, 'Gulfport': 410000, 'Hattiesburg': 160000,
  // Missouri
  'Kansas City': 2200000, 'St. Louis': 2820000, 'Springfield': 490000, 'Columbia': 220000,
  // Montana
  'Billings': 180000, 'Missoula': 120000, 'Great Falls': 85000,
  // Nebraska
  'Omaha': 970000, 'Lincoln': 340000,
  // Nevada
  'Las Vegas': 2300000, 'Henderson': 2300000, 'Reno': 490000,
  // New Hampshire
  'Manchester': 410000, 'Nashua': 410000, 'Concord': 150000,
  // New Jersey
  'Newark': 20000000, 'Jersey City': 20000000, 'Paterson': 20000000, 'Trenton': 370000,
  // New Mexico
  'Albuquerque': 920000, 'Las Cruces': 220000, 'Santa Fe': 210000,
  // New York
  'New York City': 20000000, 'Buffalo': 1200000, 'Rochester': 1100000,
  'Yonkers': 20000000, 'Syracuse': 660000, 'Albany': 900000,
  // North Carolina
  'Charlotte': 2700000, 'Raleigh': 1450000, 'Greensboro': 780000, 'Durham': 1450000,
  'Winston-Salem': 680000, 'Fayetteville': 530000, 'Cary': 1450000,
  // North Dakota
  'Fargo': 250000, 'Bismarck': 140000, 'Grand Forks': 100000,
  // Ohio
  'Columbus': 2100000, 'Cleveland': 2000000, 'Cincinnati': 2270000, 'Toledo': 650000,
  'Akron': 710000, 'Dayton': 800000,
  // Oklahoma
  'Oklahoma City': 1440000, 'Tulsa': 1010000, 'Norman': 1440000,
  // Oregon
  'Portland': 2510000, 'Eugene': 380000, 'Salem': 430000, 'Gresham': 2510000,
  // Pennsylvania
  'Philadelphia': 6200000, 'Pittsburgh': 2370000, 'Allentown': 860000,
  'Erie': 270000, 'Reading': 430000, 'Harrisburg': 570000,
  // Rhode Island
  'Providence': 1680000, 'Warwick': 1680000, 'Cranston': 1680000,
  // South Carolina
  'Columbia': 840000, 'Charleston': 800000, 'Greenville': 920000,
  // South Dakota
  'Sioux Falls': 280000, 'Rapid City': 150000,
  // Tennessee
  'Nashville': 2060000, 'Memphis': 1340000, 'Knoxville': 880000, 'Chattanooga': 580000,
  // Texas
  'Houston': 7300000, 'San Antonio': 2600000, 'Dallas': 7700000, 'Austin': 2300000,
  'Fort Worth': 7700000, 'El Paso': 870000, 'Arlington': 7700000, 'Corpus Christi': 470000,
  'Plano': 7700000, 'Lubbock': 330000, 'Irving': 7700000, 'Laredo': 280000,
  // Utah
  'Salt Lake City': 1250000, 'West Valley City': 1250000, 'Provo': 650000, 'West Jordan': 1250000,
  // Vermont
  'Burlington': 230000, 'Montpelier': 50000,
  // Virginia
  'Virginia Beach': 1840000, 'Norfolk': 1840000, 'Chesapeake': 1840000,
  'Richmond': 1320000, 'Newport News': 1840000, 'Arlington': 6400000, 'Alexandria': 6400000,
  // Washington
  'Seattle': 4000000, 'Spokane': 590000, 'Tacoma': 4000000, 'Bellevue': 4000000,
  'Vancouver': 4000000, 'Renton': 4000000,
  // West Virginia
  'Charleston': 210000, 'Huntington': 350000, 'Morgantown': 140000,
  // Wisconsin
  'Milwaukee': 1580000, 'Madison': 680000, 'Green Bay': 330000, 'Kenosha': 1580000,
  // Wyoming
  'Cheyenne': 100000, 'Casper': 80000,
  // District of Columbia
  'Washington': 6400000,
};

// Return metro population for a city, or a conservative default
function getCityMetroPop(city) {
  return CITY_METRO_POP[city] || 250000; // default: small-medium city
}

// localScore: steeper tiers so small markets drop scores aggressively.
// Major metros (5M+) stay at 1.0; mid-size cities land in 0.4-0.6 range.
function getLocalScore(city) {
  const pop = getCityMetroPop(city);
  if (pop >= 5000000) return 1.0;
  if (pop >= 2000000) return 0.9;
  if (pop >= 1000000) return 0.75;
  if (pop >= 500000)  return 0.6;
  if (pop >= 300000)  return 0.45;
  if (pop >= 150000)  return 0.3;
  if (pop >= 75000)   return 0.2;
  return 0.1;
}

module.exports = { getCityMetroPop, getLocalScore, CITY_METRO_POP };
