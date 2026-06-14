'use strict';

const CHINA_PROVINCES = {
  GD: { name: 'Guangdong', tier: 'Tier 1 Province', gdp: '13.57 trillion CNY', majorCities: ['Shenzhen', 'Guangzhou', 'Dongguan', 'Foshan'], economicProfile: 'Manufacturing hub, tech innovation (Shenzhen Silicon Valley), export powerhouse, Pearl River Delta economy' },
  JS: { name: 'Jiangsu', tier: 'Tier 1 Province', gdp: '12.29 trillion CNY', majorCities: ['Nanjing', 'Suzhou', 'Wuxi', 'Changzhou'], economicProfile: 'Yangtze River Delta, advanced manufacturing, pharma/biotech, high-tech industries' },
  ZJ: { name: 'Zhejiang', tier: 'Tier 1 Province', gdp: '8.07 trillion CNY', majorCities: ['Hangzhou', 'Ningbo', 'Wenzhou', 'Yiwu'], economicProfile: 'E-commerce capital (Alibaba HQ Hangzhou), private enterprise culture, commodity trading (Yiwu), strong SME ecosystem' },
  SH: { name: 'Shanghai', tier: 'Tier 1 Municipality', gdp: '4.72 trillion CNY', majorCities: ['Shanghai Puxi', 'Shanghai Pudong', 'Minhang', 'Jiading'], economicProfile: 'China financial center, luxury/retail hub, international business gateway, free trade zone (FTZ)' },
  BJ: { name: 'Beijing', tier: 'Tier 1 Municipality', gdp: '4.16 trillion CNY', majorCities: ['Beijing CBD', 'Zhongguancun', 'Haidian', 'Chaoyang'], economicProfile: 'Political capital, tech/AI hub (Zhongguancun Silicon Valley), HQ economy, strong consumer market' },
  SD: { name: 'Shandong', tier: 'Tier 2 Province', gdp: '9.22 trillion CNY', majorCities: ['Qingdao', 'Jinan', 'Yantai', 'Weifang'], economicProfile: 'Heavy industry, agriculture, port economy (Qingdao), consumer goods manufacturing' },
  SC: { name: 'Sichuan', tier: 'Tier 2 Province', gdp: '6.01 trillion CNY', majorCities: ['Chengdu', 'Mianyang', 'Leshan', 'Nanchong'], economicProfile: 'Western China hub, Chengdu tech/startup scene, food culture, tourist economy, electronics manufacturing' },
  HA: { name: 'Henan', tier: 'Tier 2 Province', gdp: '5.89 trillion CNY', majorCities: ['Zhengzhou', 'Luoyang', 'Kaifeng', 'Anyang'], economicProfile: 'Transportation crossroads, logistics hub (Zhengzhou), food processing, manufacturing' },
  HB: { name: 'Hubei', tier: 'Tier 2 Province', gdp: '5.37 trillion CNY', majorCities: ['Wuhan', 'Yichang', 'Xiangyang', 'Jingzhou'], economicProfile: 'Central China hub, Wuhan automotive/education city, optics valley tech cluster' },
  FJ: { name: 'Fujian', tier: 'Tier 2 Province', gdp: '5.31 trillion CNY', majorCities: ['Fuzhou', 'Xiamen', 'Quanzhou', 'Zhangzhou'], economicProfile: 'Cross-strait trade with Taiwan, e-commerce (Quanzhou), port economy, overseas Chinese investment' },
  CQ: { name: 'Chongqing', tier: 'Tier 1 Municipality', gdp: '3.00 trillion CNY', majorCities: ['Chongqing Central', 'Jiangbei', 'Shapingba', 'Yubei'], economicProfile: 'Inland trade gateway, automobile manufacturing, digital economy, Yangtze River logistics hub' },
  HN: { name: 'Hunan', tier: 'Tier 2 Province', gdp: '4.61 trillion CNY', majorCities: ['Changsha', 'Zhuzhou', 'Xiangtan', 'Hengyang'], economicProfile: 'Media/entertainment (Changsha), construction equipment, agriculture, emerging tech cluster' },
  GX: { name: 'Guangxi', tier: 'Tier 3 Province', gdp: '2.62 trillion CNY', majorCities: ['Nanning', 'Guilin', 'Liuzhou', 'Beihai'], economicProfile: 'ASEAN gateway, tourism (Guilin karst landscape), sugar production, cross-border trade with Vietnam' },
  YN: { name: 'Yunnan', tier: 'Tier 3 Province', gdp: '2.95 trillion CNY', majorCities: ['Kunming', 'Dali', 'Lijiang', 'Xishuangbanna'], economicProfile: 'Tourism hub, biodiversity economy, Southeast Asia gateway, flower/tea exports, growing tech sector' },
  SN: { name: 'Shaanxi', tier: 'Tier 2 Province', gdp: '3.23 trillion CNY', majorCities: ["Xi'an", 'Baoji', 'Xianyang', 'Tongchuan'], economicProfile: "Ancient capital (Xi'an), aerospace/defense, energy sector, tourism (Terracotta Warriors), university town" },
  AH: { name: 'Anhui', tier: 'Tier 2 Province', gdp: '4.50 trillion CNY', majorCities: ['Hefei', 'Wuhu', 'Bengbu', 'Ma anshan'], economicProfile: 'Emerging tech hub (Hefei AI), EV manufacturing, steel/auto parts, Yangtze River Delta integration' },
  HI: { name: 'Hainan', tier: 'Special Region', gdp: '0.69 trillion CNY', majorCities: ['Haikou', 'Sanya', 'Wenchang', 'Qionghai'], economicProfile: 'China free trade port, tourism (Sanya resort), duty-free retail, tropical agriculture, emerging offshore finance' },
  LN: { name: 'Liaoning', tier: 'Tier 2 Province', gdp: '3.00 trillion CNY', majorCities: ['Shenyang', 'Dalian', 'Fushun', 'Anshan'], economicProfile: 'Northeast industrial base, port economy (Dalian), heavy equipment, shipbuilding, transitioning to tech services' },
  JX: { name: 'Jiangxi', tier: 'Tier 3 Province', gdp: '3.23 trillion CNY', majorCities: ['Nanchang', 'Ganzhou', 'Jingdezhen', 'Jiujiang'], economicProfile: 'Porcelain heritage (Jingdezhen), copper/rare earth resources, logistics corridor, growing EV/electronics' },
};

const CITY_TIERS = {
  'Shanghai': 'Tier 1', 'Beijing': 'Tier 1', 'Shenzhen': 'Tier 1', 'Guangzhou': 'Tier 1',
  'Chengdu': 'New Tier 1', 'Hangzhou': 'New Tier 1', 'Wuhan': 'New Tier 1', "Xi'an": 'New Tier 1',
  'Nanjing': 'New Tier 1', 'Chongqing': 'New Tier 1', 'Tianjin': 'New Tier 1',
  'Suzhou': 'New Tier 1', 'Zhengzhou': 'New Tier 1', 'Changsha': 'New Tier 1', 'Dongguan': 'New Tier 1',
  'Foshan': 'Tier 2', 'Qingdao': 'Tier 2', 'Ningbo': 'Tier 2', 'Shenyang': 'Tier 2', 'Dalian': 'Tier 2',
  'Fuzhou': 'Tier 2', 'Xiamen': 'Tier 2', 'Jinan': 'Tier 2', 'Hefei': 'Tier 2', 'Kunming': 'Tier 2',
};

const GBT_INDUSTRY_MAP = {
  food: { code: 'C1300–C1490', name: '农副食品加工业/食品制造业', description: 'Agricultural food processing & food manufacturing' },
  retail: { code: 'F5200', name: '零售业', description: 'Retail trade — physical and online' },
  tech: { code: 'I6500', name: '软件和信息技术服务业', description: 'Software and IT services' },
  health: { code: 'Q8310–Q8320', name: '医院/基层医疗卫生机构', description: 'Hospitals, clinics, and primary healthcare' },
  education: { code: 'P8200', name: '教育', description: 'Education services including training/tutoring' },
  beauty: { code: 'S8050', name: '理发及美容服务', description: 'Hair salons and beauty services' },
  fitness: { code: 'R9000', name: '体育', description: 'Sports, fitness, and recreational services' },
  construction: { code: 'E4700', name: '房屋建筑业', description: 'Building construction' },
  transport: { code: 'G5400–G5600', name: '道路运输业', description: 'Road and freight transport services' },
  agriculture: { code: 'A0100–A0300', name: '农业/林业/牧业/渔业', description: 'Farming, forestry, animal husbandry, fishing' },
  manufacturing: { code: 'C2600–C2900', name: '电气机械及器材制造', description: 'Electrical machinery and equipment manufacturing' },
  finance: { code: 'J6600–J6700', name: '银行业/证券业', description: 'Banking and financial services' },
  hospitality: { code: 'H6200', name: '餐饮业', description: 'Food service and restaurants' },
  ecommerce: { code: 'F5200', name: '互联网销售', description: 'Online retail and e-commerce' },
  media: { code: 'I6400', name: '互联网和相关服务', description: 'Internet and related services' },
};

function detectCityTier(city) {
  return CITY_TIERS[city] || 'Tier 3';
}

function getChinaProvinceByCode(code) {
  return CHINA_PROVINCES[code] || null;
}

module.exports = {
  CHINA_PROVINCES,
  GBT_INDUSTRY_MAP,
  detectCityTier,
  getChinaProvinceByCode,
};
