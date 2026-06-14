export interface IntlCity { city: string; slug: string; areaCode?: string; }
export interface IntlRegion { name: string; code: string; slug: string; cities: IntlCity[]; }
export interface IntlCountry { name: string; code: string; currency: string; symbol: string; regions: IntlRegion[]; }

export const INTL_GEO: Record<string, IntlCountry> = {
  CA: {
    name: 'Canada', code: 'CA', currency: 'CAD', symbol: 'CAD $',
    regions: [
      { name: 'Ontario', code: 'ON', slug: 'ontario', cities: [
        { city: 'Toronto', slug: 'toronto', areaCode: 'M5V' },
        { city: 'Ottawa', slug: 'ottawa', areaCode: 'K1A' },
        { city: 'Mississauga', slug: 'mississauga', areaCode: 'L5B' },
      ]},
      { name: 'British Columbia', code: 'BC', slug: 'british-columbia', cities: [
        { city: 'Vancouver', slug: 'vancouver', areaCode: 'V6B' },
        { city: 'Surrey', slug: 'surrey', areaCode: 'V3R' },
        { city: 'Victoria', slug: 'victoria', areaCode: 'V8R' },
      ]},
      { name: 'Quebec', code: 'QC', slug: 'quebec', cities: [
        { city: 'Montreal', slug: 'montreal', areaCode: 'H2X' },
        { city: 'Quebec City', slug: 'quebec-city', areaCode: 'G1K' },
        { city: 'Laval', slug: 'laval', areaCode: 'H7A' },
      ]},
      { name: 'Alberta', code: 'AB', slug: 'alberta', cities: [
        { city: 'Calgary', slug: 'calgary', areaCode: 'T2P' },
        { city: 'Edmonton', slug: 'edmonton', areaCode: 'T5J' },
        { city: 'Red Deer', slug: 'red-deer', areaCode: 'T4N' },
      ]},
      { name: 'Manitoba', code: 'MB', slug: 'manitoba', cities: [
        { city: 'Winnipeg', slug: 'winnipeg', areaCode: 'R3B' },
        { city: 'Brandon', slug: 'brandon', areaCode: 'R7A' },
      ]},
      { name: 'Saskatchewan', code: 'SK', slug: 'saskatchewan', cities: [
        { city: 'Saskatoon', slug: 'saskatoon', areaCode: 'S7K' },
        { city: 'Regina', slug: 'regina', areaCode: 'S4P' },
      ]},
      { name: 'Nova Scotia', code: 'NS', slug: 'nova-scotia', cities: [
        { city: 'Halifax', slug: 'halifax', areaCode: 'B3J' },
        { city: 'Sydney', slug: 'sydney', areaCode: 'B1P' },
      ]},
      { name: 'New Brunswick', code: 'NB', slug: 'new-brunswick', cities: [
        { city: 'Moncton', slug: 'moncton', areaCode: 'E1C' },
        { city: 'Fredericton', slug: 'fredericton', areaCode: 'E3B' },
      ]},
    ],
  },

  GB: {
    name: 'United Kingdom', code: 'GB', currency: 'GBP', symbol: '£',
    regions: [
      { name: 'London', code: 'LDN', slug: 'greater-london', cities: [
        { city: 'City of London', slug: 'city-of-london', areaCode: 'EC1A' },
        { city: 'Westminster', slug: 'westminster', areaCode: 'SW1A' },
        { city: 'Southwark', slug: 'southwark', areaCode: 'SE1' },
      ]},
      { name: 'North West', code: 'NW', slug: 'north-west', cities: [
        { city: 'Manchester', slug: 'manchester', areaCode: 'M1' },
        { city: 'Liverpool', slug: 'liverpool', areaCode: 'L1' },
        { city: 'Preston', slug: 'preston', areaCode: 'PR1' },
      ]},
      { name: 'South East', code: 'SE', slug: 'south-east', cities: [
        { city: 'Brighton', slug: 'brighton', areaCode: 'BN1' },
        { city: 'Southampton', slug: 'southampton', areaCode: 'SO14' },
        { city: 'Oxford', slug: 'oxford', areaCode: 'OX1' },
      ]},
      { name: 'South West', code: 'SW', slug: 'south-west', cities: [
        { city: 'Bristol', slug: 'bristol', areaCode: 'BS1' },
        { city: 'Exeter', slug: 'exeter', areaCode: 'EX1' },
        { city: 'Plymouth', slug: 'plymouth', areaCode: 'PL1' },
      ]},
      { name: 'West Midlands', code: 'WM', slug: 'west-midlands', cities: [
        { city: 'Birmingham', slug: 'birmingham', areaCode: 'B1' },
        { city: 'Coventry', slug: 'coventry', areaCode: 'CV1' },
        { city: 'Wolverhampton', slug: 'wolverhampton', areaCode: 'WV1' },
      ]},
      { name: 'Yorkshire and the Humber', code: 'YH', slug: 'yorkshire-and-the-humber', cities: [
        { city: 'Leeds', slug: 'leeds', areaCode: 'LS1' },
        { city: 'Sheffield', slug: 'sheffield', areaCode: 'S1' },
        { city: 'Bradford', slug: 'bradford', areaCode: 'BD1' },
      ]},
      { name: 'Scotland', code: 'SCT', slug: 'scotland', cities: [
        { city: 'Edinburgh', slug: 'edinburgh', areaCode: 'EH1' },
        { city: 'Glasgow', slug: 'glasgow', areaCode: 'G1' },
        { city: 'Aberdeen', slug: 'aberdeen', areaCode: 'AB10' },
      ]},
      { name: 'Wales', code: 'WLS', slug: 'wales', cities: [
        { city: 'Cardiff', slug: 'cardiff', areaCode: 'CF10' },
        { city: 'Swansea', slug: 'swansea', areaCode: 'SA1' },
      ]},
      { name: 'Northern Ireland', code: 'NIR', slug: 'northern-ireland', cities: [
        { city: 'Belfast', slug: 'belfast', areaCode: 'BT1' },
        { city: 'Derry', slug: 'derry', areaCode: 'BT47' },
      ]},
    ],
  },

  AU: {
    name: 'Australia', code: 'AU', currency: 'AUD', symbol: 'AUD $',
    regions: [
      { name: 'New South Wales', code: 'NSW', slug: 'new-south-wales', cities: [
        { city: 'Sydney', slug: 'sydney' },
        { city: 'Newcastle', slug: 'newcastle' },
        { city: 'Wollongong', slug: 'wollongong' },
      ]},
      { name: 'Victoria', code: 'VIC', slug: 'victoria', cities: [
        { city: 'Melbourne', slug: 'melbourne' },
        { city: 'Geelong', slug: 'geelong' },
        { city: 'Ballarat', slug: 'ballarat' },
      ]},
      { name: 'Queensland', code: 'QLD', slug: 'queensland', cities: [
        { city: 'Brisbane', slug: 'brisbane' },
        { city: 'Gold Coast', slug: 'gold-coast' },
        { city: 'Sunshine Coast', slug: 'sunshine-coast' },
      ]},
      { name: 'Western Australia', code: 'WA', slug: 'western-australia', cities: [
        { city: 'Perth', slug: 'perth' },
        { city: 'Mandurah', slug: 'mandurah' },
        { city: 'Bunbury', slug: 'bunbury' },
      ]},
      { name: 'South Australia', code: 'SA', slug: 'south-australia', cities: [
        { city: 'Adelaide', slug: 'adelaide' },
        { city: 'Mount Gambier', slug: 'mount-gambier' },
      ]},
      { name: 'Tasmania', code: 'TAS', slug: 'tasmania', cities: [
        { city: 'Hobart', slug: 'hobart' },
        { city: 'Launceston', slug: 'launceston' },
      ]},
      { name: 'Australian Capital Territory', code: 'ACT', slug: 'australian-capital-territory', cities: [
        { city: 'Canberra', slug: 'canberra' },
      ]},
      { name: 'Northern Territory', code: 'NT', slug: 'northern-territory', cities: [
        { city: 'Darwin', slug: 'darwin' },
        { city: 'Alice Springs', slug: 'alice-springs' },
      ]},
    ],
  },

  IN: {
    name: 'India', code: 'IN', currency: 'INR', symbol: '₹',
    regions: [
      { name: 'Maharashtra', code: 'MH', slug: 'maharashtra', cities: [
        { city: 'Mumbai', slug: 'mumbai', areaCode: '400001' },
        { city: 'Pune', slug: 'pune', areaCode: '411001' },
        { city: 'Nagpur', slug: 'nagpur', areaCode: '440001' },
        { city: 'Nashik', slug: 'nashik', areaCode: '422001' },
        { city: 'Aurangabad', slug: 'aurangabad', areaCode: '431001' },
      ]},
      { name: 'Delhi', code: 'DL', slug: 'delhi', cities: [
        { city: 'New Delhi', slug: 'new-delhi', areaCode: '110001' },
        { city: 'Gurugram', slug: 'gurugram', areaCode: '122001' },
        { city: 'Noida', slug: 'noida', areaCode: '201301' },
      ]},
      { name: 'Karnataka', code: 'KA', slug: 'karnataka', cities: [
        { city: 'Bengaluru', slug: 'bengaluru', areaCode: '560001' },
        { city: 'Mysuru', slug: 'mysuru', areaCode: '570001' },
        { city: 'Mangaluru', slug: 'mangaluru', areaCode: '575001' },
        { city: 'Hubballi', slug: 'hubballi', areaCode: '580020' },
      ]},
      { name: 'Tamil Nadu', code: 'TN', slug: 'tamil-nadu', cities: [
        { city: 'Chennai', slug: 'chennai', areaCode: '600001' },
        { city: 'Coimbatore', slug: 'coimbatore', areaCode: '641001' },
        { city: 'Madurai', slug: 'madurai', areaCode: '625001' },
        { city: 'Tiruchirappalli', slug: 'tiruchirappalli', areaCode: '620001' },
        { city: 'Salem', slug: 'salem', areaCode: '636001' },
      ]},
      { name: 'Gujarat', code: 'GJ', slug: 'gujarat', cities: [
        { city: 'Ahmedabad', slug: 'ahmedabad', areaCode: '380001' },
        { city: 'Surat', slug: 'surat', areaCode: '395001' },
        { city: 'Vadodara', slug: 'vadodara', areaCode: '390001' },
        { city: 'Rajkot', slug: 'rajkot', areaCode: '360001' },
      ]},
      { name: 'Rajasthan', code: 'RJ', slug: 'rajasthan', cities: [
        { city: 'Jaipur', slug: 'jaipur', areaCode: '302001' },
        { city: 'Jodhpur', slug: 'jodhpur', areaCode: '342001' },
        { city: 'Udaipur', slug: 'udaipur', areaCode: '313001' },
        { city: 'Kota', slug: 'kota', areaCode: '324001' },
      ]},
      { name: 'Uttar Pradesh', code: 'UP', slug: 'uttar-pradesh', cities: [
        { city: 'Lucknow', slug: 'lucknow', areaCode: '226001' },
        { city: 'Kanpur', slug: 'kanpur', areaCode: '208001' },
        { city: 'Agra', slug: 'agra', areaCode: '282001' },
        { city: 'Varanasi', slug: 'varanasi', areaCode: '221001' },
        { city: 'Prayagraj', slug: 'prayagraj', areaCode: '211001' },
      ]},
      { name: 'West Bengal', code: 'WB', slug: 'west-bengal', cities: [
        { city: 'Kolkata', slug: 'kolkata', areaCode: '700001' },
        { city: 'Howrah', slug: 'howrah', areaCode: '711101' },
        { city: 'Durgapur', slug: 'durgapur', areaCode: '713201' },
        { city: 'Siliguri', slug: 'siliguri', areaCode: '734001' },
      ]},
      { name: 'Telangana', code: 'TS', slug: 'telangana', cities: [
        { city: 'Hyderabad', slug: 'hyderabad', areaCode: '500001' },
        { city: 'Warangal', slug: 'warangal', areaCode: '506001' },
        { city: 'Nizamabad', slug: 'nizamabad', areaCode: '503001' },
      ]},
      { name: 'Andhra Pradesh', code: 'AP', slug: 'andhra-pradesh', cities: [
        { city: 'Visakhapatnam', slug: 'visakhapatnam', areaCode: '530001' },
        { city: 'Vijayawada', slug: 'vijayawada', areaCode: '520001' },
        { city: 'Guntur', slug: 'guntur', areaCode: '522001' },
        { city: 'Tirupati', slug: 'tirupati', areaCode: '517501' },
      ]},
      { name: 'Kerala', code: 'KL', slug: 'kerala', cities: [
        { city: 'Kochi', slug: 'kochi', areaCode: '682001' },
        { city: 'Thiruvananthapuram', slug: 'thiruvananthapuram', areaCode: '695001' },
        { city: 'Kozhikode', slug: 'kozhikode', areaCode: '673001' },
        { city: 'Thrissur', slug: 'thrissur', areaCode: '680001' },
      ]},
      { name: 'Madhya Pradesh', code: 'MP', slug: 'madhya-pradesh', cities: [
        { city: 'Bhopal', slug: 'bhopal', areaCode: '462001' },
        { city: 'Indore', slug: 'indore', areaCode: '452001' },
        { city: 'Gwalior', slug: 'gwalior', areaCode: '474001' },
        { city: 'Jabalpur', slug: 'jabalpur', areaCode: '482001' },
      ]},
      { name: 'Punjab', code: 'PB', slug: 'punjab', cities: [
        { city: 'Ludhiana', slug: 'ludhiana', areaCode: '141001' },
        { city: 'Amritsar', slug: 'amritsar', areaCode: '143001' },
        { city: 'Jalandhar', slug: 'jalandhar', areaCode: '144001' },
        { city: 'Chandigarh', slug: 'chandigarh', areaCode: '160001' },
      ]},
      { name: 'Haryana', code: 'HR', slug: 'haryana', cities: [
        { city: 'Gurugram', slug: 'gurugram-hr', areaCode: '122001' },
        { city: 'Faridabad', slug: 'faridabad', areaCode: '121001' },
        { city: 'Panipat', slug: 'panipat', areaCode: '132001' },
        { city: 'Hisar', slug: 'hisar', areaCode: '125001' },
      ]},
      { name: 'Bihar', code: 'BR', slug: 'bihar', cities: [
        { city: 'Patna', slug: 'patna', areaCode: '800001' },
        { city: 'Gaya', slug: 'gaya', areaCode: '823001' },
        { city: 'Muzaffarpur', slug: 'muzaffarpur', areaCode: '842001' },
      ]},
      { name: 'Odisha', code: 'OR', slug: 'odisha', cities: [
        { city: 'Bhubaneswar', slug: 'bhubaneswar', areaCode: '751001' },
        { city: 'Cuttack', slug: 'cuttack', areaCode: '753001' },
        { city: 'Rourkela', slug: 'rourkela', areaCode: '769001' },
      ]},
      { name: 'Jharkhand', code: 'JH', slug: 'jharkhand', cities: [
        { city: 'Ranchi', slug: 'ranchi', areaCode: '834001' },
        { city: 'Jamshedpur', slug: 'jamshedpur', areaCode: '831001' },
        { city: 'Dhanbad', slug: 'dhanbad', areaCode: '826001' },
      ]},
      { name: 'Assam', code: 'AS', slug: 'assam', cities: [
        { city: 'Guwahati', slug: 'guwahati', areaCode: '781001' },
        { city: 'Silchar', slug: 'silchar', areaCode: '788001' },
        { city: 'Dibrugarh', slug: 'dibrugarh', areaCode: '786001' },
      ]},
      { name: 'Chhattisgarh', code: 'CG', slug: 'chhattisgarh', cities: [
        { city: 'Raipur', slug: 'raipur', areaCode: '492001' },
        { city: 'Bhilai', slug: 'bhilai', areaCode: '490001' },
        { city: 'Bilaspur', slug: 'bilaspur', areaCode: '495001' },
      ]},
      { name: 'Uttarakhand', code: 'UK', slug: 'uttarakhand', cities: [
        { city: 'Dehradun', slug: 'dehradun', areaCode: '248001' },
        { city: 'Haridwar', slug: 'haridwar', areaCode: '249401' },
        { city: 'Haldwani', slug: 'haldwani', areaCode: '263139' },
      ]},
      { name: 'Himachal Pradesh', code: 'HP', slug: 'himachal-pradesh', cities: [
        { city: 'Shimla', slug: 'shimla', areaCode: '171001' },
        { city: 'Dharamshala', slug: 'dharamshala', areaCode: '176215' },
        { city: 'Solan', slug: 'solan', areaCode: '173201' },
      ]},
      { name: 'Goa', code: 'GA', slug: 'goa', cities: [
        { city: 'Panaji', slug: 'panaji', areaCode: '403001' },
        { city: 'Margao', slug: 'margao', areaCode: '403601' },
        { city: 'Vasco da Gama', slug: 'vasco-da-gama', areaCode: '403802' },
      ]},
      { name: 'Jammu & Kashmir', code: 'JK', slug: 'jammu-kashmir', cities: [
        { city: 'Srinagar', slug: 'srinagar', areaCode: '190001' },
        { city: 'Jammu', slug: 'jammu', areaCode: '180001' },
      ]},
      { name: 'Puducherry', code: 'PY', slug: 'puducherry', cities: [
        { city: 'Puducherry', slug: 'puducherry-city', areaCode: '605001' },
      ]},
    ],
  },

  DE: {
    name: 'Germany', code: 'DE', currency: 'EUR', symbol: '€',
    regions: [
      { name: 'Bavaria', code: 'BY', slug: 'bavaria', cities: [
        { city: 'Munich', slug: 'munich' },
        { city: 'Nuremberg', slug: 'nuremberg' },
        { city: 'Augsburg', slug: 'augsburg' },
      ]},
      { name: 'Berlin', code: 'BE', slug: 'berlin', cities: [
        { city: 'Berlin', slug: 'berlin' },
        { city: 'Potsdam', slug: 'potsdam' },
      ]},
      { name: 'North Rhine-Westphalia', code: 'NW', slug: 'north-rhine-westphalia', cities: [
        { city: 'Cologne', slug: 'cologne' },
        { city: 'Düsseldorf', slug: 'dusseldorf' },
        { city: 'Dortmund', slug: 'dortmund' },
        { city: 'Essen', slug: 'essen' },
      ]},
      { name: 'Hamburg', code: 'HH', slug: 'hamburg', cities: [
        { city: 'Hamburg', slug: 'hamburg' },
      ]},
      { name: 'Baden-Württemberg', code: 'BW', slug: 'baden-wurttemberg', cities: [
        { city: 'Stuttgart', slug: 'stuttgart' },
        { city: 'Karlsruhe', slug: 'karlsruhe' },
        { city: 'Mannheim', slug: 'mannheim' },
      ]},
      { name: 'Saxony', code: 'SN', slug: 'saxony', cities: [
        { city: 'Dresden', slug: 'dresden' },
        { city: 'Leipzig', slug: 'leipzig' },
      ]},
    ],
  },

  FR: {
    name: 'France', code: 'FR', currency: 'EUR', symbol: '€',
    regions: [
      { name: 'Île-de-France', code: 'IDF', slug: 'ile-de-france', cities: [
        { city: 'Paris', slug: 'paris' },
        { city: 'Versailles', slug: 'versailles' },
        { city: 'Boulogne-Billancourt', slug: 'boulogne-billancourt' },
      ]},
      { name: 'Auvergne-Rhône-Alpes', code: 'ARA', slug: 'auvergne-rhone-alpes', cities: [
        { city: 'Lyon', slug: 'lyon' },
        { city: 'Grenoble', slug: 'grenoble' },
        { city: 'Clermont-Ferrand', slug: 'clermont-ferrand' },
      ]},
      { name: 'Provence-Alpes-Côte d\'Azur', code: 'PAC', slug: 'provence-alpes-cote-dazur', cities: [
        { city: 'Marseille', slug: 'marseille' },
        { city: 'Nice', slug: 'nice' },
        { city: 'Toulon', slug: 'toulon' },
      ]},
      { name: 'Nouvelle-Aquitaine', code: 'NAQ', slug: 'nouvelle-aquitaine', cities: [
        { city: 'Bordeaux', slug: 'bordeaux' },
        { city: 'Limoges', slug: 'limoges' },
      ]},
      { name: 'Occitanie', code: 'OCC', slug: 'occitanie', cities: [
        { city: 'Toulouse', slug: 'toulouse' },
        { city: 'Montpellier', slug: 'montpellier' },
      ]},
    ],
  },

  AE: {
    name: 'United Arab Emirates', code: 'AE', currency: 'AED', symbol: 'AED',
    regions: [
      { name: 'Dubai', code: 'DU', slug: 'dubai', cities: [
        { city: 'Dubai', slug: 'dubai' },
        { city: 'Deira', slug: 'deira' },
        { city: 'Business Bay', slug: 'business-bay' },
        { city: 'Jumeirah', slug: 'jumeirah' },
      ]},
      { name: 'Abu Dhabi', code: 'AZ', slug: 'abu-dhabi', cities: [
        { city: 'Abu Dhabi', slug: 'abu-dhabi' },
        { city: 'Al Ain', slug: 'al-ain' },
      ]},
      { name: 'Sharjah', code: 'SH', slug: 'sharjah', cities: [
        { city: 'Sharjah', slug: 'sharjah' },
        { city: 'Khor Fakkan', slug: 'khor-fakkan' },
      ]},
      { name: 'Ajman', code: 'AJ', slug: 'ajman', cities: [
        { city: 'Ajman', slug: 'ajman' },
      ]},
    ],
  },

  SG: {
    name: 'Singapore', code: 'SG', currency: 'SGD', symbol: 'SGD $',
    regions: [
      { name: 'Central Region', code: 'CR', slug: 'central-region', cities: [
        { city: 'Orchard', slug: 'orchard' },
        { city: 'Marina Bay', slug: 'marina-bay' },
        { city: 'Tanjong Pagar', slug: 'tanjong-pagar' },
        { city: 'Bugis', slug: 'bugis' },
      ]},
      { name: 'East Region', code: 'ER', slug: 'east-region', cities: [
        { city: 'Tampines', slug: 'tampines' },
        { city: 'Bedok', slug: 'bedok' },
        { city: 'Changi', slug: 'changi' },
      ]},
      { name: 'West Region', code: 'WR', slug: 'west-region', cities: [
        { city: 'Jurong East', slug: 'jurong-east' },
        { city: 'Clementi', slug: 'clementi' },
        { city: 'Buona Vista', slug: 'buona-vista' },
      ]},
      { name: 'North Region', code: 'NR', slug: 'north-region', cities: [
        { city: 'Woodlands', slug: 'woodlands' },
        { city: 'Yishun', slug: 'yishun' },
      ]},
    ],
  },

  BR: {
    name: 'Brazil', code: 'BR', currency: 'BRL', symbol: 'R$',
    regions: [
      { name: 'São Paulo', code: 'SP', slug: 'sao-paulo', cities: [
        { city: 'São Paulo', slug: 'sao-paulo' },
        { city: 'Campinas', slug: 'campinas' },
        { city: 'Santos', slug: 'santos' },
        { city: 'Guarulhos', slug: 'guarulhos' },
      ]},
      { name: 'Rio de Janeiro', code: 'RJ', slug: 'rio-de-janeiro', cities: [
        { city: 'Rio de Janeiro', slug: 'rio-de-janeiro' },
        { city: 'Niterói', slug: 'niteroi' },
      ]},
      { name: 'Minas Gerais', code: 'MG', slug: 'minas-gerais', cities: [
        { city: 'Belo Horizonte', slug: 'belo-horizonte' },
        { city: 'Uberlândia', slug: 'uberlandia' },
      ]},
      { name: 'Bahia', code: 'BA', slug: 'bahia', cities: [
        { city: 'Salvador', slug: 'salvador' },
        { city: 'Feira de Santana', slug: 'feira-de-santana' },
      ]},
      { name: 'Rio Grande do Sul', code: 'RS', slug: 'rio-grande-do-sul', cities: [
        { city: 'Porto Alegre', slug: 'porto-alegre' },
        { city: 'Caxias do Sul', slug: 'caxias-do-sul' },
      ]},
      { name: 'Paraná', code: 'PR', slug: 'parana', cities: [
        { city: 'Curitiba', slug: 'curitiba' },
        { city: 'Londrina', slug: 'londrina' },
      ]},
    ],
  },

  JP: {
    name: 'Japan', code: 'JP', currency: 'JPY', symbol: '¥',
    regions: [
      { name: 'Tokyo', code: 'TK', slug: 'tokyo', cities: [
        { city: 'Shinjuku', slug: 'shinjuku' },
        { city: 'Shibuya', slug: 'shibuya' },
        { city: 'Akihabara', slug: 'akihabara' },
        { city: 'Ginza', slug: 'ginza' },
      ]},
      { name: 'Osaka', code: 'OS', slug: 'osaka', cities: [
        { city: 'Osaka', slug: 'osaka' },
        { city: 'Namba', slug: 'namba' },
        { city: 'Umeda', slug: 'umeda' },
      ]},
      { name: 'Aichi', code: 'AI', slug: 'aichi', cities: [
        { city: 'Nagoya', slug: 'nagoya' },
        { city: 'Toyota', slug: 'toyota' },
      ]},
      { name: 'Kanagawa', code: 'KN', slug: 'kanagawa', cities: [
        { city: 'Yokohama', slug: 'yokohama' },
        { city: 'Kawasaki', slug: 'kawasaki' },
      ]},
      { name: 'Fukuoka', code: 'FK', slug: 'fukuoka', cities: [
        { city: 'Fukuoka', slug: 'fukuoka' },
        { city: 'Kitakyushu', slug: 'kitakyushu' },
      ]},
    ],
  },

  MX: {
    name: 'Mexico', code: 'MX', currency: 'MXN', symbol: 'MX$',
    regions: [
      { name: 'Mexico City', code: 'CDMX', slug: 'mexico-city', cities: [
        { city: 'Mexico City', slug: 'mexico-city' },
        { city: 'Coyoacán', slug: 'coyoacan' },
        { city: 'Polanco', slug: 'polanco' },
      ]},
      { name: 'Jalisco', code: 'JAL', slug: 'jalisco', cities: [
        { city: 'Guadalajara', slug: 'guadalajara' },
        { city: 'Zapopan', slug: 'zapopan' },
      ]},
      { name: 'Nuevo León', code: 'NL', slug: 'nuevo-leon', cities: [
        { city: 'Monterrey', slug: 'monterrey' },
        { city: 'San Pedro Garza García', slug: 'san-pedro-garza-garcia' },
      ]},
      { name: 'Yucatán', code: 'YUC', slug: 'yucatan', cities: [
        { city: 'Mérida', slug: 'merida' },
        { city: 'Cancún', slug: 'cancun' },
      ]},
      { name: 'Baja California', code: 'BC', slug: 'baja-california', cities: [
        { city: 'Tijuana', slug: 'tijuana' },
        { city: 'Ensenada', slug: 'ensenada' },
      ]},
    ],
  },

  ZA: {
    name: 'South Africa', code: 'ZA', currency: 'ZAR', symbol: 'R',
    regions: [
      { name: 'Gauteng', code: 'GP', slug: 'gauteng', cities: [
        { city: 'Johannesburg', slug: 'johannesburg' },
        { city: 'Pretoria', slug: 'pretoria' },
        { city: 'Sandton', slug: 'sandton' },
      ]},
      { name: 'Western Cape', code: 'WC', slug: 'western-cape', cities: [
        { city: 'Cape Town', slug: 'cape-town' },
        { city: 'Stellenbosch', slug: 'stellenbosch' },
        { city: 'George', slug: 'george' },
      ]},
      { name: 'KwaZulu-Natal', code: 'KZN', slug: 'kwazulu-natal', cities: [
        { city: 'Durban', slug: 'durban' },
        { city: 'Pietermaritzburg', slug: 'pietermaritzburg' },
      ]},
      { name: 'Eastern Cape', code: 'EC', slug: 'eastern-cape', cities: [
        { city: 'Port Elizabeth', slug: 'port-elizabeth' },
        { city: 'East London', slug: 'east-london' },
      ]},
    ],
  },

  NL: {
    name: 'Netherlands', code: 'NL', currency: 'EUR', symbol: '€',
    regions: [
      { name: 'North Holland', code: 'NH', slug: 'north-holland', cities: [
        { city: 'Amsterdam', slug: 'amsterdam' },
        { city: 'Haarlem', slug: 'haarlem' },
        { city: 'Zaandam', slug: 'zaandam' },
      ]},
      { name: 'South Holland', code: 'ZH', slug: 'south-holland', cities: [
        { city: 'Rotterdam', slug: 'rotterdam' },
        { city: 'The Hague', slug: 'the-hague' },
        { city: 'Leiden', slug: 'leiden' },
        { city: 'Delft', slug: 'delft' },
      ]},
      { name: 'Utrecht', code: 'UT', slug: 'utrecht', cities: [
        { city: 'Utrecht', slug: 'utrecht' },
        { city: 'Amersfoort', slug: 'amersfoort' },
      ]},
      { name: 'North Brabant', code: 'NB', slug: 'north-brabant', cities: [
        { city: 'Eindhoven', slug: 'eindhoven' },
        { city: 'Tilburg', slug: 'tilburg' },
        { city: 'Breda', slug: 'breda' },
      ]},
    ],
  },

  NG: {
    name: 'Nigeria', code: 'NG', currency: 'NGN', symbol: '₦',
    regions: [
      { name: 'Lagos', code: 'LA', slug: 'lagos', cities: [
        { city: 'Lagos', slug: 'lagos' },
        { city: 'Ikeja', slug: 'ikeja' },
        { city: 'Victoria Island', slug: 'victoria-island' },
        { city: 'Lekki', slug: 'lekki' },
      ]},
      { name: 'Abuja FCT', code: 'FC', slug: 'abuja-fct', cities: [
        { city: 'Abuja', slug: 'abuja' },
        { city: 'Gwagwalada', slug: 'gwagwalada' },
      ]},
      { name: 'Kano', code: 'KN', slug: 'kano', cities: [
        { city: 'Kano', slug: 'kano' },
        { city: 'Kaduna', slug: 'kaduna' },
      ]},
      { name: 'Rivers', code: 'RI', slug: 'rivers', cities: [
        { city: 'Port Harcourt', slug: 'port-harcourt' },
        { city: 'Bonny', slug: 'bonny' },
      ]},
      { name: 'Oyo', code: 'OY', slug: 'oyo', cities: [
        { city: 'Ibadan', slug: 'ibadan' },
        { city: 'Ogbomosho', slug: 'ogbomosho' },
      ]},
    ],
  },

  KE: {
    name: 'Kenya', code: 'KE', currency: 'KES', symbol: 'KSh',
    regions: [
      { name: 'Nairobi', code: 'NBI', slug: 'nairobi', cities: [
        { city: 'Nairobi', slug: 'nairobi' },
        { city: 'Westlands', slug: 'westlands' },
        { city: 'Karen', slug: 'karen' },
        { city: 'Kilimani', slug: 'kilimani' },
      ]},
      { name: 'Coast', code: 'CST', slug: 'coast', cities: [
        { city: 'Mombasa', slug: 'mombasa' },
        { city: 'Malindi', slug: 'malindi' },
      ]},
      { name: 'Rift Valley', code: 'RV', slug: 'rift-valley', cities: [
        { city: 'Nakuru', slug: 'nakuru' },
        { city: 'Eldoret', slug: 'eldoret' },
      ]},
      { name: 'Central', code: 'CEN', slug: 'central', cities: [
        { city: 'Thika', slug: 'thika' },
        { city: 'Nyeri', slug: 'nyeri' },
      ]},
    ],
  },

  ES: {
    name: 'Spain', code: 'ES', currency: 'EUR', symbol: '€',
    regions: [
      { name: 'Community of Madrid', code: 'MD', slug: 'madrid', cities: [
        { city: 'Madrid', slug: 'madrid' },
        { city: 'Alcalá de Henares', slug: 'alcala-de-henares' },
      ]},
      { name: 'Catalonia', code: 'CT', slug: 'catalonia', cities: [
        { city: 'Barcelona', slug: 'barcelona' },
        { city: 'Girona', slug: 'girona' },
        { city: 'Tarragona', slug: 'tarragona' },
      ]},
      { name: 'Andalusia', code: 'AN', slug: 'andalusia', cities: [
        { city: 'Seville', slug: 'seville' },
        { city: 'Málaga', slug: 'malaga' },
        { city: 'Granada', slug: 'granada' },
      ]},
      { name: 'Valencia', code: 'VC', slug: 'valencia', cities: [
        { city: 'Valencia', slug: 'valencia' },
        { city: 'Alicante', slug: 'alicante' },
      ]},
      { name: 'Basque Country', code: 'PV', slug: 'basque-country', cities: [
        { city: 'Bilbao', slug: 'bilbao' },
        { city: 'San Sebastián', slug: 'san-sebastian' },
      ]},
    ],
  },

  IT: {
    name: 'Italy', code: 'IT', currency: 'EUR', symbol: '€',
    regions: [
      { name: 'Lombardy', code: 'LOM', slug: 'lombardy', cities: [
        { city: 'Milan', slug: 'milan' },
        { city: 'Bergamo', slug: 'bergamo' },
        { city: 'Brescia', slug: 'brescia' },
      ]},
      { name: 'Lazio', code: 'LAZ', slug: 'lazio', cities: [
        { city: 'Rome', slug: 'rome' },
        { city: 'Viterbo', slug: 'viterbo' },
      ]},
      { name: 'Campania', code: 'CAM', slug: 'campania', cities: [
        { city: 'Naples', slug: 'naples' },
        { city: 'Salerno', slug: 'salerno' },
      ]},
      { name: 'Veneto', code: 'VEN', slug: 'veneto', cities: [
        { city: 'Venice', slug: 'venice' },
        { city: 'Verona', slug: 'verona' },
        { city: 'Padua', slug: 'padua' },
      ]},
      { name: 'Tuscany', code: 'TUS', slug: 'tuscany', cities: [
        { city: 'Florence', slug: 'florence' },
        { city: 'Siena', slug: 'siena' },
        { city: 'Pisa', slug: 'pisa' },
      ]},
    ],
  },

  PH: {
    name: 'Philippines', code: 'PH', currency: 'PHP', symbol: '₱',
    regions: [
      { name: 'Metro Manila', code: 'NCR', slug: 'metro-manila', cities: [
        { city: 'Makati', slug: 'makati' },
        { city: 'BGC (Taguig)', slug: 'bgc-taguig' },
        { city: 'Quezon City', slug: 'quezon-city' },
        { city: 'Pasig', slug: 'pasig' },
      ]},
      { name: 'Central Visayas', code: 'VII', slug: 'central-visayas', cities: [
        { city: 'Cebu City', slug: 'cebu-city' },
        { city: 'Mandaue', slug: 'mandaue' },
      ]},
      { name: 'Davao Region', code: 'XI', slug: 'davao-region', cities: [
        { city: 'Davao City', slug: 'davao-city' },
        { city: 'Tagum', slug: 'tagum' },
      ]},
      { name: 'Central Luzon', code: 'III', slug: 'central-luzon', cities: [
        { city: 'Angeles City', slug: 'angeles-city' },
        { city: 'San Fernando', slug: 'san-fernando' },
      ]},
    ],
  },

  PK: {
    name: 'Pakistan', code: 'PK', currency: 'PKR', symbol: '₨',
    regions: [
      { name: 'Punjab', code: 'PB', slug: 'punjab', cities: [
        { city: 'Lahore', slug: 'lahore' },
        { city: 'Faisalabad', slug: 'faisalabad' },
        { city: 'Rawalpindi', slug: 'rawalpindi' },
        { city: 'Multan', slug: 'multan' },
      ]},
      { name: 'Sindh', code: 'SD', slug: 'sindh', cities: [
        { city: 'Karachi', slug: 'karachi' },
        { city: 'Hyderabad', slug: 'hyderabad-pk' },
        { city: 'Sukkur', slug: 'sukkur' },
      ]},
      { name: 'Islamabad Capital Territory', code: 'IS', slug: 'islamabad', cities: [
        { city: 'Islamabad', slug: 'islamabad' },
      ]},
      { name: 'Khyber Pakhtunkhwa', code: 'KP', slug: 'khyber-pakhtunkhwa', cities: [
        { city: 'Peshawar', slug: 'peshawar' },
        { city: 'Abbottabad', slug: 'abbottabad' },
      ]},
    ],
  },
};

export function getCountry(countryCode: string): IntlCountry | undefined {
  return INTL_GEO[countryCode.toUpperCase()];
}

export function getRegionBySlug(countryCode: string, regionSlug: string): IntlRegion | undefined {
  return getCountry(countryCode)?.regions.find(r => r.slug === regionSlug);
}

export function getCityBySlug(countryCode: string, regionSlug: string, citySlug: string): IntlCity | undefined {
  return getRegionBySlug(countryCode, regionSlug)?.cities.find(c => c.slug === citySlug);
}
