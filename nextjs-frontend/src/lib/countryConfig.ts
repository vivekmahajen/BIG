export interface CountryHubConfig {
  code: string;
  name: string;
  slug: string;           // URL path under /opportunity/
  flag: string;
  currency: string;
  symbol: string;
  locale: string;
  hreflang: string;
  headline: string;
  subheadline: string;
  marketStat: string;     // e.g. "63M MSMEs"
  searchVolume: string;   // e.g. "14,800 searches/month"
  topKeyword: string;     // e.g. "startup ideas India"
  registrationBody: string;
  registrationUrl: string;
  primaryStructures: string[];
  grantPrograms: { name: string; desc: string }[];
  platforms: string[];
  topSectors: { label: string; icon: string; why: string }[];
  faqs: { q: string; a: string }[];
  appUrl: string;         // link back to the app with ?country=XX
}

const APP_BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://big-eosin.vercel.app';

export const COUNTRY_HUBS: Record<string, CountryHubConfig> = {
  IN: {
    code: 'IN', name: 'India', slug: 'in', flag: '🇮🇳',
    currency: 'INR', symbol: '₹', locale: 'en_IN', hreflang: 'en-IN',
    headline: 'Business Ideas in India 2025',
    subheadline: '100+ AI-analysed opportunities across 28 states — from ₹50K to ₹5 crore investment',
    marketStat: '63M MSMEs · World\'s 5th-largest economy · 1.4B consumers',
    searchVolume: '14,800 searches/month',
    topKeyword: 'startup ideas India',
    registrationBody: 'Udyam Portal (MSME) + MCA21',
    registrationUrl: 'https://udyamregistration.gov.in',
    primaryStructures: ['Sole Proprietorship', 'One Person Company (OPC)', 'Private Limited (Pvt Ltd)', 'LLP', 'Partnership Firm'],
    grantPrograms: [
      { name: 'MUDRA Loan', desc: 'Up to ₹10 lakh collateral-free via Shishu/Kishore/Tarun tiers. Apply at any bank or MUDRA portal.' },
      { name: 'PMEGP', desc: 'Prime Minister\'s Employment Generation Programme — up to 35% capital subsidy on projects up to ₹50 lakh.' },
      { name: 'Stand-Up India', desc: 'Greenfield enterprise loans of ₹10 lakh–₹1 crore for SC/ST and women entrepreneurs.' },
      { name: 'Startup India', desc: 'Tax exemption, fast-track patent, and funding support for DPIIT-recognised startups.' },
    ],
    platforms: ['WhatsApp Business', 'Meesho', 'Flipkart Seller Hub', 'Amazon.in', 'GeM Portal (B2G)', 'Swiggy/Zomato (food)', 'Urban Company (services)'],
    topSectors: [
      { label: 'Technology & EdTech', icon: '💻', why: 'India\'s 600M+ internet users and 50M+ college students create massive demand for affordable digital tools and skilling platforms.' },
      { label: 'Food Processing', icon: '🌾', why: '40% of India\'s fresh produce is wasted post-harvest — cold chain, processing, and agri-logistics are a ₹50,000 crore opportunity.' },
      { label: 'Healthcare & Diagnostics', icon: '🏥', why: 'Doctor-to-patient ratio of 1:1,511 (vs. WHO norm of 1:1,000) — diagnostic centres, teleconsultation, and home healthcare are chronically underserved.' },
      { label: 'Renewable Energy', icon: '☀️', why: 'India\'s 500 GW renewable target by 2030 means solar installation, maintenance, and financing services are in decade-long demand.' },
      { label: 'D2C Retail', icon: '📦', why: '650M Tier-2/3 city residents are first-time online shoppers — building D2C brands in apparel, home goods, and personal care is a greenfield market.' },
      { label: 'EV Services', icon: '⚡', why: 'India crossed 1.5M EV sales in 2024; charging infrastructure, repair workshops, and battery swap networks are critically needed in every city.' },
    ],
    faqs: [
      { q: 'What is the easiest business to start in India with low investment?', a: 'Service businesses (tutoring, consulting, freelancing), food tiffin services, and dropshipping via Meesho can start with under ₹1 lakh. Register as a Sole Proprietorship and get Udyam MSME certification for priority banking access.' },
      { q: 'How do I register a business in India?', a: 'For a micro business: (1) Udyam registration at udyamregistration.gov.in (free, Aadhaar-based). (2) GST registration if turnover >₹20 lakh (services) or ₹40 lakh (goods). (3) Shop & Establishment Act registration at your state labour department.' },
      { q: 'What government loans are available for small businesses in India?', a: 'MUDRA Loan (up to ₹10 lakh, collateral-free) is the most accessible — available at all PSU banks, private banks, and NBFCs. PMEGP offers up to 35% capital subsidy. Apply online at mudra.org.in or your nearest bank branch.' },
      { q: 'Which Indian states are best for starting a business?', a: 'Maharashtra (Mumbai — finance/tech), Karnataka (Bengaluru — startup ecosystem), Tamil Nadu (manufacturing), Gujarat (trade/entrepreneurship culture), Telangana (Hyderabad — IT/pharma), Delhi NCR (consumer/services). Each state has sector-specific incentives.' },
    ],
    appUrl: `${APP_BASE}/?country=IN`,
  },

  ID: {
    code: 'ID', name: 'Indonesia', slug: 'id', flag: '🇮🇩',
    currency: 'IDR', symbol: 'Rp', locale: 'id_ID', hreflang: 'id',
    headline: 'Ide Bisnis Indonesia 2025',
    subheadline: 'Peluang usaha terbaik di 38 provinsi — dari Rp 5 juta hingga Rp 5 miliar',
    marketStat: '65M UMKMs · Ekonomi terbesar di ASEAN · 270M konsumen',
    searchVolume: '6,600 searches/month',
    topKeyword: 'peluang bisnis Indonesia',
    registrationBody: 'OSS-RBA (oss.go.id) untuk NIB',
    registrationUrl: 'https://oss.go.id',
    primaryStructures: ['Usaha Perseorangan', 'CV (Commanditaire Vennootschap)', 'PT (Perseroan Terbatas)', 'PT Perorangan (1-person PT)'],
    grantPrograms: [
      { name: 'KUR Mikro', desc: 'Kredit Usaha Rakyat — hingga Rp 100 juta, bunga 6% per tahun. Tersedia di BRI, BNI, Mandiri, dan bank lainnya.' },
      { name: 'KUR Kecil', desc: 'Hingga Rp 500 juta, bunga 6% per tahun, untuk usaha yang sudah berjalan minimal 6 bulan.' },
      { name: 'BPUM', desc: 'Bantuan Produktif Usaha Mikro — hibah langsung Rp 600 ribu–1,2 juta untuk pengusaha mikro terdaftar.' },
      { name: 'PNM Mekaar', desc: 'Program pembiayaan perempuan pengusaha ultra-mikro — pinjaman Rp 2–10 juta tanpa agunan.' },
    ],
    platforms: ['Tokopedia', 'Shopee ID', 'TikTok Shop', 'Lazada ID', 'GoFood/Gojek', 'GrabFood', 'Bukalapak', 'Blibli'],
    topSectors: [
      { label: 'Kuliner & F&B', icon: '🍜', why: 'Indonesia adalah surga kuliner — bisnis makanan rumahan, frozen food, dan cloud kitchen bisa dimulai dengan Rp 5–20 juta.' },
      { label: 'Fashion & Batik', icon: '👗', why: 'Pasar fashion Muslim Indonesia (70% penduduk) senilai $18 miliar/tahun — peluang besar untuk brand lokal yang otentik.' },
      { label: 'Teknologi & SaaS', icon: '💻', why: '212 juta pengguna internet mendorong permintaan solusi digital untuk UMKM — dari kasir digital hingga platform manajemen stok.' },
      { label: 'Agribisnis', icon: '🌴', why: 'Indonesia produsen kelapa sawit, kopi, dan kakao terbesar dunia — pengolahan dan ekspor produk turunannya adalah peluang triliunan rupiah.' },
      { label: 'Jasa & Layanan', icon: '🔧', why: 'Platform seperti Gojek membuktikan permintaan on-demand service — laundry, cleaning, AC service, dan kecantikan mobile terus tumbuh.' },
      { label: 'Pendidikan & EduTech', icon: '📚', why: '57 juta pelajar dan budaya bimbingan belajar yang kuat menciptakan permintaan besar untuk platform edukasi dan les privat.' },
    ],
    faqs: [
      { q: 'Bagaimana cara mendaftar NIB untuk usaha saya?', a: 'Daftar NIB (Nomor Induk Berusaha) secara online di oss.go.id menggunakan akun OSS. Proses gratis dan bisa selesai dalam 1 hari kerja. NIB berlaku sebagai izin usaha dasar untuk usaha mikro dan kecil.' },
      { q: 'Bisnis apa yang paling menguntungkan di Indonesia 2025?', a: 'Bisnis kuliner, jasa digital (content creator, desain grafis), agribisnis, dan layanan berbasis platform (Gojek/Grab partner) memiliki ROI tertinggi untuk modal kecil. BIG menganalisis peluang spesifik per kota dan sektor.' },
      { q: 'Bagaimana cara mendapatkan KUR untuk usaha kecil?', a: 'KUR Mikro (hingga Rp 100 juta, bunga 6%) tersedia di BRI, BNI, Mandiri, dan bank lainnya. Persyaratan: NIB aktif, usaha berjalan minimal 6 bulan, tidak sedang menerima kredit usaha dari bank lain.' },
    ],
    appUrl: `${APP_BASE}/?country=ID`,
  },

  CN: {
    code: 'CN', name: 'China', slug: 'cn', flag: '🇨🇳',
    currency: 'CNY', symbol: '¥', locale: 'zh_CN', hreflang: 'zh-CN',
    headline: '2025年中国创业机会分析',
    subheadline: '覆盖19个省级行政区的商业机会 — 从¥10万到¥1000万投资规模',
    marketStat: '6000万中小企业 · 全球第二大经济体 · 14亿消费者',
    searchVolume: '4,400 searches/month',
    topKeyword: 'small business ideas China',
    registrationBody: '国家市场监督管理局 (GSXT)',
    registrationUrl: 'https://gsxt.gov.cn',
    primaryStructures: ['个体工商户 (Sole Proprietor)', '有限责任公司 LLC (LLC)', '股份有限公司 (Joint-Stock)', 'WFOE (外资独资企业 for foreign investors)'],
    grantPrograms: [
      { name: '小微企业税收优惠', desc: '年应纳税所得额不超过300万元的小型微利企业，所得税率5%-10%。' },
      { name: '专精特新补贴', desc: '专精特新"小巨人"企业可获得最高500万元的政府补贴和优惠贷款。' },
      { name: '创业担保贷款', desc: '个人最高30万元、小微企业最高500万元的政府担保创业贷款，利率优惠。' },
      { name: '西部大开发政策', desc: '在西部省份创业可享受15%优惠企业所得税率及其他政策优惠。' },
    ],
    platforms: ['微信小程序 (WeChat Mini Program)', '抖音小店 (Douyin Shop)', '淘宝/天猫', '京东 (JD.com)', '拼多多', '美团 (local services)', '小红书 (content commerce)', '1688.com (B2B)'],
    topSectors: [
      { label: '直播电商 Live Commerce', icon: '📱', why: '2024年中国直播电商规模超4.9万亿元，大量垂直品类仍处于红利期，中小品牌入场成本持续降低。' },
      { label: '新能源服务', icon: '⚡', why: '中国新能源汽车保有量超2000万辆，充电桩缺口巨大，维修、保养、换电服务需求爆发式增长。' },
      { label: '宠物经济', icon: '🐾', why: '2024年中国宠物市场规模超6000亿元，城市独居青年群体推动高端宠物食品、医疗、寄养需求持续攀升。' },
      { label: '银发经济', icon: '👴', why: '中国60岁以上人口超3亿，养老服务、适老化改造、老年健康管理市场进入万亿规模蓝海。' },
      { label: '跨境电商', icon: '🌐', why: '通过亚马逊、速卖通、TikTok Shop出海，中国中小企业可触达全球消费者，利润率显著高于国内。' },
      { label: '职业培训 & EdTech', icon: '📚', why: '职场技能培训、考证辅导、成人再教育市场规模超8000亿元，线上化程度仍有巨大提升空间。' },
    ],
    faqs: [
      { q: '外国人可以在中国注册公司吗？', a: '可以。外资可注册WFOE（外商独资企业）或合资企业。建议通过专业注册代理办理，流程约需4-8周，注册资本无强制最低要求（实缴制已取消）。' },
      { q: '在中国创业需要哪些手续？', a: '基本流程：(1) 工商注册 — 市场监督管理局核名+提交申请；(2) 税务登记 — 增值税一般纳税人/小规模纳税人登记；(3) 开立公司银行账户；(4) 社保开户。个体工商户最快1天可完成注册。' },
      { q: '中国哪个城市最适合创业？', a: '深圳（科技/硬件/跨境电商）、杭州（直播电商/数字经济）、成都（消费/文化创意）、上海（金融/高端消费/国际市场）、武汉/西安（制造业/高校资源丰富）各有优势。BIG根据具体城市和行业给出精准分析。' },
    ],
    appUrl: `${APP_BASE}/?country=CN`,
  },

  BR: {
    code: 'BR', name: 'Brazil', slug: 'br', flag: '🇧🇷',
    currency: 'BRL', symbol: 'R$', locale: 'pt_BR', hreflang: 'pt-BR',
    headline: 'Ideias de Negócios no Brasil 2025',
    subheadline: 'Oportunidades analisadas por IA em 26 estados — de R$5 mil a R$5 milhões de investimento',
    marketStat: '17.4M micro/pequenas empresas · 15M+ MEIs registrados · 214M consumidores',
    searchVolume: '9,900 searches/month',
    topKeyword: 'business ideas Brazil',
    registrationBody: 'Receita Federal (CNPJ) · MEI via gov.br/mei',
    registrationUrl: 'https://www.gov.br/mei',
    primaryStructures: ['MEI (Microempreendedor Individual)', 'ME (Microempresa)', 'Empresário Individual', 'Sociedade Limitada (Ltda)', 'EIRELI / SLU'],
    grantPrograms: [
      { name: 'BNDES Microcrédito', desc: 'Banco Nacional de Desenvolvimento — linhas de crédito para micro e pequenas empresas a partir de R$2.000 com taxas reduzidas.' },
      { name: 'Pronampe', desc: 'Programa Nacional de Apoio às Microempresas — linha de crédito de até 30% do faturamento anual a 6% a.a.' },
      { name: 'SEBRAE Consultoria', desc: 'Consultoria gratuita, cursos online e presenciais, e acesso a feiras e mercados. sebrae.com.br.' },
      { name: 'Simples Nacional', desc: 'Regime tributário simplificado para empresas com faturamento até R$4,8M/ano — alíquota única de 4–22,5%.' },
    ],
    platforms: ['Mercado Livre (dominante)', 'Shopee BR', 'Amazon.com.br', 'iFood', 'Rappi', 'WhatsApp Business', 'OLX', 'Magazine Luiza / Magalu'],
    topSectors: [
      { label: 'Alimentação & F&B', icon: '🍽️', why: 'Brasil tem a 3ª maior indústria alimentícia do mundo. Dark kitchens, alimentos congelados saudáveis e delivery de nicho são mercados de alto crescimento.' },
      { label: 'Beleza & Estética', icon: '💄', why: 'Brasil é o 4º maior mercado de beleza global. Barbearias premium, clínicas de estética e produtos naturais lideram o crescimento.' },
      { label: 'Agronegócio & AgTech', icon: '🌱', why: 'Brasil é o maior exportador mundial de soja, carne bovina e café. Serviços de consultoria agrícola e tecnologia para o campo têm demanda crescente.' },
      { label: 'Pet Care', icon: '🐾', why: 'Com 149M animais de estimação (3ª maior população pet do mundo), serviços veterinários, pet shop e hotelaria para pets são negócios de alta lucratividade.' },
      { label: 'Energia Solar', icon: '☀️', why: 'O Brasil tem o maior potencial solar da América Latina. Com financiamentos do BNDES, instalação residencial e comercial retorna o investimento em 3–5 anos.' },
      { label: 'Serviços para MEI/PME', icon: '💼', why: '15M+ MEIs precisam de contador, advogado, marketing digital e tecnologia acessíveis — mercado massivo cronicamente mal atendido.' },
    ],
    faqs: [
      { q: 'Como abrir um MEI no Brasil?', a: 'Acesse gov.br/mei, faça login com sua conta gov.br (usando CPF), escolha a atividade econômica (CNAE) e confirme. O processo é gratuito e leva menos de 10 minutos. O MEI permite faturamento de até R$81.000/ano com DAS mensal de ~R$70.' },
      { q: 'Qual negócio é mais lucrativo para começar no Brasil com pouco dinheiro?', a: 'Serviços de beleza (manicure, sobrancelha, barba), delivery de marmitas, revenda via Shopee/Mercado Livre, aulas particulares e serviços de manutenção predial têm baixo investimento inicial e retorno rápido. BIG analisa a oportunidade específica para sua cidade.' },
      { q: 'O que é o Simples Nacional e como funciona?', a: 'O Simples Nacional é um regime tributário simplificado para empresas com faturamento até R$4,8M/ano. Você paga uma única guia DAS mensal que cobre todos os impostos federais, estaduais e municipais. A alíquota varia de 4% a 22,5% dependendo do faturamento e setor.' },
    ],
    appUrl: `${APP_BASE}/?country=BR`,
  },

  DE: {
    code: 'DE', name: 'Germany', slug: 'de', flag: '🇩🇪',
    currency: 'EUR', symbol: '€', locale: 'de_DE', hreflang: 'de',
    headline: 'Business Ideas in Germany 2025',
    subheadline: 'AI-analysed opportunities across 16 federal states — from €5,000 to €500,000 investment',
    marketStat: '3.8M SMEs · 99.4% of all businesses · €4.5T GDP (world\'s 3rd largest)',
    searchVolume: '2,800 searches/month',
    topKeyword: 'business ideas Germany',
    registrationBody: 'Gewerbeamt (trade office) · Handelsregister (commercial register)',
    registrationUrl: 'https://www.ihk.de',
    primaryStructures: ['Einzelunternehmen (Sole Trader)', 'GbR (Civil Partnership)', 'UG haftungsbeschränkt (mini-GmbH, €1 min capital)', 'GmbH (€25K min capital)', 'Freiberufler (Liberal Professions — no trade registration)'],
    grantPrograms: [
      { name: 'KfW Gründerkredit', desc: 'KfW Bank startup loan — up to €100M at subsidised interest rates (from 4.45% p.a.). Apply via your Hausbank.' },
      { name: 'EXIST Gründerstipendium', desc: '€1,000–€3,000/month living allowance + €10,000–€30,000 project budget for university-based startup founders.' },
      { name: 'BAFA Förderung', desc: 'Federal Office for Economic Affairs — consulting vouchers (up to €3,500) and energy efficiency grants.' },
      { name: 'IHK/HWK Beratung', desc: 'Free startup consultations at your local Chamber of Commerce (IHK) or Chamber of Crafts (HWK) — mandatory first stop for new founders.' },
    ],
    platforms: ['Amazon.de (dominant)', 'eBay Kleinanzeigen / eBay.de', 'Otto.de', 'Zalando (fashion)', 'Lieferando (food delivery)', 'ManoMano (DIY)', 'idealo.de (price comparison)'],
    topSectors: [
      { label: 'Handwerk (Skilled Trades)', icon: '🔨', why: 'Germany faces a critical shortage of 250,000+ skilled tradespeople (Handwerker). Electricians, plumbers, carpenters, and HVAC technicians command €80–150/hour and have 6+ month waiting lists.' },
      { label: 'Sustainability Consulting', icon: '🌱', why: 'Germany\'s Energiewende and ESG reporting mandates create massive demand for sustainability audits, carbon offsetting, and green certification consulting for Mittelstand businesses.' },
      { label: 'EV Infrastructure', icon: '⚡', why: 'With 15M EVs projected by 2030, Germany needs 1M charging points (currently 100K). Installation, maintenance, and charging network management are decade-long opportunities.' },
      { label: 'Senior Care (Pflege)', icon: '👴', why: '21M people over 65 (25% of population) and a nursing shortage of 200,000+ workers creates a critical gap in home care, assisted living, and health monitoring services.' },
      { label: 'Digital Tools for Mittelstand', icon: '💻', why: 'Germany\'s 3.5M Mittelstand companies are under-digitised — CRM, ERP, e-commerce, and cybersecurity for SMEs is a €50B+ market with fragmented competition.' },
      { label: 'Cross-Border E-Commerce', icon: '🌐', why: 'German products have a global quality premium (Made in Germany). Export fulfilment, translation services, and marketplaces connecting German Mittelstand to Asia and Americas are growing fast.' },
    ],
    faqs: [
      { q: 'What is the easiest way to start a business in Germany as a foreigner?', a: 'EU citizens can register as Freiberufler (if a qualifying profession) or Einzelunternehmer (sole trader) at the local Finanzamt and Gewerbeamt. Non-EU citizens need a residence permit with self-employment rights. A UG (haftungsbeschränkt) can be formed with just €1 capital via a notary.' },
      { q: 'What is a UG and how is it different from a GmbH?', a: 'A UG (Unternehmergesellschaft) is a mini-GmbH requiring just €1 minimum capital — ideal for startups. It must retain 25% of annual profits until the reserve reaches €25,000, at which point it can be converted to a GmbH. Registration costs ~€300–600 via a notary.' },
      { q: 'How does VAT (Umsatzsteuer) work for small businesses in Germany?', a: 'Businesses under €22,000 annual turnover can use the Kleinunternehmerregelung (small business exemption) — no VAT charged or claimed. Above this threshold, register for Umsatzsteuer (19% standard, 7% reduced) and submit quarterly Voranmeldung to the Finanzamt.' },
      { q: 'What sectors have the most demand in Germany right now?', a: 'Handwerk (trades) has 250,000+ unfilled positions. Pflege (nursing/care) has a 200,000 worker shortage. Sustainability services, digital transformation for SMEs, and EV infrastructure are government-priority growth areas. All have structural demand for 10+ years.' },
    ],
    appUrl: `${APP_BASE}/?country=DE`,
  },

  CA: {
    code: 'CA', name: 'Canada', slug: 'ca', flag: '🇨🇦',
    currency: 'CAD', symbol: 'CAD $', locale: 'en_CA', hreflang: 'en-CA',
    headline: 'Business Ideas in Canada 2025',
    subheadline: 'AI-powered opportunities across 13 provinces and territories — from CAD $5K to CAD $500K',
    marketStat: '1.2M small businesses · 10th-largest economy · 40M consumers',
    searchVolume: '2,400 searches/month',
    topKeyword: 'local market gaps Canada',
    registrationBody: 'Corporations Canada (federal) · Provincial registries',
    registrationUrl: 'https://www.canada.ca/en/services/business.html',
    primaryStructures: ['Sole Proprietorship', 'General Partnership', 'Federal Corporation (Corporations Canada)', 'Provincial Corporation', 'Co-operative'],
    grantPrograms: [
      { name: 'BDC Startup Loan', desc: 'Business Development Bank of Canada — loans from CAD $10,000 for startups with no revenue. Also offers advisory services.' },
      { name: 'CSBFP', desc: 'Canada Small Business Financing Program — up to CAD $1M for equipment and leasehold improvements, government-backed.' },
      { name: 'IRAP', desc: 'Industrial Research Assistance Program — NRC grants (CAD $50K–$500K) for technology-based startups.' },
      { name: 'Provincial Grants', desc: 'Ontario (Starter Company Plus), BC (Futurpreneur), Quebec (FDEQ) — each province offers targeted startup grants.' },
    ],
    platforms: ['Amazon.ca', 'Shopify (Canadian, strong local ecosystem)', 'Kijiji', 'Facebook Marketplace', 'Skip the Dishes / Uber Eats', 'DoorDash CA'],
    topSectors: [
      { label: 'Tech & SaaS', icon: '💻', why: 'Canada\'s strong immigration pipeline (500K+ annually) and tax credits (SR&ED) create a world-class tech talent pool at lower cost than Silicon Valley.' },
      { label: 'Clean Energy', icon: '☀️', why: 'Canada\'s Net Zero 2050 targets and C$9/tonne carbon tax (rising to C$170 by 2030) make solar, wind, EV charging, and energy efficiency services decade-long growth markets.' },
      { label: 'Senior Care & Health', icon: '🏥', why: '23% of Canada\'s population will be 65+ by 2030 — home care, assisted living, and mental health services face critical supply gaps in every province.' },
      { label: 'Food & Agri-Tech', icon: '🌾', why: 'Canada is the world\'s 5th-largest agri-food exporter. Tech-enabled crop monitoring, sustainable packaging, and specialty food processing serve both domestic and export markets.' },
      { label: 'Construction & Trades', icon: '🔨', why: 'Canada needs 300,000 new homes annually through 2030 — electricians, plumbers, HVAC, and project management services have 6–18 month wait times in major cities.' },
      { label: 'Indigenous Business', icon: '🍁', why: 'The Indigenous economy is Canada\'s fastest-growing segment ($32B+ GDP contribution). Cultural tourism, land stewardship services, and Indigenous-led supply chains are underserved and government-prioritised.' },
    ],
    faqs: [
      { q: 'How do I register a small business in Canada?', a: 'Register your business name provincially (e.g., Service Ontario for CAD $60, BC Registry for CAD $31). If incorporating federally, use Corporations Canada online (~CAD $200). Register for GST/HST when annual revenue exceeds CAD $30,000.' },
      { q: 'What government funding is available for Canadian startups?', a: 'BDC offers startup loans with no revenue requirements. CSBFP (government-backed) covers equipment up to CAD $1M. NRC IRAP gives CAD $50K–$500K grants for tech companies. Each province also has targeted programs — Ontario\'s Starter Company Plus gives CAD $5,000 grants.' },
      { q: 'Is it better to incorporate federally or provincially in Canada?', a: 'Federal incorporation (~CAD $200 via Corporations Canada) gives you the right to operate in all provinces under the same name and signals credibility. Provincial incorporation is cheaper and simpler for businesses operating in one province. Most serious startups incorporate federally.' },
    ],
    appUrl: `${APP_BASE}/?country=CA`,
  },

  GB: {
    code: 'GB', name: 'United Kingdom', slug: 'gb', flag: '🇬🇧',
    currency: 'GBP', symbol: '£', locale: 'en_GB', hreflang: 'en-GB',
    headline: 'Small Business Ideas UK 2025',
    subheadline: 'AI-analysed opportunities across England, Scotland, Wales & Northern Ireland — from £2K to £200K',
    marketStat: '5.7M small businesses · 99.9% of all UK businesses · £2.2T GDP',
    searchVolume: '3,200 searches/month',
    topKeyword: 'small business ideas UK',
    registrationBody: 'Companies House (company) · HMRC (sole trader/VAT)',
    registrationUrl: 'https://www.gov.uk/set-up-business',
    primaryStructures: ['Sole Trader (simplest, register with HMRC)', 'Limited Company (Companies House, £12)', 'LLP (for professional firms)', 'Partnership', 'Community Interest Company (CIC)'],
    grantPrograms: [
      { name: 'Start Up Loan', desc: 'Government-backed personal loan of £500–£25,000 at 6% fixed rate for new businesses. Via British Business Bank.' },
      { name: 'Innovate UK Grants', desc: 'Up to £500K for technology and innovation projects. Open calls published quarterly at iuk.ukri.org.' },
      { name: 'Seed Enterprise Investment Scheme (SEIS)', desc: 'Investors get 50% income tax relief on investments up to £200K — makes raising early-stage equity significantly easier.' },
      { name: 'Local Enterprise Partnerships', desc: 'LEPs across England offer grants, loans, and business support tailored to local economic priorities.' },
    ],
    platforms: ['Amazon.co.uk', 'eBay.co.uk', 'Etsy (strong UK seller base)', 'Deliveroo / Uber Eats / Just Eat', 'Gumtree', 'Not on the High Street (gifts/craft)'],
    topSectors: [
      { label: 'Net Zero Services', icon: '🌱', why: 'UK\'s legally binding Net Zero 2050 target means 10+ years of government-backed demand for insulation, heat pumps, solar, and EV charging — with £billions in support schemes.' },
      { label: 'Social Care', icon: '💛', why: 'UK\'s NHS crisis means 7.7M people on waiting lists. Private physiotherapy, mental health, home care, and diagnostic services are in critical short supply.' },
      { label: 'Tech & Digital Services', icon: '💻', why: 'London is Europe\'s largest tech hub. UK businesses that serve US and EU markets through digital services benefit from the £ exchange rate advantage and English language reach.' },
      { label: 'Food & Hospitality', icon: '🍽️', why: 'Post-pandemic food culture boom: food trucks, specialty coffee, plant-based, and experiential dining concepts are outperforming traditional restaurants.' },
      { label: 'Construction & Renovation', icon: '🔨', why: 'UK needs 300,000+ new homes per year (current output: 175,000). Tradespeople are booked 6–12 months ahead in most cities — skilled trades is the UK\'s most reliable business.' },
      { label: 'E-Commerce & D2C', icon: '📦', why: 'UK has the 3rd highest e-commerce spend per capita globally. D2C brands in health, beauty, and sustainable products reach a wealthy, English-speaking market with high LTV.' },
    ],
    faqs: [
      { q: 'How do I register a limited company in the UK?', a: 'Register online at Companies House (companieshouse.gov.uk) for £12 — process takes about 24 hours. You\'ll need a registered address, at least one director, and at least one shareholder. After registration, set up a business bank account and register for Corporation Tax with HMRC.' },
      { q: 'What is the VAT threshold in the UK?', a: 'You must register for VAT when your annual taxable turnover exceeds £85,000 (2024–25 threshold). Once registered, charge 20% VAT on most goods/services, submit quarterly VAT returns, and can reclaim VAT on business purchases. Some supplies are zero-rated (food, books, children\'s clothing).' },
      { q: 'What grants are available for UK startups in 2025?', a: 'The British Business Bank\'s Start Up Loan (£500–£25K at 6% fixed) is the most accessible. Innovate UK offers £25K–£500K for tech companies. The Enterprise Investment Scheme (EIS) and SEIS make equity investment highly attractive for investors. Check your Local Enterprise Partnership for regional grants.' },
    ],
    appUrl: `${APP_BASE}/?country=GB`,
  },

  AU: {
    code: 'AU', name: 'Australia', slug: 'au', flag: '🇦🇺',
    currency: 'AUD', symbol: 'AUD $', locale: 'en_AU', hreflang: 'en-AU',
    headline: 'Business Ideas in Australia 2025',
    subheadline: 'AI-powered opportunities across 8 states and territories — from AUD $5K to AUD $500K',
    marketStat: '2.5M small businesses · World\'s 13th-largest economy · 26M consumers',
    searchVolume: '1,900 searches/month',
    topKeyword: 'small business ideas Australia',
    registrationBody: 'ASIC (company) · ATO (ABN/GST) · Business.gov.au',
    registrationUrl: 'https://abr.gov.au',
    primaryStructures: ['Sole Trader (ABN required)', 'Partnership', 'Pty Ltd Company (ASIC, AUD ~$500/year)', 'Trust (common for asset protection)', 'Co-operative'],
    grantPrograms: [
      { name: 'R&D Tax Incentive', desc: '43.5% refundable tax offset for eligible R&D expenditure for companies with turnover <AUD $20M. Apply via AusIndustry.' },
      { name: 'Export Market Development Grant', desc: 'Austrade reimburses 50% of eligible export marketing expenses up to AUD $150,000/year.' },
      { name: 'NDIA / NDIS Provider Registration', desc: 'Becoming a registered NDIS provider gives access to AUD $43B+/year in disability services funding — highly profitable segment.' },
      { name: 'State Business Grants', desc: 'NSW Business Connect, VIC LaunchVic, QLD Ignite Ideas — each state offers AUD $10K–$250K startup grants with quarterly application windows.' },
    ],
    platforms: ['Amazon.com.au', 'eBay.com.au', 'Gumtree', 'Afterpay (BNPL dominant)', 'Uber Eats / DoorDash / Menulog', 'Catch.com.au', 'MyDeal'],
    topSectors: [
      { label: 'NDIS & Disability Services', icon: '💛', why: 'The National Disability Insurance Scheme funds AUD $43B+/year in disability support services. Registered providers in care, transport, and therapeutic services are in chronic short supply.' },
      { label: 'Construction & Trades', icon: '🔨', why: 'Australia needs 1.2M new homes by 2030. Tradies (electricians, plumbers, builders) are the highest-paid workers in Australian history — demand exceeds supply by 40%.' },
      { label: 'Tourism & Experiences', icon: '🌊', why: 'Australia\'s post-COVID inbound tourism recovery (12M+ annual visitors targeted) creates demand for unique experiences, eco-tourism, and luxury accommodation.' },
      { label: 'AgriTech & Food', icon: '🌾', why: 'Australia is a top-10 global food exporter. Precision agriculture, direct-to-consumer farm produce, and export-oriented specialty food brands are fast-growing.' },
      { label: 'Clean Energy', icon: '☀️', why: 'Australia has the highest residential solar adoption in the world (35%+ of homes). Battery storage, EV charging, and commercial solar installation are in peak demand.' },
      { label: 'Allied Health', icon: '🏥', why: 'Physiotherapy, psychology, dietetics, and occupational therapy have 6–12 month wait times in metro and regional areas — private practice is highly profitable with NDIS and Medicare support.' },
    ],
    faqs: [
      { q: 'How do I get an ABN in Australia?', a: 'Apply online at abr.gov.au using your myGovID — it\'s free and takes about 15 minutes. You need an ABN before you can legally invoice clients. Register for GST (10%) when annual turnover exceeds AUD $75,000. ASIC Pty Ltd registration costs AUD $506/year.' },
      { q: 'What is the NDIS and how can I start an NDIS business?', a: 'The National Disability Insurance Scheme funds support services for 650,000+ Australians with disability. To become a registered NDIS provider, apply through the NDIS Quality and Safeguards Commission (ndiscommission.gov.au). Unregistered providers can offer some support types to self-managed participants immediately.' },
      { q: 'What government grants are available for Australian startups?', a: 'The R&D Tax Incentive gives back 43.5% of R&D spending for eligible companies — the most generous in the OECD. State grants (NSW Business Connect, VIC LaunchVic) offer AUD $10K–$100K. Export Market Development Grants reimburse 50% of export marketing costs up to AUD $150K.' },
    ],
    appUrl: `${APP_BASE}/?country=AU`,
  },

  MX: {
    code: 'MX', name: 'Mexico', slug: 'mx', flag: '🇲🇽',
    currency: 'MXN', symbol: 'MX$', locale: 'es_MX', hreflang: 'es-MX',
    headline: 'Ideas de Negocios en México 2025',
    subheadline: 'Oportunidades analizadas por IA en 32 estados — desde MX$50 mil hasta MX$5 millones',
    marketStat: '4.9M pequeñas empresas · 15ª economía más grande del mundo · 130M consumidores',
    searchVolume: '3,100 searches/month',
    topKeyword: 'business ideas Mexico',
    registrationBody: 'SAT (RFC) · Secretaría de Economía (SE)',
    registrationUrl: 'https://www.sat.gob.mx',
    primaryStructures: ['Persona Física con Actividad Empresarial', 'S. de R.L. de C.V. (LLC)', 'S.A. de C.V. (Joint-Stock)', 'REPSE (Régimen de Personas Morales)'],
    grantPrograms: [
      { name: 'NAFIN Microcrédito', desc: 'Nacional Financiera — créditos desde MX$10,000 a tasas preferenciales para micro y pequeñas empresas.' },
      { name: 'PRONAMYPE', desc: 'Programa Nacional de Microempresas — apoyos de MX$5,000–$30,000 para negocios con menos de 10 empleados.' },
      { name: 'INADEM / SE Convocatorias', desc: 'La Secretaría de Economía publica convocatorias anuales con apoyos de hasta MX$500,000 para proyectos innovadores.' },
      { name: 'IMSS Registro Patronal', desc: 'Registro obligatorio al contratar empleados — permite acceso a crédito INFONAVIT para vivienda de trabajadores como beneficio laboral.' },
    ],
    platforms: ['Mercado Libre (dominante)', 'Amazon.com.mx', 'Rappi', 'Uber Eats', 'WhatsApp Business', 'OLX México', 'Liverpool / Palacio de Hierro (retail)'],
    topSectors: [
      { label: 'Nearshoring & Manufactura', icon: '🏭', why: 'México recibe el mayor flujo de nearshoring de Latinoamérica — 700+ empresas han relocalizado producción de Asia a México. Servicios logísticos, maquila y parques industriales están en demanda histórica.' },
      { label: 'Alimentos & Gastronomía', icon: '🌮', why: 'La gastronomía mexicana es Patrimonio Cultural de la Humanidad. Restaurantes, dark kitchens, exportación de productos gourmet y turismo gastronómico son mercados de alto crecimiento.' },
      { label: 'Fintech & Pagos', icon: '💳', why: '50% de mexicanos no tiene cuenta bancaria — CoDi, OXXO Pay y billeteras digitales están transformando el acceso financiero. Soluciones para los "no bancarizados" atraen inversión masiva.' },
      { label: 'Turismo', icon: '🏖️', why: 'México recibe 40M+ turistas anuales (top 10 mundial). Cancún, Los Cabos, CDMX y Oaxaca generan oportunidades en alojamiento boutique, experiencias locales y servicios de concierge.' },
      { label: 'Agronegocio & Exportación', icon: '🥑', why: 'México es el mayor exportador de aguacate, tomate y berries del mundo. Procesamiento, empaque y logística refrigerada para exportación a EUA son mercados con demanda garantizada.' },
      { label: 'Tecnología & SaaS para PyMEs', icon: '💻', why: '4.9M PyMEs mexicanas están sub-digitalizadas — soluciones de facturación electrónica, punto de venta, e-commerce y logística son vendidas con márgenes altos y renovación anual.' },
    ],
    faqs: [
      { q: '¿Cómo registro mi negocio en México?', a: 'Primero obtén tu RFC (Registro Federal de Contribuyentes) en el SAT (sat.gob.mx) con tu CURP — gratuito y en línea. Luego registra tu nombre comercial en el IMPI si es necesario. Para S. de R.L. de C.V. necesitas escritura ante notario (~MX$8,000–15,000). El Régimen Simplificado de Confianza (RESICO) permite tributar con sólo 1.5% sobre ingresos hasta MX$35M/año.' },
      { q: '¿Qué negocio es más rentable en México con poco dinero?', a: 'Servicios de comida (tacos/tortas/gorditas), reventa en Mercado Libre, servicios de limpieza, mantenimiento del hogar y clases particulares tienen ROI alto con MX$5,000–50,000 de inversión inicial. El clave es servir a la clase media emergente de ciudades de Tier-2 (Querétaro, León, Mérida, Guadalajara).' },
      { q: '¿Qué es el RESICO y quién puede usarlo?', a: 'El Régimen Simplificado de Confianza (RESICO) es el régimen fiscal más sencillo para personas físicas con actividad empresarial e ingresos hasta MX$3.5M/año. La tasa va del 1% al 2.5% sobre ingresos totales, sin deducciones complicadas. Ideal para microempresarios y emprendedores que inician.' },
    ],
    appUrl: `${APP_BASE}/?country=MX`,
  },
};

export function getCountryHub(code: string): CountryHubConfig | undefined {
  return COUNTRY_HUBS[code.toUpperCase()];
}

export const ALL_COUNTRY_HUBS = Object.values(COUNTRY_HUBS);
