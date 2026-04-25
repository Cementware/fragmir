import { LucideMailQuestionMark } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [question, setQuestion] = useState('');
  const [isRedacted, setIsRedacted] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/list${query ? '?q=' + query : ''}`, { credentials: 'include' });
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        setUsers([]);
        alert('Error searching for user: ' + error);
      } finally { setLoading(false); }
    };
    if (!users)
      searchUsers();
    const timeoutId = setTimeout(searchUsers, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${import.meta.env.VITE_API_URL}/question/post/${selectedUser.ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, private: isRedacted }),
      credentials: 'include'
    });
    setSelectedUser(null);
    setQuestion('');
  };

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Find People</h2>
      <input
        type="search"
        placeholder="Username or email..."
        className="w-full px-6 py-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none mb-6"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="space-y-3">
        {loading && <p className="text-center text-slate-400 italic">Searching...</p>}
        {users.map((user) => (
          <div key={user.username} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
            <p className="font-bold text-slate-800">@{user.username}</p>
            <button
              onClick={() => setSelectedUser(user)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition">
              <LucideMailQuestionMark size={24} />
            </button>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSendQuestion} className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Ask @{selectedUser.username}</h3>
            <textarea
              required
              className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-indigo-500 min-h-[150px] mb-4"
              placeholder="What's on your mind?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold text-slate-600">Redact my username</span>
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
              <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200">Send</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
