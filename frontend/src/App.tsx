import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage';
import Layout from './components/Layout';
import SearchPage from './pages/SearchPage';
import LocationPage from './pages/LocationPage';
import NotificationsPage from './pages/NotificationsPage';
import EventsPage from './pages/EventsPage';
import ProfilePage from './pages/ProfilePage';
import { UserProvider } from './context/UserContext';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/account/me`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        alert('Failed to authenticate: ' + error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/account/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } finally {
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={!user ? <AuthPage onLogin={setUser} /> : <Navigate to="/" />} />

          {/* All protected routes live inside the Layout */}
          <Route path="/" element={user ? <Layout onLogout={handleLogout} /> : <Navigate to="/login" />}>
            <Route index element={<SearchPage />} />
            <Route path="locations" element={<LocationPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path='locations/:location_id' element={<EventsPage />} />
            <Route path='profile/:user_id' element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}
