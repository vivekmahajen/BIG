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
