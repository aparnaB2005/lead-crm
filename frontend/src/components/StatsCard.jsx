import styles from './StatsCard.module.css';

export default function StatsCard({ icon, label, value, sub, color, trend }) {
  return (
    <div className={`card ${styles.card}`}>
      <div className={styles.header}>
        <div className={styles.iconWrap} style={{ background: `${color}18`, color }}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`${styles.trend} ${trend >= 0 ? styles.up : styles.down}`}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className={styles.value}>{value ?? '—'}</div>
      <div className={styles.label}>{label}</div>
      {sub && <div className={styles.sub}>{sub}</div>}
    </div>
  );
}
