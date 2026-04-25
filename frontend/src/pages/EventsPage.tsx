import { useState } from 'react';

export default function EventsPage() {
  const [placeQuery, setPlaceQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);

  // Mock data for places
  const places = [
    { id: 1, name: 'The Grand Library', address: '123 Book St', activeEvents: 2 },
    { id: 2, name: 'Neon Garden', address: '456 Party Ave', activeEvents: 5 },
    { id: 3, name: 'Central Park', address: 'Downtown', activeEvents: 1 },
  ].filter(p => p.name.toLowerCase().includes(placeQuery.toLowerCase()));

  return (
    <div className="animate-in fade-in duration-500">
      {!selectedPlace ? (
        <>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Explore Places</h2>
          <input
            type="search"
            placeholder="Find a location..."
            className="w-full px-6 py-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none mb-6"
            value={placeQuery}
            onChange={(e) => setPlaceQuery(e.target.value)}
          />
          <div className="grid gap-4">
            {places.map(place => (
              <button
                key={place.id}
                onClick={() => setSelectedPlace(place)}
                className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm text-left hover:border-indigo-200 hover:shadow-md transition group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition">{place.name}</h4>
                    <p className="text-slate-500 text-sm">{place.address}</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-md uppercase">
                    {place.activeEvents} Active
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="animate-in slide-in-from-right duration-300">
          <button
            onClick={() => setSelectedPlace(null)}
            className="mb-6 text-indigo-600 font-bold flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
          >
            ← Back to All Places
          </button>

          <div className="bg-indigo-600 p-8 rounded-3xl text-white mb-8 shadow-xl shadow-indigo-100">
            <h2 className="text-3xl font-black">{selectedPlace.name}</h2>
            <p className="opacity-80">{selectedPlace.address}</p>
          </div>

          <h3 className="font-bold text-slate-800 mb-4 uppercase tracking-widest text-xs">Ongoing Events</h3>
          <div className="space-y-4">
            {/* Example Event */}
            <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-indigo-500">
              <h4 className="font-bold text-slate-800">Community Coding Hangout</h4>
              <p className="text-slate-500 text-sm mt-1">Started 45 minutes ago • 12 attending</p>
              <button className="mt-4 text-xs font-bold text-indigo-600 uppercase tracking-wider">Join Discussion</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
