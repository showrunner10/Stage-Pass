'use client';

import { useMemo, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { EventCard } from '@/components/shared/EventCard';
import { events } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';

type SortType = 'Highest commission' | 'Ending soonest' | 'Newest' | 'Most promoted';
type DateRangeType = 'Any date' | 'Next 30 days' | 'Next 90 days';
type CommissionType = 'Any commission' | '10%+' | '12%+' | '15%+';

export default function CreatorMarketplace() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | string>('All');
  const [city, setCity] = useState<'All cities' | string>('All cities');
  const [dateRange, setDateRange] = useState<DateRangeType>('Any date');
  const [commissionFilter, setCommissionFilter] = useState<CommissionType>('Any commission');
  const [sortBy, setSortBy] = useState<SortType>('Highest commission');

  const categories = ['All', 'Festival', 'Warehouse Party', 'Wine Event', 'Conference', 'Live Music'];
  const cities = ['All cities', ...Array.from(new Set(events.map((e) => e.city)))];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = events
      .filter((e) => e.status === 'Live')
      .filter((e) => (category === 'All' ? true : e.category === category))
      .filter((e) => (city === 'All cities' ? true : e.city === city))
      .filter((e) => {
        if (commissionFilter === '10%+') return e.commission >= 10;
        if (commissionFilter === '12%+') return e.commission >= 12;
        if (commissionFilter === '15%+') return e.commission >= 15;
        return true;
      })
      .filter((e) => {
        if (dateRange === 'Any date') return true;
        const monthMap: Record<string, number> = {
          Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
        };
        const match = e.date.match(/([A-Za-z]{3})\s+(\d{1,2})/);
        if (!match) return true;
        const eventDate = new Date(new Date().getFullYear(), monthMap[match[1]], Number(match[2]));
        const now = new Date();
        const maxDays = dateRange === 'Next 30 days' ? 30 : 90;
        const delta = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return delta >= 0 && delta <= maxDays;
      })
      .filter((e) => {
        if (!q) return true;
        return [e.title, e.city, e.venue, e.promoter, e.category].some((v) => v.toLowerCase().includes(q));
      });

    if (sortBy === 'Newest') return base.sort((a, b) => b.id.localeCompare(a.id));
    if (sortBy === 'Most promoted') return base.sort((a, b) => b.soldCount - a.soldCount);
    if (sortBy === 'Ending soonest') {
      const monthMap: Record<string, number> = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
      };
      return base.sort((a, b) => {
        const am = a.date.match(/([A-Za-z]{3})\s+(\d{1,2})/);
        const bm = b.date.match(/([A-Za-z]{3})\s+(\d{1,2})/);
        const ad = am ? new Date(new Date().getFullYear(), monthMap[am[1]], Number(am[2])).getTime() : Number.MAX_SAFE_INTEGER;
        const bd = bm ? new Date(new Date().getFullYear(), monthMap[bm[1]], Number(bm[2])).getTime() : Number.MAX_SAFE_INTEGER;
        return ad - bd;
      });
    }
    return base.sort((a, b) => b.commission - a.commission);
  }, [query, category, city, dateRange, commissionFilter, sortBy]);

  return (
    <DashboardShell>
      <div className="space-y-8 pb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white">Marketplace</h1>
            <p className="text-offwhite/50">Discover events by category, city, date range, and commission potential.</p>
          </div>

          <div className="relative w-full lg:w-[460px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-offwhite/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, city, venue, promoter"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="space-y-4 pb-6 border-b border-white/10">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  category === c
                    ? 'bg-primary/20 border-primary/45 text-white'
                    : 'bg-white/5 border-white/10 text-offwhite/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-offwhite/80"
            >
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRangeType)}
              className="appearance-none bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-offwhite/80"
            >
              <option>Any date</option>
              <option>Next 30 days</option>
              <option>Next 90 days</option>
            </select>
            <select
              value={commissionFilter}
              onChange={(e) => setCommissionFilter(e.target.value as CommissionType)}
              className="appearance-none bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-offwhite/80"
            >
              <option>Any commission</option>
              <option>10%+</option>
              <option>12%+</option>
              <option>15%+</option>
            </select>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="appearance-none bg-white/5 border border-white/10 rounded-xl py-2.5 pl-4 pr-9 text-sm text-offwhite/80"
              >
                <option>Highest commission</option>
                <option>Ending soonest</option>
                <option>Newest</option>
                <option>Most promoted</option>
              </select>
              <ChevronDown className="w-4 h-4 text-offwhite/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <Button variant="ghost" size="icon" className="text-white border border-white/10">
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} href={`/events/${event.slug}`} showApplyButton />
          ))}
        </div>

        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-2xl rounded-2xl border border-primary/35 bg-dark/95 backdrop-blur-md px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-offwhite/50 uppercase tracking-widest">Quick action</div>
            <div className="text-sm text-white font-semibold">Build a tracked campaign in under 2 minutes</div>
          </div>
          <Button variant="premium" className="h-10 whitespace-nowrap">Launch builder</Button>
        </div>
      </div>
    </DashboardShell>
  );
}
