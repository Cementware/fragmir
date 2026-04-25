import { Clock, Info, Calendar, User } from 'lucide-react';

interface Event {
  name: string;
  description: string;
  time: string; // ISO string from MariaDB
  end_time: string | null;
  creator_username: string | null;
  participants: number;
}

const EventCard = ({ event }: { event: Event }) => {
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

  return (
    <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-slate-800 leading-tight">
          {event.name}
        </h3>
        <div>
          <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase px-2 py-1 rounded-full">
            {
              time > new Date() ?
                'Upcoming' : event.end_time && new Date(event.end_time) > new Date() ? 'Ongoing' : 'Past'
            }
          </span>
          <span className="bg-orange-50 text-orange-400 text-[10px] font-black uppercase px-2 py-1 rounded-full">
            {event.participants} participants
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
        <Clock size={14} />
        <span>{eventDate}</span>
        {event.end_time && <span> - {eventEndDate}</span>}
      </div>
      {event.creator_username && (
        <div className="flex gap-2 pt-3 border-t border-slate-50">
          <User size={14} className="text-slate-400 mt-1 shrink-0" />
          <p className="text-slate-600 text-sm leading-relaxed">
            Organized by {event.creator_username}
          </p>
        </div>
      )}
      {event.description && (
        <div className="flex gap-2 pt-3 border-t border-slate-50">
          <Info size={14} className="text-slate-400 mt-1 shrink-0" />
          <p className="text-slate-600 text-sm leading-relaxed">
            {event.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventCard;
