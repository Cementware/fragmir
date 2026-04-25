import { MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EventsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState<{ ID: string, name: string, location: { coordinated: number[] }, count: number }[]>([]);

  useEffect(() => {
    const searchPlaces = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/location/list${query ? '?q=' + query : ''}`, { credentials: 'include' });
        const data = await response.json();
        setPlaces(Array.isArray(data) ? data : []);
      } catch (err) { setPlaces([]); } finally { setLoading(false); }
    };
    if (!places)
      searchPlaces();
    const timeoutId = setTimeout(searchPlaces, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Explore Locations</h2>
      <input
        type="search"
        placeholder="Find a location..."
        className="w-full px-6 py-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none mb-6"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="grid gap-4">
        {loading && <p className="text-center text-slate-400 italic">Searching...</p>}
        {places.map(place => (
          <button
            key={place.ID}
            onClick={() => navigate(`/locations/${place.ID}`)}
            className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm text-left hover:shadow-md transition group"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-800 transition">{place.name}</h4>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${place.location.coordinates[0]}, ${place.location.coordinates[1]}`}
                  target='_blank'
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 text-indigo-600 hover:underline text-sm">
                  <MapPin size={24} />
                  Google Maps
                </a>
              </div>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-md uppercase">
                {place.count} Active
              </span>
            </div>
          </button>
        ))}
      </div>
    </div >
  );
}
