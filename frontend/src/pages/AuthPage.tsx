import React, { useState } from 'react';

interface AuthPageProps {
  onLogin: (user: any) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState({ message: '', isError: false });

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ message: '', isError: false });

    const endpoint = isRegistering
      ? 'register'
      : 'login';

    const payload = isRegistering
      ? { username, email, password }
      : { identifier, password };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/account/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (response.ok) {
        onLogin({ loggedIn: true });
      } else {
        const error = await response.json();
        setMessage({ message: error.message, isError: true });
      }
    } catch (err) {
      setMessage({ message: "Could not connect to server", isError: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800">{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-slate-500 mt-2">{isRegistering ? 'Join our community' : 'Please sign in'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {message.message && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${message.isError ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                <span className="text-sm font-medium">{message.message}</span>
              </div>
            )}

            {isRegistering && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
                <input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">{isRegistering ? 'Email' : 'Username or Email'}</label>
              <input type={isRegistering ? 'email' : 'text'} required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" value={isRegistering ? email : identifier} onChange={(e) => isRegistering ? setEmail(e.target.value) : setIdentifier(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <input type="password" required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">
              {isRegistering ? 'Register' : 'Login'}
            </button>
          </form>
        </div>
        <div className="px-8 py-6 bg-slate-50 border-t text-center">
          <button onClick={() => setIsRegistering(!isRegistering)} className="text-indigo-600 font-semibold">
            {isRegistering ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
