import { useState } from 'react';
import { saveOpportunity } from '../api/savedOpportunities';
import styles from './SaveButton.module.css';

export default function SaveButton({ cardData, state, city, zip, sector, sectorLabel, onNavigate }) {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  async function handleSave() {
    if (status === 'saving') return;
    if (status === 'saved' || status === 'duplicate') {
      if (onNavigate) onNavigate('saved');
      return;
    }
    setStatus('saving');
    try {
      const result = await saveOpportunity({ state, city, zip, sector, sectorLabel, cardData });
      setStatus(result.alreadySaved ? 'duplicate' : 'saved');
      setMessage(result.alreadySaved ? 'Already saved' : 'Saved!');
    } catch (err) {
      setStatus('error');
      setMessage('Save failed — try again');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  const map = {
    idle:      { label: '+ Save',        cls: styles.idle },
    saving:    { label: 'Saving...',      cls: styles.saving },
    saved:     { label: '✓ Saved',        cls: styles.saved },
    duplicate: { label: '✓ Already Saved',cls: styles.saved },
    error:     { label: 'Try Again',      cls: styles.error },
  };
  const d = map[status];

  return (
    <div className={styles.wrap}>
      <button className={`${styles.btn} ${d.cls}`} onClick={handleSave} disabled={status === 'saving'}>
        {d.label}
      </button>
      {message && (
        <span className={styles.msg}>
          {message}
          {(status === 'saved' || status === 'duplicate') && onNavigate && (
            <button className={styles.link} onClick={() => onNavigate('saved')}>View dashboard →</button>
          )}
        </span>
      )}
    </div>
  );
}
