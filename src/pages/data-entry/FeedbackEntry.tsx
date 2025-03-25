import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export const FeedbackEntry: React.FC = () => {
  const [formData, setFormData] = useState({
    transaction_id: '',
    satisfaction_score: 5,
    comments: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('customer_feedback')
        .insert([formData]);

      if (error) throw error;

      alert('Feedback recorded successfully!');
      setFormData({
        transaction_id: '',
        satisfaction_score: 5,
        comments: ''
      });
    } catch (error) {
      console.error('Error recording feedback:', error);
      alert('Failed to record feedback. Please try again.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Record Customer Feedback</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
            <input
              type="text"
              value={formData.transaction_id}
              onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Satisfaction Score</label>
            <div className="mt-2 flex items-center space-x-4">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setFormData({ ...formData, satisfaction_score: score })}
                  className={`w-10 h-10 rounded-full ${
                    formData.satisfaction_score === score
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Comments</label>
            <textarea
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              placeholder="Enter customer comments..."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Record Feedback
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};