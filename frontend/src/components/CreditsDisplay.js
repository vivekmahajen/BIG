import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import styles from './CreditsDisplay.module.css';

export default function CreditsDisplay({ user, onBuyCredits }) {
  const [credits, setCredits] = useState(user?.credits ?? null);
  const [tierName, setTierName] = useState(user?.tierName || 'Free');
  const [low, setLow] = useState(false);

  const refresh = useCallback(() => {
    api.credits().then(data => {
      setCredits(data.credits);
      setTierName(data.tierName);
      setLow(data.credits <= Math.max(2, Math.floor((data.monthlyAllowance || 10) * 0.2)));
    }).catch(() => {});
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  if (credits === null) return null;

  return (
    <div className={styles.wrap} title={`${credits} credits remaining`}>
      <span className={`${styles.badge} ${low ? styles.low : ''}`}>
        <span className={styles.icon}>◈</span>
        <span className={styles.count}>{credits}</span>
        <span className={styles.label}>credits</span>
      </span>
      <span className={styles.tier}>{tierName}</span>
      <button className={styles.buyBtn} onClick={onBuyCredits}>+ Add Credits</button>
    </div>
  );
}
