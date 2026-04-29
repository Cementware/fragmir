import { Clock, Info, Calendar, User, Circle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface Event {
  ID: string;
  name: string;
  description: string;
  time: string; // ISO string from MariaDB
  end_time: string | null;
  creator_username: string | null;
  participants: number;
  participating: boolean;
}

const EventCard = ({ event, location_id }: { event: Event, location_id?: string }) => {
  const [joined, setJoined] = useState(event.participating || false);
  const [loading, setLoading] = useState(false);
  const [popups, setPopups] = useState<{ id: number, text: string, offset: number }[]>([]);

  // Format the date to be human-readable
  const eventDate = new Date(event.time).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  });

  const eventEndDate = event.end_time ? new Date(event.end_time).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  }) : eventDate;

  const time = new Date(event.time);

  const toggleParticipation = async (e: React.MouseEvent) => {
    // Prevent clicking the card from triggering other actions if necessary
    e.stopPropagation();

    const id = Date.now();
    setPopups((prev) => [...prev, { id, text: joined ? '-5' : '+5', offset: Math.floor(Math.random() * 40) - 20 }]);
    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, 800);

    setLoading(true);
    try {
      const method = joined ? 'DELETE' : 'POST';
      // Adjust this URL to your actual endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL}/location/${location_id}/participate/${event.ID}`, { method });

      if (response.ok) {
        setJoined(!joined);
      }
    } catch (error) {
      console.error("Failed to update participation", error);
      alert('Failed to update participation' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex justify-between gap-2">
      <div className='flex flex-col gap-2'>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-slate-800 leading-tight">
            {event.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Clock size={14} />
          <span>{eventDate}</span>
          {event.end_time && <span>-</span>}
          {event.end_time && <span>{eventEndDate}</span>}
        </div>
        {event.creator_username && (
          <div className="flex gap-2 border-t border-slate-50">
            <User size={14} className="text-slate-400 mt-1 shrink-0" />
            <p className="text-slate-600 text-sm leading-relaxed">
              Organized by {event.creator_username}
            </p>
          </div>
        )}
        {event.description && (
          <div className="flex gap-2 border-t border-slate-50">
            <Info size={14} className="text-slate-400 mt-1 shrink-0" />
            <p className="text-slate-600 text-sm leading-relaxed">
              {event.description}
            </p>
          </div>
        )}
      </div>

      <div className='flex flex-col gap-2 justify-between'>{/* 1. The Popups Container */}
        <div className='flex gap-1 flex-wrap'>
          <div className={`${time > new Date() ?
            'bg-green-100 text-green-500' : event.end_time && new Date(event.end_time) > new Date() ? 'bg-yellow-100 text-yellow-500' : 'bg-red-100 text-red-500'} text-[10px] font-black uppercase px-2 py-1 rounded-full`}>
            {
              time > new Date() ?
                'Upcoming' : event.end_time && new Date(event.end_time) > new Date() ? 'Ongoing' : 'Past'
            }
          </div>
          <div className="bg-orange-50 text-orange-400 text-[10px] font-black uppercase px-2 py-1 rounded-full">
            {event.participants} participants
          </div>
        </div>
        <button
          onClick={toggleParticipation}
          disabled={loading}
          className={`relative shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${joined
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100'
            : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
            }`}
        >
          {popups.map((popup) => (
            <span
              key={popup.id}
              style={{ left: `calc(50% + ${popup.offset}px)` }}
              className={
                `absolute top-0 -translate-x-1/2 pointer-events-none font-black text-xl animate-fly-up z-50
                ${joined ? 'text-emerald-500' : 'text-red-500'}`}
            >
              {popup.text}
            </span>
          ))}
          {joined ? <CheckCircle2 size={18} /> : <Circle size={18} />}
          {joined ? 'Going' : 'Join'}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
