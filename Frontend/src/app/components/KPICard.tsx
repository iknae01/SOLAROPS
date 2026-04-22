import { ReactNode } from 'react';

interface KPICardProps {
  label: string;
  value: string | number;
  supportText?: string;
  trend?: 'up' | 'down' | 'neutral';
  colorIndicator?: 'red' | 'orange' | 'green' | 'navy';
}

export function KPICard({ label, value, supportText, trend, colorIndicator }: KPICardProps) {
  const getColorClass = () => {
    switch (colorIndicator) {
      case 'red':
        return 'text-[var(--solar-red)]';
      case 'orange':
        return 'text-[var(--solar-orange)]';
      case 'green':
        return 'text-[var(--solar-green)]';
      case 'navy':
        return 'text-[var(--solar-navy)]';
      default:
        return 'text-[var(--solar-text)]';
    }
  };
  
  return (
    <div className="bg-white rounded-lg border border-[var(--solar-border)] p-6 shadow-sm">
      <div className="text-sm text-[var(--solar-text-muted)] mb-2">{label}</div>
      <div className={`text-3xl font-semibold mb-1 ${getColorClass()}`}>
        {value}
      </div>
      {supportText && (
        <div className="text-xs text-[var(--solar-text-muted)]">{supportText}</div>
      )}
    </div>
  );
}
