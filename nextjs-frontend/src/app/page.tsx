import Link from 'next/link';
import { STATES } from '@/lib/geography';
import { SECTORS } from '@/lib/sectors';

export default function HomePage() {
  const featuredStates = STATES.filter(s =>
    ['california', 'texas', 'florida', 'new-york', 'illinois', 'washington', 'colorado', 'georgia'].includes(s.slug)
  );

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Next Business Opportunity
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          AI-powered market analysis for every US city and sector. Discover market gaps, demand trends, and high-potential niches — in minutes.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Browse by State</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {featuredStates.map(state => (
          <Link
            key={state.slug}
            href={`/opportunity/${state.slug}`}
            className="p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all text-center"
          >
            <div className="font-semibold text-gray-900">{state.name}</div>
            <div className="text-xs text-gray-500 mt-0.5">{state.cities.length} cities</div>
          </Link>
        ))}
      </div>
      <div className="mb-12">
        <Link href="/opportunity/california" className="text-sm text-blue-600 hover:underline">
          View all 50 states →
        </Link>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Browse by Sector</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {SECTORS.map(sector => (
          <Link
            key={sector.id}
            href={`/opportunity/california/los-angeles/${sector.id}`}
            className={`p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all ${sector.color}`}
          >
            <div className="text-2xl mb-1">{sector.icon}</div>
            <div className="font-medium text-gray-900 text-sm">{sector.label}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
