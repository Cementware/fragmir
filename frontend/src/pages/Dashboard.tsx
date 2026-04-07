import { useState, useEffect } from 'react';

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (query.length < 2) {
        setUsers([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/profile/list?q=${query}`, {
          credentials: 'include'
        });
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
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
        {!loading && query.length >= 2 && users.length === 0 && (
          <p className="text-center text-slate-500">No matches found.</p>
        )}
        {users.map((user) => (
          <div key={user.username} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-800">@{user.username}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
