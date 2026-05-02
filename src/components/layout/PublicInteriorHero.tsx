import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PublicInteriorHeroProps = {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  className?: string;
  /** Narrower readable column for long-form intros */
  narrow?: boolean;
};

export function PublicInteriorHero({ eyebrow, title, children, className, narrow }: PublicInteriorHeroProps) {
  return (
    <section
      className={cn(
        'relative py-20 md:py-28 lg:py-32 border-b border-white/10 overflow-hidden',
        className,
      )}
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/16 via-transparent to-primary/[0.07]" />
      <div className="absolute inset-0 z-0 light-particles opacity-[0.35]" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(25,105,255,0.12),transparent)]" />
      <div className="page-shell relative z-10">
        <div className={cn(narrow ? 'max-w-3xl' : 'max-w-4xl')}>
          {eyebrow ? (
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary mb-4">{eyebrow}</p>
          ) : null}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-[-0.03em] leading-[1.05] text-balance">
            {title}
          </h1>
          {children ? <div className="mt-6 md:mt-8">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
