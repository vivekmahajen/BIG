'use strict';

const INDONESIA_PROVINCES = {
  JK: { name: 'DKI Jakarta', gdp: '3.55 trillion IDR', majorCities: ['Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Barat'], economicProfile: 'National capital, financial center, largest consumer market, startup ecosystem (GoTo, Tokopedia HQ), highest purchasing power' },
  JB: { name: 'Jawa Barat', gdp: '2.14 trillion IDR', majorCities: ['Bandung', 'Bekasi', 'Depok', 'Bogor', 'Cirebon'], economicProfile: 'Largest province by population, manufacturing corridor (Karawang), university city (Bandung/ITB), strong creative economy' },
  JT: { name: 'Jawa Tengah', gdp: '1.37 trillion IDR', majorCities: ['Semarang', 'Solo', 'Yogyakarta', 'Magelang', 'Purwokerto'], economicProfile: 'Batik/textile heritage, tourism (Borobudur/Prambanan), garment manufacturing, agricultural trade, growing e-commerce adoption' },
  JI: { name: 'Jawa Timur', gdp: '2.33 trillion IDR', majorCities: ['Surabaya', 'Malang', 'Sidoarjo', 'Gresik', 'Jember'], economicProfile: 'Second largest economy, Surabaya port city, manufacturing/agro-industry, strong SME culture, petrochemicals' },
  YO: { name: 'DI Yogyakarta', gdp: '0.11 trillion IDR', majorCities: ['Yogyakarta', 'Sleman', 'Bantul', 'Kulon Progo'], economicProfile: 'University city (UGM/UII), tourism hub, batik/craft economy, creative industries, student entrepreneur culture' },
  BT: { name: 'Banten', gdp: '0.68 trillion IDR', majorCities: ['Tangerang', 'Serang', 'Cilegon', 'Tangerang Selatan'], economicProfile: 'Industrial corridor (Cilegon steel), tech startups (BSD City/Tangerang), airport hub (Soetta), real estate development' },
  BA: { name: 'Bali', gdp: '0.26 trillion IDR', majorCities: ['Denpasar', 'Badung', 'Gianyar', 'Ubud', 'Seminyak'], economicProfile: 'Global tourism destination, hospitality economy, digital nomad hub, arts/crafts export, international F&B scene' },
  SU: { name: 'Sumatera Utara', gdp: '0.89 trillion IDR', majorCities: ['Medan', 'Binjai', 'Pematangsiantar', 'Tebing Tinggi'], economicProfile: 'Largest Sumatra economy, palm oil/rubber agribusiness, Medan trade hub, growing logistics and manufacturing' },
  SS: { name: 'Sumatera Selatan', gdp: '0.44 trillion IDR', majorCities: ['Palembang', 'Lubuklinggau', 'Prabumulih', 'Pagar Alam'], economicProfile: 'Coal/oil resources, pempek food culture (Palembang), river port economy, agro-processing' },
  RI: { name: 'Riau', gdp: '0.72 trillion IDR', majorCities: ['Pekanbaru', 'Dumai', 'Bengkalis', 'Rokan Hilir'], economicProfile: 'Palm oil heartland, petroleum industry, border economy with Malaysia/Singapore, Batam-proximate logistics' },
  LA: { name: 'Lampung', gdp: '0.36 trillion IDR', majorCities: ['Bandar Lampung', 'Metro', 'Pringsewu', 'Kotabumi'], economicProfile: 'Gateway to Sumatra, agricultural surplus (coffee/cassava/pepper), transmigration settlement economy, growing logistics hub' },
  SN: { name: 'Sulawesi Selatan', gdp: '0.57 trillion IDR', majorCities: ['Makassar', 'Parepare', 'Palopo', 'Bone'], economicProfile: 'Eastern Indonesia hub, Makassar trade center, seafood/cocoa exports, strong Bugis trader culture, growing tourism' },
  KT: { name: 'Kalimantan Timur', gdp: '0.79 trillion IDR', majorCities: ['Balikpapan', 'Samarinda', 'Bontang', 'Kutai Kartanegara'], economicProfile: 'New national capital (Nusantara IKN), coal/palm oil resources, Balikpapan oil refinery, massive infrastructure investment' },
  KB: { name: 'Kalimantan Barat', gdp: '0.24 trillion IDR', majorCities: ['Pontianak', 'Singkawang', 'Sanggau', 'Ketapang'], economicProfile: 'Malaysia border trade, palm oil plantation, rubber industry, Chinese-heritage trading community in Singkawang' },
  PA: { name: 'Papua', gdp: '0.23 trillion IDR', majorCities: ['Jayapura', 'Timika', 'Sorong', 'Merauke'], economicProfile: 'Resource-rich (Freeport mining), government investment region, emerging agro-industry, strategic development zone' },
};

const KBLI_INDUSTRY_MAP = {
  food: { code: '10000–12000', name: 'Industri Makanan dan Minuman', description: 'Food and beverage manufacturing and processing' },
  retail: { code: '47000', name: 'Perdagangan Eceran', description: 'Retail trade — toko, warung, online shop' },
  tech: { code: '62000', name: 'Aktivitas Pemrograman, Konsultansi Komputer', description: 'IT services, software development, digital consulting' },
  health: { code: '86000', name: 'Aktivitas Kesehatan Manusia', description: 'Human health activities — klinik, apotek, laboratorium' },
  education: { code: '85000', name: 'Pendidikan', description: 'Education — sekolah, les privat, kursus/pelatihan' },
  beauty: { code: '96021', name: 'Salon Kecantikan', description: 'Beauty salons and hairdressing services' },
  fitness: { code: '93110', name: 'Aktivitas Olahraga', description: 'Sports and fitness facilities' },
  construction: { code: '41000', name: 'Konstruksi Gedung', description: 'Building construction and property development' },
  transport: { code: '49000', name: 'Angkutan Darat', description: 'Land transport — ojek, travel, cargo' },
  agriculture: { code: '01000–03000', name: 'Pertanian, Kehutanan, Perikanan', description: 'Farming, forestry, and fisheries' },
  manufacturing: { code: '28000', name: 'Industri Mesin dan Perlengkapan', description: 'Machinery and equipment manufacturing' },
  finance: { code: '64000–66000', name: 'Jasa Keuangan', description: 'Financial services including koperasi and microfinance' },
  hospitality: { code: '56000', name: 'Penyajian Makanan dan Minuman', description: 'Restaurant, warung, katering, food stall' },
  ecommerce: { code: '47911', name: 'Perdagangan Melalui Internet', description: 'E-commerce via Tokopedia, Shopee, TikTok Shop' },
  media: { code: '73000', name: 'Periklanan dan Riset Pasar', description: 'Advertising, content creation, market research' },
};

const GOVT_PROGRAMS = {
  KUR_MIKRO: { name: 'KUR Mikro', limit: 'Up to Rp 100 juta', rate: '6% per year', description: 'Kredit Usaha Rakyat for micro businesses, no collateral required for amounts under Rp 50 juta' },
  KUR_KECIL: { name: 'KUR Kecil', limit: 'Up to Rp 500 juta', rate: '6% per year', description: 'KUR for small businesses with business track record of minimum 6 months' },
  KUR_SUPER_MIKRO: { name: 'KUR Super Mikro', limit: 'Up to Rp 10 juta', rate: '0% (subsidized)', description: 'Ultra-micro credit for first-time borrowers and informal sector workers' },
  BPUM: { name: 'BPUM', limit: 'Rp 2.4 juta grant', rate: 'Grant (no repayment)', description: 'Bantuan Produktif Usaha Mikro — cash grant for micro businesses affected by economic shocks' },
  PNM_MEKAAR: { name: 'PNM Mekaar', limit: 'Rp 2–25 juta', rate: 'Group lending model', description: 'Permodalan Nasional Madani — group-based microfinance for women entrepreneurs' },
  PEMBIAYAAN_UMI: { name: 'Pembiayaan UMi', limit: 'Up to Rp 20 juta', rate: '3% per year', description: 'Ultra-micro financing from government for businesses too small for KUR' },
};

function getRelevantPrograms(sector, revenue) {
  const programs = [];
  programs.push(GOVT_PROGRAMS.KUR_SUPER_MIKRO);
  programs.push(GOVT_PROGRAMS.KUR_MIKRO);
  if (revenue > 300000000) programs.push(GOVT_PROGRAMS.KUR_KECIL);
  programs.push(GOVT_PROGRAMS.BPUM);
  programs.push(GOVT_PROGRAMS.PNM_MEKAAR);
  return programs;
}

function getIndonesiaProvinceByCode(code) {
  return INDONESIA_PROVINCES[code] || null;
}

module.exports = {
  INDONESIA_PROVINCES,
  KBLI_INDUSTRY_MAP,
  GOVT_PROGRAMS,
  getRelevantPrograms,
  getIndonesiaProvinceByCode,
};
