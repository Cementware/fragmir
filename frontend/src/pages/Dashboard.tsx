import { useState, useEffect } from 'react';

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // States for the new Question Form
  const [selectedUser, setSelectedUser] = useState<{ username: string, ID: string } | null>(null);
  const [question, setQuestion] = useState('');
  const [isRedacted, setIsRedacted] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (query.length < 2) {
        setUsers([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/list?q=${query}`, {
          credentials: 'include'
        });
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Search failed", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${import.meta.env.VITE_API_URL}/question/post/${selectedUser.ID}`, {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: question, private: isRedacted })
    });
    setSelectedUser(null);
    setQuestion('');
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Search Users</h1>
        <button onClick={onLogout} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition">
          Logout
        </button>
      </div>

      <input
        autoComplete='off'
        type="text"
        placeholder="Type a username or email..."
        className="w-full px-6 py-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none mb-6"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="space-y-3">
        {loading && <p className="text-center text-slate-400">Searching...</p>}
        {users.map((user) => (
          <div key={user.username} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
            <p className="font-bold text-slate-800">@{user.username}</p>
            <button
              onClick={() => setSelectedUser(user)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
            >
              ?
            </button>
          </div>
        ))}
      </div>

      {/* Question Form Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSendQuestion} className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Ask @{selectedUser.username}</h3>

            <textarea
              required
              className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px] mb-4"
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
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
