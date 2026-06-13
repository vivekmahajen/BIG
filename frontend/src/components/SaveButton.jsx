import { useState } from 'react';
import { saveOpportunity } from '../api/savedOpportunities';
import './SaveButton.css';

export default function SaveButton({ cardData, state, city, zip, sector, sectorLabel, onSaved, onNavigateDashboard }) {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const displayMap = {
    idle:      { label: '+ Save to Dashboard', disabled: false, className: 'save-btn-idle' },
    saving:    { label: 'Saving…',              disabled: true,  className: 'save-btn-saving' },
    saved:     { label: 'Saved ✓',              disabled: false, className: 'save-btn-saved' },
    duplicate: { label: 'Already Saved',        disabled: false, className: 'save-btn-saved' },
    error:     { label: 'Try Again',            disabled: false, className: 'save-btn-error' },
  };

  const display = displayMap[status];

  async function handleSave() {
    if (status === 'saving') return;
    if (status === 'saved' || status === 'duplicate') {
      if (onNavigateDashboard) onNavigateDashboard();
      return;
    }
    setStatus('saving');
    setMessage('');
    try {
      const result = await saveOpportunity({ state, city, zip, sector, sectorLabel, cardData });
      if (result.alreadySaved) {
        setStatus('duplicate');
        setMessage('Already in your dashboard');
      } else {
        setStatus('saved');
        setMessage('Saved!');
        if (onSaved) onSaved(result.id);
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.message.includes('401') ? 'Sign in to save' : err.message.includes('503') ? 'DB not configured' : 'Save failed — try again');
      setTimeout(() => { setStatus('idle'); setMessage(''); }, 3000);
    }
  }

  return (
    <div className="save-button-group">
      <button
        className={`save-btn ${display.className}`}
        onClick={handleSave}
        disabled={display.disabled}
        title={(status === 'saved' || status === 'duplicate') ? 'Click to view your dashboard' : 'Save this opportunity'}
      >
        {display.label}
      </button>
      {message && (
        <span className={`save-msg save-msg-${status}`}>
          {message}
          {(status === 'saved' || status === 'duplicate') && onNavigateDashboard && (
            <button className="save-msg-link" onClick={onNavigateDashboard}>View dashboard →</button>
          )}
        </span>
      )}
    </div>
  );
}
