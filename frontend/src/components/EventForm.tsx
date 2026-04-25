import React, { useState } from 'react';
import { CalendarPlus, Clock, FileText, Tag } from 'lucide-react';

interface AddEventProps {
  location_id: string | undefined;
  onSuccess?: () => void;
}

export default function AddEventForm({ location_id, onSuccess }: AddEventProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    time: '',
    end_time: '',
    private: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/location/${location_id}/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', description: '', time: '', end_time: '', private: false });
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Error adding event: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
        <CalendarPlus className="text-indigo-600" size={24} />
        Create New Event
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Event Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Event Name</label>
          <div className="relative">
            <Tag className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              required
              type="text"
              placeholder="e.g. Summer Jazz Night"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        </div>

        {/* Date/Time */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Start Date & Time</label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              required
              type="datetime-local"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
              value={formData.time}
              max={formData.end_time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">End Date & Time</label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              type="datetime-local"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
              min={formData.time}
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            />
          </div>

        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-slate-400" size={18} />
            <textarea
              rows={3}
              placeholder="Tell people about the event..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>
        <div className="text-sm font-semibold text-slate-700 mb-6 flex items-center justify-between">
          <span className="block text-sm font-semibold text-slate-700 mb-1">Redact my user</span>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, private: !formData.private })}
            className={`w-12 h-6 rounded-full transition-colors relative ${formData.private ? 'bg-indigo-600' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.private ? 'translate-x-6' : ''}`} />
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Event'}
        </button>
      </form>
    </div>
  );
}
