import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CompetitiveAnalysisPage from './pages/CompetitiveAnalysisPage';
import PricingPage from './pages/PricingPage';
import SavedDashboard from './pages/SavedDashboard';
import PublicAnalysisPage from './pages/PublicAnalysisPage';
import { claimReferral } from './api/share';

// Capture ?ref= on any page load and persist in sessionStorage
const _initRef = new URLSearchParams(window.location.search).get('ref');
if (_initRef) sessionStorage.setItem('big_ref_code', _initRef);

function getUrlPreselect() {
  const p = new URLSearchParams(window.location.search);
  return {
    state: p.get('state') || '',
    city: p.get('city') || '',
    sector: p.get('sector') || '',
  };
}

// Wrapper that renders the public analysis page without any auth
function PublicRoute() {
  return <PublicAnalysisPage />;
}

function AuthenticatedApp() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [page, setPage] = useState('dashboard'); // 'dashboard' | 'competitive' | 'pricing' | 'saved'
  const [preselect] = useState(getUrlPreselect);

  useEffect(() => {
    const token = localStorage.getItem('big_token');
    const stored = localStorage.getItem('big_user');
    if (token && stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setChecking(false);
  }, []);

  async function handleLogin(userData, token) {
    localStorage.setItem('big_token', token);
    localStorage.setItem('big_user', JSON.stringify(userData));
    setUser(userData);

    // Claim referral if one was captured before login
    const refCode = sessionStorage.getItem('big_ref_code');
    const refPublicId = sessionStorage.getItem('big_ref_public_id');
    if (refCode) {
      try {
        await claimReferral(refCode, refPublicId || null);
      } catch {
        // Non-fatal — referral claim failure should not block login
      } finally {
        sessionStorage.removeItem('big_ref_code');
        sessionStorage.removeItem('big_ref_public_id');
      }
    }
  }

  function handleLogout() {
    localStorage.removeItem('big_token');
    localStorage.removeItem('big_user');
    setUser(null);
    setPage('dashboard');
  }

  function handleCreditsUpdated(updated) {
    const merged = { ...user, ...updated };
    setUser(merged);
    localStorage.setItem('big_user', JSON.stringify(merged));
  }

  if (checking) return null;
  if (!user) return <LoginPage onLogin={handleLogin} />;

  if (page === 'saved') {
    return <SavedDashboard onNavigate={setPage} />;
  }

  if (page === 'competitive') {
    return <CompetitiveAnalysisPage user={user} onBack={() => setPage('dashboard')} onLogout={handleLogout} onNavigate={setPage} />;
  }

  if (page === 'pricing') {
    return <PricingPage user={user} onBack={() => setPage('dashboard')} onCreditsUpdated={handleCreditsUpdated} />;
  }

  return <DashboardPage user={user} onLogout={handleLogout} onNavigate={setPage} preselect={preselect} />;
}

export default function App() {
  // Public analysis pages require no auth — render immediately
  if (window.location.pathname.startsWith('/analysis/')) {
    return <PublicRoute />;
  }

  return <AuthenticatedApp />;
}
