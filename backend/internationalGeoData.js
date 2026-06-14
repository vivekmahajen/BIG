// International geo data: countries → regions → cities → postal areas
// Used when user selects a non-US country.
// Postal codes are representative samples (not exhaustive).

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IN', name: 'India' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SG', name: 'Singapore' },
  { code: 'BR', name: 'Brazil' },
  { code: 'JP', name: 'Japan' },
  { code: 'MX', name: 'Mexico' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'CN', name: 'China' },
  { code: 'ID', name: 'Indonesia' },
];

const INTERNATIONAL_REGIONS = {
  GB: [
    { code: 'GB-ENG-LDN', name: 'London', cities: [
      { name: 'City of London', postalAreas: ['EC1A','EC2A','EC3A','EC4A'] },
      { name: 'Canary Wharf', postalAreas: ['E14 5AB','E14 9GE'] },
      { name: 'Shoreditch', postalAreas: ['E1 6RF','E2 7JH'] },
      { name: 'Brixton', postalAreas: ['SW2 1JQ','SW9 8PS'] },
      { name: 'Camden', postalAreas: ['NW1 7AH','NW1 2DB'] },
      { name: 'Hackney', postalAreas: ['E8 1DU','E9 5HE'] },
      { name: 'Southwark', postalAreas: ['SE1 7PB','SE1 0NZ'] },
    ]},
    { code: 'GB-ENG-NW', name: 'North West England', cities: [
      { name: 'Manchester', postalAreas: ['M1 1AE','M2 3HZ','M4 1HN','M14 5RG'] },
      { name: 'Liverpool', postalAreas: ['L1 1HF','L2 2QP','L3 8EQ','L7 2YD'] },
      { name: 'Salford', postalAreas: ['M5 4WT','M6 8AG'] },
      { name: 'Preston', postalAreas: ['PR1 1HT','PR2 8RZ'] },
    ]},
    { code: 'GB-ENG-YH', name: 'Yorkshire & Humber', cities: [
      { name: 'Leeds', postalAreas: ['LS1 1BA','LS2 7JF','LS6 2AE','LS17 6QN'] },
      { name: 'Sheffield', postalAreas: ['S1 2GU','S3 7QL','S10 2TN'] },
      { name: 'Bradford', postalAreas: ['BD1 1HX','BD3 9DB'] },
      { name: 'York', postalAreas: ['YO1 7HH','YO24 1AB'] },
    ]},
    { code: 'GB-ENG-WM', name: 'West Midlands', cities: [
      { name: 'Birmingham', postalAreas: ['B1 1BB','B2 4QA','B5 7QU','B15 2TT'] },
      { name: 'Coventry', postalAreas: ['CV1 1GE','CV3 6GH'] },
      { name: 'Wolverhampton', postalAreas: ['WV1 1DT','WV2 4BA'] },
    ]},
    { code: 'GB-SCT', name: 'Scotland', cities: [
      { name: 'Edinburgh', postalAreas: ['EH1 1YZ','EH2 4AB','EH6 6QR','EH10 4TG'] },
      { name: 'Glasgow', postalAreas: ['G1 1DT','G2 5PB','G3 8SE','G41 2PH'] },
      { name: 'Aberdeen', postalAreas: ['AB10 1AB','AB11 5QH','AB21 9FB'] },
      { name: 'Dundee', postalAreas: ['DD1 1QF','DD2 1BL'] },
    ]},
    { code: 'GB-WLS', name: 'Wales', cities: [
      { name: 'Cardiff', postalAreas: ['CF10 1EP','CF24 0EE','CF5 2YB'] },
      { name: 'Swansea', postalAreas: ['SA1 1NW','SA2 0GJ'] },
      { name: 'Newport', postalAreas: ['NP20 1GH','NP44 2EX'] },
    ]},
    { code: 'GB-NIR', name: 'Northern Ireland', cities: [
      { name: 'Belfast', postalAreas: ['BT1 1JB','BT7 3GG','BT9 6FG'] },
      { name: 'Derry', postalAreas: ['BT47 6AA','BT48 6QH'] },
    ]},
  ],

  CA: [
    { code: 'CA-ON', name: 'Ontario', cities: [
      { name: 'Toronto', postalAreas: ['M5V 3A8','M4W 1A7','M6K 1T8','M1K 5G4'] },
      { name: 'Ottawa', postalAreas: ['K1A 0A9','K1P 5G3','K2P 1L4'] },
      { name: 'Mississauga', postalAreas: ['L5B 1M2','L4T 2K5','L5M 1Y3'] },
      { name: 'Hamilton', postalAreas: ['L8R 3J3','L8H 3Z5'] },
      { name: 'Brampton', postalAreas: ['L6T 4B8','L6V 1A1'] },
      { name: 'Waterloo', postalAreas: ['N2L 3G1','N2J 1Y8'] },
    ]},
    { code: 'CA-BC', name: 'British Columbia', cities: [
      { name: 'Vancouver', postalAreas: ['V6B 2W9','V5K 1A1','V6J 1G3','V3N 4R9'] },
      { name: 'Victoria', postalAreas: ['V8W 1T2','V8R 1G4'] },
      { name: 'Surrey', postalAreas: ['V3T 4X4','V4A 2J2'] },
      { name: 'Kelowna', postalAreas: ['V1Y 6C8','V1V 1A1'] },
    ]},
    { code: 'CA-QC', name: 'Quebec', cities: [
      { name: 'Montreal', postalAreas: ['H2X 1Y6','H3A 2A4','H1A 1A1','H4B 1T3'] },
      { name: 'Quebec City', postalAreas: ['G1R 4P5','G1K 7L2'] },
      { name: 'Laval', postalAreas: ['H7G 4B8','H7N 5N5'] },
    ]},
    { code: 'CA-AB', name: 'Alberta', cities: [
      { name: 'Calgary', postalAreas: ['T2P 1K9','T3A 1Z1','T2E 7B2'] },
      { name: 'Edmonton', postalAreas: ['T5J 2Z1','T6E 2S4','T5A 0A1'] },
      { name: 'Red Deer', postalAreas: ['T4N 2Z6','T4P 3B1'] },
    ]},
    { code: 'CA-MB', name: 'Manitoba', cities: [
      { name: 'Winnipeg', postalAreas: ['R3C 4T6','R2H 0E4','R3T 2N2'] },
      { name: 'Brandon', postalAreas: ['R7A 6A9','R7B 3H4'] },
    ]},
    { code: 'CA-NS', name: 'Nova Scotia', cities: [
      { name: 'Halifax', postalAreas: ['B3H 4R2','B3J 1S9','B3K 5X5'] },
      { name: 'Sydney', postalAreas: ['B1P 6J7','B1S 2G2'] },
    ]},
    { code: 'CA-NB', name: 'New Brunswick', cities: [
      { name: 'Moncton', postalAreas: ['E1C 1A1','E1C 4M4','E1E 1A1'] },
      { name: 'Saint John', postalAreas: ['E2L 1B8','E2M 3V9','E2J 1N4'] },
      { name: 'Fredericton', postalAreas: ['E3B 1A1','E3B 4G4','E3C 2G2'] },
    ]},
    { code: 'CA-SK', name: 'Saskatchewan', cities: [
      { name: 'Saskatoon', postalAreas: ['S7K 0A1','S7H 0A1','S7L 0A1'] },
      { name: 'Regina', postalAreas: ['S4P 0A1','S4R 0A1','S4S 0A1'] },
    ]},
    { code: 'CA-PE', name: 'Prince Edward Island', cities: [
      { name: 'Charlottetown', postalAreas: ['C1A 1A1','C1A 4N5'] },
    ]},
    { code: 'CA-NL', name: 'Newfoundland & Labrador', cities: [
      { name: "St. John's", postalAreas: ['A1A 1A1','A1B 0A1','A1C 0A1'] },
    ]},
  ],

  AU: [
    { code: 'AU-NSW', name: 'New South Wales', cities: [
      { name: 'Sydney', postalAreas: ['2000','2010','2021','2060','2150'] },
      { name: 'Newcastle', postalAreas: ['2300','2302','2289','2340'] },
      { name: 'Wollongong', postalAreas: ['2500','2505','2519'] },
      { name: 'Parramatta', postalAreas: ['2150','2151','2153'] },
    ]},
    { code: 'AU-VIC', name: 'Victoria', cities: [
      { name: 'Melbourne', postalAreas: ['3000','3004','3008','3065','3121'] },
      { name: 'Geelong', postalAreas: ['3220','3215','3216'] },
      { name: 'Ballarat', postalAreas: ['3350','3352'] },
      { name: 'Bendigo', postalAreas: ['3550','3551'] },
    ]},
    { code: 'AU-QLD', name: 'Queensland', cities: [
      { name: 'Brisbane', postalAreas: ['4000','4101','4066','4178'] },
      { name: 'Gold Coast', postalAreas: ['4217','4220','4226'] },
      { name: 'Sunshine Coast', postalAreas: ['4556','4575','4551'] },
      { name: 'Cairns', postalAreas: ['4870','4868','4879'] },
    ]},
    { code: 'AU-WA', name: 'Western Australia', cities: [
      { name: 'Perth', postalAreas: ['6000','6005','6009','6018','6106'] },
      { name: 'Fremantle', postalAreas: ['6160','6163'] },
      { name: 'Bunbury', postalAreas: ['6230','6231'] },
    ]},
    { code: 'AU-SA', name: 'South Australia', cities: [
      { name: 'Adelaide', postalAreas: ['5000','5006','5011','5042','5067'] },
      { name: 'Mount Gambier', postalAreas: ['5290','5291'] },
    ]},
    { code: 'AU-ACT', name: 'Australian Capital Territory', cities: [
      { name: 'Canberra', postalAreas: ['2600','2601','2602','2614'] },
      { name: 'Belconnen', postalAreas: ['2617','2615'] },
    ]},
  ],

  IN: [
    { code: 'IN-MH', name: 'Maharashtra', cities: [
      { name: 'Mumbai', postalAreas: ['400001', '400002', '400050', '400051', '400063', '400064', '400070', '400076'] },
      { name: 'Pune', postalAreas: ['411001', '411002', '411005', '411007', '411028', '411045'] },
      { name: 'Nagpur', postalAreas: ['440001', '440002', '440010', '440012', '440022'] },
      { name: 'Nashik', postalAreas: ['422001', '422002', '422005', '422011'] },
      { name: 'Aurangabad', postalAreas: ['431001', '431003', '431005'] },
    ]},
    { code: 'IN-DL', name: 'Delhi', cities: [
      { name: 'New Delhi', postalAreas: ['110001', '110002', '110003', '110006', '110011', '110021', '110029', '110070'] },
      { name: 'Delhi', postalAreas: ['110031', '110032', '110051', '110052', '110053', '110085', '110086', '110092'] },
    ]},
    { code: 'IN-KA', name: 'Karnataka', cities: [
      { name: 'Bengaluru', postalAreas: ['560001', '560002', '560011', '560017', '560029', '560037', '560068', '560100'] },
      { name: 'Mysuru', postalAreas: ['570001', '570002', '570004', '570008', '570010'] },
      { name: 'Mangaluru', postalAreas: ['575001', '575002', '575003', '575006'] },
      { name: 'Hubballi', postalAreas: ['580020', '580021', '580023', '580025', '580028', '580029', '580031'] },
    ]},
    { code: 'IN-TN', name: 'Tamil Nadu', cities: [
      { name: 'Chennai', postalAreas: ['600001', '600002', '600006', '600017', '600028', '600040', '600078', '600096'] },
      { name: 'Coimbatore', postalAreas: ['641001', '641002', '641004', '641011', '641018', '641021'] },
      { name: 'Madurai', postalAreas: ['625001', '625002', '625003', '625009', '625016'] },
      { name: 'Tiruchirappalli', postalAreas: ['620001', '620002', '620003', '620008', '620017'] },
    ]},
    { code: 'IN-GJ', name: 'Gujarat', cities: [
      { name: 'Ahmedabad', postalAreas: ['380001', '380002', '380006', '380009', '380013', '380015', '380051', '380063'] },
      { name: 'Surat', postalAreas: ['395001', '395002', '395003', '395004', '395005', '395006', '395007'] },
      { name: 'Vadodara', postalAreas: ['390001', '390002', '390003', '390007', '390011', '390019'] },
      { name: 'Rajkot', postalAreas: ['360001', '360002', '360003', '360004', '360005', '360006'] },
    ]},
    { code: 'IN-RJ', name: 'Rajasthan', cities: [
      { name: 'Jaipur', postalAreas: ['302001', '302002', '302003', '302004', '302006', '302011', '302012', '302017'] },
      { name: 'Jodhpur', postalAreas: ['342001', '342002', '342003', '342005', '342006', '342008'] },
      { name: 'Udaipur', postalAreas: ['313001', '313002', '313004', '313011'] },
      { name: 'Kota', postalAreas: ['324001', '324002', '324003', '324005', '324006', '324007', '324010'] },
    ]},
    { code: 'IN-UP', name: 'Uttar Pradesh', cities: [
      { name: 'Lucknow', postalAreas: ['226001', '226002', '226003', '226004', '226005', '226010', '226012', '226016'] },
      { name: 'Kanpur', postalAreas: ['208001', '208002', '208003', '208004', '208005', '208006', '208011'] },
      { name: 'Agra', postalAreas: ['282001', '282002', '282003', '282004', '282005', '282006', '282007', '282010'] },
      { name: 'Varanasi', postalAreas: ['221001', '221002', '221003', '221004', '221005', '221006', '221007', '221010'] },
      { name: 'Noida', postalAreas: ['201301', '201302', '201303', '201304', '201305', '201306', '201307', '201308'] },
    ]},
    { code: 'IN-WB', name: 'West Bengal', cities: [
      { name: 'Kolkata', postalAreas: ['700001', '700002', '700012', '700017', '700019', '700029', '700040', '700064'] },
      { name: 'Howrah', postalAreas: ['711101', '711102', '711103', '711104', '711106'] },
      { name: 'Durgapur', postalAreas: ['713201', '713202', '713203', '713204', '713205', '713206'] },
      { name: 'Asansol', postalAreas: ['713301', '713302', '713303', '713304', '713305', '713306'] },
    ]},
    { code: 'IN-TS', name: 'Telangana', cities: [
      { name: 'Hyderabad', postalAreas: ['500001', '500002', '500003', '500004', '500028', '500034', '500072', '500081'] },
      { name: 'Warangal', postalAreas: ['506001', '506002', '506003', '506004', '506005', '506006'] },
      { name: 'Nizamabad', postalAreas: ['503001', '503002', '503003', '503006', '503007'] },
      { name: 'Karimnagar', postalAreas: ['505001', '505002', '505003', '505004', '505186'] },
    ]},
    { code: 'IN-AP', name: 'Andhra Pradesh', cities: [
      { name: 'Visakhapatnam', postalAreas: ['530001', '530002', '530003', '530004', '530017', '530020', '530022', '530040'] },
      { name: 'Vijayawada', postalAreas: ['520001', '520002', '520003', '520004', '520007', '520010', '520012'] },
      { name: 'Guntur', postalAreas: ['522001', '522002', '522003', '522004', '522006', '522007'] },
      { name: 'Tirupati', postalAreas: ['517501', '517502', '517503', '517504', '517505', '517507'] },
    ]},
    { code: 'IN-KL', name: 'Kerala', cities: [
      { name: 'Kochi', postalAreas: ['682001', '682002', '682005', '682011', '682016', '682017', '682018', '682020'] },
      { name: 'Thiruvananthapuram', postalAreas: ['695001', '695002', '695003', '695004', '695011', '695014', '695016'] },
      { name: 'Kozhikode', postalAreas: ['673001', '673002', '673003', '673004', '673005', '673006', '673009'] },
      { name: 'Thrissur', postalAreas: ['680001', '680002', '680003', '680004', '680005', '680006', '680007'] },
    ]},
    { code: 'IN-MP', name: 'Madhya Pradesh', cities: [
      { name: 'Bhopal', postalAreas: ['462001', '462002', '462003', '462011', '462016', '462021', '462023', '462026'] },
      { name: 'Indore', postalAreas: ['452001', '452002', '452003', '452006', '452007', '452008', '452010', '452011'] },
      { name: 'Gwalior', postalAreas: ['474001', '474002', '474003', '474004', '474005', '474006', '474010', '474011'] },
      { name: 'Jabalpur', postalAreas: ['482001', '482002', '482003', '482004', '482005', '482006', '482007', '482008'] },
    ]},
    { code: 'IN-PB', name: 'Punjab', cities: [
      { name: 'Chandigarh', postalAreas: ['160001', '160002', '160003', '160009', '160010', '160011', '160014', '160015'] },
      { name: 'Ludhiana', postalAreas: ['141001', '141002', '141003', '141004', '141008', '141010', '141012', '141013'] },
      { name: 'Amritsar', postalAreas: ['143001', '143002', '143003', '143004', '143005', '143006', '143007', '143008'] },
      { name: 'Jalandhar', postalAreas: ['144001', '144002', '144003', '144004', '144005', '144006', '144007', '144008'] },
    ]},
    { code: 'IN-HR', name: 'Haryana', cities: [
      { name: 'Gurugram', postalAreas: ['122001', '122002', '122003', '122004', '122006', '122007', '122008', '122009'] },
      { name: 'Faridabad', postalAreas: ['121001', '121002', '121003', '121004', '121005', '121006', '121007'] },
      { name: 'Panipat', postalAreas: ['132001', '132103', '132104', '132105', '132106', '132107'] },
      { name: 'Ambala', postalAreas: ['134001', '134002', '134003', '134004', '134005', '134007', '134008'] },
    ]},
    { code: 'IN-BR', name: 'Bihar', cities: [
      { name: 'Patna', postalAreas: ['800001', '800002', '800003', '800004', '800005', '800006', '800007', '800009'] },
      { name: 'Gaya', postalAreas: ['823001', '823002', '823003', '823004', '823005', '823006'] },
      { name: 'Muzaffarpur', postalAreas: ['842001', '842002', '842003', '842004', '842005', '842006'] },
      { name: 'Bhagalpur', postalAreas: ['812001', '812002', '812003', '812004', '812005', '812007'] },
    ]},
    { code: 'IN-OR', name: 'Odisha', cities: [
      { name: 'Bhubaneswar', postalAreas: ['751001', '751002', '751003', '751006', '751007', '751010', '751012', '751015'] },
      { name: 'Cuttack', postalAreas: ['753001', '753002', '753003', '753004', '753005', '753006', '753007', '753008'] },
      { name: 'Rourkela', postalAreas: ['769001', '769002', '769003', '769004', '769005', '769006', '769007'] },
      { name: 'Berhampur', postalAreas: ['760001', '760002', '760003', '760004', '760006', '760007', '760010'] },
    ]},
    { code: 'IN-JH', name: 'Jharkhand', cities: [
      { name: 'Ranchi', postalAreas: ['834001', '834002', '834003', '834004', '834005', '834006', '834008', '834009'] },
      { name: 'Jamshedpur', postalAreas: ['831001', '831002', '831003', '831004', '831005', '831006', '831009'] },
      { name: 'Dhanbad', postalAreas: ['826001', '826002', '826003', '826004', '826005', '826006', '826007'] },
      { name: 'Bokaro', postalAreas: ['827001', '827002', '827003', '827004', '827006', '827009', '827010'] },
    ]},
    { code: 'IN-AS', name: 'Assam', cities: [
      { name: 'Guwahati', postalAreas: ['781001', '781002', '781003', '781004', '781005', '781007', '781011', '781021'] },
      { name: 'Silchar', postalAreas: ['788001', '788002', '788003', '788004', '788005', '788006', '788007'] },
      { name: 'Dibrugarh', postalAreas: ['786001', '786002', '786003', '786004', '786005', '786006'] },
      { name: 'Jorhat', postalAreas: ['785001', '785002', '785003', '785004', '785005', '785006', '785007'] },
    ]},
    { code: 'IN-CG', name: 'Chhattisgarh', cities: [
      { name: 'Raipur', postalAreas: ['492001', '492002', '492003', '492004', '492005', '492006', '492007', '492009'] },
      { name: 'Bhilai', postalAreas: ['490001', '490006', '490007', '490009', '490011', '490020', '490021', '490022'] },
      { name: 'Bilaspur', postalAreas: ['495001', '495002', '495003', '495004', '495006', '495007', '495008'] },
      { name: 'Korba', postalAreas: ['495450', '495451', '495452', '495453', '495454', '495455'] },
    ]},
    { code: 'IN-UK', name: 'Uttarakhand', cities: [
      { name: 'Dehradun', postalAreas: ['248001', '248002', '248003', '248006', '248007', '248009', '248010', '248011'] },
      { name: 'Haridwar', postalAreas: ['249401', '249402', '249403', '249404', '249405', '249406', '249407', '249408'] },
      { name: 'Roorkee', postalAreas: ['247667', '247668', '247670', '247671', '247672', '247675', '247677'] },
      { name: 'Haldwani', postalAreas: ['263139', '263140', '263141', '263142', '263143', '263144', '263145'] },
    ]},
    { code: 'IN-HP', name: 'Himachal Pradesh', cities: [
      { name: 'Shimla', postalAreas: ['171001', '171002', '171003', '171004', '171005', '171006', '171007', '171008'] },
      { name: 'Manali', postalAreas: ['175131', '175132', '175133', '175134', '175136'] },
      { name: 'Dharamshala', postalAreas: ['176215', '176216', '176217', '176218', '176219'] },
      { name: 'Solan', postalAreas: ['173001', '173002', '173003', '173005', '173006', '173007', '173008', '173009'] },
    ]},
    { code: 'IN-GA', name: 'Goa', cities: [
      { name: 'Panaji', postalAreas: ['403001', '403002', '403003', '403004', '403005', '403006'] },
      { name: 'Margao', postalAreas: ['403601', '403602', '403603', '403604', '403605', '403606', '403607'] },
      { name: 'Vasco da Gama', postalAreas: ['403802', '403803', '403804', '403806', '403807'] },
      { name: 'Mapusa', postalAreas: ['403507', '403508', '403509', '403510', '403511', '403512'] },
    ]},
    { code: 'IN-MN', name: 'Manipur', cities: [
      { name: 'Imphal', postalAreas: ['795001', '795002', '795003', '795004', '795005', '795006', '795007', '795008'] },
    ]},
    { code: 'IN-TR', name: 'Tripura', cities: [
      { name: 'Agartala', postalAreas: ['799001', '799002', '799003', '799004', '799005', '799006', '799007', '799010'] },
    ]},
    { code: 'IN-ML', name: 'Meghalaya', cities: [
      { name: 'Shillong', postalAreas: ['793001', '793002', '793003', '793004', '793005', '793006', '793007', '793008'] },
    ]},
    { code: 'IN-NL', name: 'Nagaland', cities: [
      { name: 'Kohima', postalAreas: ['797001', '797002', '797003', '797004', '797005'] },
      { name: 'Dimapur', postalAreas: ['797112', '797113', '797114', '797115', '797116', '797117'] },
    ]},
    { code: 'IN-AR', name: 'Arunachal Pradesh', cities: [
      { name: 'Itanagar', postalAreas: ['791111', '791112', '791113', '791114', '791115'] },
    ]},
    { code: 'IN-MZ', name: 'Mizoram', cities: [
      { name: 'Aizawl', postalAreas: ['796001', '796002', '796003', '796004', '796005', '796006', '796007'] },
    ]},
    { code: 'IN-SK', name: 'Sikkim', cities: [
      { name: 'Gangtok', postalAreas: ['737101', '737102', '737103', '737104', '737106', '737107'] },
    ]},
    { code: 'IN-JK', name: 'Jammu & Kashmir', cities: [
      { name: 'Srinagar', postalAreas: ['190001', '190002', '190003', '190004', '190005', '190006', '190007', '190008'] },
      { name: 'Jammu', postalAreas: ['180001', '180002', '180003', '180004', '180005', '180006', '180007', '180012'] },
    ]},
    { code: 'IN-LA', name: 'Ladakh', cities: [
      { name: 'Leh', postalAreas: ['194101', '194102', '194103', '194104', '194105', '194106'] },
      { name: 'Kargil', postalAreas: ['194103', '194201', '194202', '194203', '194204'] },
    ]},
    { code: 'IN-CH', name: 'Chandigarh', cities: [
      { name: 'Chandigarh', postalAreas: ['160001', '160002', '160003', '160009', '160010', '160011', '160014', '160015'] },
    ]},
    { code: 'IN-PY', name: 'Puducherry', cities: [
      { name: 'Puducherry', postalAreas: ['605001', '605002', '605003', '605004', '605005', '605006', '605007', '605008'] },
      { name: 'Karaikal', postalAreas: ['609601', '609602', '609603', '609604', '609605', '609606'] },
    ]},
    { code: 'IN-AN', name: 'Andaman & Nicobar Islands', cities: [
      { name: 'Port Blair', postalAreas: ['744101', '744102', '744103', '744104', '744105', '744106'] },
    ]},
    { code: 'IN-LD', name: 'Lakshadweep', cities: [
      { name: 'Kavaratti', postalAreas: ['682555', '682556', '682557', '682559'] },
    ]},
    { code: 'IN-DN', name: 'Dadra & Nagar Haveli and Daman & Diu', cities: [
      { name: 'Silvassa', postalAreas: ['396230', '396231', '396232', '396233', '396235', '396236'] },
      { name: 'Daman', postalAreas: ['396210', '396211', '396212', '396213', '396215', '396220'] },
      { name: 'Diu', postalAreas: ['362520', '362521', '362522', '362523', '362524', '362526'] },
    ]},
  ],

  DE: [
    { code: 'DE-BY', name: 'Bavaria', cities: [
      { name: 'Munich', postalAreas: ['80331','80801','80995','81249'] },
      { name: 'Nuremberg', postalAreas: ['90402','90439','90471'] },
      { name: 'Augsburg', postalAreas: ['86150','86153','86167'] },
    ]},
    { code: 'DE-BE', name: 'Berlin', cities: [
      { name: 'Berlin-Mitte', postalAreas: ['10115','10178','10179'] },
      { name: 'Berlin-Prenzlauer Berg', postalAreas: ['10405','10437','10439'] },
      { name: 'Berlin-Kreuzberg', postalAreas: ['10967','10969','10997'] },
      { name: 'Berlin-Charlottenburg', postalAreas: ['10623','10625','10627'] },
    ]},
    { code: 'DE-HH', name: 'Hamburg', cities: [
      { name: 'Hamburg-Mitte', postalAreas: ['20095','20099','20144'] },
      { name: 'Hamburg-Altona', postalAreas: ['22765','22767','22769'] },
      { name: 'Hamburg-Eimsbüttel', postalAreas: ['20251','20253','20357'] },
    ]},
    { code: 'DE-NW', name: 'North Rhine-Westphalia', cities: [
      { name: 'Cologne', postalAreas: ['50667','50672','50823','51063'] },
      { name: 'Düsseldorf', postalAreas: ['40210','40219','40225','40470'] },
      { name: 'Dortmund', postalAreas: ['44135','44141','44227'] },
      { name: 'Essen', postalAreas: ['45127','45130','45141'] },
    ]},
    { code: 'DE-HE', name: 'Hesse', cities: [
      { name: 'Frankfurt', postalAreas: ['60311','60316','60327','60486'] },
      { name: 'Wiesbaden', postalAreas: ['65185','65187','65195'] },
      { name: 'Kassel', postalAreas: ['34117','34119','34123'] },
    ]},
    { code: 'DE-BW', name: 'Baden-Württemberg', cities: [
      { name: 'Stuttgart', postalAreas: ['70173','70176','70197','70567'] },
      { name: 'Karlsruhe', postalAreas: ['76131','76133','76185'] },
      { name: 'Mannheim', postalAreas: ['68159','68161','68163'] },
    ]},
  ],

  FR: [
    { code: 'FR-IDF', name: 'Île-de-France', cities: [
      { name: 'Paris 1er–4e', postalAreas: ['75001','75002','75003','75004'] },
      { name: 'Paris 5e–8e', postalAreas: ['75005','75006','75007','75008'] },
      { name: 'Paris 9e–11e', postalAreas: ['75009','75010','75011'] },
      { name: 'Paris 12e–15e', postalAreas: ['75012','75013','75014','75015'] },
      { name: 'Paris 16e–20e', postalAreas: ['75016','75017','75018','75020'] },
      { name: 'Boulogne-Billancourt', postalAreas: ['92100','92130'] },
      { name: 'Saint-Denis', postalAreas: ['93200','93210'] },
    ]},
    { code: 'FR-ARA', name: 'Auvergne-Rhône-Alpes', cities: [
      { name: 'Lyon', postalAreas: ['69001','69002','69003','69006','69007'] },
      { name: 'Grenoble', postalAreas: ['38000','38100','38130'] },
      { name: 'Clermont-Ferrand', postalAreas: ['63000','63100'] },
    ]},
    { code: 'FR-OCC', name: 'Occitanie', cities: [
      { name: 'Toulouse', postalAreas: ['31000','31100','31200','31300'] },
      { name: 'Montpellier', postalAreas: ['34000','34070','34090'] },
    ]},
    { code: 'FR-PAC', name: 'Provence-Alpes-Côte d\'Azur', cities: [
      { name: 'Marseille', postalAreas: ['13001','13002','13005','13008'] },
      { name: 'Nice', postalAreas: ['06000','06100','06200','06300'] },
      { name: 'Aix-en-Provence', postalAreas: ['13100','13090'] },
    ]},
    { code: 'FR-GES', name: 'Grand Est', cities: [
      { name: 'Strasbourg', postalAreas: ['67000','67100','67200'] },
      { name: 'Mulhouse', postalAreas: ['68100','68110','68200'] },
    ]},
    { code: 'FR-NAQ', name: 'Nouvelle-Aquitaine', cities: [
      { name: 'Bordeaux', postalAreas: ['33000','33100','33200','33300'] },
      { name: 'Limoges', postalAreas: ['87000','87100'] },
    ]},
  ],

  AE: [
    { code: 'AE-DU', name: 'Dubai', cities: [
      { name: 'Downtown Dubai', postalAreas: ['121774','282614'] },
      { name: 'Dubai Marina', postalAreas: ['212706','39435'] },
      { name: 'Business Bay', postalAreas: ['39436','28001'] },
      { name: 'JLT (Jumeirah Lake Towers)', postalAreas: ['18173','36975'] },
      { name: 'DIFC', postalAreas: ['506528','507260'] },
      { name: 'Deira', postalAreas: ['53701','53800'] },
      { name: 'Bur Dubai', postalAreas: ['23355','23400'] },
    ]},
    { code: 'AE-AZ', name: 'Abu Dhabi', cities: [
      { name: 'Abu Dhabi City', postalAreas: ['112633','44444'] },
      { name: 'Khalifa City', postalAreas: ['55556','66666'] },
      { name: 'Al Ain', postalAreas: ['17551','15551'] },
      { name: 'Musaffah', postalAreas: ['88888','99999'] },
    ]},
    { code: 'AE-SH', name: 'Sharjah', cities: [
      { name: 'Sharjah City', postalAreas: ['65533','61999'] },
      { name: 'Sharjah Media City', postalAreas: ['515000','515001'] },
    ]},
    { code: 'AE-AJ', name: 'Ajman', cities: [
      { name: 'Ajman City', postalAreas: ['4444','3201'] },
    ]},
  ],

  SG: [
    { code: 'SG-01', name: 'Central Region', cities: [
      { name: 'CBD / Raffles Place', postalAreas: ['048616','068897','069545'] },
      { name: 'Marina Bay', postalAreas: ['018956','039190','018988'] },
      { name: 'Orchard', postalAreas: ['238863','238885','238878'] },
      { name: 'Tanjong Pagar', postalAreas: ['088782','089065','089066'] },
      { name: 'Clarke Quay', postalAreas: ['179024','179037','179023'] },
    ]},
    { code: 'SG-02', name: 'East Region', cities: [
      { name: 'Tampines', postalAreas: ['529536','529538','529543'] },
      { name: 'Pasir Ris', postalAreas: ['518457','518942'] },
      { name: 'Bedok', postalAreas: ['469994','460101'] },
    ]},
    { code: 'SG-03', name: 'North Region', cities: [
      { name: 'Woodlands', postalAreas: ['738099','738784','730791'] },
      { name: 'Sembawang', postalAreas: ['757980','757981'] },
      { name: 'Yishun', postalAreas: ['760430','760431'] },
    ]},
    { code: 'SG-04', name: 'West Region', cities: [
      { name: 'Jurong East', postalAreas: ['609731','608549','609731'] },
      { name: 'Clementi', postalAreas: ['120305','120410'] },
      { name: 'Boon Lay', postalAreas: ['649877','609741'] },
    ]},
    { code: 'SG-05', name: 'North-East Region', cities: [
      { name: 'Serangoon', postalAreas: ['550101','550102'] },
      { name: 'Hougang', postalAreas: ['530101','530111'] },
      { name: 'Punggol', postalAreas: ['820101','820102'] },
    ]},
  ],

  BR: [
    { code: 'BR-SP', name: 'São Paulo', cities: [
      { name: 'São Paulo Centro', postalAreas: ['01310-100','01001-000','01310-200'] },
      { name: 'Paulista', postalAreas: ['01311-000','01310-909','01452-001'] },
      { name: 'Faria Lima / Itaim', postalAreas: ['04538-132','04538-133','04538-143'] },
      { name: 'Vila Olímpia', postalAreas: ['04551-000','04552-000'] },
      { name: 'Campinas', postalAreas: ['13010-001','13010-100','13025-610'] },
    ]},
    { code: 'BR-RJ', name: 'Rio de Janeiro', cities: [
      { name: 'Centro Rio', postalAreas: ['20040-020','20021-390','20040-030'] },
      { name: 'Barra da Tijuca', postalAreas: ['22793-080','22775-001','22620-010'] },
      { name: 'Ipanema / Leblon', postalAreas: ['22411-000','22430-060','22420-180'] },
      { name: 'Botafogo', postalAreas: ['22250-040','22250-140','22290-140'] },
    ]},
    { code: 'BR-MG', name: 'Minas Gerais', cities: [
      { name: 'Belo Horizonte', postalAreas: ['30110-010','30140-070','30310-060'] },
      { name: 'Uberlândia', postalAreas: ['38400-000','38401-001'] },
    ]},
    { code: 'BR-SC', name: 'Santa Catarina', cities: [
      { name: 'Florianópolis', postalAreas: ['88010-000','88015-000','88025-100'] },
      { name: 'Joinville', postalAreas: ['89201-000','89201-305'] },
    ]},
    { code: 'BR-RS', name: 'Rio Grande do Sul', cities: [
      { name: 'Porto Alegre', postalAreas: ['90010-000','90035-000','90040-060'] },
      { name: 'Caxias do Sul', postalAreas: ['95010-000','95012-000'] },
    ]},
  ],

  JP: [
    { code: 'JP-TK', name: 'Tokyo', cities: [
      { name: 'Shinjuku', postalAreas: ['160-0022','160-0023','160-0021'] },
      { name: 'Shibuya', postalAreas: ['150-0001','150-0002','150-0031'] },
      { name: 'Chiyoda / Marunouchi', postalAreas: ['100-0005','100-0004','100-6890'] },
      { name: 'Minato / Roppongi', postalAreas: ['106-0032','105-0001','107-0062'] },
      { name: 'Akihabara', postalAreas: ['101-0021','101-0023','101-0025'] },
      { name: 'Harajuku / Omotesando', postalAreas: ['150-0001','150-0001','151-0051'] },
    ]},
    { code: 'JP-OS', name: 'Osaka', cities: [
      { name: 'Osaka City', postalAreas: ['541-0051','530-0001','542-0071'] },
      { name: 'Namba', postalAreas: ['542-0073','542-0071','542-0075'] },
      { name: 'Umeda', postalAreas: ['530-0001','530-0002','530-0011'] },
    ]},
    { code: 'JP-KN', name: 'Kanagawa', cities: [
      { name: 'Yokohama', postalAreas: ['220-0012','231-0021','230-0051'] },
      { name: 'Kawasaki', postalAreas: ['210-0001','211-0067'] },
    ]},
    { code: 'JP-AK', name: 'Aichi', cities: [
      { name: 'Nagoya', postalAreas: ['460-0001','460-0003','450-0001'] },
      { name: 'Toyota', postalAreas: ['471-0801','471-8501'] },
    ]},
    { code: 'JP-FK', name: 'Fukuoka', cities: [
      { name: 'Fukuoka City', postalAreas: ['810-0001','810-0072','812-0011'] },
      { name: 'Kitakyushu', postalAreas: ['800-0001','800-0003'] },
    ]},
  ],

  MX: [
    { code: 'MX-CMX', name: 'Mexico City (CDMX)', cities: [
      { name: 'Centro Histórico', postalAreas: ['06000','06020','06040'] },
      { name: 'Polanco', postalAreas: ['11550','11560','11590'] },
      { name: 'Santa Fe', postalAreas: ['01376','05300','01330'] },
      { name: 'Condesa / Roma', postalAreas: ['06700','06600','06170'] },
      { name: 'Coyoacán', postalAreas: ['04000','04100','04810'] },
    ]},
    { code: 'MX-NL', name: 'Nuevo León', cities: [
      { name: 'Monterrey', postalAreas: ['64000','64010','64600','64650'] },
      { name: 'San Pedro Garza García', postalAreas: ['66220','66238','66267'] },
      { name: 'Guadalupe', postalAreas: ['67100','67110','67130'] },
    ]},
    { code: 'MX-JAL', name: 'Jalisco', cities: [
      { name: 'Guadalajara', postalAreas: ['44100','44200','44600','44630'] },
      { name: 'Zapopan', postalAreas: ['45000','45030','45116'] },
      { name: 'Puerto Vallarta', postalAreas: ['48300','48310','48350'] },
    ]},
    { code: 'MX-YUC', name: 'Yucatan', cities: [
      { name: 'Mérida', postalAreas: ['97000','97070','97110'] },
      { name: 'Cancún', postalAreas: ['77500','77506','77520'] },
    ]},
    { code: 'MX-BCN', name: 'Baja California', cities: [
      { name: 'Tijuana', postalAreas: ['22000','22010','22100'] },
      { name: 'Mexicali', postalAreas: ['21000','21010','21100'] },
      { name: 'Ensenada', postalAreas: ['22800','22820','22870'] },
    ]},
  ],

  ZA: [
    { code: 'ZA-GP', name: 'Gauteng', cities: [
      { name: 'Johannesburg CBD', postalAreas: ['2001','2041','2001'] },
      { name: 'Sandton', postalAreas: ['2196','2194','2199'] },
      { name: 'Pretoria', postalAreas: ['0001','0002','0181','0182'] },
      { name: 'Midrand', postalAreas: ['1685','1686','1687'] },
      { name: 'Soweto', postalAreas: ['1818','1827','1803'] },
    ]},
    { code: 'ZA-WC', name: 'Western Cape', cities: [
      { name: 'Cape Town CBD', postalAreas: ['8001','8005','8018'] },
      { name: 'Sea Point / Green Point', postalAreas: ['8005','8001','8050'] },
      { name: 'Stellenbosch', postalAreas: ['7600','7604','7610'] },
      { name: 'George', postalAreas: ['6530','6531'] },
    ]},
    { code: 'ZA-KZN', name: 'KwaZulu-Natal', cities: [
      { name: 'Durban CBD', postalAreas: ['4001','4004','4006'] },
      { name: 'Umhlanga', postalAreas: ['4319','4320','4321'] },
      { name: 'Pietermaritzburg', postalAreas: ['3200','3201','3201'] },
    ]},
    { code: 'ZA-EC', name: 'Eastern Cape', cities: [
      { name: 'Port Elizabeth (Gqeberha)', postalAreas: ['6001','6014','6020'] },
      { name: 'East London', postalAreas: ['5200','5201','5247'] },
    ]},
  ],

  NL: [
    { code: 'NL-NH', name: 'North Holland', cities: [
      { name: 'Amsterdam Centre', postalAreas: ['1011','1012','1013','1016','1017'] },
      { name: 'Amsterdam East', postalAreas: ['1091','1092','1093','1094'] },
      { name: 'Amsterdam West', postalAreas: ['1052','1053','1054','1055'] },
      { name: 'Haarlem', postalAreas: ['2011','2012','2013','2018'] },
    ]},
    { code: 'NL-ZH', name: 'South Holland', cities: [
      { name: 'Rotterdam Centre', postalAreas: ['3011','3012','3013','3014'] },
      { name: 'Rotterdam North', postalAreas: ['3031','3032','3033','3034'] },
      { name: 'The Hague', postalAreas: ['2511','2512','2513','2514'] },
      { name: 'Delft', postalAreas: ['2601','2611','2612','2613'] },
    ]},
    { code: 'NL-UT', name: 'Utrecht', cities: [
      { name: 'Utrecht Centre', postalAreas: ['3511','3512','3513','3514'] },
      { name: 'Amersfoort', postalAreas: ['3811','3812','3813'] },
    ]},
    { code: 'NL-NB', name: 'North Brabant', cities: [
      { name: 'Eindhoven', postalAreas: ['5611','5612','5613','5614'] },
      { name: 'Tilburg', postalAreas: ['5011','5012','5013','5014'] },
      { name: 'Breda', postalAreas: ['4811','4812','4813','4814'] },
    ]},
  ],

  NG: [
    { code: 'NG-LA', name: 'Lagos', cities: [
      { name: 'Victoria Island', postalAreas: ['101241','101233','101221'] },
      { name: 'Lekki', postalAreas: ['106104','105102','105101'] },
      { name: 'Ikeja', postalAreas: ['100281','100271','100261'] },
      { name: 'Lagos Island', postalAreas: ['101001','101002','101003'] },
      { name: 'Yaba', postalAreas: ['101245','100004','100001'] },
    ]},
    { code: 'NG-AB', name: 'Abuja (FCT)', cities: [
      { name: 'Central Business District', postalAreas: ['900001','900002','900003'] },
      { name: 'Maitama', postalAreas: ['900231','900232','900233'] },
      { name: 'Wuse', postalAreas: ['900001','900011','900012'] },
      { name: 'Garki', postalAreas: ['900001','900003','900004'] },
    ]},
    { code: 'NG-KN', name: 'Kano', cities: [
      { name: 'Kano City', postalAreas: ['700001','700010','700231'] },
      { name: 'Nassarawa', postalAreas: ['700282','700283'] },
    ]},
    { code: 'NG-RV', name: 'Rivers', cities: [
      { name: 'Port Harcourt', postalAreas: ['500001','500211','500261'] },
      { name: 'Obio/Akpor', postalAreas: ['500102','500211'] },
    ]},
  ],

  KE: [
    { code: 'KE-NAI', name: 'Nairobi County', cities: [
      { name: 'Nairobi CBD', postalAreas: ['00100','00200','00300'] },
      { name: 'Westlands', postalAreas: ['00800','00619','00618'] },
      { name: 'Karen / Langata', postalAreas: ['00502','00501','00100'] },
      { name: 'Kilimani', postalAreas: ['00100','00502','00623'] },
      { name: 'Upperhill', postalAreas: ['00100','00200','00100'] },
    ]},
    { code: 'KE-MOM', name: 'Mombasa County', cities: [
      { name: 'Mombasa CBD', postalAreas: ['80100','80200','80100'] },
      { name: 'Nyali', postalAreas: ['80100','80118','80114'] },
      { name: 'Bamburi', postalAreas: ['80100','80113'] },
    ]},
    { code: 'KE-KSM', name: 'Kisumu County', cities: [
      { name: 'Kisumu City', postalAreas: ['40100','40200','40107'] },
      { name: 'Milimani', postalAreas: ['40100','40109'] },
    ]},
    { code: 'KE-NKR', name: 'Nakuru County', cities: [
      { name: 'Nakuru Town', postalAreas: ['20100','20110','20160'] },
    ]},
  ],

  ES: [
    { code: 'ES-MD', name: 'Madrid', cities: [
      { name: 'Madrid Centro', postalAreas: ['28001','28004','28012','28013'] },
      { name: 'Salamanca', postalAreas: ['28001','28006','28009'] },
      { name: 'Chamberí', postalAreas: ['28003','28010','28036'] },
      { name: 'Vallecas', postalAreas: ['28018','28031','28032'] },
    ]},
    { code: 'ES-CT', name: 'Catalonia', cities: [
      { name: 'Barcelona Eixample', postalAreas: ['08009','08011','08015','08029'] },
      { name: 'Barcelona Gràcia', postalAreas: ['08012','08024','08025'] },
      { name: 'Barcelona Poblenou', postalAreas: ['08005','08018','08019'] },
      { name: 'Tarragona', postalAreas: ['43001','43002','43003'] },
    ]},
    { code: 'ES-PV', name: 'Basque Country', cities: [
      { name: 'Bilbao', postalAreas: ['48001','48005','48010','48012'] },
      { name: 'San Sebastián', postalAreas: ['20001','20003','20004'] },
    ]},
    { code: 'ES-AN', name: 'Andalusia', cities: [
      { name: 'Seville', postalAreas: ['41001','41003','41005','41007'] },
      { name: 'Málaga', postalAreas: ['29001','29002','29004','29007'] },
      { name: 'Granada', postalAreas: ['18001','18003','18010'] },
    ]},
  ],

  IT: [
    { code: 'IT-LOM', name: 'Lombardy', cities: [
      { name: 'Milan Centro', postalAreas: ['20121','20122','20123','20135'] },
      { name: 'Milan Porta Nuova', postalAreas: ['20124','20125','20124'] },
      { name: 'Milan Navigli', postalAreas: ['20144','20143','20142'] },
      { name: 'Bergamo', postalAreas: ['24121','24122','24123'] },
      { name: 'Brescia', postalAreas: ['25121','25122','25123'] },
    ]},
    { code: 'IT-LAZ', name: 'Lazio', cities: [
      { name: 'Rome Centro Storico', postalAreas: ['00186','00184','00192'] },
      { name: 'Rome EUR', postalAreas: ['00144','00145','00147'] },
      { name: 'Rome Parioli', postalAreas: ['00197','00196','00199'] },
    ]},
    { code: 'IT-VEN', name: 'Veneto', cities: [
      { name: 'Venice', postalAreas: ['30121','30122','30123','30124'] },
      { name: 'Verona', postalAreas: ['37121','37122','37123','37124'] },
      { name: 'Padua', postalAreas: ['35121','35122','35123'] },
    ]},
    { code: 'IT-CAM', name: 'Campania', cities: [
      { name: 'Naples', postalAreas: ['80121','80122','80133','80138'] },
      { name: 'Salerno', postalAreas: ['84121','84122','84123'] },
    ]},
  ],

  PH: [
    { code: 'PH-NCR', name: 'Metro Manila (NCR)', cities: [
      { name: 'Makati CBD', postalAreas: ['1200','1226','1227','1229'] },
      { name: 'BGC (Taguig)', postalAreas: ['1634','1630','1637'] },
      { name: 'Quezon City', postalAreas: ['1100','1101','1108','1128'] },
      { name: 'Manila', postalAreas: ['1000','1001','1002','1003'] },
      { name: 'Pasig', postalAreas: ['1600','1605','1607'] },
      { name: 'Mandaluyong', postalAreas: ['1550','1552','1555'] },
    ]},
    { code: 'PH-VII', name: 'Central Visayas', cities: [
      { name: 'Cebu City', postalAreas: ['6000','6001','6002'] },
      { name: 'Mandaue', postalAreas: ['6014','6015','6016'] },
      { name: 'Lapu-Lapu', postalAreas: ['6015','6016','6054'] },
    ]},
    { code: 'PH-XI', name: 'Davao Region', cities: [
      { name: 'Davao City', postalAreas: ['8000','8001','8002'] },
    ]},
    { code: 'PH-III', name: 'Central Luzon', cities: [
      { name: 'Clark / Angeles', postalAreas: ['2009','2023','2010'] },
      { name: 'San Fernando', postalAreas: ['2000','2002'] },
    ]},
  ],

  PK: [
    { code: 'PK-PB', name: 'Punjab', cities: [
      { name: 'Lahore', postalAreas: ['54000','54500','54600','54700','54800'] },
      { name: 'Faisalabad', postalAreas: ['38000','38800','37000'] },
      { name: 'Rawalpindi', postalAreas: ['46000','46300','46200'] },
      { name: 'Gujranwala', postalAreas: ['52250','52000'] },
    ]},
    { code: 'PK-SD', name: 'Sindh', cities: [
      { name: 'Karachi', postalAreas: ['75500','75600','74200','74400'] },
      { name: 'Hyderabad', postalAreas: ['71000','71100','71600'] },
      { name: 'Sukkur', postalAreas: ['65200','65300'] },
    ]},
    { code: 'PK-KP', name: 'Khyber Pakhtunkhwa', cities: [
      { name: 'Peshawar', postalAreas: ['25000','25001','25100'] },
      { name: 'Abbottabad', postalAreas: ['22010','22020'] },
    ]},
    { code: 'PK-IS', name: 'Islamabad Capital Territory', cities: [
      { name: 'Islamabad Blue Area', postalAreas: ['44000','44220','44230'] },
      { name: 'F-7 / F-8', postalAreas: ['44000','44090'] },
      { name: 'DHA Islamabad', postalAreas: ['44000','44100'] },
    ]},
  ],
  CN: [
    { code: 'GD', name: 'Guangdong', cities: [
      { name: 'Shenzhen', postalAreas: ['518000','518001','518100'] },
      { name: 'Guangzhou', postalAreas: ['510000','510001','510100'] },
      { name: 'Dongguan', postalAreas: ['523000','523001','523100'] },
      { name: 'Foshan', postalAreas: ['528000','528001','528100'] },
      { name: 'Zhuhai', postalAreas: ['519000','519001','519100'] },
    ]},
    { code: 'SH', name: 'Shanghai', cities: [
      { name: 'Shanghai Puxi', postalAreas: ['200000','200001','200002'] },
      { name: 'Shanghai Pudong', postalAreas: ['200120','200121','200122'] },
      { name: 'Minhang', postalAreas: ['201100','201101','201102'] },
    ]},
    { code: 'BJ', name: 'Beijing', cities: [
      { name: 'Beijing CBD', postalAreas: ['100000','100001','100020'] },
      { name: 'Zhongguancun', postalAreas: ['100080','100081','100082'] },
      { name: 'Chaoyang', postalAreas: ['100020','100021','100022'] },
    ]},
    { code: 'ZJ', name: 'Zhejiang', cities: [
      { name: 'Hangzhou', postalAreas: ['310000','310001','310002'] },
      { name: 'Ningbo', postalAreas: ['315000','315001','315100'] },
      { name: 'Wenzhou', postalAreas: ['325000','325001','325100'] },
      { name: 'Yiwu', postalAreas: ['322000','322001','322100'] },
    ]},
    { code: 'JS', name: 'Jiangsu', cities: [
      { name: 'Nanjing', postalAreas: ['210000','210001','210002'] },
      { name: 'Suzhou', postalAreas: ['215000','215001','215100'] },
      { name: 'Wuxi', postalAreas: ['214000','214001','214100'] },
    ]},
    { code: 'SC', name: 'Sichuan', cities: [
      { name: 'Chengdu', postalAreas: ['610000','610001','610041'] },
      { name: 'Mianyang', postalAreas: ['621000','621001','621100'] },
    ]},
    { code: 'HB', name: 'Hubei', cities: [
      { name: 'Wuhan', postalAreas: ['430000','430001','430070'] },
      { name: 'Yichang', postalAreas: ['443000','443001','443100'] },
    ]},
    { code: 'SN', name: 'Shaanxi', cities: [
      { name: "Xi'an", postalAreas: ['710000','710001','710054'] },
      { name: 'Xianyang', postalAreas: ['712000','712001','712100'] },
    ]},
    { code: 'CQ', name: 'Chongqing', cities: [
      { name: 'Chongqing Central', postalAreas: ['400000','400001','400020'] },
      { name: 'Jiangbei', postalAreas: ['400020','400021','400022'] },
    ]},
    { code: 'FJ', name: 'Fujian', cities: [
      { name: 'Xiamen', postalAreas: ['361000','361001','361100'] },
      { name: 'Fuzhou', postalAreas: ['350000','350001','350100'] },
      { name: 'Quanzhou', postalAreas: ['362000','362001','362100'] },
    ]},
  ],
  ID: [
    { code: 'JK', name: 'DKI Jakarta', cities: [
      { name: 'Jakarta Pusat', postalAreas: ['10000','10110','10120'] },
      { name: 'Jakarta Selatan', postalAreas: ['12000','12110','12160'] },
      { name: 'Jakarta Barat', postalAreas: ['11000','11110','11140'] },
    ]},
    { code: 'JB', name: 'Jawa Barat', cities: [
      { name: 'Bandung', postalAreas: ['40111','40112','40113'] },
      { name: 'Bekasi', postalAreas: ['17110','17111','17112'] },
      { name: 'Depok', postalAreas: ['16411','16412','16413'] },
      { name: 'Bogor', postalAreas: ['16111','16112','16113'] },
    ]},
    { code: 'JT', name: 'Jawa Tengah', cities: [
      { name: 'Semarang', postalAreas: ['50111','50112','50113'] },
      { name: 'Solo', postalAreas: ['57111','57112','57113'] },
      { name: 'Yogyakarta', postalAreas: ['55111','55112','55113'] },
    ]},
    { code: 'JI', name: 'Jawa Timur', cities: [
      { name: 'Surabaya', postalAreas: ['60111','60112','60113'] },
      { name: 'Malang', postalAreas: ['65111','65112','65113'] },
      { name: 'Sidoarjo', postalAreas: ['61211','61212','61213'] },
    ]},
    { code: 'BA', name: 'Bali', cities: [
      { name: 'Denpasar', postalAreas: ['80111','80112','80113'] },
      { name: 'Badung', postalAreas: ['80351','80352','80353'] },
      { name: 'Ubud', postalAreas: ['80571','80572','80573'] },
    ]},
    { code: 'SU', name: 'Sumatera Utara', cities: [
      { name: 'Medan', postalAreas: ['20111','20112','20113'] },
      { name: 'Binjai', postalAreas: ['20711','20712','20713'] },
    ]},
    { code: 'SN', name: 'Sulawesi Selatan', cities: [
      { name: 'Makassar', postalAreas: ['90111','90112','90113'] },
      { name: 'Parepare', postalAreas: ['91111','91112','91113'] },
    ]},
    { code: 'KT', name: 'Kalimantan Timur', cities: [
      { name: 'Balikpapan', postalAreas: ['76111','76112','76113'] },
      { name: 'Samarinda', postalAreas: ['75111','75112','75113'] },
    ]},
  ],
};

/**
 * Returns regions for a given country code.
 * US uses the main geoData.js states list.
 */
function getRegionsForCountry(countryCode) {
  return INTERNATIONAL_REGIONS[countryCode] || [];
}

/**
 * Returns cities for a given country + region code.
 */
function getCitiesForRegion(countryCode, regionCode) {
  const regions = INTERNATIONAL_REGIONS[countryCode] || [];
  const region = regions.find(r => r.code === regionCode);
  return region ? region.cities : [];
}

/**
 * Returns postal areas for a given country + region + city.
 */
function getPostalAreasForCity(countryCode, regionCode, cityName) {
  const cities = getCitiesForRegion(countryCode, regionCode);
  const city = cities.find(c => c.name === cityName);
  return city ? city.postalAreas : [];
}

/**
 * Returns country name for a given code.
 */
function getCountryName(countryCode) {
  const country = COUNTRIES.find(c => c.code === countryCode);
  return country ? country.name.replace(/\s🇦-🇿🇦-🇿/g, '').trim() : countryCode;
}

module.exports = {
  COUNTRIES,
  INTERNATIONAL_REGIONS,
  getRegionsForCountry,
  getCitiesForRegion,
  getPostalAreasForCity,
  getCountryName,
};
