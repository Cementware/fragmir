import React, { useState } from 'react';

export default function AuthPage() {
  // UI State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState({ message: '', isError: false });

  // Form Fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState(''); // Email OR Username for login
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ message: '', isError: false });

    const endpoint = isRegistering
      ? 'http://localhost:3000/account/register'
      : 'http://localhost:3000/account/login';

    const payload = isRegistering
      ? { username, email, password }
      : { identifier, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        const error = await response.json();
        setMessage({ message: error.message, isError: true });
      }
    } catch (err) {
      setMessage({ message: "Could not connect to server", isError: true });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIdentifier('');
    setPassword('');
    setMessage({ message: 'Logged out successfully', isError: false });
  };

  // --- LOGGED IN VIEW ---
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center border border-slate-100">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Successfully Authenticated</h1>
          <p className="text-slate-500 mt-2 mb-8">You are now signed in to your secure account.</p>
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // --- AUTH FORM VIEW ---
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">

        <div className="p-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-slate-500 mt-2">
              {isRegistering ? 'Join our community today' : 'Please enter your details'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">{/* Error/Success Message Display */}
            {message.message && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${message.isError ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                }`}>
                {message.isError ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-sm font-medium">{message.message}</span>
              </div>
            )}
            {/* Conditional Username Field for Registration */}
            {isRegistering && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  placeholder="johndoe123"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}

            {/* Email Field (Registration) OR Identifier Field (Login) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {isRegistering ? 'Email Address' : 'Username or Email'}
              </label>
              <input
                type={isRegistering ? 'email' : 'text'}
                required
                placeholder={isRegistering ? 'name@company.com' : 'Enter username or email'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                value={isRegistering ? email : identifier}
                onChange={(e) => isRegistering ? setEmail(e.target.value) : setIdentifier(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
            >
              {isRegistering ? 'Register' : 'Login'}
            </button>
          </form>
        </div>

        {/* Footer / Toggle */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setMessage({ text: '', isError: false });
            }}
            className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
          >
            {isRegistering ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
