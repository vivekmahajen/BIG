import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('big_token');
    const stored = localStorage.getItem('big_user');
    if (token && stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setChecking(false);
  }, []);

  function handleLogin(userData, token) {
    localStorage.setItem('big_token', token);
    localStorage.setItem('big_user', JSON.stringify(userData));
    setUser(userData);
  }

  function handleLogout() {
    localStorage.removeItem('big_token');
    localStorage.removeItem('big_user');
    setUser(null);
  }

  if (checking) return null;

  return user
    ? <DashboardPage user={user} onLogout={handleLogout} />
    : <LoginPage onLogin={handleLogin} />;
}
