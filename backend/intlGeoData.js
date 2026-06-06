// International geo data: Canada, United Kingdom, Australia

const INTL_GEO = {
  CA: {
    name: 'Canada',
    currency: 'CAD',
    symbol: 'CAD $',
    regions: [
      {
        code: 'ON', name: 'Ontario', cities: [
          { name: 'Toronto', areas: ['M5V', 'M4W', 'M6K', 'M1R', 'M9W'] },
          { name: 'Ottawa', areas: ['K1A', 'K2P', 'K1N', 'K1S'] },
          { name: 'Mississauga', areas: ['L5B', 'L4Z', 'L5A', 'L5G'] },
          { name: 'Brampton', areas: ['L6T', 'L6X', 'L6Z', 'L7A'] },
          { name: 'Hamilton', areas: ['L8N', 'L8P', 'L8R', 'L8S'] },
        ],
      },
      {
        code: 'BC', name: 'British Columbia', cities: [
          { name: 'Vancouver', areas: ['V6B', 'V5K', 'V6E', 'V6G', 'V6Z'] },
          { name: 'Surrey', areas: ['V3R', 'V3S', 'V3T', 'V3V'] },
          { name: 'Burnaby', areas: ['V5A', 'V5B', 'V5C', 'V5E'] },
          { name: 'Richmond', areas: ['V6X', 'V6Y', 'V7A', 'V7B'] },
          { name: 'Victoria', areas: ['V8R', 'V8S', 'V8T', 'V8V'] },
        ],
      },
      {
        code: 'QC', name: 'Quebec', cities: [
          { name: 'Montreal', areas: ['H2X', 'H3A', 'H3B', 'H3C', 'H1Y'] },
          { name: 'Quebec City', areas: ['G1K', 'G1N', 'G1R', 'G1S'] },
          { name: 'Laval', areas: ['H7A', 'H7C', 'H7E', 'H7G'] },
          { name: 'Gatineau', areas: ['J8P', 'J8R', 'J8T', 'J8Y'] },
        ],
      },
      {
        code: 'AB', name: 'Alberta', cities: [
          { name: 'Calgary', areas: ['T2P', 'T2R', 'T2S', 'T2T', 'T3A'] },
          { name: 'Edmonton', areas: ['T5J', 'T5K', 'T5L', 'T6E', 'T6G'] },
          { name: 'Red Deer', areas: ['T4N', 'T4P', 'T4R', 'T4S'] },
          { name: 'Lethbridge', areas: ['T1H', 'T1J', 'T1K', 'T1M'] },
        ],
      },
      {
        code: 'MB', name: 'Manitoba', cities: [
          { name: 'Winnipeg', areas: ['R2C', 'R2H', 'R3B', 'R3C', 'R3G'] },
          { name: 'Brandon', areas: ['R7A', 'R7B', 'R7C'] },
          { name: 'Steinbach', areas: ['R5G', 'R0A'] },
        ],
      },
      {
        code: 'SK', name: 'Saskatchewan', cities: [
          { name: 'Saskatoon', areas: ['S7H', 'S7J', 'S7K', 'S7L', 'S7N'] },
          { name: 'Regina', areas: ['S4N', 'S4P', 'S4R', 'S4S'] },
          { name: 'Prince Albert', areas: ['S6V', 'S6W', 'S6X'] },
        ],
      },
      {
        code: 'NS', name: 'Nova Scotia', cities: [
          { name: 'Halifax', areas: ['B3H', 'B3J', 'B3K', 'B3L', 'B3M'] },
          { name: 'Sydney', areas: ['B1P', 'B1R', 'B1S'] },
          { name: 'Truro', areas: ['B2N', 'B6L'] },
        ],
      },
      {
        code: 'NB', name: 'New Brunswick', cities: [
          { name: 'Moncton', areas: ['E1A', 'E1B', 'E1C', 'E1E'] },
          { name: 'Fredericton', areas: ['E3A', 'E3B', 'E3C'] },
          { name: 'Saint John', areas: ['E2J', 'E2K', 'E2L', 'E2M'] },
        ],
      },
      {
        code: 'NL', name: 'Newfoundland and Labrador', cities: [
          { name: "St. John's", areas: ['A1A', 'A1B', 'A1C', 'A1E'] },
          { name: 'Mount Pearl', areas: ['A1N', 'A1S'] },
          { name: 'Corner Brook', areas: ['A2H', 'A2J'] },
        ],
      },
      {
        code: 'PE', name: 'Prince Edward Island', cities: [
          { name: 'Charlottetown', areas: ['C1A', 'C1B', 'C1C', 'C1E'] },
          { name: 'Summerside', areas: ['C1N', 'C0B'] },
          { name: 'Stratford', areas: ['C1B', 'C0A'] },
        ],
      },
      {
        code: 'YT', name: 'Yukon', cities: [
          { name: 'Whitehorse', areas: ['Y1A', 'Y0B'] },
          { name: 'Dawson City', areas: ['Y0B'] },
          { name: 'Watson Lake', areas: ['Y0A'] },
        ],
      },
      {
        code: 'NT', name: 'Northwest Territories', cities: [
          { name: 'Yellowknife', areas: ['X1A', 'X0E'] },
          { name: 'Hay River', areas: ['X0E', 'X0G'] },
          { name: 'Inuvik', areas: ['X0E'] },
        ],
      },
      {
        code: 'NU', name: 'Nunavut', cities: [
          { name: 'Iqaluit', areas: ['X0A'] },
          { name: 'Rankin Inlet', areas: ['X0C'] },
          { name: 'Arviat', areas: ['X0C'] },
        ],
      },
    ],
  },

  GB: {
    name: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    regions: [
      {
        code: 'LDN', name: 'London', cities: [
          { name: 'City of London', areas: ['EC1A', 'EC2V', 'EC3M', 'EC4M'] },
          { name: 'Westminster', areas: ['SW1A', 'SW1P', 'W1A', 'WC2N'] },
          { name: 'Southwark', areas: ['SE1', 'SE16', 'SE5'] },
          { name: 'Camden', areas: ['NW1', 'WC1H', 'NW3'] },
        ],
      },
      {
        code: 'NW', name: 'North West', cities: [
          { name: 'Manchester', areas: ['M1', 'M2', 'M4', 'M13', 'M14'] },
          { name: 'Liverpool', areas: ['L1', 'L2', 'L3', 'L8'] },
          { name: 'Preston', areas: ['PR1', 'PR2', 'PR4'] },
          { name: 'Blackpool', areas: ['FY1', 'FY2', 'FY3'] },
        ],
      },
      {
        code: 'SE', name: 'South East', cities: [
          { name: 'Brighton', areas: ['BN1', 'BN2', 'BN3'] },
          { name: 'Southampton', areas: ['SO14', 'SO15', 'SO16', 'SO17'] },
          { name: 'Oxford', areas: ['OX1', 'OX2', 'OX3', 'OX4'] },
          { name: 'Reading', areas: ['RG1', 'RG2', 'RG6', 'RG7'] },
          { name: 'Canterbury', areas: ['CT1', 'CT2', 'CT3'] },
        ],
      },
      {
        code: 'SW', name: 'South West', cities: [
          { name: 'Bristol', areas: ['BS1', 'BS2', 'BS3', 'BS6', 'BS8'] },
          { name: 'Exeter', areas: ['EX1', 'EX2', 'EX4'] },
          { name: 'Plymouth', areas: ['PL1', 'PL2', 'PL3', 'PL4'] },
          { name: 'Bath', areas: ['BA1', 'BA2'] },
        ],
      },
      {
        code: 'WM', name: 'West Midlands', cities: [
          { name: 'Birmingham', areas: ['B1', 'B2', 'B5', 'B15', 'B16'] },
          { name: 'Coventry', areas: ['CV1', 'CV2', 'CV3', 'CV6'] },
          { name: 'Wolverhampton', areas: ['WV1', 'WV2', 'WV3'] },
        ],
      },
      {
        code: 'EE', name: 'East of England', cities: [
          { name: 'Cambridge', areas: ['CB1', 'CB2', 'CB3', 'CB4'] },
          { name: 'Norwich', areas: ['NR1', 'NR2', 'NR3', 'NR4'] },
          { name: 'Ipswich', areas: ['IP1', 'IP2', 'IP3', 'IP4'] },
          { name: 'Peterborough', areas: ['PE1', 'PE2', 'PE3', 'PE4'] },
        ],
      },
      {
        code: 'EM', name: 'East Midlands', cities: [
          { name: 'Nottingham', areas: ['NG1', 'NG2', 'NG3', 'NG7'] },
          { name: 'Leicester', areas: ['LE1', 'LE2', 'LE3', 'LE5'] },
          { name: 'Derby', areas: ['DE1', 'DE22', 'DE23', 'DE24'] },
          { name: 'Lincoln', areas: ['LN1', 'LN2', 'LN5', 'LN6'] },
        ],
      },
      {
        code: 'NE', name: 'North East', cities: [
          { name: 'Newcastle upon Tyne', areas: ['NE1', 'NE2', 'NE3', 'NE4', 'NE6'] },
          { name: 'Sunderland', areas: ['SR1', 'SR2', 'SR3', 'SR4'] },
          { name: 'Middlesbrough', areas: ['TS1', 'TS2', 'TS3', 'TS5'] },
        ],
      },
      {
        code: 'YH', name: 'Yorkshire and the Humber', cities: [
          { name: 'Leeds', areas: ['LS1', 'LS2', 'LS6', 'LS11', 'LS15'] },
          { name: 'Sheffield', areas: ['S1', 'S2', 'S3', 'S10', 'S11'] },
          { name: 'Bradford', areas: ['BD1', 'BD2', 'BD7', 'BD8'] },
          { name: 'Hull', areas: ['HU1', 'HU2', 'HU3', 'HU5'] },
        ],
      },
      {
        code: 'SCT', name: 'Scotland', cities: [
          { name: 'Edinburgh', areas: ['EH1', 'EH2', 'EH3', 'EH6', 'EH10'] },
          { name: 'Glasgow', areas: ['G1', 'G2', 'G3', 'G11', 'G12'] },
          { name: 'Aberdeen', areas: ['AB10', 'AB11', 'AB12', 'AB24'] },
          { name: 'Dundee', areas: ['DD1', 'DD2', 'DD3', 'DD4'] },
        ],
      },
      {
        code: 'WLS', name: 'Wales', cities: [
          { name: 'Cardiff', areas: ['CF10', 'CF11', 'CF14', 'CF24'] },
          { name: 'Swansea', areas: ['SA1', 'SA2', 'SA3', 'SA5'] },
          { name: 'Newport', areas: ['NP19', 'NP20', 'NP10'] },
        ],
      },
      {
        code: 'NIR', name: 'Northern Ireland', cities: [
          { name: 'Belfast', areas: ['BT1', 'BT2', 'BT5', 'BT7', 'BT9'] },
          { name: 'Derry', areas: ['BT47', 'BT48', 'BT49'] },
          { name: 'Lisburn', areas: ['BT27', 'BT28'] },
        ],
      },
    ],
  },

  AU: {
    name: 'Australia',
    currency: 'AUD',
    symbol: 'AUD $',
    regions: [
      {
        code: 'NSW', name: 'New South Wales', cities: [
          { name: 'Sydney', areas: ['Sydney CBD', 'Surry Hills', 'Newtown', 'Parramatta', 'Chatswood'] },
          { name: 'Newcastle', areas: ['Newcastle CBD', 'Hamilton', 'Broadmeadow', 'Charlestown'] },
          { name: 'Wollongong', areas: ['Wollongong CBD', 'Fairy Meadow', 'Figtree', 'Dapto'] },
          { name: 'Penrith', areas: ['Penrith CBD', 'Kingswood', 'St Marys', 'Glenmore Park'] },
        ],
      },
      {
        code: 'VIC', name: 'Victoria', cities: [
          { name: 'Melbourne', areas: ['Melbourne CBD', 'Fitzroy', 'St Kilda', 'Richmond', 'Docklands'] },
          { name: 'Geelong', areas: ['Geelong CBD', 'Newtown', 'Belmont', 'Corio'] },
          { name: 'Ballarat', areas: ['Ballarat CBD', 'Wendouree', 'Sebastopol', 'Alfredton'] },
          { name: 'Bendigo', areas: ['Bendigo CBD', 'Kangaroo Flat', 'Golden Square', 'Epsom'] },
        ],
      },
      {
        code: 'QLD', name: 'Queensland', cities: [
          { name: 'Brisbane', areas: ['Brisbane CBD', 'Fortitude Valley', 'South Bank', 'West End', 'Chermside'] },
          { name: 'Gold Coast', areas: ['Surfers Paradise', 'Broadbeach', 'Burleigh Heads', 'Robina'] },
          { name: 'Sunshine Coast', areas: ['Maroochydore', 'Noosa Heads', 'Caloundra', 'Buderim'] },
          { name: 'Townsville', areas: ['Townsville CBD', 'Hermit Park', 'Aitkenvale', 'Mundingburra'] },
        ],
      },
      {
        code: 'WA', name: 'Western Australia', cities: [
          { name: 'Perth', areas: ['Perth CBD', 'Subiaco', 'Fremantle', 'Joondalup', 'Midland'] },
          { name: 'Mandurah', areas: ['Mandurah CBD', 'Falcon', 'Halls Head', 'Greenfields'] },
          { name: 'Bunbury', areas: ['Bunbury CBD', 'Carey Park', 'Withers', 'Australind'] },
        ],
      },
      {
        code: 'SA', name: 'South Australia', cities: [
          { name: 'Adelaide', areas: ['Adelaide CBD', 'Glenelg', 'Norwood', 'Elizabeth', 'Modbury'] },
          { name: 'Mount Gambier', areas: ['Mount Gambier CBD', 'Millicent', 'Naracoorte'] },
          { name: 'Whyalla', areas: ['Whyalla CBD', 'Whyalla Stuart', 'Whyalla Playford'] },
        ],
      },
      {
        code: 'TAS', name: 'Tasmania', cities: [
          { name: 'Hobart', areas: ['Hobart CBD', 'Sandy Bay', 'Glenorchy', 'Bellerive'] },
          { name: 'Launceston', areas: ['Launceston CBD', 'Invermay', 'Newnham', 'Kings Meadows'] },
          { name: 'Devonport', areas: ['Devonport CBD', 'Spreyton', 'Miandetta'] },
        ],
      },
      {
        code: 'ACT', name: 'Australian Capital Territory', cities: [
          { name: 'Canberra', areas: ['Canberra CBD', 'Civic', 'Belconnen', 'Tuggeranong', 'Gungahlin'] },
          { name: 'Queanbeyan', areas: ['Queanbeyan CBD', 'Jerrabomberra', 'Karabar'] },
        ],
      },
      {
        code: 'NT', name: 'Northern Territory', cities: [
          { name: 'Darwin', areas: ['Darwin CBD', 'Parap', 'Stuart Park', 'Nightcliff', 'Casuarina'] },
          { name: 'Alice Springs', areas: ['Alice Springs CBD', 'Gillen', 'Larapinta', 'Eastside'] },
          { name: 'Palmerston', areas: ['Palmerston CBD', 'Durack', 'Gunn', 'Rosebery'] },
        ],
      },
    ],
  },
};

module.exports = { INTL_GEO };
