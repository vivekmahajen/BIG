import styles from './Disclaimer.module.css';

export default function Disclaimer() {
  return (
    <div className={styles.bar} role="note" aria-label="Legal disclaimer">
      <span className={styles.icon}>⚠</span>
      <p className={styles.text}>
        <strong>Disclaimer:</strong> All content on this platform — including business opportunity analyses, financial projections, market size estimates, revenue forecasts, and AI-generated ideas — is provided <strong>for informational and entertainment purposes only</strong>. It does not constitute financial, legal, investment, or business advice. BIG and its operators make no representations or warranties of any kind regarding the accuracy, completeness, or fitness for any particular purpose of any information presented. Past performance and market data referenced herein are not indicative of future results. <strong>You should conduct your own independent research and consult qualified professional advisors before making any business or investment decision.</strong> BIG assumes no liability for any loss, damage, or consequence arising from reliance on any content displayed on this platform.
      </p>
    </div>
  );
}
