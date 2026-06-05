export interface CityData {
  city: string;
  zip: string;
  slug: string;
  population?: number;
}

export interface StateData {
  name: string;
  abbr: string;
  slug: string;
  fips: string;
  cities: CityData[];
}

export const STATES: StateData[] = [
  { name: 'Alabama', slug: 'alabama', abbr: 'AL', fips: '01', cities: [
    { city: 'Birmingham', zip: '35203', slug: 'birmingham', population: 212237 },
    { city: 'Montgomery', zip: '36104', slug: 'montgomery', population: 199518 },
    { city: 'Huntsville', zip: '35801', slug: 'huntsville', population: 190582 },
    { city: 'Mobile', zip: '36602', slug: 'mobile', population: 187041 },
  ]},
  { name: 'Alaska', slug: 'alaska', abbr: 'AK', fips: '02', cities: [
    { city: 'Anchorage', zip: '99501', slug: 'anchorage', population: 291247 },
    { city: 'Fairbanks', zip: '99701', slug: 'fairbanks', population: 31516 },
    { city: 'Juneau', zip: '99801', slug: 'juneau', population: 32255 },
  ]},
  { name: 'Arizona', slug: 'arizona', abbr: 'AZ', fips: '04', cities: [
    { city: 'Phoenix', zip: '85001', slug: 'phoenix', population: 1608139 },
    { city: 'Tucson', zip: '85701', slug: 'tucson', population: 542629 },
    { city: 'Mesa', zip: '85201', slug: 'mesa', population: 504258 },
    { city: 'Scottsdale', zip: '85251', slug: 'scottsdale', population: 258069 },
    { city: 'Chandler', zip: '85225', slug: 'chandler', population: 261165 },
  ]},
  { name: 'Arkansas', slug: 'arkansas', abbr: 'AR', fips: '05', cities: [
    { city: 'Little Rock', zip: '72201', slug: 'little-rock', population: 202591 },
    { city: 'Fayetteville', zip: '72701', slug: 'fayetteville', population: 93949 },
    { city: 'Fort Smith', zip: '72901', slug: 'fort-smith', population: 88037 },
  ]},
  { name: 'California', slug: 'california', abbr: 'CA', fips: '06', cities: [
    { city: 'Los Angeles', zip: '90001', slug: 'los-angeles', population: 3898747 },
    { city: 'San Diego', zip: '92101', slug: 'san-diego', population: 1386932 },
    { city: 'San Jose', zip: '95101', slug: 'san-jose', population: 1013240 },
    { city: 'San Francisco', zip: '94102', slug: 'san-francisco', population: 873965 },
    { city: 'Fresno', zip: '93701', slug: 'fresno', population: 542107 },
    { city: 'Sacramento', zip: '95814', slug: 'sacramento', population: 524943 },
    { city: 'Oakland', zip: '94601', slug: 'oakland', population: 440646 },
  ]},
  { name: 'Colorado', slug: 'colorado', abbr: 'CO', fips: '08', cities: [
    { city: 'Denver', zip: '80202', slug: 'denver', population: 715522 },
    { city: 'Colorado Springs', zip: '80901', slug: 'colorado-springs', population: 478961 },
    { city: 'Aurora', zip: '80010', slug: 'aurora', population: 386261 },
    { city: 'Fort Collins', zip: '80521', slug: 'fort-collins', population: 164630 },
    { city: 'Boulder', zip: '80301', slug: 'boulder', population: 105112 },
  ]},
  { name: 'Connecticut', slug: 'connecticut', abbr: 'CT', fips: '09', cities: [
    { city: 'Bridgeport', zip: '06601', slug: 'bridgeport', population: 148654 },
    { city: 'New Haven', zip: '06501', slug: 'new-haven', population: 130250 },
    { city: 'Hartford', zip: '06101', slug: 'hartford', population: 121054 },
    { city: 'Stamford', zip: '06901', slug: 'stamford', population: 135470 },
  ]},
  { name: 'Delaware', slug: 'delaware', abbr: 'DE', fips: '10', cities: [
    { city: 'Wilmington', zip: '19801', slug: 'wilmington', population: 70898 },
    { city: 'Dover', zip: '19901', slug: 'dover', population: 37366 },
  ]},
  { name: 'Florida', slug: 'florida', abbr: 'FL', fips: '12', cities: [
    { city: 'Jacksonville', zip: '32099', slug: 'jacksonville', population: 949611 },
    { city: 'Miami', zip: '33101', slug: 'miami', population: 467963 },
    { city: 'Tampa', zip: '33601', slug: 'tampa', population: 384959 },
    { city: 'Orlando', zip: '32801', slug: 'orlando', population: 307573 },
    { city: 'St. Petersburg', zip: '33701', slug: 'st-petersburg', population: 258308 },
    { city: 'Hialeah', zip: '33010', slug: 'hialeah', population: 223109 },
    { city: 'Fort Lauderdale', zip: '33301', slug: 'fort-lauderdale', population: 182437 },
  ]},
  { name: 'Georgia', slug: 'georgia', abbr: 'GA', fips: '13', cities: [
    { city: 'Atlanta', zip: '30301', slug: 'atlanta', population: 498715 },
    { city: 'Augusta', zip: '30901', slug: 'augusta', population: 202081 },
    { city: 'Columbus', zip: '31901', slug: 'columbus', population: 195769 },
    { city: 'Macon', zip: '31201', slug: 'macon', population: 157346 },
    { city: 'Savannah', zip: '31401', slug: 'savannah', population: 147780 },
  ]},
  { name: 'Hawaii', slug: 'hawaii', abbr: 'HI', fips: '15', cities: [
    { city: 'Honolulu', zip: '96801', slug: 'honolulu', population: 345510 },
    { city: 'Pearl City', zip: '96782', slug: 'pearl-city', population: 47698 },
    { city: 'Hilo', zip: '96720', slug: 'hilo', population: 43263 },
  ]},
  { name: 'Idaho', slug: 'idaho', abbr: 'ID', fips: '16', cities: [
    { city: 'Boise', zip: '83701', slug: 'boise', population: 235684 },
    { city: 'Meridian', zip: '83642', slug: 'meridian', population: 117635 },
    { city: 'Nampa', zip: '83651', slug: 'nampa', population: 100200 },
  ]},
  { name: 'Illinois', slug: 'illinois', abbr: 'IL', fips: '17', cities: [
    { city: 'Chicago', zip: '60601', slug: 'chicago', population: 2696555 },
    { city: 'Aurora', zip: '60505', slug: 'aurora', population: 180542 },
    { city: 'Naperville', zip: '60540', slug: 'naperville', population: 148449 },
    { city: 'Joliet', zip: '60431', slug: 'joliet', population: 150362 },
    { city: 'Rockford', zip: '61101', slug: 'rockford', population: 147651 },
    { city: 'Springfield', zip: '62701', slug: 'springfield', population: 114394 },
  ]},
  { name: 'Indiana', slug: 'indiana', abbr: 'IN', fips: '18', cities: [
    { city: 'Indianapolis', zip: '46201', slug: 'indianapolis', population: 887232 },
    { city: 'Fort Wayne', zip: '46801', slug: 'fort-wayne', population: 263886 },
    { city: 'Evansville', zip: '47701', slug: 'evansville', population: 117979 },
    { city: 'South Bend', zip: '46601', slug: 'south-bend', population: 103453 },
  ]},
  { name: 'Iowa', slug: 'iowa', abbr: 'IA', fips: '19', cities: [
    { city: 'Des Moines', zip: '50301', slug: 'des-moines', population: 214237 },
    { city: 'Cedar Rapids', zip: '52401', slug: 'cedar-rapids', population: 137710 },
    { city: 'Davenport', zip: '52801', slug: 'davenport', population: 101590 },
  ]},
  { name: 'Kansas', slug: 'kansas', abbr: 'KS', fips: '20', cities: [
    { city: 'Wichita', zip: '67201', slug: 'wichita', population: 397532 },
    { city: 'Overland Park', zip: '66201', slug: 'overland-park', population: 197238 },
    { city: 'Kansas City', zip: '66101', slug: 'kansas-city', population: 156607 },
  ]},
  { name: 'Kentucky', slug: 'kentucky', abbr: 'KY', fips: '21', cities: [
    { city: 'Louisville', zip: '40201', slug: 'louisville', population: 633045 },
    { city: 'Lexington', zip: '40501', slug: 'lexington', population: 322570 },
    { city: 'Bowling Green', zip: '42101', slug: 'bowling-green', population: 72294 },
  ]},
  { name: 'Louisiana', slug: 'louisiana', abbr: 'LA', fips: '22', cities: [
    { city: 'New Orleans', zip: '70112', slug: 'new-orleans', population: 383997 },
    { city: 'Baton Rouge', zip: '70801', slug: 'baton-rouge', population: 227549 },
    { city: 'Shreveport', zip: '71101', slug: 'shreveport', population: 187593 },
    { city: 'Lafayette', zip: '70501', slug: 'lafayette', population: 126848 },
  ]},
  { name: 'Maine', slug: 'maine', abbr: 'ME', fips: '23', cities: [
    { city: 'Portland', zip: '04101', slug: 'portland', population: 68408 },
    { city: 'Lewiston', zip: '04240', slug: 'lewiston', population: 36592 },
  ]},
  { name: 'Maryland', slug: 'maryland', abbr: 'MD', fips: '24', cities: [
    { city: 'Baltimore', zip: '21201', slug: 'baltimore', population: 585708 },
    { city: 'Frederick', zip: '21701', slug: 'frederick', population: 78171 },
    { city: 'Rockville', zip: '20850', slug: 'rockville', population: 67117 },
    { city: 'Gaithersburg', zip: '20877', slug: 'gaithersburg', population: 68341 },
  ]},
  { name: 'Massachusetts', slug: 'massachusetts', abbr: 'MA', fips: '25', cities: [
    { city: 'Boston', zip: '02101', slug: 'boston', population: 692600 },
    { city: 'Worcester', zip: '01601', slug: 'worcester', population: 206518 },
    { city: 'Springfield', zip: '01101', slug: 'springfield', population: 155929 },
    { city: 'Cambridge', zip: '02139', slug: 'cambridge', population: 118403 },
    { city: 'Lowell', zip: '01851', slug: 'lowell', population: 113653 },
  ]},
  { name: 'Michigan', slug: 'michigan', abbr: 'MI', fips: '26', cities: [
    { city: 'Detroit', zip: '48201', slug: 'detroit', population: 639111 },
    { city: 'Grand Rapids', zip: '49501', slug: 'grand-rapids', population: 198917 },
    { city: 'Warren', zip: '48089', slug: 'warren', population: 139387 },
    { city: 'Sterling Heights', zip: '48310', slug: 'sterling-heights', population: 132052 },
    { city: 'Lansing', zip: '48901', slug: 'lansing', population: 112644 },
    { city: 'Ann Arbor', zip: '48103', slug: 'ann-arbor', population: 123851 },
  ]},
  { name: 'Minnesota', slug: 'minnesota', abbr: 'MN', fips: '27', cities: [
    { city: 'Minneapolis', zip: '55401', slug: 'minneapolis', population: 429954 },
    { city: 'Saint Paul', zip: '55101', slug: 'saint-paul', population: 311527 },
    { city: 'Rochester', zip: '55901', slug: 'rochester', population: 121395 },
    { city: 'Duluth', zip: '55801', slug: 'duluth', population: 92734 },
  ]},
  { name: 'Mississippi', slug: 'mississippi', abbr: 'MS', fips: '28', cities: [
    { city: 'Jackson', zip: '39201', slug: 'jackson', population: 153701 },
    { city: 'Gulfport', zip: '39501', slug: 'gulfport', population: 72926 },
    { city: 'Southaven', zip: '38671', slug: 'southaven', population: 54944 },
  ]},
  { name: 'Missouri', slug: 'missouri', abbr: 'MO', fips: '29', cities: [
    { city: 'Kansas City', zip: '64101', slug: 'kansas-city', population: 508090 },
    { city: 'Saint Louis', zip: '63101', slug: 'saint-louis', population: 301578 },
    { city: 'Springfield', zip: '65801', slug: 'springfield', population: 169176 },
    { city: 'Columbia', zip: '65201', slug: 'columbia', population: 126254 },
  ]},
  { name: 'Montana', slug: 'montana', abbr: 'MT', fips: '30', cities: [
    { city: 'Billings', zip: '59101', slug: 'billings', population: 117116 },
    { city: 'Missoula', zip: '59801', slug: 'missoula', population: 74468 },
    { city: 'Great Falls', zip: '59401', slug: 'great-falls', population: 60442 },
  ]},
  { name: 'Nebraska', slug: 'nebraska', abbr: 'NE', fips: '31', cities: [
    { city: 'Omaha', zip: '68101', slug: 'omaha', population: 486051 },
    { city: 'Lincoln', zip: '68501', slug: 'lincoln', population: 295222 },
    { city: 'Bellevue', zip: '68005', slug: 'bellevue', population: 63977 },
  ]},
  { name: 'Nevada', slug: 'nevada', abbr: 'NV', fips: '32', cities: [
    { city: 'Las Vegas', zip: '89101', slug: 'las-vegas', population: 641903 },
    { city: 'Henderson', zip: '89002', slug: 'henderson', population: 320189 },
    { city: 'Reno', zip: '89501', slug: 'reno', population: 264165 },
    { city: 'North Las Vegas', zip: '89030', slug: 'north-las-vegas', population: 262527 },
  ]},
  { name: 'New Hampshire', slug: 'new-hampshire', abbr: 'NH', fips: '33', cities: [
    { city: 'Manchester', zip: '03101', slug: 'manchester', population: 115644 },
    { city: 'Nashua', zip: '03060', slug: 'nashua', population: 91322 },
    { city: 'Concord', zip: '03301', slug: 'concord', population: 44000 },
  ]},
  { name: 'New Jersey', slug: 'new-jersey', abbr: 'NJ', fips: '34', cities: [
    { city: 'Newark', zip: '07101', slug: 'newark', population: 311549 },
    { city: 'Jersey City', zip: '07302', slug: 'jersey-city', population: 292449 },
    { city: 'Paterson', zip: '07501', slug: 'paterson', population: 159732 },
    { city: 'Elizabeth', zip: '07201', slug: 'elizabeth', population: 137298 },
    { city: 'Trenton', zip: '08601', slug: 'trenton', population: 90871 },
  ]},
  { name: 'New Mexico', slug: 'new-mexico', abbr: 'NM', fips: '35', cities: [
    { city: 'Albuquerque', zip: '87101', slug: 'albuquerque', population: 564559 },
    { city: 'Las Cruces', zip: '88001', slug: 'las-cruces', population: 115512 },
    { city: 'Rio Rancho', zip: '87124', slug: 'rio-rancho', population: 104046 },
    { city: 'Santa Fe', zip: '87501', slug: 'santa-fe', population: 84683 },
  ]},
  { name: 'New York', slug: 'new-york', abbr: 'NY', fips: '36', cities: [
    { city: 'New York City', zip: '10001', slug: 'new-york-city', population: 8336817 },
    { city: 'Buffalo', zip: '14201', slug: 'buffalo', population: 255805 },
    { city: 'Rochester', zip: '14601', slug: 'rochester', population: 211328 },
    { city: 'Yonkers', zip: '10701', slug: 'yonkers', population: 211464 },
    { city: 'Syracuse', zip: '13201', slug: 'syracuse', population: 148620 },
    { city: 'Albany', zip: '12201', slug: 'albany', population: 97478 },
  ]},
  { name: 'North Carolina', slug: 'north-carolina', abbr: 'NC', fips: '37', cities: [
    { city: 'Charlotte', zip: '28201', slug: 'charlotte', population: 874579 },
    { city: 'Raleigh', zip: '27601', slug: 'raleigh', population: 467665 },
    { city: 'Greensboro', zip: '27401', slug: 'greensboro', population: 296710 },
    { city: 'Durham', zip: '27701', slug: 'durham', population: 278993 },
    { city: 'Winston-Salem', zip: '27101', slug: 'winston-salem', population: 249545 },
    { city: 'Fayetteville', zip: '28301', slug: 'fayetteville', population: 208501 },
  ]},
  { name: 'North Dakota', slug: 'north-dakota', abbr: 'ND', fips: '38', cities: [
    { city: 'Fargo', zip: '58101', slug: 'fargo', population: 125994 },
    { city: 'Bismarck', zip: '58501', slug: 'bismarck', population: 73622 },
    { city: 'Grand Forks', zip: '58201', slug: 'grand-forks', population: 59166 },
  ]},
  { name: 'Ohio', slug: 'ohio', abbr: 'OH', fips: '39', cities: [
    { city: 'Columbus', zip: '43215', slug: 'columbus', population: 905748 },
    { city: 'Cleveland', zip: '44101', slug: 'cleveland', population: 372624 },
    { city: 'Cincinnati', zip: '45201', slug: 'cincinnati', population: 309317 },
    { city: 'Toledo', zip: '43601', slug: 'toledo', population: 270871 },
    { city: 'Akron', zip: '44301', slug: 'akron', population: 190469 },
    { city: 'Dayton', zip: '45401', slug: 'dayton', population: 137644 },
  ]},
  { name: 'Oklahoma', slug: 'oklahoma', abbr: 'OK', fips: '40', cities: [
    { city: 'Oklahoma City', zip: '73101', slug: 'oklahoma-city', population: 681054 },
    { city: 'Tulsa', zip: '74101', slug: 'tulsa', population: 413066 },
    { city: 'Norman', zip: '73019', slug: 'norman', population: 128026 },
  ]},
  { name: 'Oregon', slug: 'oregon', abbr: 'OR', fips: '41', cities: [
    { city: 'Portland', zip: '97201', slug: 'portland', population: 652503 },
    { city: 'Salem', zip: '97301', slug: 'salem', population: 175535 },
    { city: 'Eugene', zip: '97401', slug: 'eugene', population: 176654 },
    { city: 'Bend', zip: '97701', slug: 'bend', population: 102059 },
  ]},
  { name: 'Pennsylvania', slug: 'pennsylvania', abbr: 'PA', fips: '42', cities: [
    { city: 'Philadelphia', zip: '19101', slug: 'philadelphia', population: 1603797 },
    { city: 'Pittsburgh', zip: '15201', slug: 'pittsburgh', population: 302971 },
    { city: 'Allentown', zip: '18101', slug: 'allentown', population: 125845 },
    { city: 'Erie', zip: '16501', slug: 'erie', population: 94831 },
    { city: 'Reading', zip: '19601', slug: 'reading', population: 88707 },
  ]},
  { name: 'Rhode Island', slug: 'rhode-island', abbr: 'RI', fips: '44', cities: [
    { city: 'Providence', zip: '02901', slug: 'providence', population: 179883 },
    { city: 'Cranston', zip: '02910', slug: 'cranston', population: 82934 },
    { city: 'Warwick', zip: '02886', slug: 'warwick', population: 82672 },
  ]},
  { name: 'South Carolina', slug: 'south-carolina', abbr: 'SC', fips: '45', cities: [
    { city: 'Columbia', zip: '29201', slug: 'columbia', population: 136632 },
    { city: 'Charleston', zip: '29401', slug: 'charleston', population: 150227 },
    { city: 'North Charleston', zip: '29405', slug: 'north-charleston', population: 114852 },
    { city: 'Greenville', zip: '29601', slug: 'greenville', population: 70635 },
  ]},
  { name: 'South Dakota', slug: 'south-dakota', abbr: 'SD', fips: '46', cities: [
    { city: 'Sioux Falls', zip: '57101', slug: 'sioux-falls', population: 192517 },
    { city: 'Rapid City', zip: '57701', slug: 'rapid-city', population: 74703 },
    { city: 'Aberdeen', zip: '57401', slug: 'aberdeen', population: 28495 },
  ]},
  { name: 'Tennessee', slug: 'tennessee', abbr: 'TN', fips: '47', cities: [
    { city: 'Nashville', zip: '37201', slug: 'nashville', population: 689447 },
    { city: 'Memphis', zip: '38101', slug: 'memphis', population: 633104 },
    { city: 'Knoxville', zip: '37901', slug: 'knoxville', population: 190740 },
    { city: 'Chattanooga', zip: '37401', slug: 'chattanooga', population: 181099 },
  ]},
  { name: 'Texas', slug: 'texas', abbr: 'TX', fips: '48', cities: [
    { city: 'Houston', zip: '77001', slug: 'houston', population: 2304580 },
    { city: 'San Antonio', zip: '78201', slug: 'san-antonio', population: 1434625 },
    { city: 'Dallas', zip: '75201', slug: 'dallas', population: 1304379 },
    { city: 'Austin', zip: '78701', slug: 'austin', population: 961855 },
    { city: 'Fort Worth', zip: '76101', slug: 'fort-worth', population: 918915 },
    { city: 'El Paso', zip: '79901', slug: 'el-paso', population: 678815 },
    { city: 'Arlington', zip: '76010', slug: 'arlington', population: 394266 },
    { city: 'Corpus Christi', zip: '78401', slug: 'corpus-christi', population: 317863 },
    { city: 'Plano', zip: '75023', slug: 'plano', population: 287677 },
  ]},
  { name: 'Utah', slug: 'utah', abbr: 'UT', fips: '49', cities: [
    { city: 'Salt Lake City', zip: '84101', slug: 'salt-lake-city', population: 200591 },
    { city: 'West Valley City', zip: '84119', slug: 'west-valley-city', population: 140230 },
    { city: 'Provo', zip: '84601', slug: 'provo', population: 116868 },
    { city: 'West Jordan', zip: '84084', slug: 'west-jordan', population: 116961 },
    { city: 'Ogden', zip: '84401', slug: 'ogden', population: 87321 },
  ]},
  { name: 'Vermont', slug: 'vermont', abbr: 'VT', fips: '50', cities: [
    { city: 'Burlington', zip: '05401', slug: 'burlington', population: 44743 },
    { city: 'South Burlington', zip: '05403', slug: 'south-burlington', population: 19814 },
  ]},
  { name: 'Virginia', slug: 'virginia', abbr: 'VA', fips: '51', cities: [
    { city: 'Virginia Beach', zip: '23451', slug: 'virginia-beach', population: 459470 },
    { city: 'Norfolk', zip: '23501', slug: 'norfolk', population: 238005 },
    { city: 'Chesapeake', zip: '23320', slug: 'chesapeake', population: 244835 },
    { city: 'Richmond', zip: '23219', slug: 'richmond', population: 226610 },
    { city: 'Arlington', zip: '22201', slug: 'arlington', population: 236842 },
    { city: 'Alexandria', zip: '22314', slug: 'alexandria', population: 159428 },
  ]},
  { name: 'Washington', slug: 'washington', abbr: 'WA', fips: '53', cities: [
    { city: 'Seattle', zip: '98101', slug: 'seattle', population: 737255 },
    { city: 'Spokane', zip: '99201', slug: 'spokane', population: 228989 },
    { city: 'Tacoma', zip: '98401', slug: 'tacoma', population: 219346 },
    { city: 'Vancouver', zip: '98660', slug: 'vancouver', population: 190915 },
    { city: 'Bellevue', zip: '98004', slug: 'bellevue', population: 151854 },
    { city: 'Kirkland', zip: '98033', slug: 'kirkland', population: 92175 },
  ]},
  { name: 'West Virginia', slug: 'west-virginia', abbr: 'WV', fips: '54', cities: [
    { city: 'Charleston', zip: '25301', slug: 'charleston', population: 48864 },
    { city: 'Huntington', zip: '25701', slug: 'huntington', population: 45426 },
    { city: 'Morgantown', zip: '26501', slug: 'morgantown', population: 30955 },
  ]},
  { name: 'Wisconsin', slug: 'wisconsin', abbr: 'WI', fips: '55', cities: [
    { city: 'Milwaukee', zip: '53201', slug: 'milwaukee', population: 577222 },
    { city: 'Madison', zip: '53701', slug: 'madison', population: 269840 },
    { city: 'Green Bay', zip: '54301', slug: 'green-bay', population: 107395 },
    { city: 'Kenosha', zip: '53140', slug: 'kenosha', population: 100150 },
  ]},
  { name: 'Wyoming', slug: 'wyoming', abbr: 'WY', fips: '56', cities: [
    { city: 'Cheyenne', zip: '82001', slug: 'cheyenne', population: 63957 },
    { city: 'Casper', zip: '82601', slug: 'casper', population: 58643 },
    { city: 'Laramie', zip: '82070', slug: 'laramie', population: 32158 },
  ]},
];

export function getStateBySlug(slug: string): StateData | undefined {
  return STATES.find(s => s.slug === slug);
}

export function getCityBySlug(stateSlug: string, citySlug: string): CityData | undefined {
  const state = getStateBySlug(stateSlug);
  return state?.cities.find(c => c.slug === citySlug);
}

export function getTopCityCombinations(maxPerState = 1): Array<{ state: string; city: string }> {
  const combinations: Array<{ state: string; city: string }> = [];
  for (const state of STATES) {
    const topCities = [...state.cities]
      .sort((a, b) => (b.population || 0) - (a.population || 0))
      .slice(0, maxPerState);
    for (const city of topCities) {
      combinations.push({ state: state.slug, city: city.slug });
    }
  }
  return combinations;
}
export const ALL_STATE_SLUGS = STATES.map(s => s.slug);
export function getTotalPageCount(): number {
  const totalCities = STATES.reduce((sum, s) => sum + s.cities.length, 0);
  return totalCities * 16;
}
export function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
