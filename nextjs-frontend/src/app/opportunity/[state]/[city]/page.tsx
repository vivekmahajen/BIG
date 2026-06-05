import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { STATES, getStateBySlug, getCityBySlug } from '@/lib/geography';
import { SECTORS } from '@/lib/sectors';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function generateStaticParams() {
  const params: { state: string; city: string }[] = [];
  for (const state of STATES) {
    for (const city of state.cities.slice(0, 2)) {
      params.push({ state: state.slug, city: city.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ state: string; city: string }> }): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) return {};
  const city = getCityBySlug(stateSlug, citySlug);
  if (!city) return {};
  const title = `Business Opportunities in ${city.city}, ${state.name} | BIG`;
  const description = `AI analysis of business opportunities in ${city.city}, ${state.name}. Explore market gaps, sector trends, and high-potential niches across 16 industries.`;
  return {
    title,
    description,
    alternates: { canonical: `${process.env.SITE_URL || 'https://getbig.io'}/opportunity/${stateSlug}/${citySlug}` },
  };
}

export default async function CityPage({ params }: { params: Promise<{ state: string; city: string }> }) {
  const { state: stateSlug, city: citySlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) notFound();
  const city = getCityBySlug(stateSlug, citySlug);
  if (!city) notFound();

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        {' / '}
        <Link href={`/opportunity/${state.slug}`} className="hover:text-blue-600">{state.name}</Link>
        {' / '}
        <span className="text-gray-800">{city.city}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">Business Opportunities in {city.city}, {state.name}</h1>
      <p className="text-gray-600 mb-8">
        AI-powered market analysis for {city.city}. Select a sector to see a full opportunity report with demand scores, competitive landscape, and actionable insights.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {SECTORS.map(sector => (
          <Link
            key={sector.id}
            href={`/opportunity/${state.slug}/${city.slug}/${sector.id}`}
            className={`block p-5 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all ${sector.color}`}
          >
            <div className="text-2xl mb-2">{sector.icon}</div>
            <div className="font-semibold text-gray-900">{sector.label}</div>
            <div className="text-xs text-gray-500 mt-1">{sector.description}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
