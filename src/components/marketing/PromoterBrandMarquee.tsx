'use client';

const PARTNERS = ['SECRET SOUNDS', 'PULSE', 'VINO', 'HORIZON', 'LANEWAY'] as const;

/** Infinite R→L scroll; track is duplicated for seamless loop (see globals `.experience-marquee-track`). */
export function PromoterBrandMarquee() {
  const track = [...PARTNERS, ...PARTNERS];

  return (
    <div className="bg-[#020202] overflow-hidden" aria-label="Partner promoters">
      <div className="experience-marquee-track partner-marquee-speed flex w-max items-center py-8 md:py-10">
        {track.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="shrink-0 flex items-center gap-10 md:gap-16 pr-10 md:pr-16"
          >
            <span className="font-display text-2xl sm:text-3xl md:text-[2.25rem] font-bold uppercase tracking-[0.08em] text-white/55 whitespace-nowrap">
              {name}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}
