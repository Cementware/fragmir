import { Calendar, MapPin, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddEventForm from '../components/EventForm';
import EventCard from '../components/EventCard';

export default function PlaceDetailPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [events, setEvents] = useState<{
    ID: string,
    name: string,
    description: string,
    time: string,
    end_time: string,
    participants: number,
    participating: boolean,
    creator_username: string
  }[]>([]);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState<{ name: string, location: { coordinates: number[] } } | null>(null)
  const [loading, setLoading] = useState(true);
  const { location_id } = useParams<{ location_id: string }>();

  const searchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/location/${location_id}/list${query ? '?q=' + query : ''}`, { credentials: 'include' });
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      setEvents([]);
      alert('Error searching events: ' + error);
    } finally { setLoading(false); }
  };

  const getLocation = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/location/info/${location_id}`, { credentials: 'include' });
      setLocation(await response.json());
    } catch (error) {
      setLocation(null);
      alert('Error getting location data: ' + error);
    } finally { setLoading(false); }
  }

  useEffect(() => {
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-l font-bold mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Ongoing and Upcoming Events
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-sm bg-slate-100 px-4 py-2 rounded-full font-bold hover:bg-slate-200"
          >
            {showAddForm ? 'Cancel' : '+ Add Event'}
          </button>
        </div>
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
              <EventCard key={event.ID} event={event} location_id={location_id} />
            ))
          )}
          {!loading && !events && (
            <div className="p-10 border-2 border-dashed border-slate-200 rounded-3xl text-center text-slate-400 animate-in fade-in duration-500">
              No events matching your criteria
            </div>
          )}
        </div>
      </section>

      {showAddForm && (
        <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center">

          {/* 1. The Dimmed Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowAddForm(false)}
          />

          {/* 2. The Form Sheet */}
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 pb-10 sm:pb-6">

            {/* Handle bar for visual cue on mobile */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-3xl mx-auto mb-6 sm:hidden" />

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800">New Event</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <AddEventForm
              location_id={location_id}
              onSuccess={() => {
                setShowAddForm(false);
                searchEvents(); // Update the list behind the overlay
              }}
            />
          </div>
        </div>
      )}
    </div >
  );
}
