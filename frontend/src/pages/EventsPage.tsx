import { Calendar, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function PlaceDetailPage() {
  const [events, setEvents] = useState<{ ID: string, name: string, description: string, time: string }[]>([]);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState<{ name: string, location: { coordinates: number[] } } | null>(null)
  const [loading, setLoading] = useState(true);
  const { location_id } = useParams<{ location_id: string }>();

  useEffect(() => {
    const searchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/location/${location_id}/list${query ? '?q=' + query : ''}`, { credentials: 'include' });
        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) { setEvents([]); } finally { setLoading(false); }
    };

    const getLocation = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/location/info/${location_id}`, { credentials: 'include' });
        setLocation(await response.json());
      } catch (err) { setLocation(null); } finally { setLoading(false); }
    }
    if (!events) searchEvents();
    if (!location) getLocation();

    const timeoutId = setTimeout(searchEvents, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      {/* Header Section */}
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900">{location?.name}</h1>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${location?.location.coordinates[0]}, ${location?.location.coordinates[1]}`}
          target='_blank'
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 text-indigo-600 hover:underline text-sm">
          <MapPin size={24} />
          Google Maps
        </a>
      </header>

      {/* Ongoing Events List */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Ongoing Events
        </h2>
        <input
          type="search"
          placeholder="Find an event..."
          className="w-full px-6 py-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none mb-6"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="space-y-4">
          {loading && <p className="text-center text-slate-400 italic">Searching...</p>}
          {events.length > 0 && (
            events.map(event => (
              <EventCard key={event.ID} event={event} />
            ))
          )}
          {!loading && (
            <div className="p-10 border-2 border-dashed border-slate-200 rounded-3xl text-center text-slate-400 animate-in fade-in duration-500">
              No events matching your criteria
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
