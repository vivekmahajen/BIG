import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CompetitiveAnalysisPage from './pages/CompetitiveAnalysisPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [page, setPage] = useState('dashboard'); // 'dashboard' | 'competitive'

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
    setPage('dashboard');
  }

  if (checking) return null;
  if (!user) return <LoginPage onLogin={handleLogin} />;

  if (page === 'competitive') {
    return <CompetitiveAnalysisPage user={user} onBack={() => setPage('dashboard')} onLogout={handleLogout} />;
  }

  return <DashboardPage user={user} onLogout={handleLogout} onNavigate={setPage} />;
}
