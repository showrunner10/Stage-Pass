'use client';

import { useState } from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { EventCard } from '@/components/shared/EventCard';
import { events } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Festival', 'Warehouse Party', 'Wine Event', 'Conference', 'Live Music'];
  const filteredEvents = events.filter(event => 
    (selectedCategory === 'All' || event.category === selectedCategory) &&
    (event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     event.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-dark">
      <PublicNavbar />
      
      <main className="pt-32 pb-20">
        <div className="page-shell">
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
                <span>Sort by:</span>
                <button className="flex items-center gap-1 text-white font-medium">
                  Highest commission <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <Button variant="ghost" size="icon" className="text-white border border-white/10">
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

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
