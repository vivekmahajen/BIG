import React, { useState } from 'react';
import { generateShareLink } from '../api/share';
import './ShareButton.css';

/**
 * Props:
 *   opportunityId  {string|null}  UUID of saved_opportunities row (null = not saved yet)
 *   opportunityName {string}      for social share text
 */
export default function ShareButton({ opportunityId, opportunityName }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (!opportunityId) return;
    setOpen(true);
    if (shareUrl) return; // already loaded
    setLoading(true);
    setError('');
    try {
      const result = await generateShareLink(opportunityId);
      setShareUrl(result.shareUrl);
    } catch (err) {
      setError(err.message || 'Failed to generate share link');
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function shareLinkedIn() {
    if (!shareUrl) return;
    const text = encodeURIComponent(`Check out this business opportunity: ${opportunityName || 'Untitled'}`);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank', 'noopener');
  }

  function shareTwitter() {
    if (!shareUrl) return;
    const text = encodeURIComponent(`Check out this business opportunity: ${opportunityName || 'Untitled'} via @BIG_Intelligence`);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener');
  }

  function handleClose() {
    setOpen(false);
  }

  if (!opportunityId) {
    return (
      <div className="share-btn-group">
        <span className="share-not-saved" title="Save this opportunity first to get a share link">
          🔗 Share (save first)
        </span>
      </div>
    );
  }

  return (
    <div className="share-btn-group">
      <button className="share-btn" onClick={handleShare}>
        🔗 Share
      </button>

      {open && (
        <div className="share-modal-overlay" onClick={e => { if (e.target === e.currentTarget) handleClose(); }}>
          <div className="share-modal">
            <div className="share-modal-header">
              <h3 className="share-modal-title">Share this Analysis</h3>
              <button className="share-modal-close" onClick={handleClose}>✕</button>
            </div>

            <div className="share-referral-banner">
              🎁 Earn 5 free credits when someone signs up through your link
            </div>

            {loading && <div className="share-loading">Generating share link…</div>}
            {error && <div className="share-error">{error}</div>}

            {shareUrl && (
              <>
                <div className="share-url-row">
                  <input
                    className="share-url-input"
                    type="text"
                    readOnly
                    value={shareUrl}
                    onFocus={e => e.target.select()}
                  />
                  <button
                    className={`share-copy-btn${copied ? ' copied' : ''}`}
                    onClick={handleCopy}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <div className="share-social-row">
                  <button className="share-social-btn linkedin" onClick={shareLinkedIn}>
                    in LinkedIn
                  </button>
                  <button className="share-social-btn twitter" onClick={shareTwitter}>
                    𝕏 Twitter / X
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
