// Geo hierarchy: states → cities → ZIP codes
// Sectors and opportunity briefs keyed by ZIP → sector

const SECTORS = [
  'Technology & Software',
  'Healthcare & Life Sciences',
  'Financial Services & Fintech',
  'Retail & E-Commerce',
  'Real Estate & Construction',
  'Food & Beverage',
  'Education & EdTech',
  'Manufacturing & Logistics',
  'Media & Entertainment',
  'Energy & Sustainability',
  'Professional Services',
  'Transportation & Mobility',
  'Agriculture & AgTech',
  'Government & Public Sector',
  'Wellness & Fitness',
  'Hospitality & Tourism',
];

const geoData = {
  states: [
    {
      code: 'TX', name: 'Texas',
      cities: [
        {
          name: 'Austin',
          zips: ['78701','78702','78703','78704','78705'],
        },
        {
          name: 'Houston',
          zips: ['77001','77002','77036','77042','77056'],
        },
        {
          name: 'Dallas',
          zips: ['75201','75202','75204','75205','75214'],
        },
        {
          name: 'San Antonio',
          zips: ['78201','78202','78205','78209','78212'],
        },
      ],
    },
    {
      code: 'TN', name: 'Tennessee',
      cities: [
        {
          name: 'Nashville',
          zips: ['37201','37203','37204','37206','37219'],
        },
        {
          name: 'Memphis',
          zips: ['38101','38103','38104','38105','38111'],
        },
        {
          name: 'Knoxville',
          zips: ['37901','37902','37909','37916','37917'],
        },
      ],
    },
    {
      code: 'AZ', name: 'Arizona',
      cities: [
        {
          name: 'Phoenix',
          zips: ['85001','85003','85034','85040','85043'],
        },
        {
          name: 'Scottsdale',
          zips: ['85250','85251','85254','85257','85259'],
        },
        {
          name: 'Tucson',
          zips: ['85701','85705','85710','85711','85712'],
        },
      ],
    },
    {
      code: 'CO', name: 'Colorado',
      cities: [
        {
          name: 'Denver',
          zips: ['80201','80203','80204','80205','80210'],
        },
        {
          name: 'Colorado Springs',
          zips: ['80901','80903','80905','80907','80910'],
        },
      ],
    },
    {
      code: 'NC', name: 'North Carolina',
      cities: [
        {
          name: 'Raleigh',
          zips: ['27601','27603','27605','27607','27609'],
        },
        {
          name: 'Charlotte',
          zips: ['28201','28202','28203','28204','28205'],
        },
      ],
    },
    {
      code: 'FL', name: 'Florida',
      cities: [
        {
          name: 'Tampa',
          zips: ['33601','33602','33603','33605','33609'],
        },
        {
          name: 'Miami',
          zips: ['33101','33125','33128','33130','33131'],
        },
        {
          name: 'Orlando',
          zips: ['32801','32803','32804','32806','32808'],
        },
      ],
    },
    {
      code: 'CA', name: 'California',
      cities: [
        {
          name: 'Los Angeles',
          zips: ['90001','90021','90028','90210','90291'],
        },
        {
          name: 'San Francisco',
          zips: ['94101','94103','94105','94107','94110'],
        },
        {
          name: 'San Jose',
          zips: ['95101','95110','95112','95113','95126'],
        },
        {
          name: 'Fresno',
          zips: ['93701','93703','93706','93710','93721'],
        },
      ],
    },
    {
      code: 'IL', name: 'Illinois',
      cities: [
        {
          name: 'Chicago',
          zips: ['60601','60607','60610','60614','60632'],
        },
      ],
    },
    {
      code: 'IN', name: 'Indiana',
      cities: [
        {
          name: 'Indianapolis',
          zips: ['46201','46202','46204','46205','46218'],
        },
      ],
    },
    {
      code: 'WA', name: 'Washington',
      cities: [
        {
          name: 'Seattle',
          zips: ['98101','98102','98103','98104','98121'],
        },
      ],
    },
    {
      code: 'NY', name: 'New York',
      cities: [
        {
          name: 'New York City',
          zips: ['10001','10007','10013','11201','11211'],
        },
      ],
    },
    {
      code: 'GA', name: 'Georgia',
      cities: [
        {
          name: 'Atlanta',
          zips: ['30301','30303','30306','30308','30309'],
        },
      ],
    },
    {
      code: 'OH', name: 'Ohio',
      cities: [
        {
          name: 'Columbus',
          zips: ['43201','43202','43203','43210','43215'],
        },
      ],
    },
    {
      code: 'DC', name: 'District of Columbia',
      cities: [
        {
          name: 'Washington',
          zips: ['20001','20002','20003','20004','20009'],
        },
      ],
    },
  ],
};

// ── Opportunity data keyed by [zip][sector] ─────────────────────────────
// Each entry has a brief with score, key metrics, and a short thesis.
// We cover the top-cited ZIPs in depth and fall back to a generated summary
// for all other combinations so every selection always returns data.

const opportunityOverrides = {
  '78701': {
    'Technology & Software': {
      score: 9.3,
      name: 'AI Legal Ops Platform for SMBs',
      model: 'SaaS',
      tam: '$37.9B',
      sam: '$8.2B',
      som: '$5.1M (Yr 3)',
      grossMargin: '82%',
      ltv_cac: '27:1',
      paybackMonths: 2.2,
      topCompetitors: ['Ironclad', 'ContractPodAi', 'Harvey AI'],
      bestZip: '78701',
      startupCost: '$362K',
      exitVal: '$140M–$200M',
      verdict: 'Every SMB that signs a contract is a potential customer; LLM costs fall annually while value rises.',
    },
    'Energy & Sustainability': {
      score: 8.9,
      name: 'ESG Reporting Automation SaaS',
      model: 'SaaS',
      tam: '$4.1B → $22B by 2030',
      sam: '$3.8B',
      som: '$9.2M (Yr 3)',
      grossMargin: '79%',
      ltv_cac: '15:1',
      paybackMonths: 4.6,
      topCompetitors: ['Watershed', 'Persefoni', 'Workiva'],
      bestZip: '78701',
      startupCost: '$362K',
      exitVal: '$250M–$380M',
      verdict: 'SEC and EU mandates make ESG reporting legally required — the CFO has no choice but to purchase.',
    },
    'Professional Services': {
      score: 8.2,
      name: 'AI-Augmented Accounting for E-Commerce & SaaS',
      model: 'Monthly retainer + project fees',
      tam: '$510B (U.S. accounting services)',
      sam: '$6.1B',
      som: '$4.2M (Yr 3)',
      grossMargin: '67%',
      ltv_cac: '22:1',
      paybackMonths: 2.8,
      topCompetitors: ['Pilot.com', 'Bench', 'Kruze Consulting'],
      bestZip: '78701',
      startupCost: '$48K (bootstrappable)',
      exitVal: '$120M–$200M',
      verdict: 'AI reduces entry-level accounting labor cost 65%, creating structural margin advantages over traditional CPA firms.',
    },
  },
  '37203': {
    'Technology & Software': {
      score: 9.1,
      name: 'AI-Powered Revenue Cycle Management for Independent Practices',
      model: 'SaaS + % of collections',
      tam: '$238B',
      sam: '$31B',
      som: '$8.4M (Yr 3)',
      grossMargin: '79%',
      ltv_cac: '30:1',
      paybackMonths: 2.7,
      topCompetitors: ['Kareo/Tebra', 'AdvancedMD', 'Athenahealth'],
      bestZip: '37203',
      startupCost: '$1.4M seed',
      exitVal: '$175M–$260M',
      verdict: 'Compulsory demand + AI margin advantages + fragmented $31B TAM = durable path to $20M ARR.',
    },
    'Hospitality & Tourism': {
      score: 8.6,
      name: 'AI Dynamic Pricing SaaS for Independent Hotels',
      model: 'SaaS ($299–$999/mo per property)',
      tam: '$4.2B',
      sam: '$1.1B',
      som: '$18.1M (Yr 3)',
      grossMargin: '83%',
      ltv_cac: '28:1',
      paybackMonths: 1.9,
      topCompetitors: ['IDeaS', 'Duetto', 'OTA Insight'],
      bestZip: '37203',
      startupCost: '$280K',
      exitVal: '$450M–$700M',
      verdict: '50,000 independent hotels navigate pricing with spreadsheets, losing $8,200/property/year in revenue.',
    },
  },
  '85034': {
    'Real Estate & Construction': {
      score: 8.7,
      name: 'Modular Workforce Housing Development',
      model: 'Real estate development + property management',
      tam: '$48B development opportunity (AZ+TX+FL+NC)',
      sam: '$12B',
      som: '$3.8M NOI (Yr 5)',
      grossMargin: '52% NOI margin',
      ltv_cac: 'N/A (asset-based)',
      paybackMonths: 24,
      topCompetitors: ['NexMetro', 'AMH', 'D.R. Horton'],
      bestZip: '85034',
      startupCost: '$3.8M equity + $11.6M debt',
      exitVal: '$28M–$36M asset value (Yr 5)',
      verdict: 'Phoenix\'s 38,000-unit housing shortage + modular cost advantage + employer partnerships = triple tailwind.',
    },
    'Energy & Sustainability': {
      score: 8.4,
      name: 'EV Fleet Charging Infrastructure + Management SaaS',
      model: 'Hardware install + SaaS ($150–$400/vehicle/mo)',
      tam: '$168B by 2030',
      sam: '$22B',
      som: '$14M (Yr 3)',
      grossMargin: '46%',
      ltv_cac: '18:1',
      paybackMonths: 3.5,
      topCompetitors: ['ChargePoint', 'Blink', 'Voltera'],
      bestZip: '85034',
      startupCost: '$2.2M',
      exitVal: '$400M–$700M',
      verdict: 'AZ\'s fleet electrification mandates and Sky Harbor corridor employer base create a captive install pipeline.',
    },
  },
  '94105': {
    'Food & Beverage': {
      score: 8.4,
      name: 'Cognitive Performance Functional Beverage Brand',
      model: 'D2C subscription + B2B corporate + retail',
      tam: '$53B',
      sam: '$4.2B',
      som: '$8.5M (Yr 3)',
      grossMargin: '58%',
      ltv_cac: '24:1',
      paybackMonths: 2.1,
      topCompetitors: ['RXBAR', 'Kin Euphorics', 'Thesis Nootropics'],
      bestZip: '94105',
      startupCost: '$380K',
      exitVal: '$150M–$300M',
      verdict: 'The cognitive beverage category has no incumbent brand and SoMa knowledge workers are the perfect launch cohort.',
    },
  },
  '80203': {
    'Healthcare & Life Sciences': {
      score: 8.6,
      name: 'Concierge Mental Health Practice (Hybrid)',
      model: 'Direct-pay membership $299/mo',
      tam: '$280B',
      sam: '$22B',
      som: '$4.8M (Yr 3)',
      grossMargin: '58%',
      ltv_cac: '38:1',
      paybackMonths: 1.3,
      topCompetitors: ['Talkspace', 'Headway', 'Traditional private practice'],
      bestZip: '80203',
      startupCost: '$380K',
      exitVal: '$60M–$95M',
      verdict: '6-week therapist waitlists + willing-to-pay professional population = durable pricing arbitrage.',
    },
  },
  '90028': {
    'Media & Entertainment': {
      score: 8.7,
      name: 'Creator Economy Financial Services Platform',
      model: 'Banking interchange + factoring + subscription',
      tam: '$480B globally',
      sam: '$8.4B',
      som: '$12M (Yr 3)',
      grossMargin: '73%',
      ltv_cac: '31:1',
      paybackMonths: 1.8,
      topCompetitors: ['Mercury', 'Lili', 'Found'],
      bestZip: '90028',
      startupCost: '$1.8M',
      exitVal: '$800M–$1.5B',
      verdict: '3.8M professional creators have complex irregular income that no bank was designed for.',
    },
  },
  '27601': {
    'Education & EdTech': {
      score: 7.7,
      name: 'Outcome-Based Coding Bootcamp (ISA Model)',
      model: 'Income Share Agreement + employer placement fees',
      tam: '$101B (corporate training)',
      sam: '$4.8B',
      som: '$5.7M (Yr 3)',
      grossMargin: '58%',
      ltv_cac: '19:1',
      paybackMonths: 3.2,
      topCompetitors: ['Flatiron School', 'General Assembly', 'Turing School'],
      bestZip: '27601',
      startupCost: '$420K',
      exitVal: '$85M–$135M',
      verdict: 'Research Triangle tech labor shortage creates employer urgency; ISA model aligns school incentives with student outcomes.',
    },
  },
};

// Default opportunity generator for any zip/sector combo not in overrides
function generateDefaultOpportunity(zip, sector) {
  const sectorDefaults = {
    'Technology & Software':       { score: 7.8, model: 'SaaS', grossMargin: '75%', ltv_cac: '22:1', paybackMonths: 3.5, tam: '$12–38B', exitVal: '$50M–$200M' },
    'Healthcare & Life Sciences':  { score: 7.9, model: 'Service + SaaS', grossMargin: '52%', ltv_cac: '18:1', paybackMonths: 4.2, tam: '$28–280B', exitVal: '$40M–$150M' },
    'Financial Services & Fintech':{ score: 7.7, model: 'SaaS + transaction fees', grossMargin: '65%', ltv_cac: '20:1', paybackMonths: 3.8, tam: '$8–210B', exitVal: '$60M–$300M' },
    'Retail & E-Commerce':         { score: 7.2, model: 'D2C + marketplace', grossMargin: '38%', ltv_cac: '12:1', paybackMonths: 5.0, tam: '$14–124B', exitVal: '$30M–$120M' },
    'Real Estate & Construction':  { score: 7.5, model: 'Development + SaaS', grossMargin: '45%', ltv_cac: '15:1', paybackMonths: 18, tam: '$12–48B', exitVal: '$40M–$180M' },
    'Food & Beverage':             { score: 7.1, model: 'D2C + B2B distribution', grossMargin: '48%', ltv_cac: '14:1', paybackMonths: 4.5, tam: '$4–53B', exitVal: '$30M–$200M' },
    'Education & EdTech':          { score: 7.6, model: 'SaaS + services', grossMargin: '62%', ltv_cac: '18:1', paybackMonths: 4.0, tam: '$5–101B', exitVal: '$40M–$150M' },
    'Manufacturing & Logistics':   { score: 7.8, model: 'SaaS + marketplace', grossMargin: '68%', ltv_cac: '24:1', paybackMonths: 3.2, tam: '$2–680B', exitVal: '$80M–$400M' },
    'Media & Entertainment':       { score: 7.2, model: 'Subscription + ads', grossMargin: '55%', ltv_cac: '16:1', paybackMonths: 4.8, tam: '$3–480B', exitVal: '$30M–$350M' },
    'Energy & Sustainability':     { score: 8.1, model: 'SaaS + HaaS', grossMargin: '62%', ltv_cac: '20:1', paybackMonths: 4.0, tam: '$4–168B', exitVal: '$80M–$500M' },
    'Professional Services':       { score: 8.0, model: 'Retainer + project', grossMargin: '60%', ltv_cac: '22:1', paybackMonths: 2.5, tam: '$2–44B', exitVal: '$40M–$200M' },
    'Transportation & Mobility':   { score: 7.6, model: 'SaaS + managed service', grossMargin: '45%', ltv_cac: '18:1', paybackMonths: 5.5, tam: '$2–168B', exitVal: '$100M–$600M' },
    'Agriculture & AgTech':        { score: 7.4, model: 'HaaS + SaaS', grossMargin: '52%', ltv_cac: '16:1', paybackMonths: 5.0, tam: '$1–32B', exitVal: '$40M–$200M' },
    'Government & Public Sector':  { score: 7.5, model: 'SaaS + long-term contracts', grossMargin: '58%', ltv_cac: '20:1', paybackMonths: 6.0, tam: '$2–53B', exitVal: '$100M–$500M' },
    'Wellness & Fitness':          { score: 7.8, model: 'Membership + SaaS', grossMargin: '62%', ltv_cac: '24:1', paybackMonths: 3.0, tam: '$3–94B', exitVal: '$50M–$350M' },
    'Hospitality & Tourism':       { score: 7.4, model: 'SaaS + ops', grossMargin: '58%', ltv_cac: '20:1', paybackMonths: 3.5, tam: '$1–42B', exitVal: '$60M–$700M' },
  };

  const d = sectorDefaults[sector] || sectorDefaults['Technology & Software'];
  return {
    score: d.score,
    name: `${sector} Opportunity — ZIP ${zip}`,
    model: d.model,
    tam: d.tam,
    sam: 'See full report',
    som: 'See full report',
    grossMargin: d.grossMargin,
    ltv_cac: d.ltv_cac,
    paybackMonths: d.paybackMonths,
    topCompetitors: ['Fragmented incumbents', 'Legacy platforms', 'Manual processes'],
    bestZip: zip,
    startupCost: 'Varies by scope',
    exitVal: d.exitVal,
    verdict: `The ${sector} sector in ZIP ${zip} presents a viable opportunity supported by national trends; conduct local demand validation before committing capital.`,
  };
}

function getSectorsForZip(zip) {
  // All ZIPs support all sectors; return all 16 with a relevance score
  return SECTORS.map(name => ({
    name,
    score: opportunityOverrides[zip]?.[name]?.score ?? null,
  }));
}

function getOpportunity(zip, sector) {
  if (opportunityOverrides[zip]?.[sector]) {
    return opportunityOverrides[zip][sector];
  }
  return generateDefaultOpportunity(zip, sector);
}

module.exports = { geoData, getSectorsForZip, getOpportunity };
