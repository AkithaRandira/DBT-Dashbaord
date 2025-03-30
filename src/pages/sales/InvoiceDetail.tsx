import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabase';
import { formatCurrency } from '../../utils/format';

interface Invoice {
  id: string;
  date: string;
  channel: string;
  discount: number;
  total: number;
  shops: { name: string }[];
}

interface InvoiceItem {
  id: string;
  quantity: number;
  price: number;
  total: number;
  products: { name: string }[];
}

export const InvoiceDetail: React.FC = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);

  useEffect(() => {
    if (!id) return;

    const loadInvoice = async () => {
      const { data: invData } = await supabase
        .from('invoices')
        .select('*, shops(name)')
        .eq('id', id)
        .single();

      const { data: itemData } = await supabase
        .from('invoice_items')
        .select('*, products(name)')
        .eq('invoice_id', id);

      setInvoice(invData);
      setItems(itemData || []);
    };

    loadInvoice();
  }, [id]);

  if (!invoice) return <div className="p-8">Loading invoice details...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Invoice Details</h1>

      <div className="bg-white shadow p-6 rounded mb-6">
        <p><strong>Store:</strong> {invoice.shops?.[0]?.name}</p>
        <p><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</p>
        <p><strong>Channel:</strong> {invoice.channel}</p>
        <p><strong>Discount:</strong> {invoice.discount}%</p>
        <p><strong>Total:</strong> {formatCurrency(invoice.total)}</p>
      </div>

      <div className="bg-white shadow p-6 rounded">
        <h2 className="text-lg font-semibold mb-4">Items</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Product</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Quantity</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Price</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2">{item.products?.[0]?.name || '-'}</td>
                <td className="px-4 py-2 text-right">{item.quantity}</td>
                <td className="px-4 py-2 text-right">{formatCurrency(item.price)}</td>
                <td className="px-4 py-2 text-right">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
