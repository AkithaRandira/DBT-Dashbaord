import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Plus, Pencil, Trash2 } from 'lucide-react';

type Shop = {
  id: string;
  name: string;
  type: string;
  region: string;
};

export const Shops: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({ name: '', type: '', region: '' });

  const fetchShops = async () => {
    const response = await supabase.from('shops').select('*');
    const data = response.data as Shop[] | null;
    const error = response.error;

    if (error) {
      console.error('Error fetching shops:', error);
    } else {
      setShops(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.type || !form.region) return;

    if (isEditing && editId) {
      // Edit existing
      const { error } = await supabase
        .from('shops')
        .update(form)
        .eq('id', editId);

      if (error) {
        alert('Failed to update shop');
      }
    } else {
      // Add new
      const { error } = await supabase.from('shops').insert([form]);
      if (error) {
        alert('Failed to add shop');
      }
    }

    setShowFormModal(false);
    setForm({ name: '', type: '', region: '' });
    setIsEditing(false);
    setEditId(null);
    fetchShops();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('shops').delete().eq('id', deleteId);
    if (error) {
      alert('Failed to delete shop');
    }
    setShowDeleteModal(false);
    setDeleteId(null);
    fetchShops();
  };

  const openEditModal = (shop: Shop) => {
    setForm({ name: shop.name, type: shop.type, region: shop.region });
    setEditId(shop.id);
    setIsEditing(true);
    setShowFormModal(true);
  };

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shops</h1>
        <button
          onClick={() => {
            setForm({ name: '', type: '', region: '' });
            setIsEditing(false);
            setEditId(null);
            setShowFormModal(true);
          }}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Shop
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {shops.map((shop) => (
              <tr key={shop.id}>
                <td className="px-6 py-4">{shop.name}</td>
                <td className="px-6 py-4 capitalize">{shop.type}</td>
                <td className="px-6 py-4">{shop.region}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => openEditModal(shop)}
                    className="text-emerald-600 hover:text-emerald-800"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(shop.id);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
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
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Shop' : 'Add New Shop'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Shop Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Select Type</option>
                <option value="retail">Retail</option>
                <option value="direct">Direct</option>
              </select>
              <input
                type="text"
                placeholder="Region"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
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
            <h2 className="text-lg font-semibold mb-4">Delete Shop</h2>
            <p className="mb-6">Are you sure you want to delete this shop?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
