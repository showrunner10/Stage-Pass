'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/data/mock';
import { MapPin, Calendar, Briefcase } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  href?: string;
  showApplyButton?: boolean;
}

export function EventCard({ event, href, showApplyButton = false }: EventCardProps) {
  const linkHref = href || `/events/${event.slug}`;
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Link href={linkHref} className="block group page-fade-in">
      <Card className="overflow-hidden rounded-2xl hover-lift premium-ring border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.03] transition-all duration-300 group-hover:shadow-[0_26px_44px_-20px_rgba(0,0,0,0.95)] group-hover:border-primary/45 group-hover:[box-shadow:0_0_0_1px_rgba(83,74,183,0.28),0_26px_44px_-20px_rgba(0,0,0,0.95)]">
        <div className="relative aspect-[16/10] overflow-hidden">
          {!imageFailed ? (
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.08]"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(130deg,#111827,#0b254d_55%,#111827)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-primary/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/30 to-transparent" />

          <div className="absolute top-3 right-3">
            <Badge variant="premium" className="bg-primary/90 text-white border-primary/35 px-3 py-1 text-[10px] font-bold shadow-[0_8px_18px_-10px_rgba(83,74,183,1)]">
              {event.commission}% - {formatCurrency(event.commissionFixed)} per sale
            </Badge>
          </div>

          <div className="absolute left-3 bottom-3">
            <Badge variant="secondary" className="bg-black/55 border-white/20 text-offwhite/90">
              {event.category}
            </Badge>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/35 backdrop-blur-md border-t border-white/10">
            <h3 className="text-xl font-extrabold text-white group-hover:text-primary transition-colors line-clamp-1">
              {event.title}
            </h3>
          </div>
        </div>

        <CardContent className="p-5 space-y-4">
          <div className="space-y-2 text-sm text-offwhite/60 leading-relaxed">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{event.venue}, {event.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              <span>{event.promoter}</span>
            </div>
          </div>
        </CardContent>

        {showApplyButton && (
          <CardFooter className="p-5 pt-0">
            <div className="w-full py-2 text-center rounded-lg bg-primary/15 text-primary font-semibold border border-primary/30 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              Apply to Promote
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
