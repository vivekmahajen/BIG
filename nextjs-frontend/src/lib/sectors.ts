export interface SectorData {
  id: string;
  apiId: string;
  label: string;
  shortLabel: string;
  naics: string;
  description: string;
  searchIntent: string;
  icon: string;
  color: string;
}

export const SECTORS: SectorData[] = [
  { id: 'food-beverage', apiId: 'food_beverage', label: 'Food & Beverage', shortLabel: 'Food', naics: '72', description: 'Restaurants, cafes, food trucks, catering, and specialty food businesses', searchIntent: 'food and beverage business opportunity', icon: '🍽️', color: 'bg-orange-50' },
  { id: 'technology', apiId: 'technology', label: 'Technology & Software', shortLabel: 'Tech', naics: '54', description: 'SaaS products, IT services, software development, and tech consulting', searchIntent: 'technology business opportunity', icon: '💻', color: 'bg-blue-50' },
  { id: 'healthcare', apiId: 'healthcare', label: 'Healthcare & Life Sciences', shortLabel: 'Healthcare', naics: '62', description: 'Medical practices, wellness centers, home health, and healthcare technology', searchIntent: 'healthcare business opportunity', icon: '🏥', color: 'bg-red-50' },
  { id: 'financial-services', apiId: 'financial_services', label: 'Financial Services', shortLabel: 'Finance', naics: '52', description: 'Insurance, accounting, financial planning, fintech, and lending', searchIntent: 'financial services business opportunity', icon: '🏦', color: 'bg-green-50' },
  { id: 'retail', apiId: 'retail', label: 'Retail & E-Commerce', shortLabel: 'Retail', naics: '44', description: 'Brick-and-mortar retail, online stores, and specialty product brands', searchIntent: 'retail business opportunity', icon: '🛍️', color: 'bg-purple-50' },
  { id: 'real-estate', apiId: 'real_estate', label: 'Real Estate & Construction', shortLabel: 'Real Estate', naics: '23', description: 'Property management, construction, renovation, and real estate services', searchIntent: 'real estate business opportunity', icon: '🏗️', color: 'bg-yellow-50' },
  { id: 'education', apiId: 'education', label: 'Education & EdTech', shortLabel: 'Education', naics: '61', description: 'Tutoring, online courses, training centers, and educational technology', searchIntent: 'education business opportunity', icon: '📚', color: 'bg-indigo-50' },
  { id: 'manufacturing', apiId: 'manufacturing', label: 'Manufacturing & Logistics', shortLabel: 'Manufacturing', naics: '31', description: 'Light manufacturing, 3PL fulfillment, supply chain, and distribution', searchIntent: 'manufacturing business opportunity', icon: '🏭', color: 'bg-gray-50' },
  { id: 'wellness', apiId: 'wellness', label: 'Wellness & Fitness', shortLabel: 'Wellness', naics: '812', description: 'Gyms, yoga studios, med spas, personal training, and wellness coaching', searchIntent: 'wellness fitness business opportunity', icon: '💪', color: 'bg-teal-50' },
  { id: 'hospitality', apiId: 'hospitality', label: 'Hospitality & Tourism', shortLabel: 'Hospitality', naics: '721', description: 'Hotels, STR management, tour operations, and travel services', searchIntent: 'hospitality tourism business opportunity', icon: '🏨', color: 'bg-sky-50' },
  { id: 'energy', apiId: 'energy', label: 'Energy & Sustainability', shortLabel: 'Energy', naics: '22', description: 'Solar installation, EV charging, green building, and clean energy services', searchIntent: 'energy sustainability business opportunity', icon: '⚡', color: 'bg-lime-50' },
  { id: 'professional-services', apiId: 'professional_services', label: 'Professional Services', shortLabel: 'Consulting', naics: '54', description: 'Consulting, legal, accounting, HR, and business advisory services', searchIntent: 'professional services business opportunity', icon: '💼', color: 'bg-slate-50' },
  { id: 'transportation', apiId: 'transportation', label: 'Transportation & Mobility', shortLabel: 'Transport', naics: '48', description: 'Last-mile delivery, NEMT, freight brokerage, and fleet services', searchIntent: 'transportation business opportunity', icon: '🚗', color: 'bg-amber-50' },
  { id: 'media-entertainment', apiId: 'media_entertainment', label: 'Media & Entertainment', shortLabel: 'Media', naics: '71', description: 'Content creation, podcasting, events, gaming, and digital media', searchIntent: 'media entertainment business opportunity', icon: '🎬', color: 'bg-pink-50' },
  { id: 'agriculture', apiId: 'agriculture', label: 'Agriculture & AgTech', shortLabel: 'Agriculture', naics: '11', description: 'Farming, vertical agriculture, agtech, and food production', searchIntent: 'agriculture agtech business opportunity', icon: '🌾', color: 'bg-emerald-50' },
  { id: 'government', apiId: 'government', label: 'Government & Public Sector', shortLabel: 'GovTech', naics: '92', description: 'GovTech, grant writing, public sector consulting, and defense contracting', searchIntent: 'government public sector business opportunity', icon: '🏛️', color: 'bg-violet-50' },
];

export function getSectorById(id: string): SectorData | undefined {
  return SECTORS.find(s => s.id === id);
}
export function getSectorByApiId(apiId: string): SectorData | undefined {
  return SECTORS.find(s => s.apiId === apiId);
}
export const ALL_SECTOR_IDS = SECTORS.map(s => s.id);
