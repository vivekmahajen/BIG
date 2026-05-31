import { useState } from 'react';
import { api } from '../api';
import styles from './LoginPage.module.css';

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ email: '', name: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let res;
      if (mode === 'login') {
        res = await api.login(form.email, form.password);
      } else {
        if (!form.name.trim()) { setError('Name is required'); setLoading(false); return; }
        res = await api.register(form.email, form.name, form.password);
      }
      onLogin(res.user, res.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function fillDemo() {
    setForm({ email: 'demo@big.com', name: '', password: 'demo1234' });
    setMode('login');
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <span className={styles.logo}>BIG</span>
          <p className={styles.tagline}>Business Opportunity Intelligence</p>
        </div>
        <div className={styles.stats}>
          {[
            { label: 'Sectors Analyzed', value: '16' },
            { label: 'U.S. Markets', value: '100+' },
            { label: 'Opportunities', value: '32+' },
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
          <h1 className={styles.title}>
            {mode === 'login' ? 'Sign in to BIG' : 'Create account'}
          </h1>
          <p className={styles.sub}>
            {mode === 'login'
              ? 'Access your opportunity intelligence dashboard'
              : 'Start discovering profitable business opportunities'}
          </p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={submit} className={styles.form}>
            {mode === 'register' && (
              <label className={styles.field}>
                <span>Full Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Jane Smith"
                  required
                />
              </label>
            )}
            <label className={styles.field}>
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                required
              />
            </label>
            <label className={styles.field}>
              <span>Password</span>
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                placeholder={mode === 'register' ? 'Min 8 characters' : '••••••••'}
                minLength={mode === 'register' ? 8 : undefined}
                required
              />
            </label>

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className={styles.divider}><span>or</span></div>

          <button className={styles.demoBtn} onClick={fillDemo} type="button">
            Try demo account
          </button>

          <p className={styles.toggle}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); }}>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
