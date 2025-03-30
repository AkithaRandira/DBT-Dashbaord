import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { formatCurrency } from '../utils/format';
import { useNavigate } from 'react-router-dom';

interface Invoice {
  id: string;
  date: string;
  total: number;
  discount: number;
  channel: string;
  shops: {
    name: string;
  } | null;
}

export const SalesList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('id, date, total, discount, channel, shops(name)')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching invoices:', error);
      } else {
        setInvoices(
          (data || []).map((inv: any) => ({
            ...inv,
            shops: inv.shops?.[0] || null,
          }))
        );
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">All Sales Invoices</h1>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shop</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Channel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{new Date(inv.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm">{inv.shops?.name || 'N/A'}</td>
                <td className="px-6 py-4 text-sm capitalize">{inv.channel}</td>
                <td className="px-6 py-4 text-sm">{formatCurrency(inv.total)}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => navigate(`/sales/${inv.id}`)}
                    className="text-emerald-600 hover:text-emerald-900 underline text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {invoices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
