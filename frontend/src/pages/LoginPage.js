import { useState, useEffect } from 'react';
import { api } from '../api';
import Disclaimer from '../components/Disclaimer';
import styles from './LoginPage.module.css';

// mode: 'login' | 'register' | 'forgot' | 'reset-sent' | 'reset-password'

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', name: '', password: '', confirm: '', resetToken: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [devToken, setDevToken] = useState('');

  // Check URL for ?reset=TOKEN on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('reset');
    if (token) {
      api.resetValidate(token)
        .then(() => {
          setForm(f => ({ ...f, resetToken: token }));
          setMode('reset-password');
        })
        .catch(err => {
          setError(err.message);
          setMode('forgot');
        });
    }
  }, []);

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  function switchMode(m) {
    setMode(m);
    setError('');
    setSuccess('');
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await api.login(form.email, form.password);
        onLogin(res.user, res.token);

      } else if (mode === 'register') {
        if (!form.name.trim()) { setError('Name is required'); setLoading(false); return; }
        if (form.password.length < 8) { setError('Password must be at least 8 characters'); setLoading(false); return; }
        const res = await api.register(form.email, form.name, form.password);
        onLogin(res.user, res.token);

      } else if (mode === 'forgot') {
        const res = await api.resetRequest(form.email);
        if (res.devToken) setDevToken(res.devToken);
        switchMode('reset-sent');

      } else if (mode === 'reset-password') {
        if (form.password.length < 8) { setError('Password must be at least 8 characters'); setLoading(false); return; }
        if (form.password !== form.confirm) { setError('Passwords do not match'); setLoading(false); return; }
        await api.resetPassword(form.resetToken, form.password);
        setSuccess('Password updated! You can now sign in.');
        setForm(f => ({ ...f, password: '', confirm: '', resetToken: '' }));
        switchMode('login');
        setSuccess('Password updated successfully. Please sign in.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function fillDemo() {
    setForm(f => ({ ...f, email: 'demo@big.com', password: 'demo1234' }));
    setMode('login');
    setError('');
    setSuccess('');
  }

  const titles = {
    login: 'Sign in to BIG',
    register: 'Create account',
    forgot: 'Reset your password',
    'reset-sent': 'Check your email',
    'reset-password': 'Set new password',
  };
  const subs = {
    login: 'Access your opportunity intelligence dashboard',
    register: 'Start discovering profitable business opportunities',
    forgot: "Enter your email and we'll send you a reset link",
    'reset-sent': 'A reset link has been sent if your email is registered',
    'reset-password': 'Choose a strong new password for your account',
  };

  return (
    <div className={styles.wrapper}>
      <Disclaimer />
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.brand}>
            <span className={styles.logo}>BIG</span>
            <p className={styles.tagline}>Business Opportunity Intelligence</p>
          </div>
          <div className={styles.stats}>
            {[
              { label: 'Sectors Analyzed', value: '16' },
              { label: 'U.S. Markets', value: '200+' },
              { label: 'Curated Ideas', value: '80' },
              { label: 'Avg Exit Multiple', value: '10×' },
            ].map(s => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
          <p className={styles.copy}>
            Identify profitable business opportunities across every industry,
            geography, and business model — backed by data-driven business cases.
          </p>
        </div>

        <div className={styles.right}>
          <div className={styles.card}>
            <h1 className={styles.title}>{titles[mode]}</h1>
            <p className={styles.sub}>{subs[mode]}</p>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.successBox}>{success}</div>}

            {/* ── Login form ── */}
            {mode === 'login' && (
              <form onSubmit={submit} className={styles.form}>
                <label className={styles.field}>
                  <span>Email</span>
                  <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required autoFocus />
                </label>
                <label className={styles.field}>
                  <span>
                    Password
                    <button type="button" className={styles.forgotLink} onClick={() => switchMode('forgot')}>
                      Forgot password?
                    </button>
                  </span>
                  <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required />
                </label>
                <button type="submit" className={styles.btn} disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
            )}

            {/* ── Register form ── */}
            {mode === 'register' && (
              <form onSubmit={submit} className={styles.form}>
                <label className={styles.field}>
                  <span>Full Name</span>
                  <input type="text" value={form.name} onChange={set('name')} placeholder="Jane Smith" required autoFocus />
                </label>
                <label className={styles.field}>
                  <span>Email</span>
                  <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
                </label>
                <label className={styles.field}>
                  <span>Password</span>
                  <input type="password" value={form.password} onChange={set('password')} placeholder="Min 8 characters" minLength={8} required />
                </label>
                <button type="submit" className={styles.btn} disabled={loading}>
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
              </form>
            )}

            {/* ── Forgot password form ── */}
            {mode === 'forgot' && (
              <form onSubmit={submit} className={styles.form}>
                <label className={styles.field}>
                  <span>Email address</span>
                  <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required autoFocus />
                </label>
                <button type="submit" className={styles.btn} disabled={loading}>
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
                <button type="button" className={styles.ghostBtn} onClick={() => switchMode('login')}>
                  ← Back to sign in
                </button>
              </form>
            )}

            {/* ── Reset sent screen ── */}
            {mode === 'reset-sent' && (
              <div className={styles.resetSent}>
                <div className={styles.resetSentIcon}>✉️</div>
                <p className={styles.resetSentText}>
                  If <strong>{form.email}</strong> is registered, you'll receive a reset link shortly.
                  Check your spam folder if you don't see it.
                </p>
                {devToken && (
                  <div className={styles.devTokenBox}>
                    <p className={styles.devTokenLabel}>Dev mode — use this token to reset:</p>
                    <button
                      className={styles.devTokenBtn}
                      type="button"
                      onClick={() => { setForm(f => ({ ...f, resetToken: devToken, password: '', confirm: '' })); switchMode('reset-password'); }}
                    >
                      Enter password reset →
                    </button>
                  </div>
                )}
                <button type="button" className={styles.ghostBtn} onClick={() => switchMode('forgot')}>
                  Resend link
                </button>
                <button type="button" className={styles.ghostBtn} onClick={() => switchMode('login')}>
                  ← Back to sign in
                </button>
              </div>
            )}

            {/* ── Reset password form ── */}
            {mode === 'reset-password' && (
              <form onSubmit={submit} className={styles.form}>
                <label className={styles.field}>
                  <span>New password</span>
                  <input type="password" value={form.password} onChange={set('password')} placeholder="Min 8 characters" minLength={8} required autoFocus />
                </label>
                <label className={styles.field}>
                  <span>Confirm new password</span>
                  <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" required />
                </label>
                <button type="submit" className={styles.btn} disabled={loading}>
                  {loading ? 'Updating…' : 'Set new password'}
                </button>
                <button type="button" className={styles.ghostBtn} onClick={() => switchMode('login')}>
                  ← Back to sign in
                </button>
              </form>
            )}

            {/* Demo button on login/register only */}
            {(mode === 'login' || mode === 'register') && (
              <>
                <div className={styles.divider}><span>or</span></div>
                <button className={styles.demoBtn} onClick={fillDemo} type="button">
                  Try demo account
                </button>
              </>
            )}

            {/* Toggle login / register */}
            {(mode === 'login' || mode === 'register') && (
              <p className={styles.toggle}>
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button type="button" onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}>
                  {mode === 'login' ? 'Sign up free' : 'Sign in'}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
      <Disclaimer />
    </div>
  );
}
