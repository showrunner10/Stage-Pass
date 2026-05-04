'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';

const experienceCategories = [
  { label: 'Events', href: '/events?category=Events', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=640&q=80' },
  { label: 'Festivals', href: '/events?category=Festival', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=640&q=80' },
  { label: 'Nightlife', href: '/events?category=Warehouse%20Party', image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=640&q=80' },
  { label: 'Wellness', href: '/events?category=Wellness', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=640&q=80' },
];

type TiltVars = { rx: string; ry: string; tz: string; sc: string };

function CategoryTiltCard({
  cat,
  baseRyDeg,
}: {
  cat: (typeof experienceCategories)[number];
  baseRyDeg: number;
}) {
  const faceRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<TiltVars | null>(null);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const applyTilt = useCallback((vars: TiltVars) => {
    const el = faceRef.current;
    if (!el) return;
    el.style.setProperty('--rx', vars.rx);
    el.style.setProperty('--ry', vars.ry);
    el.style.setProperty('--tz', vars.tz);
    el.style.setProperty('--sc', vars.sc);
  }, []);

  const flushTilt = useCallback(() => {
    rafRef.current = null;
    if (pendingRef.current) applyTilt(pendingRef.current);
  }, [applyTilt]);

  const queueTilt = useCallback(
    (vars: TiltVars) => {
      pendingRef.current = vars;
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(flushTilt);
    },
    [flushTilt],
  );

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const face = faceRef.current;
    const link = e.currentTarget;
    if (!face) return;

    face.classList.add('category-tilt-face--hot');
    face.style.transition = 'none';

    const rect = link.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const px = (x - 0.5) * 2;
    const py = (y - 0.5) * 2;

    const maxRy = 22;
    const maxRx = 16;
    const ry = baseRyDeg + px * maxRy;
    const rx = py * -maxRx;
    const tz = '56px';
    const sc = '1.12';

    queueTilt({ rx: `${rx}deg`, ry: `${ry}deg`, tz, sc });
  };

  const handleLeave = () => {
    const face = faceRef.current;
    if (face) {
      face.classList.remove('category-tilt-face--hot');
      face.style.transition =
        'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.55s ease, border-color 0.55s ease';
    }
    queueTilt({
      rx: '0deg',
      ry: `${baseRyDeg}deg`,
      tz: '0px',
      sc: '1',
    });
  };

  const initialStyle = {
    ['--rx' as string]: '0deg',
    ['--ry' as string]: `${baseRyDeg}deg`,
    ['--tz' as string]: '0px',
    ['--sc' as string]: '1',
  } as React.CSSProperties;

  return (
    <Link
      href={cat.href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={[
        'group category-discover-card-wrap block shrink-0 w-[42vw] max-w-[200px] md:max-w-[230px]',
        'snap-center snap-always md:snap-none',
        '[perspective:1200px] [perspective-origin:center_center]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] rounded-2xl',
      ].join(' ')}
    >
      <div
        ref={faceRef}
        style={{
          ...initialStyle,
          transform:
            'rotateX(var(--rx)) rotateY(var(--ry)) translateZ(var(--tz)) scale(var(--sc))',
        }}
        className={[
          'category-tilt-face relative aspect-[4/5] md:aspect-[3/4] rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden',
          'shadow-[0_24px_56px_-32px_rgba(0,0,0,0.95)]',
          'transform-gpu [transform-style:preserve-3d] will-change-transform',
          'transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        ].join(' ')}
      >
        <Image
          src={cat.image}
          alt=""
          fill
          sizes="230px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.14] pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.92]" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/25 via-primary/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-left pointer-events-none">
          <span className="font-display text-lg md:text-xl font-semibold uppercase tracking-wide text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            {cat.label}
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Horizontal strip + pointer-follow 3D tilt (CSS vars + rAF, no React state). */
export function CategoryDiscoverStrip() {
  return (
    <section className="category-discover-section border-b border-white/[0.07] bg-[#030303] relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="page-shell relative py-10 md:py-14">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-500 mb-8">
          Discover by category
        </p>

        <div className="relative -mx-4 sm:mx-0">
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-4 w-10 sm:w-14 z-[1] bg-gradient-to-r from-[#030303] to-transparent md:hidden"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-4 w-10 sm:w-14 z-[1] bg-gradient-to-l from-[#030303] to-transparent md:hidden"
            aria-hidden
          />

          <div className="category-discover-scroller flex gap-4 md:gap-6 md:justify-center px-6 sm:px-2 md:px-0 pb-2 scroll-smooth">
            {experienceCategories.map((cat, index) => (
              <CategoryTiltCard key={cat.label} cat={cat} baseRyDeg={index % 2 === 0 ? 5 : -5} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
