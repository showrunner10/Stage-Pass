'use client';

import { cn } from '@/lib/utils';

export function Stepper({
  steps,
  currentIndex,
}: {
  steps: string[];
  currentIndex: number;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {steps.map((label, idx) => {
          const isActive = idx === currentIndex;
          const isDone = idx < currentIndex;
          return (
            <div key={label} className="flex-1">
              <div className="flex items-center">
                <div
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border transition-colors',
                    isDone
                      ? 'bg-accent-green border-accent-green text-white'
                      : isActive
                      ? 'bg-primary border-primary text-white'
                      : 'bg-white/5 border-white/10 text-offwhite/40'
                  )}
                >
                  {idx + 1}
                </div>
                {idx !== steps.length - 1 && (
                  <div
                    className={cn(
                      'h-[2px] flex-1 mx-2',
                      isDone ? 'bg-accent-green' : 'bg-white/10'
                    )}
                  />
                )}
              </div>
              <div
                className={cn(
                  'mt-2 text-xs font-bold uppercase tracking-widest',
                  isActive ? 'text-white' : 'text-offwhite/40'
                )}
              >
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
