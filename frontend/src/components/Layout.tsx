import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Bell, BellDot, LogOut, MapPin, Pin, Search, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Layout({ onLogout }: { onLogout: () => void }) {
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const [unreadCount, setUnreadCount] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!username)
      fetch(`${import.meta.env.VITE_API_URL}/account/me`, { credentials: 'include' })
        .then(response => response.json())
        .then(me => setUsername(me.username))
        .catch(err => console.error('Failed to fetch username: ', err));
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  })

  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/question/notifications`, { credentials: 'include' });
        if (response.ok) {
          const notifications = await response.json();
          setUnreadCount(notifications.count);
        }
      } catch (err) {
        console.error('Failed to fetch notifications: ', err)
      }
    };

    checkNotifications();

    const interval = setInterval(checkNotifications, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-40">
        <h1
          className="text-xl font-black text-indigo-600 cursor-pointer"
          onClick={() => navigate('/')}
        >
          fragmir.bz
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/notifications')}
            className={`p-2 rounded-full transition ${isActive('/notifications') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            {unreadCount ?
              <BellDot size={24} /> :
              <Bell size={24} />
            }
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`p-2 rounded-full transition ${userMenuOpen ? 'bg-slate-100 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'
                }`}>
              <User size={24} />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full pt-2 w-48 animate-in fade-in zoom-in-95 duration-150 shadow-2xl z-50 rounded-2xl">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden p-1">
                  <span className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-500 font-bold">{username}</span>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 font-bold hover:bg-red-50 rounded-xl transition active:bg-red-100"
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav >

      {/* Page Content */}
      < main className="flex-1 mt-16 mb-20 max-w-2xl mx-auto w-full p-4" >
        <Outlet />
      </main >

      {/* Bottom Tab Bar */}
      < div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 flex items-center justify-around z-40" >
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center gap-1 flex-1 ${isActive('/') ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <Search size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Search</span>
        </button>
        <button
          onClick={() => navigate('/events')}
          className={`flex flex-col items-center gap-1 flex-1 ${isActive('/events') ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <MapPin size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Events</span>
        </button>
      </div >
    </div >
  );
}
