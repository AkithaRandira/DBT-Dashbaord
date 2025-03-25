import React, { useState } from 'react';
import { BarChart, LineChart, Leaf, Store } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { StatCard } from '../components/StatCard';
import { salesData, productSales, storeSales } from '../data/sampleData';
import { formatCurrency } from '../utils/format';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Updated colors for better differentiation
const COLORS = ['#2563eb', '#7c3aed', '#db2777'];
const STORE_CHART_COLOR = '#2563eb';
const LINE_COLORS = {
  total: '#059669',
  retail: '#2563eb',
  direct: '#7c3aed'
};

export const Dashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <div className="flex space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Sales"
            value={formatCurrency(245000)}
            trend={12}
            icon={<BarChart className="h-6 w-6" />}
          />
          <StatCard
            title="Best Product"
            value="Deniyaya Gold 200g"
            icon={<Leaf className="h-6 w-6" />}
          />
          <StatCard
            title="Best Store"
            value="SuperMart Central"
            icon={<Store className="h-6 w-6" />}
          />
          <StatCard
            title="Direct Sales"
            value={formatCurrency(98000)}
            trend={-5}
            icon={<LineChart className="h-6 w-6" />}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DashboardCard title="Sales by Product" className="min-h-[400px]">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={productSales}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={140}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {productSales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </DashboardCard>

          <DashboardCard title="Sales by Store" className="min-h-[400px]">
            <ResponsiveContainer width="100%" height={350}>
              <RechartsBarChart data={storeSales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `Rs. ${value / 1000}K`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="value" fill={STORE_CHART_COLOR} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </DashboardCard>

          <DashboardCard title="Monthly Trends" className="lg:col-span-2 min-h-[400px]">
            <ResponsiveContainer width="100%" height={350}>
              <RechartsLineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `Rs. ${value / 1000}K`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke={LINE_COLORS.total} 
                  strokeWidth={2}
                  name="Total Sales"
                />
                <Line 
                  type="monotone" 
                  dataKey="retail" 
                  stroke={LINE_COLORS.retail} 
                  strokeWidth={2}
                  name="Retail Sales"
                />
                <Line 
                  type="monotone" 
                  dataKey="direct" 
                  stroke={LINE_COLORS.direct} 
                  strokeWidth={2}
                  name="Direct Sales"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </DashboardCard>
        </div>
      </main>
    </div>
  );
};