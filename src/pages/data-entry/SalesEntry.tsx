import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { formatCurrency } from '../../utils/format';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Shop {
  id: string;
  name: string;
}

interface Item {
  product_id: string;
  quantity: number;
  price: number;
  total: number;
}

export const SalesEntry: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);

  const [form, setForm] = useState({
    shop_id: '',
    channel: 'retail',
    date: new Date().toISOString().split('T')[0],
    discount: 0,
    status: 'pending',
  });

  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: productData } = await supabase.from('products').select('id, name, price');
      const { data: shopData } = await supabase.from('shops').select('id, name');
      setProducts(productData || []);
      setShops(shopData || []);
    };
    fetchData();
  }, []);

  const handleItemChange = (index: number, field: keyof Item, value: string | number) => {
    const updated = [...items];
    const item = updated[index];

    if (field === 'product_id') {
      const selected = products.find(p => p.id === value);
      if (selected) {
        item.product_id = selected.id;
        item.price = selected.price;
        item.total = selected.price * item.quantity;
      }
    } else if (field === 'quantity') {
      const qty = parseInt(value as string) || 0;
      item.quantity = qty;
      item.total = qty * item.price;
    }

    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([...items, { product_id: '', quantity: 1, price: 0, total: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const totalBeforeDiscount = items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = (totalBeforeDiscount * (Number(form.discount) || 0)) / 100;
  const grandTotal = totalBeforeDiscount - discountAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: invoiceData, error: invoiceError } = await supabase.from('invoices').insert([{
      ...form,
      discount: Number(form.discount),
      total: grandTotal,
    }]).select();

    if (invoiceError || !invoiceData || invoiceData.length === 0) {
      toast.error('❌ Failed to create invoice');
      console.error(invoiceError);
      return;
    }

    const invoiceId = invoiceData[0].id;
    const itemPayload = items.map(item => ({
      invoice_id: invoiceId,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    }));

    const { error: itemsError } = await supabase.from('invoice_items').insert(itemPayload);

    if (itemsError) {
      toast.error('❌ Failed to save items');
      console.error(itemsError);
    } else {
      toast.success('✅ Invoice saved!');
      setItems([]);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Invoice</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow rounded">
        <select name="shop_id" value={form.shop_id} onChange={handleFormChange} required className="w-full border p-2 rounded">
          <option value="">Select Shop</option>
          {shops.map(shop => <option key={shop.id} value={shop.id}>{shop.name}</option>)}
        </select>

        <select name="channel" value={form.channel} onChange={handleFormChange} className="w-full border p-2 rounded">
          <option value="retail">Retail</option>
          <option value="direct">Direct</option>
        </select>

        <input type="date" name="date" value={form.date} onChange={handleFormChange} className="w-full border p-2 rounded" />

        <input
          type="number"
          name="discount"
          value={form.discount}
          onChange={handleFormChange}
          placeholder="Discount %"
          className="w-full border p-2 rounded"
        />

        <div>
          <h2 className="text-lg font-semibold mb-2">Items</h2>
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-6 gap-2 items-center mb-2">
              <select
                value={item.product_id}
                onChange={(e) => handleItemChange(idx, 'product_id', e.target.value)}
                className="col-span-2 border p-2 rounded"
              >
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>

              <input
                type="number"
                value={item.quantity}
                min={1}
                onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                className="col-span-1 border p-2 rounded"
              />

              <div className="col-span-2">{formatCurrency(item.total)}</div>
              <button type="button" onClick={() => handleRemoveItem(idx)} className="text-red-600">Remove</button>
            </div>
          ))}

          <button type="button" onClick={handleAddItem} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
            + Add Item
          </button>
        </div>

        <div className="text-right font-bold">
          Total: {formatCurrency(grandTotal)}
        </div>

        <div className="text-right">
          <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700">
            Save Invoice
          </button>
        </div>
      </form>
    </div>
  );
};