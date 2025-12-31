import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  gradient: string;
  sublabel?: ReactNode;
}

export default function StatsCard({ icon: Icon, value, label, gradient, sublabel }: StatsCardProps) {
  return (
    <div className="custom-card p-6 rounded-2xl">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="stat-number text-3xl font-black text-gray-900 mb-1">
        {value}
      </div>
      <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
        {label}
      </div>
      {sublabel && (
        <div className="mt-2 text-xs text-gray-500">
          {sublabel}
        </div>
      )}
    </div>
  );
}
