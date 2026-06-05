import React, { useState } from 'react';
import { saveOpportunity } from '../api/savedOpportunities';
import './SaveButton.css';

/**
 * Props:
 *   cardData    {Object}   full opportunity card JSON
 *   state       {string}
 *   city        {string}
 *   zip         {string}
 *   sector      {string}   sector ID
 *   sectorLabel {string}   human-readable label
 *   onSaved     {function} optional callback(savedId)
 *   onNavigate  {function} optional navigate handler from App (called with 'saved')
 */
export default function SaveButton({ cardData, state, city, zip, sector, sectorLabel, onSaved, onNavigate }) {
  const [status, setStatus]   = useState('idle');
  const [savedId, setSavedId] = useState(null);
  const [message, setMessage] = useState('');

  const displayMap = {
    idle:      { label: '+ Save',        disabled: false, className: 'save-btn-idle' },
    saving:    { label: 'Saving...',      disabled: true,  className: 'save-btn-saving' },
    saved:     { label: 'Saved ✓',       disabled: false, className: 'save-btn-saved' },
    duplicate: { label: 'Already Saved', disabled: false, className: 'save-btn-saved' },
    error:     { label: 'Try Again',     disabled: false, className: 'save-btn-error' },
  };
  const display = displayMap[status];

  async function handleSave() {
    if (status === 'saving') return;
    setStatus('saving');
    setMessage('');
    try {
      const result = await saveOpportunity({ state, city, zip, sector, sectorLabel, cardData });
      if (result.alreadySaved) {
        setStatus('duplicate');
        setSavedId(result.id);
        setMessage('Already in your dashboard');
      } else {
        setStatus('saved');
        setSavedId(result.id);
        setMessage('Saved to your dashboard!');
        if (onSaved) onSaved(result.id);
      }
    } catch (err) {
      console.error('Save failed:', err.message);
      setStatus('error');
      setMessage(err.message.includes('401') ? 'Sign in to save' : 'Save failed — try again');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  function handleViewSaved() {
    if (onNavigate) onNavigate('saved');
  }

  const isSaved = status === 'saved' || status === 'duplicate';

  return (
    <div className="save-button-group">
      <button
        className={`save-btn ${display.className}`}
        onClick={isSaved ? handleViewSaved : handleSave}
        disabled={display.disabled}
        title={isSaved ? 'View your saved dashboard' : 'Save this opportunity'}
      >
        {display.label}
      </button>
      {message && (
        <span className={`save-msg save-msg-${status}`}>
          {message}
          {isSaved && (
            <button className="save-msg-link" onClick={handleViewSaved}>
              View saved →
            </button>
          )}
        </span>
      )}
    </div>
  );
}
