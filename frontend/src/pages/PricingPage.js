import { useState, useEffect } from 'react';
import { api } from '../api';
import styles from './PricingPage.module.css';

const CREDIT_ACTION_LABELS = {
  'generate-idea': { label: 'Generate New Business Idea', icon: '✦' },
  'generate-blue-ocean': { label: 'Blue Ocean Idea (zero competitors)', icon: '◎' },
  'competitor-compare': { label: 'Competitor Gap Analysis', icon: '⚔' },
  'competitive-analysis': { label: 'Full Competitive Analysis Roadmap', icon: '📊' },
};

export default function PricingPage({ user, onBack, onCreditsUpdated }) {
  const [pricing, setPricing] = useState(null);
  const [userCredits, setUserCredits] = useState(null);
  const [buying, setBuying] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.pricing().then(setPricing).catch(() => {});
    api.credits().then(setUserCredits).catch(() => {});
  }, []);

  async function handleBuyPack(packId) {
    setBuying(packId);
    try {
      const data = await api.buyPack(packId);
      setUserCredits(data.user);
      if (onCreditsUpdated) onCreditsUpdated(data.user);
      const pack = pricing.packs.find(p => p.id === packId);
      setToast(`✓ ${pack.credits} credits added to your account!`);
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      setToast(`Error: ${err.message}`);
      setTimeout(() => setToast(''), 4000);
    } finally {
      setBuying(null);
    }
  }

  const totalCredits = userCredits ? userCredits.credits : (user?.credits ?? '—');
  const tierName = userCredits ? userCredits.tierName : (user?.tierName || 'Free');

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>← Back</button>
        <div className={styles.headerCenter}>
          <span className={styles.logo}>BIG</span>
          <span className={styles.headerTitle}>Credits & Pricing</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.currentCredits}>◈ {totalCredits} credits · {tierName}</span>
        </div>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}

      <main className={styles.main}>
        {/* Hero */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Simple, transparent pricing</h1>
          <p className={styles.heroSub}>Credits power every AI feature. Subscription credits refresh monthly — one-time pack credits <strong>never expire</strong>.</p>
        </div>

        {/* Credit costs */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What each action costs</h2>
          <div className={styles.costGrid}>
            {pricing && Object.entries(pricing.costs).filter(([, cost]) => cost > 0).map(([action, cost]) => {
              const meta = CREDIT_ACTION_LABELS[action] || { label: action, icon: '◈' };
              return (
                <div key={action} className={styles.costCard}>
                  <span className={styles.costIcon}>{meta.icon}</span>
                  <div className={styles.costInfo}>
                    <div className={styles.costLabel}>{meta.label}</div>
                  </div>
                  <span className={styles.costBadge}>{cost} credit{cost !== 1 ? 's' : ''}</span>
                </div>
              );
            })}
            <div className={styles.costCard}>
              <span className={styles.costIcon}>🗺️</span>
              <div className={styles.costInfo}>
                <div className={styles.costLabel}>Browse opportunities & reports</div>
              </div>
              <span className={styles.costBadge} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', borderColor: 'rgba(16,185,129,0.3)' }}>Free</span>
            </div>
          </div>
        </section>

        {/* Subscription tiers */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Subscription plans</h2>
          <p className={styles.sectionSub}>Credits refresh monthly. Unused subscription credits roll over (up to a cap).</p>
          <div className={styles.tiersGrid}>
            {pricing && Object.entries(pricing.tiers).map(([key, tier]) => {
              const isCurrent = tierName.toLowerCase() === tier.name.toLowerCase();
              const isPopular = key === 'growth';
              return (
                <div key={key} className={`${styles.tierCard} ${isCurrent ? styles.tierCurrent : ''} ${isPopular ? styles.tierPopular : ''}`}>
                  {isPopular && <div className={styles.popularBadge}>Most Popular</div>}
                  {isCurrent && <div className={styles.currentBadge}>Your Plan</div>}
                  <div className={styles.tierName}>{tier.name}</div>
                  <div className={styles.tierPrice}>
                    {tier.price === 0 ? (
                      <span className={styles.tierFree}>Free</span>
                    ) : (
                      <>
                        <span className={styles.tierAmount}>${tier.price}</span>
                        <span className={styles.tierPer}>/mo</span>
                      </>
                    )}
                  </div>
                  {tier.annualPrice && (
                    <div className={styles.tierAnnual}>${tier.annualPrice}/mo billed annually</div>
                  )}
                  <div className={styles.tierCredits}>
                    <span className={styles.tierCreditsNum}>{tier.monthlyCredits}</span>
                    <span className={styles.tierCreditsLabel}> credits/month</span>
                  </div>
                  {tier.rolloverMax > 0 && (
                    <div className={styles.tierRollover}>Rollover up to {tier.rolloverMax} credits</div>
                  )}
                  <button
                    className={`${styles.tierBtn} ${isCurrent ? styles.tierBtnCurrent : ''}`}
                    disabled={isCurrent}
                    onClick={() => setToast('Subscription upgrades coming soon — contact us to upgrade.')}
                  >
                    {isCurrent ? 'Current plan' : tier.price === 0 ? 'Get started free' : `Upgrade to ${tier.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* One-time packs */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>One-time credit packs</h2>
          <p className={styles.sectionSub}>No subscription required. Credits <strong>never expire</strong>. Stack on top of your subscription.</p>
          <div className={styles.packsGrid}>
            {pricing && pricing.packs.map(pack => {
              const perCredit = (pack.price / pack.credits).toFixed(2);
              const isBuying = buying === pack.id;
              return (
                <div key={pack.id} className={styles.packCard}>
                  <div className={styles.packLabel}>{pack.label}</div>
                  <div className={styles.packCredits}>
                    <span className={styles.packCreditsNum}>{pack.credits}</span>
                    <span className={styles.packCreditsUnit}> credits</span>
                  </div>
                  <div className={styles.packPrice}>${pack.price.toFixed(2)}</div>
                  <div className={styles.packPer}>${perCredit} per credit</div>
                  <div className={styles.packNeverExpire}>✓ Never expires</div>
                  <button
                    className={styles.packBtn}
                    onClick={() => handleBuyPack(pack.id)}
                    disabled={isBuying}
                  >
                    {isBuying ? 'Adding…' : 'Buy now'}
                  </button>
                </div>
              );
            })}
          </div>
          <p className={styles.packNote}>* Payment processing via Stripe — coming soon. Credits are added instantly in demo mode.</p>
        </section>

        {/* Current balance */}
        {userCredits && (
          <section className={styles.section}>
            <div className={styles.balanceCard}>
              <div className={styles.balanceTitle}>Your current balance</div>
              <div className={styles.balanceRow}>
                <span>Subscription credits</span>
                <span className={styles.balanceNum}>{userCredits.subscriptionCredits}</span>
              </div>
              <div className={styles.balanceRow}>
                <span>Pack credits (never expire)</span>
                <span className={styles.balanceNum}>{userCredits.packCredits}</span>
              </div>
              <div className={`${styles.balanceRow} ${styles.balanceTotal}`}>
                <span>Total available</span>
                <span className={styles.balanceNum}>{userCredits.credits}</span>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
