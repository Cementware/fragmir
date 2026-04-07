import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [user, setUser] = useState<any>(null);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/account/logout', { method: 'POST', credentials: 'include' });
    } finally {
      setUser(null);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          {/* If logged in, redirect home. If not, show AuthPage */}
          <Route path="/login" element={
            !user ? <AuthPage onLogin={setUser} /> : <Navigate to="/" />
          } />

          {/* If logged in, show Dashboard. If not, redirect to login */}
          <Route path="/" element={
            user ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />
          } />
        </Routes>
      </div>
    </Router>
  );
}
