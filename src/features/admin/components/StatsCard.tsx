import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow';
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  subtitle?: string;
  className?: string;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    change: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    change: 'text-green-600',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    change: 'text-purple-600',
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    change: 'text-orange-600',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    change: 'text-red-600',
  },
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-600',
    change: 'text-yellow-600',
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  change,
  subtitle,
  className = '',
}) => {
  const colors = colorClasses[color];

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${colors.bg}`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
      </div>

      {change && (
        <div className="mt-4 flex items-center text-sm">
          {change.type === 'increase' ? (
            <TrendingUp className={`w-4 h-4 mr-1 ${colors.change}`} />
          ) : (
            <TrendingDown className={`w-4 h-4 mr-1 text-red-500`} />
          )}
          <span className={change.type === 'increase' ? colors.change : 'text-red-500'}>
            {change.type === 'increase' ? '+' : '-'}{change.value}%
          </span>
          <span className="text-gray-500 ml-1">from last period</span>
        </div>
      )}
    </div>
  );
};