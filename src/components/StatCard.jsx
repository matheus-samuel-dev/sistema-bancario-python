import { formatCurrency } from "../utils/formatters";
import styles from "./StatCard.module.css";

export function StatCard({ label, value, accent, icon: Icon }) {
  return (
    <article className={`${styles.card} ${styles[accent]}`}>
      <div className={styles.header}>
        <span>{label}</span>
        <div className={styles.iconWrap}>
          <Icon size={20} />
        </div>
      </div>

      <strong>{formatCurrency(value)}</strong>
    </article>
  );
}
