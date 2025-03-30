import React, { useEffect, useState } from 'react';
import { BarChart, LineChart, Leaf, Store } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
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
  Cell,
} from 'recharts';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../components/StatCard';


const COLORS = ['#2563eb', '#7c3aed', '#db2777'];
const STORE_CHART_COLOR = '#2563eb';
const LINE_COLORS = {
  total: '#059669',
  retail: '#2563eb',
  direct: '#7c3aed',
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const [productSales, setProductSales] = useState<{ name: string; value: number }[]>([]);
  const [storeSales, setStoreSales] = useState<{ name: string; value: number }[]>([]);
  const [monthlySales, setMonthlySales] = useState<
    { month: string; total: number; retail: number; direct: number }[]
  >([]);
  const [stats, setStats] = useState<{
    total: number;
    bestProduct: string;
    bestStore: string;
    directTotal: number;
  }>({
    total: 0,
    bestProduct: '',
    bestStore: '',
    directTotal: 0,
  });

  useEffect(() => {
    const loadInsights = async () => {
      const { data: invoices } = await supabase.from('invoices').select('*');

      const now = new Date();
      let filteredInvoices = invoices || [];

      if (selectedPeriod === 'month') {
        filteredInvoices = filteredInvoices.filter(inv => {
          const date = new Date(inv.date);
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        });
      } else if (selectedPeriod === 'year') {
        filteredInvoices = filteredInvoices.filter(inv => {
          const date = new Date(inv.date);
          return date.getFullYear() === now.getFullYear();
        });
      }

      const total = filteredInvoices.reduce((sum, i) => sum + i.total, 0);
      const directTotal = filteredInvoices
        .filter(i => i.channel === 'direct')
        .reduce((s, i) => s + i.total, 0);

      const { data: items } = await supabase
        .from('invoice_items')
        .select('product_id, total, products(name)');

      const productMap = new Map<string, number>();
      items?.forEach(item => {
        const name = Array.isArray(item.products)
          ? (item.products[0] as { name: string })?.name
          : (item.products as { name: string })?.name;
        if (!name) return;
        productMap.set(name, (productMap.get(name) || 0) + item.total);
      });

      const productSales = Array.from(productMap.entries()).map(
        ([name, value]: [string, number]) => ({ name, value })
      );

      const { data: storeInvoices } = await supabase.from('invoices').select('total, shops(name)');
      const storeMap = new Map<string, number>();
      storeInvoices?.forEach(inv => {
        const name = Array.isArray(inv.shops) && inv.shops.length > 0 ? inv.shops[0].name : undefined;
        if (!name) return;
        storeMap.set(name, (storeMap.get(name) || 0) + inv.total);
      });

      const storeSales = Array.from(storeMap.entries()).map(
        ([name, value]: [string, number]) => ({ name, value })
      );

      const monthly = new Map<string, { total: number; retail: number; direct: number }>();
      filteredInvoices.forEach(inv => {
        const month = new Date(inv.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!monthly.has(month)) {
          monthly.set(month, { total: 0, retail: 0, direct: 0 });
        }
        const m = monthly.get(month)!;
        m.total += inv.total;
        if (inv.channel === 'retail' || inv.channel === 'direct') {
          if (inv.channel === 'retail' || inv.channel === 'direct') {
            if (inv.channel === 'retail' || inv.channel === 'direct') {
              m[inv.channel as keyof typeof m] += inv.total;
            }
          }
        }
      });

      const monthlySales = Array.from(monthly.entries()).map(([month, values]) => ({
        month,
        ...values,
      }));

      setProductSales(productSales);
      setStoreSales(storeSales);
      setMonthlySales(monthlySales);
      setStats({
        total,
        bestProduct: productSales[0]?.name || '',
        bestStore: storeSales[0]?.name || '',
        directTotal,
      });
    };

    loadInsights();
  }, [selectedPeriod]);

  return (
    <div className="min-h-screen bg-gray-50">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Sales"
            value={formatCurrency(stats.total)}
            trend={12}
            icon={<BarChart />}
            onClick={() => navigate('/sales')}
          />
          <StatCard
            title="Best Product"
            value={stats.bestProduct}
            icon={<Leaf />}
          />
          <StatCard
            title="Best Store"
            value={stats.bestStore}
            icon={<Store />}
            onClick={() => navigate(`/sales?store=${encodeURIComponent(stats.bestStore)}`)}
          />
          <StatCard
            title="Direct Sales"
            value={formatCurrency(stats.directTotal)}
            trend={-5}
            icon={<LineChart />}
            onClick={() => navigate(`/sales?channel=direct`)}
          />
        </div>

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
                  {productSales.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
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
              <RechartsLineChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `Rs. ${value / 1000}K`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line type="monotone" dataKey="total" stroke={LINE_COLORS.total} strokeWidth={2} />
                <Line type="monotone" dataKey="retail" stroke={LINE_COLORS.retail} strokeWidth={2} />
                <Line type="monotone" dataKey="direct" stroke={LINE_COLORS.direct} strokeWidth={2} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </DashboardCard>
        </div>
      </main>
    </div>
  );
};
