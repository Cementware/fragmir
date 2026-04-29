import { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  unreadCount: number,
  user: { username: string, ID: string, points: number } | undefined,
  fetchAll: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
  unreadCount: 0,
  user: undefined,
  fetchAll: () => new Promise(() => { })
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState<{ username: string, ID: string, points: number }>();

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

  const fetchAll = async () => {
    try {
      await Promise.all([fetchNotifications(), fetchUserData()])
    } finally { }
  }

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <UserContext.Provider value={{ unreadCount, user, fetchAll }}>
      {children}
    </UserContext.Provider>
  )
};

export const useUser = () => useContext(UserContext);
