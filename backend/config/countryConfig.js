'use strict';

/**
 * Country-specific configuration for all supported markets.
 * Used to inject locale context into Claude prompts.
 */
const COUNTRY_CONFIGS = {
  BR: {
    name: 'Brazil', currency: 'BRL', symbol: 'R$',
    currencyNote: ' Use R$ (Brazilian Reais/BRL) for ALL monetary values. Format: R$X mil (thousands), R$X milhão (millions).',
    formatExamples: {
      startup: '"R$X mil–R$Y mil"',
      revYr1: '"R$X mil–R$Y mil"',
      revYr3: '"R$X mil–R$Y mil"',
      exitVal: '"R$X milhão–R$Y milhão"',
      sam: '"R$X milhão (10% do TAM)"',
      som: '"R$X mil (1% do TAM)"',
      tam: '"R$X bilhões ou R$X milhões"',
    },
    contextBlock: `
BRAZIL-SPECIFIC CONTEXT:
- Business Structures: MEI (Microempreendedor Individual, R$81K/year limit, R$70.60/month flat tax) → ME → EPP → Sociedade Ltda → S.A.
- Registration: MEI via gov.br/mei (free, 5 minutes). CNPJ via Receita Federal for larger entities.
- Tax: Simples Nacional (simplified tax for SMEs up to R$4.8M/year). MEI has flat monthly DAS tax.
- Support Bodies: SEBRAE (primary SME support — free consultoria at sebrae.com.br), BNDES (development bank)
- Digital Platforms: Mercado Livre (dominant marketplace), Shopee BR, iFood/Rappi (food delivery), OLX (classifieds)
- Payments: Pix (instant payment — 95% digital adoption), Boleto Bancário, cartão de crédito (credit card installments cultura)
- Key opportunity: Brazil has 17.4M micro/small businesses (SEBRAE 2024), 15M+ MEIs — huge underserved B2B tools market
- Cultural notes: Relationship selling (jeitinho brasileiro), strong trust economy, family business culture
- Seasonal peaks: Carnaval (Feb), Festa Junina (June), Black Friday (November), Natal (December)

MANDATORY BRAZIL RULES:
1. ALL monetary values MUST be in Brazilian Reais (R$). NEVER use USD/$/dollars.
2. Use Brazilian format: R$X mil (thousands), R$X milhão (millions), R$X bilhão (billions).
3. Startup costs must reflect Brazilian market rates — labour and materials significantly different from US.
4. Always mention MEI registration as the entry path for micro businesses.
5. Reference SEBRAE and BNDES as funding/support resources.
6. Mention Pix as the primary payment method for any business.
7. Consider Simples Nacional tax implications in the financial projections.
`,
  },

  DE: {
    name: 'Germany', currency: 'EUR', symbol: '€',
    currencyNote: ' Use € (Euros/EUR) for ALL monetary values. Format: €X Tsd (thousands), €X Mio (millions).',
    formatExamples: {
      startup: '"€X.000–€Y.000"',
      revYr1: '"€X Tsd–€Y Tsd"',
      revYr3: '"€X Mio–€Y Mio"',
      exitVal: '"€X Mio–€Y Mio"',
      sam: '"€X Mio (10% des TAM)"',
      som: '"€X Tsd (1% des TAM)"',
      tam: '"€X Mrd oder €X Mio"',
    },
    contextBlock: `
GERMANY-SPECIFIC CONTEXT:
- Business Structures: Einzelunternehmen (sole trader, simplest), GbR (partnership), UG (mini-GmbH, €1 min capital, ideal for startups), GmbH (€25K min capital, main SME structure), AG (corporation)
- Registration: Gewerbeanmeldung at local Gewerbeamt (€20–65 fee). GmbH/UG requires notary (Handelsregister, ~€500+). Freiberufler (freelancers) register with Finanzamt only.
- Tax: Umsatzsteuer (VAT) 19% standard, 7% reduced. Register when annual turnover >€22,000 (Kleinunternehmerregelung exemption below). Corporate income tax 15% + 15% trade tax.
- Support: KfW Bank (Gründerkredit — startup loans), EXIST-Gründerstipendium (university spinout grants), BAFA subsidies, IHK/HWK (chambers of commerce, free mentoring)
- Digital Platforms: Amazon.de (dominant for e-commerce), Otto.de, Zalando (fashion), Lieferando (food delivery), eBay Kleinanzeigen (classifieds)
- Payments: PayPal, SEPA-Lastschrift (direct debit), Klarna, Sofort/Giropay, EC-Karte (debit card)
- Mittelstand culture: Germany's 3.8M SMEs (99.4% of all businesses) are the backbone of the economy — B2B, precision manufacturing, and expert services are highly respected
- Key gaps: Digitalization of Handwerk (trades), sustainability consulting, senior care, EV infrastructure services
- Seasonal peaks: Weihnachtsmarkt (Nov/Dec), Oktoberfest (Sept/Oct), summer trade fair season (April–June)

MANDATORY GERMANY RULES:
1. ALL monetary values MUST be in Euros (€). NEVER use USD/$/dollars.
2. Use German number format: €10.000 (period as thousands separator, comma for decimals).
3. Startup costs must reflect German market rates — labour costs higher than US in some sectors, trade skills very expensive.
4. Always reference appropriate business structure (UG for startups, GmbH for established).
5. Mention KfW Gründerkredit or EXIST grants as funding options.
6. Include Umsatzsteuer (VAT) implications in financial projections.
7. Reference IHK (Industrie- und Handelskammer) or HWK (Handwerkskammer) for sector-specific licensing.
`,
  },

  CA: {
    name: 'Canada', currency: 'CAD', symbol: 'CAD $',
    currencyNote: ' Use CAD $ (Canadian Dollars) for ALL monetary values.',
    formatExamples: {
      startup: '"CAD $X–CAD $Y"',
      revYr1: '"CAD $XK–CAD $YK"',
      revYr3: '"CAD $XM–CAD $YM"',
      exitVal: '"CAD $XM–CAD $YM"',
      sam: '"CAD $XM (10% of TAM)"',
      som: '"CAD $XK (1% of TAM)"',
      tam: '"CAD $XB or CAD $XM"',
    },
    contextBlock: `
CANADA-SPECIFIC CONTEXT:
- Business Structures: Sole Proprietorship (simplest), Partnership, Corporation (federally via Corporations Canada or provincially)
- Registration: Business name via provincial registry. Federal incorporation via Corporations Canada (corporationscanada.ic.gc.ca, ~CAD $200). GST/HST registration required when annual revenue >CAD $30,000.
- Tax: Federal corporate tax 15% (small businesses 9% on first CAD $500K). HST varies by province (Ontario 13%, BC 12%, Quebec 14.975%).
- Support: BDC (Business Development Bank of Canada) — loans and advisory. CSBFP (Canada Small Business Financing Program) for equipment/leasehold loans up to CAD $1M.
- Digital Platforms: Amazon.ca, Shopify (Canadian company — strong local preference), Kijiji, Skip The Dishes/Uber Eats
- Payments: Interac e-Transfer (dominant P2P), Visa/Mastercard, PayPal
- Key opportunities: Indigenous business support, francophone market (Quebec), cross-border US trade services, tech talent (strong immigration pipeline), cannabis-adjacent businesses
- Provincial nuances: Ontario (tech hub), BC (Asia-Pacific gateway), Quebec (French language requirement for consumer businesses), Alberta (energy services)

MANDATORY CANADA RULES:
1. ALL monetary values MUST be in Canadian Dollars (CAD $). NEVER use USD.
2. Account for Quebec French-language requirements if city is in Quebec.
3. Reference BDC and CSBFP as primary funding options.
4. Mention GST/HST implications based on province.
5. Consider US border proximity as a distribution/market advantage where relevant.
`,
  },

  GB: {
    name: 'United Kingdom', currency: 'GBP', symbol: '£',
    currencyNote: ' Use £ (British Pounds Sterling/GBP) for ALL monetary values.',
    formatExamples: {
      startup: '"£X–£Y"',
      revYr1: '"£XK–£YK"',
      revYr3: '"£XM–£YM"',
      exitVal: '"£XM–£YM"',
      sam: '"£XM (10% of TAM)"',
      som: '"£XK (1% of TAM)"',
      tam: '"£XB or £XM"',
    },
    contextBlock: `
UK-SPECIFIC CONTEXT:
- Business Structures: Sole Trader (simplest, register with HMRC), Limited Company (via Companies House, £12 online registration), LLP (for professional firms), Partnership
- Registration: Limited company via Companies House (companieshouse.gov.uk, £12 online). Self-assessment registration with HMRC for sole traders. VAT registration required when turnover >£85,000.
- Tax: Corporation tax 25% (19% for profits <£50K small profits rate). VAT 20% standard, 5% reduced, 0% zero-rated. Self Assessment for sole traders.
- Support: British Business Bank (loans, equity, Start Up Loans scheme — £500 to £25,000 at 6% fixed). Innovate UK grants. Local Enterprise Partnerships (LEPs).
- Digital Platforms: Amazon.co.uk, eBay.co.uk, Etsy, Just Eat/Deliveroo/Uber Eats, Gumtree
- Payments: Open Banking (UK-specific), Stripe, PayPal, Apple/Google Pay dominance, buy now pay later (Klarna, Clearpay)
- Key opportunities: Net Zero economy services, social care sector gap, digital services exports (strong £ vs emerging markets), post-Brexit import substitution
- Regional nuances: London (global finance hub), Manchester (Northern Powerhouse), Edinburgh (fintech), Birmingham (manufacturing)

MANDATORY UK RULES:
1. ALL monetary values MUST be in British Pounds (£). NEVER use USD.
2. Reference Companies House for limited company registration.
3. Mention British Business Bank Start Up Loans as primary funding option.
4. Include VAT threshold (£85,000) implications.
5. Reference relevant UK sector regulations (FCA for financial services, CQC for care, etc.).
`,
  },

  AU: {
    name: 'Australia', currency: 'AUD', symbol: 'AUD $',
    currencyNote: ' Use AUD $ (Australian Dollars) for ALL monetary values.',
    formatExamples: {
      startup: '"AUD $X–AUD $Y"',
      revYr1: '"AUD $XK–AUD $YK"',
      revYr3: '"AUD $XM–AUD $YM"',
      exitVal: '"AUD $XM–AUD $YM"',
      sam: '"AUD $XM (10% of TAM)"',
      som: '"AUD $XK (1% of TAM)"',
      tam: '"AUD $XB or AUD $XM"',
    },
    contextBlock: `
AUSTRALIA-SPECIFIC CONTEXT:
- Business Structures: Sole Trader (ABN required, simplest), Partnership, Company (Pty Ltd via ASIC, ~AUD $500), Trust (common for asset protection)
- Registration: ABN (Australian Business Number) via abr.gov.au (free, instant). Company registration via ASIC (~AUD $500/year). GST registration required when annual turnover >AUD $75,000.
- Tax: Company tax 25% for base rate entities (turnover <AUD $50M). GST 10% on most goods/services. BAS (Business Activity Statement) reporting quarterly.
- Support: Business.gov.au (federal portal). ATO (Australian Taxation Office) startup concessions. R&D Tax Incentive (43.5% refundable offset for eligible companies). State-specific grants.
- Digital Platforms: Amazon.com.au (growing), eBay.com.au (strong), Gumtree, Afterpay (BNPL dominant), DoorDash/Uber Eats/Menulog
- Payments: BPAY, PayID (instant bank transfer), Afterpay/Zip (BNPL culture), Visa/Mastercard
- Key opportunities: NDIS (National Disability Insurance Scheme) services, mining services, agri-tech, tourism experiences, Indigenous business opportunities, aged care gap
- Regional nuances: Sydney (finance/tech), Melbourne (creative/food), Brisbane (growth city), Perth (mining/resources), regional Australia (agriculture, tourism)

MANDATORY AUSTRALIA RULES:
1. ALL monetary values MUST be in Australian Dollars (AUD $). NEVER use USD.
2. Reference ABN registration as the first step for any business.
3. Mention ATO BAS obligations and GST threshold (AUD $75,000).
4. Reference relevant state government grants (e.g., NSW Business Connect, VIC LaunchVic).
5. Consider NDIS opportunities in healthcare/support sectors.
`,
  },

  MX: {
    name: 'Mexico', currency: 'MXN', symbol: 'MX$',
    currencyNote: ' Use MX$ (Mexican Pesos/MXN) for ALL monetary values. Format: MX$X mil (thousands), MX$X millones (millions).',
    formatExamples: {
      startup: '"MX$X mil–MX$Y mil"',
      revYr1: '"MX$X mil–MX$Y mil"',
      revYr3: '"MX$X millones–MX$Y millones"',
      exitVal: '"MX$X millones–MX$Y millones"',
      sam: '"MX$X millones (10% del TAM)"',
      som: '"MX$X mil (1% del TAM)"',
      tam: '"MX$X miles de millones o MX$X millones"',
    },
    contextBlock: `
MEXICO-SPECIFIC CONTEXT:
- Business Structures: Persona Física con Actividad Empresarial (simplest), S. de R.L. de C.V. (LLC equivalent, 2+ partners), S.A. de C.V. (joint-stock, for larger companies)
- Registration: RFC (Registro Federal de Contribuyentes) via SAT (sat.gob.mx). CURP required. State-level business registration. REPSE for service companies.
- Tax: ISR (Impuesto Sobre la Renta) — 30% corporate tax. IVA (VAT) 16% standard, 0% on food/medicine. RESICO (simplified tax regime) for individuals/small companies up to MX$35M/year (1.5–2.5% of income).
- Support: INADEM (now Secretaría de Economía programs), NAFIN (Nacional Financiera — SME loans), IMSS for social security registration
- Digital Platforms: Mercado Libre MX (dominant), Amazon.com.mx, Rappi, Uber Eats, OLX México
- Payments: SPEI (instant bank transfer), OXXO Pay (cash payments — huge for unbanked), CoDi, Clip/Conekta for card processing
- Key opportunities: nearshoring services (manufacturing moved from China), agribusiness, tourism services, fintech for unbanked, cross-border e-commerce to USA
- Regional nuances: CDMX (capital, services/finance), Monterrey (industrial, nearshoring), Guadalajara (tech/creative, Silicon Valley of Mexico), border cities (maquiladoras, US trade)

MANDATORY MEXICO RULES:
1. ALL monetary values MUST be in Mexican Pesos (MX$). NEVER use USD (unless explicitly cross-border context).
2. Use Mexican format: MX$X mil (thousands), MX$X millones (millions), MX$X miles de millones (billions).
3. Reference RFC/SAT registration as mandatory first step.
4. Mention RESICO as the entry-level tax regime for small businesses.
5. Reference NAFIN loans and INADEM programs as funding options.
6. Consider OXXO Pay and unbanked customer payment solutions.
`,
  },

  JP: {
    name: 'Japan', currency: 'JPY', symbol: '¥',
    currencyNote: ' Use ¥ (Japanese Yen/JPY) for ALL monetary values. Format: ¥X万 (10,000s), ¥X百万 (millions), ¥X億 (100 millions).',
    formatExamples: {
      startup: '"¥X万–¥Y万"',
      revYr1: '"¥X百万–¥Y百万"',
      revYr3: '"¥X千万–¥Y千万"',
      exitVal: '"¥X億–¥Y億"',
      sam: '"¥X億 (10% of TAM)"',
      som: '"¥X千万 (1% of TAM)"',
      tam: '"¥X兆 or ¥X億"',
    },
    contextBlock: `
JAPAN-SPECIFIC CONTEXT:
- Business Structures: Kojin Jigyo (Sole Proprietorship), Godo Kaisha (LLC equivalent, ¥0 capital requirement), Kabushiki Kaisha (KK, traditional corporation, ¥0 capital)
- Registration: Kojin Jigyo: tax office (zeimusho) notification. Godo Kaisha/KK: Legal Affairs Bureau (houmukyoku) registration, ~¥60,000–¥150,000.
- Tax: Corporate tax 23.2% + local taxes (~30% effective). Consumption Tax (消費税) 10% (8% on food). Freee/MoneyForward for SME accounting.
- Support: Japan Finance Corporation (JFC/日本政策金融公庫) — startup loans at 2–3% interest, up to ¥72M. SMRJ (中小企業基盤整備機構) for SME consulting.
- Digital Platforms: Rakuten (dominant marketplace), Amazon.co.jp, Yahoo! Shopping, Uber Eats/Demae-Can (food), LINE (messaging+commerce)
- Payments: PayPay (dominant QR payment), Suica/IC cards, credit cards, konbini (convenience store) payment
- Key opportunities: Aging population (超高齢社会) services, inbound tourism recovery, digital transformation of SMEs, agricultural reform, regional revitalization (地方創生)

MANDATORY JAPAN RULES:
1. ALL monetary values MUST be in Japanese Yen (¥). Use ¥X万 for multiples of 10,000.
2. Reference JFC (日本政策金融公庫) as the primary startup loan source.
3. Consider Japan's aging population (28% over 65) as a major market driver.
4. Reference LINE and PayPay for customer acquisition strategies.
`,
  },

  FR: {
    name: 'France', currency: 'EUR', symbol: '€',
    currencyNote: ' Use € (Euros/EUR) for ALL monetary values.',
    formatExamples: {
      startup: '"€X–€Y"',
      revYr1: '"€X k–€Y k"',
      revYr3: '"€X M–€Y M"',
      exitVal: '"€X M–€Y M"',
      sam: '"€X M (10% du TAM)"',
      som: '"€X k (1% du TAM)"',
      tam: '"€X Md ou €X M"',
    },
    contextBlock: `
FRANCE-SPECIFIC CONTEXT:
- Business Structures: Auto-entrepreneur/Micro-entreprise (simplest — ≤€77,700 services/€188,700 goods, flat cotisation rate), EURL/SARL (LLC), SAS/SASU (simplified joint-stock — preferred by startups), SA
- Registration: Auto-entrepreneur via guichet-entreprises.fr or INPI (free, online). SASU/SAS via INPI (€37.45 for standard, free for digital). SIRET number assigned automatically.
- Tax: IS (Impôt sur les Sociétés) 25% standard, 15% on first €42,500 for eligible SMEs. TVA (VAT) 20% standard, 10%/5.5% reduced. Auto-entrepreneur: 12.3–22.2% flat cotisation sociale.
- Support: Bpifrance (state investment bank — startup loans, equity, grants). ADIE (microcredit for excluded entrepreneurs). CCI (Chambre de Commerce et d'Industrie) — free business mentoring.
- Digital Platforms: Amazon.fr, Cdiscount (French marketplace), Leboncoin (classifieds dominant), Deliveroo/Uber Eats/Just Eat, ManoMano (home improvement)
- Payments: CB (Carte Bleue — French card), PayPal, Apple/Google Pay, virement SEPA
- Key opportunities: Tourism services (France is world's top tourist destination), sustainable agriculture, AI/tech services, senior care (silver economy), artisanal food/wine exports

MANDATORY FRANCE RULES:
1. ALL monetary values MUST be in Euros (€). NEVER use USD.
2. Reference auto-entrepreneur regime as the simplest entry path.
3. Mention Bpifrance and CCI as primary support resources.
4. Include TVA (VAT) implications in financial projections.
`,
  },
};

/**
 * Get country-specific prompt context for Claude injection.
 * Returns { contextBlock, currencyNote, formatExamples } or null for unsupported countries.
 */
function getCountryConfig(countryCode) {
  return COUNTRY_CONFIGS[countryCode?.toUpperCase()] || null;
}

module.exports = { getCountryConfig, COUNTRY_CONFIGS };
