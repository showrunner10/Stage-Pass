'use client';

import { useEffect, useState } from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { EventCard } from '@/components/shared/EventCard';
import type { Event } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';

type SortOption = 'commission' | 'date' | 'newest' | 'promoted';

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [minCommission, setMinCommission] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('commission');
  const [showFilters, setShowFilters] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const res = await fetch('/api/public/events', { cache: 'no-store' });
      const json = (await res.json()) as { items?: Event[] };
      if (active) setEvents(json.items ?? []);
    })();
    return () => {
      active = false;
    };
  }, []);

  const categories = ['All', ...Array.from(new Set(events.map((event) => event.category)))];
  const cities = Array.from(new Set(events.map((event) => event.city))).sort();
  
  let filteredEvents = events.filter(event => 
    (selectedCategory === 'All' || event.category === selectedCategory) &&
    (!selectedCity || event.city === selectedCity) &&
    (event.commission >= minCommission) &&
    (event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     event.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort
  if (sortBy === 'commission') {
    filteredEvents = [...filteredEvents].sort((a, b) => b.commission - a.commission);
  } else if (sortBy === 'date') {
    filteredEvents = [...filteredEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else if (sortBy === 'newest') {
    filteredEvents = [...filteredEvents].reverse();
  } else if (sortBy === 'promoted') {
    filteredEvents = [...filteredEvents].sort((a, b) => (b.promoted || 0) - (a.promoted || 0));
  }

  const activeFilters = [
    selectedCategory !== 'All' && { label: selectedCategory, clear: () => setSelectedCategory('All') },
    selectedCity && { label: selectedCity, clear: () => setSelectedCity(null) },
    minCommission > 0 && { label: `${minCommission}%+ Commission`, clear: () => setMinCommission(0) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <div className="min-h-screen bg-dark">
      <PublicNavbar />
      
      <main className="pt-32 pb-20">
        <div className="page-shell">
          <div className="mb-8 rounded-2xl border border-white/10 bg-[linear-gradient(120deg,rgba(7,13,22,0.92),rgba(8,8,9,0.85)),repeating-linear-gradient(0deg,rgba(255,255,255,0.05)_0,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_36px),repeating-linear-gradient(90deg,rgba(255,255,255,0.05)_0,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_36px)] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-primary/90 mb-3">Experience Commerce</p>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Fashion, beauty, clothing, events, and wellness campaigns in one marketplace.</h2>
            <p className="text-offwhite/65 max-w-3xl">Every listing includes campaign-ready positioning and downloadable assets so creators can launch faster.</p>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">Event Marketplace</h1>
              <p className="text-offwhite/60">Discover high-commission events to promote</p>
            </div>
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-offwhite/40" />
              <Input
                type="text"
                placeholder="Search events, cities, venues..."
                className="h-12 pl-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6 mb-10 pb-6 border-b border-white/10">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat 
                    ? 'bg-primary text-white' 
                    : 'bg-white/5 text-offwhite/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-offwhite/40">
                <span>Sort:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-white/10 text-white px-3 py-1 rounded border border-white/20 focus:outline-none focus:border-primary text-sm"
                >
                  <option value="commission">Highest commission</option>
                  <option value="date">Ending soonest</option>
                  <option value="newest">Newest</option>
                  <option value="promoted">Most promoted</option>
                </select>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white border border-white/10"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* City Filter */}
                <div>
                  <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">City</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    <button
                      onClick={() => setSelectedCity(null)}
                      className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        !selectedCity 
                          ? 'bg-primary/20 text-primary' 
                          : 'text-offwhite/60 hover:text-white'
                      }`}
                    >
                      All Cities
                    </button>
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => setSelectedCity(city)}
                        className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          selectedCity === city 
                            ? 'bg-primary/20 text-primary' 
                            : 'text-offwhite/60 hover:text-white'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Commission Filter */}
                <div>
                  <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Commission</h3>
                  <div className="space-y-3">
                    {[0, 15, 20, 25].map((threshold) => (
                      <label key={threshold} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="commission"
                          checked={minCommission === threshold}
                          onChange={() => setMinCommission(threshold)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-offwhite/60">
                          {threshold === 0 ? 'Any' : `${threshold}%+`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Sort By</h3>
                  <div className="space-y-2">
                    {[
                      { value: 'commission' as SortOption, label: 'Highest commission' },
                      { value: 'date' as SortOption, label: 'Ending soonest' },
                      { value: 'newest' as SortOption, label: 'Newest' },
                      { value: 'promoted' as SortOption, label: 'Most promoted' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="sort"
                          checked={sortBy === option.value}
                          onChange={() => setSortBy(option.value)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-offwhite/60">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="mt-6 text-white border-white/30 hover:bg-white/10"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedCity(null);
                  setMinCommission(0);
                  setSortBy('commission');
                  setShowFilters(false);
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Active Filters Display */}
          {activeFilters.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {activeFilters.map((filter, idx) => (
                <button
                  key={idx}
                  onClick={filter.clear}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm hover:bg-primary/30 transition-colors"
                >
                  {filter.label}
                  <X className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} showApplyButton />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-offwhite/40 text-lg">No events found matching your search.</p>
              <Button 
                variant="link" 
                className="text-primary mt-2"
                onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-2xl">
        <div className="bg-primary p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-6 border border-white/20">
          <div className="hidden sm:block">
            <p className="text-white font-bold">Ready to start earning?</p>
            <p className="text-white/80 text-xs">Apply as a creator to unlock all marketplace features.</p>
          </div>
          <Link href="/app/dashboard" className="w-full sm:w-auto">
            <Button variant="dark" className="w-full sm:w-auto bg-black hover:bg-black/80 border-none px-8 font-bold">
              Apply Now
            </Button>
          </Link>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
