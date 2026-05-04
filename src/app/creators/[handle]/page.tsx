import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { campaigns, creators, events } from '@/data/mock';
import { Calendar, MapPin, PlayCircle } from 'lucide-react';

export default async function CreatorProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const normalized = handle.toLowerCase();
  const creator = creators.find((item) => {
    const byHandle = item.handle.toLowerCase() === normalized;
    const bySlugName = item.name.toLowerCase().replace(/\s+/g, '-') === normalized;
    return byHandle || bySlugName;
  });

  if (!creator) return notFound();

  const creatorCampaigns = campaigns.filter((campaign) => campaign.creatorId === creator.id);
  const promotingEvents = creatorCampaigns
    .map((campaign) => events.find((event) => event.id === campaign.eventId))
    .filter((event): event is NonNullable<typeof event> => Boolean(event));
  const attendingEvents = events.filter((event) => event.city === promotingEvents[0]?.city).slice(0, 3);

  const videoCards = [
    {
      id: 'v1',
      title: `${creator.name.split(' ')[0]}'s Festival Teaser`,
      platform: 'Instagram Reel',
      tag: promotingEvents[0]?.title ?? 'Live Campaign',
      image: promotingEvents[0]?.image ?? creator.avatar,
    },
    {
      id: 'v2',
      title: 'Behind the scenes prep',
      platform: 'TikTok',
      tag: promotingEvents[1]?.title ?? 'Creator Diary',
      image: promotingEvents[1]?.image ?? creator.avatar,
    },
  ];

  return (
    <div className="min-h-screen bg-dark">
      <PublicNavbar />
      <main className="pb-20">
        <section className="border-b border-white/10 py-16 md:py-20">
          <div className="page-shell">
            <div className="flex flex-col md:flex-row gap-8 md:items-center">
              <div className="relative w-28 h-28 rounded-full overflow-hidden border border-white/20">
                <Image src={creator.avatar} alt={creator.name} fill sizes="112px" className="object-cover" />
              </div>
              <div>
                <p className="text-primary text-sm uppercase tracking-[0.2em] font-semibold mb-2">Creator Profile</p>
                <h1 className="text-4xl md:text-5xl font-black text-white">{creator.name}</h1>
                <p className="text-offwhite/65 mt-2">@{creator.handle} · {promotingEvents[0]?.city ?? 'Sydney'}</p>
                <p className="text-offwhite/55 mt-3 max-w-2xl">
                  {creator.name.split(' ')[0]} shares event-first content around {creator.niche.toLowerCase()} and publishes campaign videos that drive ticket sales.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-white/10 border-white/20 text-white">{creator.niche}</Badge>
                  <Badge variant="secondary" className="bg-white/10 border-white/20 text-white">{creator.audienceSize} audience</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="app-section">
          <div className="page-shell">
            <h2 className="text-3xl font-extrabold text-white mb-6">Events I&apos;m Attending</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {attendingEvents.map((event) => (
                <div key={event.id} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                  <div className="relative h-40">
                    <Image src={event.image} alt={event.title} fill sizes="400px" className="object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-bold mb-2">{event.title}</h3>
                    <div className="text-sm text-offwhite/60 space-y-1 mb-4">
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" />{event.date}</div>
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />{event.city} · {event.venue}</div>
                    </div>
                    <Link href={`/events/${event.slug}`} className="text-primary text-sm font-semibold hover:text-primary/80">
                      View event
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="app-section pt-0">
          <div className="page-shell">
            <h2 className="text-3xl font-extrabold text-white mb-6">Campaigns I&apos;m Promoting</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {creatorCampaigns.map((campaign) => {
                const event = events.find((item) => item.id === campaign.eventId);
                return (
                  <div key={campaign.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <p className="text-primary text-xs uppercase tracking-[0.18em] mb-2">{campaign.status}</p>
                    <h3 className="text-white text-xl font-bold mb-2">{campaign.name}</h3>
                    <p className="text-offwhite/60 mb-4">{campaign.headline}</p>
                    {event ? (
                      <Link href={`/events/${event.slug}`} className="text-sm text-primary font-semibold hover:text-primary/80">
                        View event campaign
                      </Link>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="app-section pt-0">
          <div className="page-shell">
            <h2 className="text-3xl font-extrabold text-white mb-6">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videoCards.map((video) => (
                <div key={video.id} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                  <div className="relative h-44">
                    <Image src={video.image} alt={video.title} fill sizes="600px" className="object-cover" />
                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-white/90" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-bold">{video.title}</h3>
                    <p className="text-sm text-offwhite/55 mt-1">{video.platform} · {video.tag}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">Apply to Promote with {creator.name.split(' ')[0]}</Button>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
