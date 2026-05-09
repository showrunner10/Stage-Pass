'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { dismissToast, subscribeToToasts, type ToastItem } from '@/components/ui/toast-store';

function toneStyles(tone: ToastItem['tone']) {
  if (tone === 'success') {
    return {
      card: 'border-emerald-500/30 bg-emerald-500/12 text-emerald-50',
      icon: 'text-emerald-300',
    };
  }

  if (tone === 'error') {
    return {
      card: 'border-red-500/30 bg-red-500/12 text-red-50',
      icon: 'text-red-300',
    };
  }

  return {
    card: 'border-white/15 bg-white/10 text-white',
    icon: 'text-primary',
  };
}

function ToneIcon({ tone }: { tone: ToastItem['tone'] }) {
  if (tone === 'success') return <CheckCircle2 className="h-5 w-5" />;
  if (tone === 'error') return <AlertCircle className="h-5 w-5" />;
  return <Info className="h-5 w-5" />;
}

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => subscribeToToasts(setItems), []);

  if (!items.length) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
      {items.map((item) => {
        const styles = toneStyles(item.tone);
        return (
          <div
            key={item.id}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.65)] backdrop-blur-md ${styles.card}`}
          >
            <div className="flex items-start gap-3">
              <div className={`${styles.icon} mt-0.5`}>
                <ToneIcon tone={item.tone} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{item.title}</div>
                {item.description ? <div className="mt-1 text-xs text-current/80">{item.description}</div> : null}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(item.id)}
                className="rounded-full p-1 text-current/70 transition hover:bg-white/10 hover:text-current"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
