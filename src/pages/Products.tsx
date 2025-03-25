import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/format';


type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  inventory_level: number;
  reorder_point: number;
};

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    cost: '',
    inventory_level: '',
    reorder_point: '',
  });

  const fetchProducts = async () => {
    const response = await supabase.from('products').select('*');
    const data = response.data as Product[] | null;
    const error = response.error;

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      description: form.description,
      category: form.category,
      price: parseFloat(form.price),
      cost: parseFloat(form.cost),
      inventory_level: parseInt(form.inventory_level),
      reorder_point: parseInt(form.reorder_point),
    };

    if (isEditing && editId) {
      const { error } = await supabase.from('products').update(payload).eq('id', editId);
      if (error) {
        alert('Failed to update product');
      }
    } else {
      const { error } = await supabase.from('products').insert([payload]);
      if (error) {
        console.error('Supabase insert error:', error); 
        alert('Failed to add product');
      }
      
    }

    setShowFormModal(false);
    setIsEditing(false);
    setEditId(null);
    setForm({
      name: '',
      description: '',
      category: '',
      price: '',
      cost: '',
      inventory_level: '',
      reorder_point: '',
    });
    fetchProducts();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('products').delete().eq('id', deleteId);
    if (error) {
      alert('Failed to delete product');
    }
    setDeleteId(null);
    setShowDeleteModal(false);
    fetchProducts();
  };

  const openEditModal = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      category: product.category || '',
      price: product.price.toString(),
      cost: product.cost.toString(),
      inventory_level: product.inventory_level.toString(),
      reorder_point: product.reorder_point.toString(),
    });
    setEditId(product.id);
    setIsEditing(true);
    setShowFormModal(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => {
            setShowFormModal(true);
            setIsEditing(false);
            setEditId(null);
            setForm({
              name: '',
              description: '',
              category: '',
              price: '',
              cost: '',
              inventory_level: '',
              reorder_point: '',
            });
          }}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-emerald-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {[
                'Name',
                'Category',
                'Price',
                'Cost',
                'Stock',
                'Reorder Point',
                'Actions',
              ].map((header) => (
                <th key={header} className="px-4 py-2 text-left text-gray-600 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{product.name}</td>
                <td className="px-4 py-2">{product.category}</td>
                <td className="px-4 py-2">${product.price.toFixed(2)}</td>
                <td className="px-4 py-2">${product.cost.toFixed(2)}</td>
                <td className="px-4 py-2">{product.inventory_level}</td>
                <td className="px-4 py-2">{product.reorder_point}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button onClick={() => openEditModal(product)} className="text-emerald-600 hover:text-emerald-800">
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button onClick={() => { setDeleteId(product.id); setShowDeleteModal(true); }} className="text-red-600 hover:text-red-800">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ➕ Add / ✏️ Edit Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input required type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border p-2 rounded" />
              <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border p-2 rounded" />
              <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border p-2 rounded" step="0.01" min="0" />
              <input type="number" placeholder="Cost" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} className="border p-2 rounded" step="0.01" min="0" />
              <input type="number" placeholder="Inventory Level" value={form.inventory_level} onChange={(e) => setForm({ ...form, inventory_level: e.target.value })} className="border p-2 rounded" min="0" />
              <input type="number" placeholder="Reorder Point" value={form.reorder_point} onChange={(e) => setForm({ ...form, reorder_point: e.target.value })} className="border p-2 rounded" min="0" />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border p-2 rounded col-span-full" rows={3} />
              <div className="col-span-full flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setShowFormModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
                  {isEditing ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ❌ Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Delete Product</h2>
            <p className="mb-6">Are you sure you want to delete this product?</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
