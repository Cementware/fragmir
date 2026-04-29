import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext<{ unreadCount: number, user: { username: string, ID: string, points: number } | null }>({
  unreadCount: 0,
  user: null
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState<{ username: string, ID: string, points: number } | null>(null);

  const fetchNotifications = async () => {
    return fetch(`${import.meta.env.VITE_API_URL}/question/notifications`, { credentials: 'include' })
      .then(response => response.json())
      .then(data => setUnreadCount(data.count))
      .catch(error => {
        console.error('Failed to fetch notifications: ', error);
        alert('Failed to fetch notifications: ' + error);
      });
  };

  const fetchUserData = async () => {
    return fetch(`${import.meta.env.VITE_API_URL}/account/me`, { credentials: 'include' })
      .then(response => response.json())
      .then(setUser)
      .catch(error => {
        console.error('Failed to fetch userdata: ', error);
        alert('Failed to fetch userdata: ' + error);
      });
  }

  useEffect(() => {
    console.log('Ran initial fetch')
    fetchNotifications();
    fetchUserData();

    const interval_notif = setInterval(fetchNotifications, 15000);
    const interval_user = setInterval(fetchUserData, 15000);
    return () => {
      clearInterval(interval_notif);
      clearInterval(interval_user);
    };
  }, []);

  return (
    <UserContext.Provider value={{ unreadCount, user }}>
      {children}
    </UserContext.Provider>
  )
};

export const useUser = () => useContext(UserContext);
