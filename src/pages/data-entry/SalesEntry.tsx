import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export const SalesEntry: React.FC = () => {
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: 1,
    customer_age_group: '',
    customer_gender: '',
    customer_location: '',
    payment_method: 'cash'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: product } = await supabase
        .from('products')
        .select('price')
        .eq('id', formData.product_id)
        .single();

      if (!product) {
        throw new Error('Product not found');
      }

      const revenue = product.price * formData.quantity;

      const { error } = await supabase
        .from('transactions')
        .insert([{
          ...formData,
          revenue
        }]);

      if (error) throw error;

      alert('Sale recorded successfully!');
      setFormData({
        product_id: '',
        quantity: 1,
        customer_age_group: '',
        customer_gender: '',
        customer_location: '',
        payment_method: 'cash'
      });
    } catch (error) {
      console.error('Error recording sale:', error);
      alert('Failed to record sale. Please try again.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Record New Sale</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product</label>
            <select
              value={formData.product_id}
              onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            >
              <option value="">Select a product</option>
              {/* Products will be loaded from Supabase */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Age Group</label>
            <select
              value={formData.customer_age_group}
              onChange={(e) => setFormData({ ...formData, customer_age_group: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option value="">Select age group</option>
              <option value="18-24">18-24</option>
              <option value="25-34">25-34</option>
              <option value="35-44">35-44</option>
              <option value="45-54">45-54</option>
              <option value="55+">55+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Gender</label>
            <select
              value={formData.customer_gender}
              onChange={(e) => setFormData({ ...formData, customer_gender: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Location</label>
            <input
              type="text"
              value={formData.customer_location}
              onChange={(e) => setFormData({ ...formData, customer_location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              placeholder="e.g., Colombo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Record Sale
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};