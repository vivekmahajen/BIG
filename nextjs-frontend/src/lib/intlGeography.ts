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
