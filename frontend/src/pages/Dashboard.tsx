import { useState, useEffect } from 'react';
import Layout from '../components/Layout'; // Import the layout above

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'search' | 'events'>('search');
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Event/Place States
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [places, setPlaces] = useState([{ id: 1, name: 'Main Plaza' }, { id: 2, name: 'Tech Hub' }]);

  // Question Form States
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [question, setQuestion] = useState('');
  const [isRedacted, setIsRedacted] = useState(false);

  // User Search Effect
  useEffect(() => {
    if (activeTab !== 'search') return;
    const searchUsers = async () => {
      if (query.length < 2) { setUsers([]); return; }
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/list?q=${query}`, { credentials: 'include' });
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) { setUsers([]); } finally { setLoading(false); }
    };
    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [query, activeTab]);

  const handleSendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${import.meta.env.VITE_API_URL}/question/post/${selectedUser.ID}`, {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, private: isRedacted })
    });
    setSelectedUser(null);
    setQuestion('');
  };

  return (
    <Layout onLogout={onLogout} activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'search' ? (
        <div className="py-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <input
            autoComplete='off'
            type="text"
            placeholder="Search users..."
            className="w-full px-6 py-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none mb-6"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="space-y-3">
            {loading && <p className="text-center text-slate-400">Searching...</p>}
            {users.map((user) => (
              <div key={user.username} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                <p className="font-bold text-slate-800">@{user.username}</p>
                <button onClick={() => setSelectedUser(user)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition">?</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {!selectedPlace ? (
            <>
              <input
                type="text"
                placeholder="Find a place..."
                className="w-full px-6 py-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none mb-6"
              />
              <div className="grid gap-3">
                {places.map(place => (
                  <button
                    key={place.id}
                    onClick={() => setSelectedPlace(place)}
                    className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm text-left hover:border-indigo-200 transition"
                  >
                    <h4 className="font-bold text-slate-800">{place.name}</h4>
                    <p className="text-slate-500 text-sm">3 events happening now</p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div>
              <button onClick={() => setSelectedPlace(null)} className="mb-4 text-indigo-600 font-bold flex items-center gap-2">
                ← Back to Places
              </button>
              <h2 className="text-2xl font-bold mb-6">Events at {selectedPlace.name}</h2>
              <div className="space-y-4">
                <div className="p-4 bg-indigo-600 text-white rounded-2xl">
                  <h4 className="font-bold">Live DJ Set</h4>
                  <p className="opacity-80">Started 20 mins ago</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reusable Question Modal (Used for both asking and responding) */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSendQuestion} className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Ask @{selectedUser.username}</h3>
            <textarea
              required
              className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-indigo-500 min-h-[150px] mb-4"
              placeholder="Type your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold text-slate-600">Anonymous Post</span>
              <button
                type="button"
                onClick={() => setIsRedacted(!isRedacted)}
                className={`w-12 h-6 rounded-full transition-colors relative ${isRedacted ? 'bg-indigo-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isRedacted ? 'translate-x-6' : ''}`} />
              </button>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setSelectedUser(null)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Cancel</button>
              <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl">Send</button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}
