import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <h4 className="text-2xl font-bold text-gray-800 mt-1">{value}</h4>
        </div>
        {icon && <div className="text-emerald-600">{icon}</div>}
      </div>
      {trend !== undefined && (
        <div className="mt-4 flex items-center">
          {trend >= 0 ? (
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span
            className={`ml-2 text-sm ${
              trend >= 0 ? 'text-emerald-500' : 'text-red-500'
            }`}
          >
            {Math.abs(trend)}% vs last month
          </span>
        </div>
      )}
    </div>
  );
};