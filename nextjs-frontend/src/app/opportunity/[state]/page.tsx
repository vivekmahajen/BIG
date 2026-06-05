import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { STATES, getStateBySlug, type CityData } from '@/lib/geography';
import { SECTORS } from '@/lib/sectors';
import { buildStateMetadata } from '@/lib/seo';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function generateStaticParams() {
  return STATES.map(s => ({ state: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) return {};
  return buildStateMetadata(state);
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) notFound();

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Business Opportunities in {state.name}</h1>
      <p className="text-gray-600 mb-8">
        Explore AI-powered market analysis across every major city in {state.name}. Click a city to browse opportunities by sector.
      </p>

      <h2 className="text-xl font-semibold mb-4">Cities in {state.name}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-12">
        {state.cities.map((city: CityData) => (
          <Link
            key={city.slug}
            href={`/opportunity/${state.slug}/${city.slug}`}
            className="block p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm font-medium"
          >
            {city.city}
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Browse by Sector</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {SECTORS.map(sector => (
          <Link
            key={sector.id}
            href={`/opportunity/${state.slug}/${state.cities[0].slug}/${sector.id}`}
            className="block p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="mr-2">{sector.icon}</span>
            {sector.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
