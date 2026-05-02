'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

function useCountUp(target: number, duration = 900) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const start = performance.now();
    let frameId = 0;

    const frame = (now: number) => {
      if (cancelled) return;
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(target * eased);
      if (progress < 1 && !cancelled) frameId = requestAnimationFrame(frame);
    };

    frameId = requestAnimationFrame(frame);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
    };
  }, [target, duration]);

  return count;
}

export function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: MetricCardProps) {
  const numericValue = useMemo(() => {
    if (typeof value === 'number') return value;
    const stripped = value.replace(/[^\d.]/g, '');
    return Number(stripped);
  }, [value]);

  const animatedValue = useCountUp(Number.isFinite(numericValue) ? numericValue : 0);

  const renderedValue = useMemo(() => {
    if (typeof value === 'number') {
      return Number.isInteger(value)
        ? Math.round(animatedValue).toLocaleString()
        : animatedValue.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }
    const stripped = value.replace(/[^\d.]/g, '');
    const decimals = stripped.includes('.') ? stripped.split('.')[1].length : 0;
    if (value.includes('$')) {
      return `$${animatedValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}`;
    }
    if (value.includes('%')) {
      return `${animatedValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}%`;
    }
    return value;
  }, [value, animatedValue]);

  return (
    <Card className={cn('bg-gradient-to-b from-white/[0.08] to-white/[0.03] border-white/10 hover-lift transition-all duration-300', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold text-offwhite/65 tracking-wide">{title}</CardTitle>
        {icon && <div className="text-primary">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-extrabold text-white leading-none">{renderedValue}</div>
        {(description || trend) && (
          <p className="text-xs text-offwhite/45 mt-2 leading-relaxed">
            {trend && (
              <span
                className={cn(
                  'mr-1 font-semibold',
                  trend.isPositive ? 'text-accent-green' : 'text-red-400',
                )}
              >
                {trend.isPositive ? '+' : '-'}
                {Math.abs(trend.value)}%
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
